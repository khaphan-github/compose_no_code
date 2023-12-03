import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DbQueryDomain } from '../../../core/db.query.domain';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QueryParamDataDto, RequestParamDataDto } from '../controller/query-filter.dto';
import { ConditionObject, JoinTable, QueryBuilderResult, RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { InvalidColumnOfTableError } from '../errors/invalid-table-colums.error';
import { ApplicationModel } from '../../../core/models/application.model';
import { CanNotExecuteQueryError } from '../errors/can-not-execute-query.error';
import { ExecutedSQLQueryEvent } from '../events/executed-query.event';

export class GetDataQuery {
  constructor(
    public readonly appInfo: ApplicationModel,
    public readonly tableInfo: object[],
    public readonly requestParamDataDto: RequestParamDataDto,
    public readonly queryParamDataDto: QueryParamDataDto,
    public readonly conditions?: ConditionObject,
    public readonly joinTable?: JoinTable[],
    public readonly returning?: string[],
  ) { }
}
@QueryHandler(GetDataQuery)
export class GetDataQueryHandler
  implements IQueryHandler<GetDataQuery>
{
  private readonly dbQueryDomain!: DbQueryDomain;
  private readonly getDataQueryBuilder!: RelationalDBQueryBuilder;

  private readonly logger = new Logger(GetDataQueryHandler.name);

  constructor(
    private readonly eventBus: EventBus,
  ) {
    this.dbQueryDomain = new DbQueryDomain();
    this.getDataQueryBuilder = new RelationalDBQueryBuilder();
  }

  async execute(query: GetDataQuery): Promise<object> {
    const { appInfo, requestParamDataDto, queryParamDataDto, conditions, tableInfo, joinTable, returning } = query;

    const { appid, schema } = requestParamDataDto;
    const { orderby, page, selects, size, sort } = queryParamDataDto;

    const validColumns = this.dbQueryDomain.getTableColumnNameArray(tableInfo, 'column_name');
    const tableName = this.dbQueryDomain.getTableName(appid, schema);

    this.getDataQueryBuilder.setColumns(validColumns);
    this.getDataQueryBuilder.setTableName(tableName);

    // Prepare insert query builder
    let getDataScript: QueryBuilderResult;
    try {
      getDataScript = this.getDataQueryBuilder.getByQuery(
        {
          conditions: conditions,
          orderby: orderby,
          page: page,
          size: size,
          sort: sort,
        },
        selects,
        joinTable,
        returning,
      );
    } catch (error) {
      return Promise.reject(new InvalidColumnOfTableError(appid, schema, error.message));
    }

    let appTypeOrmDataSource: DataSource;
    try {
      appTypeOrmDataSource = await new DataSource(appInfo.database_config).initialize();
      const queryResult = await appTypeOrmDataSource.query(getDataScript.queryString, getDataScript.params);
      await appTypeOrmDataSource?.destroy();
      this.eventBus.publish(new ExecutedSQLQueryEvent('GetDataQueryHandler', getDataScript, queryResult))

      return Promise.resolve(queryResult);
    } catch (error) {
      await appTypeOrmDataSource?.destroy();
      return Promise.reject(new CanNotExecuteQueryError(appid, tableName, error.message));
    }
  }
}
