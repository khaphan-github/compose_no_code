import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DbQueryDomain } from '../../../core/db.query.domain';
import { GetDataQueryHandler } from '../queries/get-by-conditions.query';
import { Logger } from '@nestjs/common';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { DataSource } from 'typeorm';
import { InvalidColumnOfTableError } from '../errors/invalid-table-colums.error';
import { ApplicationModel } from '../../../core/models/application.model';
import { CanNotDeleteResultError } from '../errors/can-not-delete-result.error';
import { ExecutedSQLQueryEvent } from '../events/executed-query.event';

export class DeleteDataCommand {
  constructor(
    public readonly appInfo: ApplicationModel,
    public readonly tableInfo: object[],

    public readonly appid: string,
    public readonly schema: string,
    public readonly id: number,
    public readonly column: string, // <--- id column
  ) { }
}
@CommandHandler(DeleteDataCommand)
export class DeleteDataCommandHandler
  implements ICommandHandler<DeleteDataCommand>
{
  private readonly dbQueryDomain!: DbQueryDomain;
  private readonly relationalDBQueryBuilder!: RelationalDBQueryBuilder;

  private readonly logger = new Logger(GetDataQueryHandler.name);

  constructor(
    private readonly eventBus: EventBus,
  ) {
    this.dbQueryDomain = new DbQueryDomain();
    this.relationalDBQueryBuilder = new RelationalDBQueryBuilder();
  }

  async execute(command: DeleteDataCommand) {
    const { appid, id, schema, tableInfo, column, appInfo } = command;
    const tableName = this.dbQueryDomain.getTableName(appid, schema);

    const validColumns = this.dbQueryDomain.getTableColumnNameArray(tableInfo, 'column_name');

    this.relationalDBQueryBuilder.setTableName(tableName);
    this.relationalDBQueryBuilder.setColumns(validColumns);

    let query: string;
    let queryParam: unknown[];

    try {
      const { queryString, params } = this.relationalDBQueryBuilder.deleteBy(column, id);
      query = queryString;
      queryParam = params;
    } catch (error) {
      return Promise.reject(new InvalidColumnOfTableError(appid, schema, error.message));
    }
    let workspaceTypeOrmDataSource: DataSource;
    try {
      workspaceTypeOrmDataSource = await new DataSource(appInfo.database_config).initialize();
      const deleteResult = await workspaceTypeOrmDataSource.query(query, queryParam);

      await workspaceTypeOrmDataSource?.destroy();
      this.eventBus.publish(new ExecutedSQLQueryEvent(DeleteDataCommandHandler.name, { query, queryParam }, deleteResult))

      if (deleteResult[1] === 0) {
        return Promise.reject(new CanNotDeleteResultError(appid, schema, id, `Not found record by this id`))
      }
      return Promise.resolve(deleteResult[1]);
    } catch (error) {
      await workspaceTypeOrmDataSource?.destroy();
      this.logger.error(error);
      return Promise.reject(new CanNotDeleteResultError(appid, schema, id, error.message));
    }
  }
}
