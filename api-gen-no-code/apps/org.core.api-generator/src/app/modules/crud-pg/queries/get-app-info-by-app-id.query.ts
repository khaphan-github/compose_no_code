import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { WorkspaceConnectionShouldNotBeEmpty } from '../../shared/errors/workspace-connection-empty.error';
import { CanNotGetAppInforError } from '../errors/can-not-get-app-info.error';
import NodeCache from 'node-cache';
import { ApplicationModel, EAppTableColumns } from '../../../core/models/application.model';
import { APPLICATIONS_TABLE_AVAILABLE_COLUMS, APPLICATIONS_TABLE_NAME } from '../../../core/variables/application-table.variables';
import { NotFoundAppByIdError } from '../errors/not-found-app-by-id.error';

export class GetAppInfoByAppId {
  constructor(
    public readonly workspaceConnection: DataSourceOptions,
    public readonly appId: string | number,
  ) { }
}

@QueryHandler(GetAppInfoByAppId)
export class GetAppInfoByAppIdHandler
  implements IQueryHandler<GetAppInfoByAppId>
{
  private readonly queryBuilderTableApp!: RelationalDBQueryBuilder;

  constructor(
    private readonly nodeCache: NodeCache,
  ) {
    this.queryBuilderTableApp = new RelationalDBQueryBuilder(
      APPLICATIONS_TABLE_NAME, APPLICATIONS_TABLE_AVAILABLE_COLUMS,
    );
  }

  async execute(query: GetAppInfoByAppId): Promise<ApplicationModel> {
    const { workspaceConnection, appId } = query;
    // Cache get app info
    const appCacheKey = `app_info_${appId}_cache_key`;
    const appInfo = this.nodeCache.get(appCacheKey) as ApplicationModel;
    if (appInfo) {
      return Promise.resolve(appInfo);
    }

    if (!workspaceConnection) {
      return Promise.reject(new WorkspaceConnectionShouldNotBeEmpty());
    }

    let workspaceTypeOrmDataSource: DataSource;
    const queryAppScript = this.queryBuilderTableApp.getByQuery({
      conditions: { [EAppTableColumns.ID]: appId.toString(), }
    });

    try {
      workspaceTypeOrmDataSource = await new DataSource(workspaceConnection).initialize();
      const appDBConfig = await workspaceTypeOrmDataSource.query(
        queryAppScript.queryString, queryAppScript.params
      );
      await workspaceTypeOrmDataSource?.destroy();

      if (appDBConfig?.length === 0) {
        return Promise.reject(new NotFoundAppByIdError(appId, APPLICATIONS_TABLE_NAME));
      }

      this.nodeCache.set(appCacheKey, appDBConfig[0]);
      return Promise.resolve(appDBConfig[0]);
    } catch (error) {
      await workspaceTypeOrmDataSource?.destroy();
      return Promise.reject(new CanNotGetAppInforError(appId, error.message));
    }
  }
}
