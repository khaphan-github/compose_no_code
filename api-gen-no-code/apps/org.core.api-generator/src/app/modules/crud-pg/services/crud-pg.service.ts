import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { QueryParamDataDto, RequestParamDataDto } from "../controller/query-filter.dto";
import { ConditionObject, JoinTable } from "../../../core/pgsql/pg.relationaldb.query-builder";
import { GetDataQuery } from "../queries/get-by-conditions.query";
import { DeleteDataCommand } from "../commands/delete.command";
import { CreateDataCommand } from "../commands/create..command";
import { UpdateDataCommand } from "../commands/update.command";
import { GetSchemaStructureQuery } from "../queries/get-schema-structure.query";
import { GetWorkspaceConnectionQuery } from "../../generator/queries/get-workspace-connection.query";
import { GetAppInfoByAppId } from "../queries/get-app-info-by-app-id.query";
import { ApplicationModel } from "../../../core/models/application.model";
import { RunScriptCommand } from "../../generator/commands/run-script-command";
import { WORKSPACE_VARIABLE } from "../../shared/variables/workspace.variable";
import NodeCache from "node-cache";

@Injectable()
export class CrudService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly nodeCache: NodeCache,
  ) { }

  // Lấy những cột có thể hiển thị
  public async getColumnsToResonseEachAPI(table: string, action: string) {
    const cacheKey = `available_columns_with_action_${action}_in_table_${table}`;
    const columnsInCache = this.nodeCache.get(cacheKey);
    if (columnsInCache) { return columnsInCache };

    const appid = WORKSPACE_VARIABLE.APP_ID.toString();

    const appInfo = await this.getApplicationInfo(appid)
    const tableInfo = await this.queryBus.execute(new GetSchemaStructureQuery(appInfo, appid, '_core_generated_apis'));

    const queryResult = await this.queryBus.execute(
      new GetDataQuery(appInfo, tableInfo, {
        appid: appid,
        schema: '_core_generated_apis'
      }, {
        selects: ['table_name', 'action', 'api_authorized'],
      }, {
        and: [
          { 'table_name': table },
          { 'action': action },
        ]
      },)
    );

    const availableColumns = queryResult[0]?.api_authorized?.columns?.filter((el) => {
      return el.active === true;
    }).map((el) => el.columnName);

    console.log(`Available colunms of table ${table} with action ${action} are: ${JSON.stringify(availableColumns)}`);
    this.nodeCache.set(cacheKey, availableColumns);
    return availableColumns;
  }

  private async getApplicationInfo(appId: string | number): Promise<ApplicationModel> {
    const workspaceConnection = await this.queryBus.execute(new GetWorkspaceConnectionQuery());
    return this.queryBus.execute(new GetAppInfoByAppId(workspaceConnection, appId));
  }

  async insert(appId: string, schema: string, data: Array<object>) {
    const appInfo = await this.getApplicationInfo(appId)
    const tableInfo = await this.queryBus.execute(new GetSchemaStructureQuery(appInfo, appId, schema));
    const returningQueryByTable = await this.getColumnsToResonseEachAPI(schema, 'INSERT');

    return this.commandBus.execute(
      new CreateDataCommand(appInfo, tableInfo, appId, schema, data, returningQueryByTable)
    );
  }

  async update(appId: string, schema: string, id: string, idColumn: string, data: object) {
    const appInfo = await this.getApplicationInfo(appId)
    const tableInfo = await this.queryBus.execute(new GetSchemaStructureQuery(appInfo, appId, schema));
    const returningQueryByTable = await this.getColumnsToResonseEachAPI(schema, 'UPDATE');

    return this.commandBus.execute(
      new UpdateDataCommand(
        appInfo,
        tableInfo,
        appId,
        schema,
        id,
        idColumn,
        data,
        returningQueryByTable
      ));
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
    joinTable?: JoinTable[],
  ) {
    const { appid, schema } = requestParamDataDto;
    const appInfo = await this.getApplicationInfo(appid)
    const tableInfo = await this.queryBus.execute(new GetSchemaStructureQuery(appInfo, appid, schema));

    // Trường hợp có join table
    let returingQuery = [];
    if (joinTable && joinTable.length !== 0) {
      const tableNameJoinTable = joinTable?.map((table) => table.withTableName);
      for (const tableName of tableNameJoinTable) {
        returingQuery = await this.getColumnsToResonseEachAPI(tableName, 'QUERY');
        console.log(returingQuery);
      }
    } else {
      // trường hợp không có join bảng
      returingQuery = await this.getColumnsToResonseEachAPI(schema, 'QUERY');
      console.log(`Call this funciton: ${returingQuery}`)
    }

    return this.queryBus.execute(
      new GetDataQuery(
        appInfo,
        tableInfo,
        requestParamDataDto,
        queryParamDataDto,
        conditions,
        joinTable,
        returingQuery
      )
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
