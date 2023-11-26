import _ from "lodash";
import { AST, Create } from "node-sql-parser";

export enum EGeneratedApisTableColumns {
  ID = 'id',
  APP_ID = 'app_id',
  TABLE_NAME = 'table_name',
  ACTION = 'action',
  API_PATH = 'api_path',
  HTTP_METHOD = 'http_method',
  AUTHENTICATION = 'authentication',
  API_AUTHORIZED = 'api_authorized',
  HEADERS = 'headers',
  REQUEST_PARAMS = 'request_params',
  REQUEST_BODY_TYPE = 'request_body_type',
  REQUEST_BODY = 'request_body',
  RESPONSE_ATTRIBUTES = 'response_attributes',
  ENABLE = 'enable',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum ApiAction {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  QUERY = 'QUERY'
}

export enum RestFulMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum Authenticate {
  NO_AUTH = 'NO_AUTH',
  NEED_AUTH = 'NEED_AUTH',
}

export interface IGeneratedApi {
  id: number;
  app_id: number;
  table_name: string;
  action: string;
  api_path: string;
  http_method: string;
  authentication: string;
  api_authorized: object;
  headers: object;
  request_params: object;
  request_body_type: string;
  request_body: object;
  response_attributes: object;
  enable: boolean;
  created_at: Date;
  updated_at: Date;
}

export class GeneratedApiModel {
  extractApisFromTableInfo = (appId: number, secretKey: string, tableInfo: AST | AST[]): object[] => {
    const apis: object[] = [];

    try {
      if (_.isArray(tableInfo)) {
        _.forEach(tableInfo, (_info: Create) => {
          if (_info.type == 'create' && _info.keyword == 'table') {
            const api = this.mapASTToAPI(appId, secretKey, _info)
            apis.push(api.insert);
            apis.push(api.update);
            apis.push(api.delete);
            apis.push(api.query);
          }
        });
        return apis;
      } else {
        if (tableInfo?.type == 'create' && tableInfo?.keyword == 'table') {
          const api = this.mapASTToAPI(appId, secretKey, tableInfo as Create);
          apis.push(api.insert);
          apis.push(api.update);
          apis.push(api.delete);
          apis.push(api.query);
        }
      }
    } catch (error) {
      console.error(error);
    }

    return apis;
  }

  mapASTToAPI = (appId: number, secretKey: string, _info: Create) => {
    const query = this.getApiConfig(appId, _info, RestFulMethod.GET, secretKey);
    const insert = this.getApiConfig(appId, _info, RestFulMethod.POST, secretKey);
    const update = this.getApiConfig(appId, _info, RestFulMethod.PUT, secretKey);
    const _delete = this.getApiConfig(appId, _info, RestFulMethod.DELETE, secretKey);

    return {
      insert: insert,
      update: update,
      delete: _delete,
      query: query
    };
  }

  getApiConfig = (appId: number, _info: Create, typeApi: RestFulMethod, secretKey: string) => {
    const apiRecord = {};

    const requestBody = {};
    _info?.create_definitions?.forEach(item => {
      if (item.column) {
        const columnName = item?.column?.column?.toLocaleLowerCase();
        requestBody[columnName] = 'example_data';
      }
    });

    const tableName = (_info?.table[0]?.table as string)?.toLocaleLowerCase() ?? '';
    const apiPath = `/schema/${tableName}`;

    const { ACTION, API_PATH, APP_ID, AUTHENTICATION, CREATED_AT, ENABLE, HEADERS, HTTP_METHOD,
      REQUEST_BODY, RESPONSE_ATTRIBUTES, TABLE_NAME, UPDATED_AT, REQUEST_PARAMS } = EGeneratedApisTableColumns;

    apiRecord[APP_ID] = appId;
    apiRecord[TABLE_NAME] = tableName;
    apiRecord[HEADERS] = JSON.stringify({
      AppClientSecretKey: secretKey
    });
    apiRecord[AUTHENTICATION] = Authenticate.NO_AUTH;

    apiRecord[ENABLE] = true;
    apiRecord[CREATED_AT] = new Date();
    apiRecord[UPDATED_AT] = new Date();
    apiRecord[REQUEST_BODY] = JSON.stringify({});
    apiRecord[RESPONSE_ATTRIBUTES] = JSON.stringify({});

    switch (typeApi) {
      case RestFulMethod.GET:
        apiRecord[API_PATH] = `${apiPath}/query`;
        apiRecord[REQUEST_PARAMS] = {
          page: 0,
          size: 10,
          orderby: 'idExample',
          sort: 'DESC/ASC',
          selectes: 'idExample',
        };
        apiRecord[HTTP_METHOD] = RestFulMethod.GET;
        apiRecord[ACTION] = ApiAction.QUERY;

        break;
      case RestFulMethod.POST:
        apiRecord[API_PATH] = apiPath;
        apiRecord[REQUEST_PARAMS] = {};

        apiRecord[HTTP_METHOD] = RestFulMethod.POST;
        apiRecord[ACTION] = ApiAction.INSERT;
        apiRecord[REQUEST_BODY] = JSON.stringify([requestBody]);
        apiRecord[RESPONSE_ATTRIBUTES] = JSON.stringify([requestBody]);

        break;
      case RestFulMethod.PUT:
        apiRecord[API_PATH] = `${apiPath}/:id`;
        apiRecord[REQUEST_PARAMS] = {};

        apiRecord[HTTP_METHOD] = RestFulMethod.PUT;
        apiRecord[ACTION] = ApiAction.UPDATE;
        apiRecord[REQUEST_BODY] = JSON.stringify([requestBody]);
        apiRecord[RESPONSE_ATTRIBUTES] = JSON.stringify([requestBody]);

        break;
      case RestFulMethod.DELETE:
        apiRecord[API_PATH] = `${apiPath}/:id`;
        apiRecord[REQUEST_PARAMS] = {};
        apiRecord[HTTP_METHOD] = RestFulMethod.DELETE;
        apiRecord[ACTION] = ApiAction.DELETE;
        break;
    }
    return apiRecord;
  }
}

