import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
import { CreateWorkspaceCommand } from "../commands/create-workspace.command";
import { ExecuteScriptDto } from "../dto/script.dto";
import { ExecuteScriptCommand } from "../commands/execute-script.command";
import { QueryParamDataDto } from "../../crud-pg/controller/query-filter.dto";
import { GetWorkspaceByIdQuery } from "../queries/get-workspace.query";
import { CreateApplicationDto } from "../dto/create-app.dto";
import { CreateApplicationCommand } from "../commands/create-app.command";
import { GetAppsByWorkspaceIdQuery } from "../queries/get-app-by-workspace-id.query";
import { GetWorkspaceConnectionQuery } from "../queries/get-workspace-connection.query";
import { GetCreatedDbScriptByAppIdQuery } from "../queries/get-app-createdb-script.query";
import { GetSchemaInfoByAppIdQuery } from "../queries/get_schema_info.query";
import { GetApisByAppIdQuery } from "../queries/get-apis-by-app-id.query";
import { SQLTransformerDto } from "../controllers/mll.query.dto";
import { SQLTransformerProxy } from "../proxy/sql.transformer.proxy";
import { RunScriptCommand } from "../commands/run-script-command";
import { ApiGeneratedViewModel } from "../view-model/apis.view.model";

@Injectable()
export class GeneratorService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly sqltransformer: SQLTransformerProxy
  ) { }

  private getWorkspaceConnection() {
    return this.queryBus.execute(new GetWorkspaceConnectionQuery());
  }

  createWorkspace(createAppDto: CreateWorkspaceDto) {
    const owner_id = '1';
    return this.commandBus.execute(new CreateWorkspaceCommand(
      owner_id, createAppDto));
  }

  executeCreateDatabaseScript = async (appId: number, ownerId: string, scripts: ExecuteScriptDto) => {
    const workspaceConnection = await this.getWorkspaceConnection();
    return this.commandBus.execute(new ExecuteScriptCommand(workspaceConnection, appId, ownerId, scripts));
  }

  async isExistedWorkspace() {
    try {
      await this.getWorkspaceConnection();
    } catch (error) {
      return false;
    }
    return true;
  }

  async getWorkspaceById(id: string, queryParamDto: QueryParamDataDto) {
    const workspaceConnection = await this.getWorkspaceConnection();
    return this.queryBus.execute(new GetWorkspaceByIdQuery(workspaceConnection, id, queryParamDto));
  }

  createApp(ownerId: string, createAppDto: CreateApplicationDto) {
    return this.commandBus.execute(new CreateApplicationCommand({} as any,ownerId, createAppDto));
  }

  async getAppsByWorkspaceId(ownerId: string, workspaceId: number,) {
    const workspaceConnection = await this.getWorkspaceConnection();
    return this.queryBus.execute(new GetAppsByWorkspaceIdQuery(workspaceConnection, ownerId, workspaceId));
  }

  async getCreateDbScriptByAppId(appId: number, ownerId: string) {
    const workspaceConnection = await this.getWorkspaceConnection();
    return this.queryBus.execute(new GetCreatedDbScriptByAppIdQuery(workspaceConnection, ownerId, appId));
  }

  async getSchemasByAppId(appId: number, ownerId: string) {
    const workspaceConnection = await this.getWorkspaceConnection();
    return this.queryBus.execute(new GetSchemaInfoByAppIdQuery(workspaceConnection, ownerId, appId));
  }

  async getApisByAppId(appId: number, ownerId: string) {
    const workspaceConnection = await this.getWorkspaceConnection();
    return this.queryBus.execute(new GetApisByAppIdQuery(workspaceConnection, ownerId, appId));
  }

  async getSQLTransformer(ownerID: string, appId: number, question: SQLTransformerDto) {
    const workspaceConnection = await this.getWorkspaceConnection();

    const createDbScript = await this.queryBus.execute(
      new GetCreatedDbScriptByAppIdQuery(workspaceConnection, ownerID, appId)
    );

    const sugesstionRes = await this.sqltransformer.transform(
      createDbScript?.create_db_script, question.question
    );

    const commandResult = this.commandBus.execute(
      new RunScriptCommand(workspaceConnection, sugesstionRes.data)
    );

    return commandResult;
  }

  async getApiGeneratedHbsView(appId: number, ownerId: string) {
    const viewModel = new ApiGeneratedViewModel();

    const workspaceConnection = await this.getWorkspaceConnection();
    const apis = await this.queryBus.execute(new GetApisByAppIdQuery(workspaceConnection, ownerId, appId));
    return viewModel.getApiDocsDisplay(apis);
  }

}
