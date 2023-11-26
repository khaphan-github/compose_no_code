import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { EAppTableColumns } from '../../../core/models/application.model';
import { APPLICATIONS_TABLE_AVAILABLE_COLUMS, APPLICATIONS_TABLE_NAME } from '../../../core/variables/application-table.variables';

export class GetSchemaInfoByAppIdQuery {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly ownerId: string,
    public readonly appid: number,
  ) { }
}
@QueryHandler(GetSchemaInfoByAppIdQuery)
export class GetSchemaInfoByAppIdQueryHandler
  implements IQueryHandler<GetSchemaInfoByAppIdQuery>
{
  private readonly queryBuilder!: RelationalDBQueryBuilder;

  private readonly logger!: Logger;

  constructor() {
    this.queryBuilder =
      new RelationalDBQueryBuilder(APPLICATIONS_TABLE_NAME, APPLICATIONS_TABLE_AVAILABLE_COLUMS);

    this.logger = new Logger(GetSchemaInfoByAppIdQueryHandler.name);
  }

  async execute(query: GetSchemaInfoByAppIdQuery) {
    const { appid, ownerId, workspaceConnections } = query;
    const { queryString, params } = this.queryBuilder.getByQuery(
      {
        conditions: {
          and: [
            { [EAppTableColumns.ID]: appid.toString() },
            { [EAppTableColumns.OWNER_ID]: ownerId },
          ]
        }
      },
      [
        EAppTableColumns.TABLES_INFO,
      ]);
    let workspaceTypeormDataSource: DataSource;
    try {
      workspaceTypeormDataSource = await new DataSource(workspaceConnections).initialize();
      const queryResult = (await workspaceTypeormDataSource.query(queryString, params))[0];
      await workspaceTypeormDataSource?.destroy();

      return queryResult?.tables_info;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
    finally {
      workspaceTypeormDataSource.destroy();
    }
  }
}
