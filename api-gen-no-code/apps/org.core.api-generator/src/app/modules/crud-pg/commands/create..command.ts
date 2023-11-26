import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { DbQueryDomain } from '../../../core/db.query.domain';
import { QueryBuilderResult, RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { InvalidColumnOfTableError } from '../errors/invalid-table-colums.error';
import { checkObjectsForSameKey } from '../../../lib/utils/check-array-object-match-key';
import { ApplicationModel } from '../../../core/models/application.model';
import { EmptyRecordWhenInsertError } from '../errors/empty-record-when-insert.error';
import { DataToInsertNotHaveSameKeyError } from '../errors/data-insert-not-have-have-key.error';
import { CanNotInsertNewRecordError } from '../errors/can-not-insert-new-record.errror';
import { ExecutedSQLQueryEvent } from '../events/executed-query.event';
import { NotFoundAppByIdError } from '../errors/not-found-app-by-id.error';
import _ from 'lodash';
import { InvalidFormatError } from '../errors/invalid-format.error';

export class CreateDataCommand {
  constructor(
    public readonly appInfo: ApplicationModel,
    public readonly tableInfo: object[],

    public readonly appId: string,
    public readonly schema: string,
    public readonly data: Array<Partial<{ [key: string]: object }>>,
  ) { }
}
@CommandHandler(CreateDataCommand)
export class CreateDataCommandHandler
  implements ICommandHandler<CreateDataCommand>
{
  private readonly dbQueryDomain!: DbQueryDomain;
  private readonly queryBuilderTableInsert!: RelationalDBQueryBuilder;

  private readonly logger = new Logger(CreateDataCommandHandler.name);

  constructor(
    private readonly eventBus: EventBus,
  ) {
    this.dbQueryDomain = new DbQueryDomain();
    this.queryBuilderTableInsert = new RelationalDBQueryBuilder();
  }

  async execute(command: CreateDataCommand) {
    const { appInfo, appId, schema, data, tableInfo } = command;

    if (!appInfo) {
      return Promise.reject(new NotFoundAppByIdError(appId, 'CreateDataCommandHandler not found application info'));
    }

    if (!(data instanceof Array)) {
      return Promise.reject(new InvalidFormatError(`Format of request body must be an array of objects [{}]`))
    }

    const tableName = this.dbQueryDomain.getTableName(appId, schema);

    if (!data || _.isEmpty(data) || data.length == 0) {
      return Promise.reject(new EmptyRecordWhenInsertError(appId, tableName));
    }

    if (!checkObjectsForSameKey(data)) {
      return Promise.reject(new DataToInsertNotHaveSameKeyError(appId, tableName))
    }

    const validColumns = this.dbQueryDomain.getTableColumnNameArray(tableInfo, 'column_name');
    this.queryBuilderTableInsert.setTableName(tableName);
    this.queryBuilderTableInsert.setColumns(validColumns);

    // Prepare insert query builder
    let insertQuery: QueryBuilderResult;
    try {
      insertQuery = this.queryBuilderTableInsert.insertMany(data);
    } catch (error) {
      return Promise.reject(new InvalidColumnOfTableError(appId, schema, error.message));
    }

    // Execute insert many using defaut connections;
    let workspaceDataSource: DataSource;
    try {
      workspaceDataSource = await new DataSource(appInfo.database_config).initialize();
      const queryResult = await workspaceDataSource.query(insertQuery.queryString, insertQuery.params);
      await workspaceDataSource?.destroy();
      this.eventBus.publish(new ExecutedSQLQueryEvent(CreateDataCommandHandler.name, insertQuery, queryResult))
      return Promise.resolve(queryResult);
    } catch (error) {
      await workspaceDataSource?.destroy();
      return Promise.reject(new CanNotInsertNewRecordError(appId, schema, error.message));
    }
  }
}
