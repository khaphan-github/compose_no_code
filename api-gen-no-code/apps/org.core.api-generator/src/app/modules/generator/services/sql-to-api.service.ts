import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ExecuteScriptCommand } from "../commands/execute-script.command";

import { GetSQLScriptQuery } from "../queries/sql-to-api/get-asserts-sql-script.query";
import { CreateWorkspaceCommand } from "../commands/create-workspace.command";
import { CreateApplicationCommand } from "../commands/create-app.command";
import { WORKSPACE_VARIABLE } from "../../shared/variables/workspace.variable";
import { CrudService } from "../../crud-pg/services/crud-pg.service";
import { GetCreateAuthTableScriptQuery } from "../queries/sql-to-api/get-asserts-auth-script.query";
import { RunScriptCommand } from "../commands/run-script-command";
import { GetWorkspaceConnectionQuery } from "../queries/get-workspace-connection.query";

@Injectable()
export class SQLToAPIService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SQLToAPIService.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly crudService: CrudService,
  ) { }

  onApplicationBootstrap() {
    this.executeScriptFromSqlFile();
  }

  //#region api to sql
  executeScriptFromSqlFile = async () => {
    try {
      const [connection, script, authscript] = await Promise.all([
        this.queryBus.execute(new GetWorkspaceConnectionQuery()),
        this.queryBus.execute(new GetSQLScriptQuery()),
        this.queryBus.execute(new GetCreateAuthTableScriptQuery()),
      ]);

      const { type, database, host, password, port, username } = connection;
      this.logger.debug(`Get config database.sql and connection success!`);

      await this.commandBus.execute(
        new CreateWorkspaceCommand(
          WORKSPACE_VARIABLE.OWNER_ID,
          {
            database: type, // <-- type
            databaseName: database,
            host: host,
            password: password,
            port: port,
            username: username,
          },
          WORKSPACE_VARIABLE.WORKSPACE_ID),
      );

      this.logger.debug(`Found workspace ${WORKSPACE_VARIABLE.WORKSPACE_ID}! `);

      await this.commandBus.execute(new CreateApplicationCommand(
        connection,
        WORKSPACE_VARIABLE.OWNER_ID,
        {
          appName: WORKSPACE_VARIABLE.APP_NAME,
          database: type,
          databaseName: database,
          host: host,
          password: password,
          port: port,
          useDefaultDb: true,
          username: username,
          workspaceId: WORKSPACE_VARIABLE.WORKSPACE_ID,
        },
        WORKSPACE_VARIABLE.APP_ID,
      ));

      this.logger.debug(`Found application ${WORKSPACE_VARIABLE.APP_ID}!`);

      await this.commandBus.execute(
        new RunScriptCommand(
          connection, authscript
        )
      );

      const executeResult = await this.commandBus.execute(
        new ExecuteScriptCommand(
          connection,
          WORKSPACE_VARIABLE.APP_ID,
          WORKSPACE_VARIABLE.OWNER_ID,
          { script: script }
        )
      );

      this.logger.debug(`Execute script success success!`);
      if (executeResult) {
        this.logger.log(`GENNERATE API SUCCESS`);
      }
    } catch (error) {
      //
      console.error(error);
    }
  }
  //#endregion api to sql
}
