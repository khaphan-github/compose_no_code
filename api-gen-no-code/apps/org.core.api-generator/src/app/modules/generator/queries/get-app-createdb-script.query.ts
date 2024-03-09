import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Logger } from '@nestjs/common';
import { EAppTableColumns } from '../../../core/models/application.model';
import { APPLICATIONS_TABLE_AVAILABLE_COLUMS, APPLICATIONS_TABLE_NAME } from '../../../core/variables/application-table.variables';

export class GetCreatedDbScriptByAppIdQuery {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly ownerId: string,
    public readonly appId: number,
  ) { }
}
@QueryHandler(GetCreatedDbScriptByAppIdQuery)
export class GetCreatedDbScriptByAppIdQueryHandler
  implements IQueryHandler<GetCreatedDbScriptByAppIdQuery>
{
  private readonly queryBuilder!: RelationalDBQueryBuilder;
  private readonly logger!: Logger;

  constructor() {
    this.queryBuilder =
      new RelationalDBQueryBuilder(APPLICATIONS_TABLE_NAME, APPLICATIONS_TABLE_AVAILABLE_COLUMS);

    this.logger = new Logger(GetCreatedDbScriptByAppIdQueryHandler.name);
  }
  // DONE
  async execute(query: GetCreatedDbScriptByAppIdQuery) {
    const { ownerId, appId, workspaceConnections } = query;

    const { queryString, params } = this.queryBuilder.getByQuery(
      {
        conditions: {
          and: [
            { [EAppTableColumns.ID]: appId.toString() },
            { [EAppTableColumns.OWNER_ID]: ownerId },
          ]
        }
      },
      [
        EAppTableColumns.ID,
        EAppTableColumns.CREATE_DB_SCRIPT,
        EAppTableColumns.UPDATED_AT,
        EAppTableColumns.CREATED_AT,
      ]);

    let typeormDataSource: DataSource;
    try {
      typeormDataSource = await new DataSource(workspaceConnections).initialize();
      const queryResult = await typeormDataSource.query(queryString, params);
      await typeormDataSource?.destroy();

      return queryResult[0];
    } catch (error) {
      this.logger.error(error);
    } finally {
      await typeormDataSource.destroy();
    }
  }
}
