import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AST } from 'node-sql-parser';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { GeneratedApiModel } from '../../../core/models/generated-api.model';
import { GENERATED_APIS_AVAILABLE_COLUMNS, GENERATED_APIS_TABLE_NAME } from '../../../core/variables/generated-api-table.variables';

export class TaskGenerateAPIsCommand {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly ownerId: string,
    public readonly appId: number,
    public readonly tableInfo: AST | AST[],
  ) { }
}

@CommandHandler(TaskGenerateAPIsCommand)
export class TaskGenerateAPIsCommandHandler
  implements ICommandHandler<TaskGenerateAPIsCommand>
{
  private readonly queryBuilder!: RelationalDBQueryBuilder;
  private readonly generatedApiModel: GeneratedApiModel;
  private readonly logger!: Logger;

  constructor() {
    this.queryBuilder = new RelationalDBQueryBuilder(
      GENERATED_APIS_TABLE_NAME, GENERATED_APIS_AVAILABLE_COLUMNS
    );
    this.generatedApiModel = new GeneratedApiModel();
    this.logger = new Logger(TaskGenerateAPIsCommandHandler.name);
  }

  async execute(command: TaskGenerateAPIsCommand) {
    const { appId, tableInfo, workspaceConnections } = command;

    const apis = this.generatedApiModel.extractApisFromTableInfo(appId, 'secret_kkey', tableInfo);
    const { params, queryString } = this.queryBuilder.insertMany(apis, ['id']);

    let workspaceTypeormDataSource: DataSource;
    try {
      workspaceTypeormDataSource = await new DataSource(workspaceConnections).initialize();
      const queryResult = await workspaceTypeormDataSource.query(queryString, params);

      await workspaceTypeormDataSource?.destroy();
      return queryResult;
    } catch (error) {
      await workspaceTypeormDataSource?.destroy();
      this.logger.error(error);
      return false;
    }
  }
}