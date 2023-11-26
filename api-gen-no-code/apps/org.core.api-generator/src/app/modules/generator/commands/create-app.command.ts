import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from "typeorm";
import { JsonIoService } from '../../shared/json.io.service';
import { CreateApplicationDto } from '../dto/create-app.dto';
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { EAppTableColumns } from '../../../core/models/application.model';
import { APPLICATIONS_TABLE_AVAILABLE_COLUMS, APPLICATIONS_TABLE_NAME } from '../../../core/variables/application-table.variables';

export class CreateApplicationCommand {
  constructor(
    public readonly ownerId: string,
    public readonly CreateApplicationDto: CreateApplicationDto,
    public readonly appid?: string | number,
  ) { }
}

@CommandHandler(CreateApplicationCommand)
export class CreateApplicationCommandHandler
  implements ICommandHandler<CreateApplicationCommand>
{
  private readonly queryBuilder!: RelationalDBQueryBuilder;

  private readonly logger = new Logger(CreateApplicationCommandHandler.name);

  constructor(
    private readonly jsonIO: JsonIoService,
  ) {
    this.queryBuilder = new RelationalDBQueryBuilder(APPLICATIONS_TABLE_NAME, APPLICATIONS_TABLE_AVAILABLE_COLUMS);

  }

  async execute(command: CreateApplicationCommand) {
    const { appName, useDefaultDb, workspaceId, database, databaseName, host, password, port, username }
      = command.CreateApplicationDto;

    try {
      // Get config workspace datbase
      const workspaceDbConfig = this.jsonIO.readJsonFile<DataSourceOptions>(`connection.json`);

      if (workspaceDbConfig) {
        const typeormDataSource = await new DataSource(workspaceDbConfig).initialize();

        const isExistedAppIdQuery = this.queryBuilder.getByQuery({
          conditions: {
            [EAppTableColumns.ID]: command.appid?.toString(),
          }
        });

        const isExitedAppResult = await typeormDataSource.query(isExistedAppIdQuery.queryString, isExistedAppIdQuery.params);
        if (isExitedAppResult[0]) {
          return isExitedAppResult[0];
        }

        let query = '';
        let queryParams = [];
        const responseColumns = ['id', 'workspace_id', 'app_name', 'enable', 'use_default_db', 'updated_at'];
        if (useDefaultDb) {
          const { queryString, params } = this.queryBuilder.insert({
            id: command?.appid,
            owner_id: command.ownerId,
            app_name: appName,
            workspace_id: workspaceId,
            enable: true,
            use_default_db: true,
            database_config: workspaceDbConfig,
          }, responseColumns);

          query = queryString;
          queryParams = params;
        } else {

          const databaseConfig = {
            type: database,
            host: host,
            port: port,
            username: username,
            password: password,
            database: databaseName,
          };

          // Todo: Only create if not exist;

          const { queryString, params } = this.queryBuilder.insert({
            id: command?.appid,
            owner_id: command.ownerId,
            app_name: appName,
            workspace_id: workspaceId,
            enable: true,
            use_default_db: false,
            database_config: databaseConfig,
          }, responseColumns);

          query = queryString;
          queryParams = params;
        }

        const queryResult = await typeormDataSource.query(query, queryParams);

        return queryResult[0];
      } else {
        throw new Error(`Json file workspace config not found`);
      }
    } catch (error) {
      this.logger.error(error);

      return {
        statusCode: 101,
        message: error.message
      }
    }
  }
}