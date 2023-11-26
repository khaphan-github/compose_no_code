import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DbQueryDomain } from '../../../core/db.query.domain';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InvalidColumnOfTableError } from '../errors/invalid-table-colums.error';
import { ApplicationModel } from '../../../core/models/application.model';
import { CanNotUpdateResultError } from '../errors/can-not-update-result.error';
import { ExecutedSQLQueryEvent } from '../events/executed-query.event';

export class UpdateDataCommand {
  constructor(
    public readonly appInfo: ApplicationModel,
    public readonly tableInfo: object[],

    public readonly appId: string,
    public readonly schema: string,
    public readonly id: string | number,
    public readonly idColumn: string,
    public readonly data: Partial<{ [key: string]: object }>,
  ) { }
}
@CommandHandler(UpdateDataCommand)
export class UpdateDataCommandHandler
  implements ICommandHandler<UpdateDataCommand>
{
  private readonly dbQueryDomain!: DbQueryDomain;
  private readonly relationalDBQueryBuilder!: RelationalDBQueryBuilder;

  private readonly logger = new Logger(UpdateDataCommandHandler.name);
  constructor(
    private readonly eventBus: EventBus,
  ) {
    this.dbQueryDomain = new DbQueryDomain();
    this.relationalDBQueryBuilder = new RelationalDBQueryBuilder();
  }
  async execute(command: UpdateDataCommand) {
    const { appId, data, id, idColumn, appInfo, schema, tableInfo } = command;

    const validColumns = this.dbQueryDomain.getTableColumnNameArray(tableInfo, 'column_name');
    const tableName = this.dbQueryDomain.getTableName(appId, schema);

    this.relationalDBQueryBuilder.setTableName(tableName);
    this.relationalDBQueryBuilder.setColumns(validColumns);

    let query: string;
    let queryParam: unknown[];
    try {
      const { queryString, params } = this.relationalDBQueryBuilder.update(idColumn, id, data);
      query = queryString;
      queryParam = params;
    } catch (error) {
      return Promise.reject(new InvalidColumnOfTableError(appId, schema, error.message));
    }

    let workspaceTypeOrmDataSource: DataSource;
    try {
      workspaceTypeOrmDataSource = await new DataSource(appInfo.database_config).initialize();
      const updateResult = await workspaceTypeOrmDataSource.query(query, queryParam);
      await workspaceTypeOrmDataSource?.destroy();
      this.eventBus.publish(new ExecutedSQLQueryEvent('UpdateDataCommandHandler', { query, queryParam }, updateResult[0]))
      return Promise.resolve(updateResult[0]);
    } catch (error) {
      await workspaceTypeOrmDataSource?.destroy();
      this.logger.error(error);
      return Promise.reject(new CanNotUpdateResultError(appId, schema, id, error.message));
    }
  }
}
