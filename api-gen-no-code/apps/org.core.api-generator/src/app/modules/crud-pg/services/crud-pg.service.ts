import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { QueryParamDataDto, RequestParamDataDto } from "../controller/query-filter.dto";
import { ConditionObject } from "../../../core/pgsql/pg.relationaldb.query-builder";
import { GetDataQuery } from "../queries/get-by-conditions.query";
import { DeleteDataCommand } from "../commands/delete.command";
import { CreateDataCommand } from "../commands/create..command";
import { UpdateDataCommand } from "../commands/update.command";
import { GetSchemaStructureQuery } from "../queries/get-schema-structure.query";
import { GetWorkspaceConnectionQuery } from "../../generator/queries/get-workspace-connection.query";
import { GetAppInfoByAppId } from "../queries/get-app-info-by-app-id.query";
import { ApplicationModel } from "../../../core/models/application.model";
import { RunScriptCommand } from "../../generator/commands/run-script-command";

@Injectable()
export class CrudService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  private async getApplicationInfo(appId: string | number): Promise<ApplicationModel> {
    const workspaceConnection = await this.queryBus.execute(new GetWorkspaceConnectionQuery());
    return this.queryBus.execute(new GetAppInfoByAppId(workspaceConnection, appId));
  }

  async insert(appId: string, schema: string, data: Array<object>) {
    const appInfo = await this.getApplicationInfo(appId)
    const tableInfo = await this.queryBus.execute(new GetSchemaStructureQuery(appInfo, appId, schema));
    return this.commandBus.execute(
      new CreateDataCommand(appInfo, tableInfo, appId, schema, data)
    );
  }

  async update(appId: string, schema: string, id: string, idColumn: string, data: object) {
    const appInfo = await this.getApplicationInfo(appId)
    const tableInfo = await this.queryBus.execute(new GetSchemaStructureQuery(appInfo, appId, schema));
    return this.commandBus.execute(new UpdateDataCommand(appInfo, tableInfo, appId, schema, id, idColumn, data));
  }

  async delete(appId: string, schema: string, id: number, column: string) {
    const appInfo = await this.getApplicationInfo(appId)
    const tableInfo = await this.queryBus.execute(new GetSchemaStructureQuery(appInfo, appId, schema));
    return this.commandBus.execute(new DeleteDataCommand(appInfo, tableInfo, appId, schema, id, column));
  }

  async query(
    requestParamDataDto: RequestParamDataDto,
    queryParamDataDto: QueryParamDataDto,
    conditions: ConditionObject,
  ) {
    const { appid, schema } = requestParamDataDto;
    const appInfo = await this.getApplicationInfo(appid)
    const tableInfo = await this.queryBus.execute(new GetSchemaStructureQuery(appInfo, appid, schema));

    return this.queryBus.execute(
      new GetDataQuery(appInfo, tableInfo, requestParamDataDto, queryParamDataDto, conditions)
    );
  }

  // Additional:
  async countAll(appId: string, schema: string) {
    const workspaceConnection = await this.queryBus.execute(new GetWorkspaceConnectionQuery());

    return this.commandBus.execute(
      new RunScriptCommand(workspaceConnection, `SELECT COUNT(*) FROM ${schema}`)
    );
  }

  async totalTable(appId: string, schema: string) {
    const workspaceConnection = await this.queryBus.execute(new GetWorkspaceConnectionQuery());

    return this.commandBus.execute(
      new RunScriptCommand(workspaceConnection, `
        SELECT count(*)
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
      `)
    );
  }

}
