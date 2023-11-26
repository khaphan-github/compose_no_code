import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Logger } from '@nestjs/common';
import { EAppTableColumns } from '../../../core/models/application.model';
import { APPLICATIONS_TABLE_AVAILABLE_COLUMS, APPLICATIONS_TABLE_NAME } from '../../../core/variables/application-table.variables';
import { DbQueryDomain } from '../../../core/db.query.domain';

export class GetTableByAppIdQuery {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly ownerId: string,
    public readonly appId: number,
  ) { }
}
@QueryHandler(GetTableByAppIdQuery)
export class GetTableByAppIdQueryHandler
  implements IQueryHandler<GetTableByAppIdQuery>
{
  private readonly queryBuilder!: RelationalDBQueryBuilder;
  private readonly dbQueryDomain!: DbQueryDomain;

  private readonly logger = new Logger(GetTableByAppIdQueryHandler.name);

  constructor() {
    this.queryBuilder = new RelationalDBQueryBuilder(
      APPLICATIONS_TABLE_NAME, APPLICATIONS_TABLE_AVAILABLE_COLUMS,
    );
    this.dbQueryDomain = new DbQueryDomain();
  }
  // DONE
  async execute(query: GetTableByAppIdQuery) {
    const { appId, ownerId, workspaceConnections } = query;
    let typeormDataSource: DataSource;

    const { params, queryString } = this.queryBuilder.getByQuery({
      conditions: {
        [EAppTableColumns.OWNER_ID]: ownerId.toString(),
        [EAppTableColumns.ID]: appId.toString(),
      }
    }, [
      EAppTableColumns.ID,
      EAppTableColumns.TABLES_INFO,
    ]);

    try {
      typeormDataSource = await new DataSource(workspaceConnections).initialize();
      const queryResult = await typeormDataSource.query(queryString, params);
      await typeormDataSource?.destroy();

      return this.dbQueryDomain.getTableNameFromParser(queryResult);
    } catch (error) {
      this.logger.error(error);
    } finally {
      await typeormDataSource.destroy();
    }
  }
}
