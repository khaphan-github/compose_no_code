import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { QueryParamDataDto } from '../../crud-pg/controller/query-filter.dto';
import { JsonIoService } from '../../shared/json.io.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { WORKSPACE_TABLE_NAME } from '../../../core/variables/workspace-table.variables';

export class UnDefineError extends Error {
  constructor(message: string) {
    super(`Error when get workspace by id: ${message}`);
  }
}

export class GetWorkspaceByIdQuery {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly id: string,
    public readonly queryDto: QueryParamDataDto,
  ) { }
}

@QueryHandler(GetWorkspaceByIdQuery)
export class GetWorkspaceByIdQueryHandler
  implements IQueryHandler<GetWorkspaceByIdQuery>
{
  private readonly queryBuilder!: RelationalDBQueryBuilder;
  private readonly logger = new Logger(GetWorkspaceByIdQueryHandler.name);

  constructor(
    private readonly jsonIO: JsonIoService,
  ) {
    this.queryBuilder = new RelationalDBQueryBuilder();
  }
  // DONE
  async execute(query: GetWorkspaceByIdQuery) {
    const { workspaceConnections } = query;
    try {
      const typeormDataSource = await new DataSource(workspaceConnections).initialize();

      this.queryBuilder.setColumns(['database_config']);
      this.queryBuilder.setTableName(WORKSPACE_TABLE_NAME);

      const { queryString, params } = this.queryBuilder.getByQuery({}, ['database_config']);
      const queryResult = await typeormDataSource.query(queryString, params);
      await typeormDataSource?.destroy();
      return queryResult[0]?.database_config;

    } catch (error) {
      throw new UnDefineError(error.message);
    }
  }
}
