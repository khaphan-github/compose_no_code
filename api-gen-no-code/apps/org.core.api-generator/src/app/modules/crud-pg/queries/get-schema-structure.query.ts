import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DbQueryDomain } from '../../../core/db.query.domain';
import { DataSource } from 'typeorm';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { Logger } from '@nestjs/common';
import NodeCache from 'node-cache';
import { DefaultResponseError } from '../errors/default.error';
import { ApplicationModel } from '../../../core/models/application.model';
import { NotFoundAppByIdError } from '../errors/not-found-app-by-id.error';

export class GetSchemaStructureQuery {
  constructor(
    public readonly appInfo: ApplicationModel,
    public readonly appid: string,
    public readonly schema: string,
  ) { }
}

@QueryHandler(GetSchemaStructureQuery)
export class GetSchemaStructureQueryHandler
  implements IQueryHandler<GetSchemaStructureQuery>
{

  private readonly dbQueryDomain!: DbQueryDomain;
  private readonly relationalDBQueryBuilder!: RelationalDBQueryBuilder;

  private readonly logger = new Logger(GetSchemaStructureQueryHandler.name);

  constructor(
    private readonly nodeCache: NodeCache,
  ) {
    this.dbQueryDomain = new DbQueryDomain();
    this.relationalDBQueryBuilder = new RelationalDBQueryBuilder(
      'information_schema.columns',
      ['column_name', 'table_name']
    );
  }

  async execute(query: GetSchemaStructureQuery): Promise<unknown> {
    const { appInfo, appid, schema } = query;
    const tableName = this.dbQueryDomain.getTableName(appid, schema).replace('public.', '');

    // Cahing
    const cacheKey = `table_info_cache_app_${appid}_table_${tableName}`
    const tableInfoFromCache = this.nodeCache.get(cacheKey);

    if (tableInfoFromCache) {
      return Promise.resolve(tableInfoFromCache);
    }

    const { queryString, params } = this.relationalDBQueryBuilder.getByQuery(
      { conditions: { 'table_name': tableName } }, ['column_name']
    );

    let typeormDataSource: DataSource;

    try {
      typeormDataSource = await new DataSource(appInfo.database_config).initialize();
      const queryResult = await typeormDataSource.query(queryString, params);
      if (!queryResult || queryResult?.length == 0) {
        await typeormDataSource?.destroy();
        return Promise.reject(new NotFoundAppByIdError(appid, schema));
      }
      this.nodeCache.set(cacheKey, queryResult);
      await typeormDataSource?.destroy();
      return Promise.resolve(queryResult);
    } catch (error) {
      await typeormDataSource?.destroy();
      this.logger.error(error);
      return Promise.reject(new DefaultResponseError(error))
    }
  }
}