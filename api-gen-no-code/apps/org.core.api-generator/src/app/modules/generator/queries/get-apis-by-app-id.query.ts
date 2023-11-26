import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Logger } from '@nestjs/common';
import { DefaultResponseError } from '../../crud-pg/errors/default.error';
import NodeCache from 'node-cache';
import { EGeneratedApisTableColumns } from '../../../core/models/generated-api.model';
import { GENERATED_APIS_AVAILABLE_COLUMNS, GENERATED_APIS_TABLE_NAME } from '../../../core/variables/generated-api-table.variables';

export class GetApisByAppIdQuery {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly ownerId: string,
    public readonly appId: number,
  ) { }
}
@QueryHandler(GetApisByAppIdQuery)
export class GetApisByAppIdQueryHandler
  implements IQueryHandler<GetApisByAppIdQuery>
{
  private readonly queryBuilder!: RelationalDBQueryBuilder;
  private readonly logger = new Logger(GetApisByAppIdQueryHandler.name);

  constructor(
    private readonly nodeCache: NodeCache
  ) {
    this.queryBuilder = new RelationalDBQueryBuilder(
      GENERATED_APIS_TABLE_NAME, GENERATED_APIS_AVAILABLE_COLUMNS,
    );

  }
  // DONE
  async execute(query: GetApisByAppIdQuery) {
    const { appId, workspaceConnections } = query;
    let typeormDataSource: DataSource;

    const cacheKey = `application_${appId}_cache_key_infomation`;
    const apisInCache = this.nodeCache.get(cacheKey);
    if (apisInCache) {
      return Promise.resolve(apisInCache);
    }

    const { params, queryString } = this.queryBuilder.getByQuery({
      conditions: {
        [EGeneratedApisTableColumns.APP_ID]: appId.toString()
      }
    });

    try {
      typeormDataSource = await new DataSource(workspaceConnections).initialize();
      const queryResult = await typeormDataSource.query(queryString, params);
      await typeormDataSource?.destroy();

      this.nodeCache.set(cacheKey, queryResult);
      return Promise.resolve(queryResult);
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(new DefaultResponseError(error.message));
    }
  }
}
