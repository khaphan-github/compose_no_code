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
import { GetInitCoreTableScriptQuery } from "../queries/sql-to-api/get-asserts-core-table.query";

@Injectable()
export class SQLToAPIService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SQLToAPIService.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly crudService: CrudService,
  ) { }

  async onApplicationBootstrap() {
    // Init all nessarray tableL
    // const [connection, script] = await Promise.all([
    //   this.queryBus.execute(new GetWorkspaceConnectionQuery()),
    //   this.queryBus.execute(new GetInitCoreTableScriptQuery()),
    // ]);
    // const executeResult = await this.commandBus.execute(
    //   new ExecuteScriptCommand(
    //     connection,
    //     WORKSPACE_VARIABLE.APP_ID,
    //     WORKSPACE_VARIABLE.OWNER_ID,
    //     { script: script }
    //   )
    // );

    // console.log(executeResult);
    // this.logger.debug(`Init core table success!!!`);

    // this.executeScriptFromSqlFile();
  }

  //#region api to sql
  executeScriptFromSqlFile = async () => {
    try {
      const [connection, authscript] = await Promise.all([
        this.queryBus.execute(new GetWorkspaceConnectionQuery()),
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

    } catch (error) {
      console.error(error);
    }
  }
  //#endregion api to sql

  async executeScript(script: string) {
    await this.executeScriptFromSqlFile();
    const connection = await this.queryBus.execute(new GetWorkspaceConnectionQuery());
    this.logger.log(`Generate core table success!`);

    const executeResult = await this.commandBus.execute(
      new ExecuteScriptCommand(
        connection,
        WORKSPACE_VARIABLE.APP_ID,
        WORKSPACE_VARIABLE.OWNER_ID,
        { script: script }
      )
    );

    this.logger.log(`Execute user script success!`);
    return executeResult;
  }

  async executeScriptAgain(script: string) {
    const connection = await this.queryBus.execute(new GetWorkspaceConnectionQuery());
    this.logger.log(`Generate core table success!`);

    await this.commandBus.execute(
      new RunScriptCommand(
        connection,
        `
          DO $$
          DECLARE
              r RECORD;
              whiteList TEXT[] := ARRAY['_core_workspace_config', '_core_applications'];
          BEGIN
              FOR r IN
                (
                  SELECT table_name
                  FROM information_schema.tables
                  WHERE table_schema = current_schema()
                )
              LOOP
                  -- Check if the table is not in the whiteList before dropping
                  IF r.table_name = ANY(whiteList) THEN
                      CONTINUE;
                  END IF;

                  EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.table_name) || ' CASCADE';
              END LOOP;
          END $$;

        `
      )
    );

    await this.executeScript(script);
    return {
      success: true
    };
  }
}
