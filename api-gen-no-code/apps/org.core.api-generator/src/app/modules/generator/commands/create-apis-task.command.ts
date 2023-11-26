import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions, QueryFailedError } from 'typeorm';
import { AST } from 'node-sql-parser';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { GeneratedApiModel } from '../../../core/models/generated-api.model';
import { GENERATED_APIS_AVAILABLE_COLUMNS, GENERATED_APIS_TABLE_NAME } from '../../../core/variables/generated-api-table.variables';

export class TaskGenerateAPIsCommand {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly ownerId: string,
    public readonly appId: number,
    public readonly tableInfo: AST | AST[] | any,
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
    const { appId, workspaceConnections } = command;

    const tableInfoQueryBuilder = new RelationalDBQueryBuilder('information_schema.columns', ['table_name', 'column_name', 'table_schema']);
    const { params, queryString } = tableInfoQueryBuilder.getByQuery({
      conditions: {
        table_schema: 'public'
      }
    }, ['table_name', 'column_name']);

    let workspaceTypeormDataSource: DataSource;
    try {
      workspaceTypeormDataSource = await new DataSource(workspaceConnections).initialize();
      const queryResult = await workspaceTypeormDataSource.query(queryString, params);
      const apis = this.generatedApiModel.extractApisFromTableInfo(appId, '_', queryResult);
      const inserApis = this.queryBuilder.insertMany(apis, ['id']);

      const result = await workspaceTypeormDataSource.query(inserApis.queryString, inserApis.params);
      await workspaceTypeormDataSource?.destroy();
      return result;
    } catch (error) {
      await workspaceTypeormDataSource?.destroy();
      if (error instanceof QueryFailedError) {
        this.logger.verbose(`Apis generated not be insert again: ${error}`);
        return false;
      }
      this.logger.error(error);
      return false;
    }
  }
}
