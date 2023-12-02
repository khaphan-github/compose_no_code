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
  extractApisFromTableInfo = (appId: number, secretKey: string, tableInfo: { table_name: string, column_name: string }[]): any => {
    const apis: object[] = [];

    const groupedData = tableInfo.reduce((result, { table_name, column_name }) => {
      if (!result[table_name]) {
        result[table_name] = { table_name, column_names: [] };
      }
      result[table_name].column_names.push(column_name);
      return result;
    }, {});
    const finalResult = Object.values(groupedData);

    let id = 1;
    const whiteList = ['_core_workspace_config', '_core_generated_apis', '_core_applications', '_core_account', '_core_role'];
    for (let index = 0; index < finalResult.length; index++) {
      const element = finalResult[index] as { table_name: string, column_names: string[] };
      if (whiteList.includes(element.table_name)) {
        continue;
      }

      apis.push(this.getApiConfig(id, appId, element.table_name, element.column_names, RestFulMethod.GET,));
      id += 1;
      apis.push(this.getApiConfig(id, appId, element.table_name, element.column_names, RestFulMethod.POST,));
      id += 1;
      apis.push(this.getApiConfig(id, appId, element.table_name, element.column_names, RestFulMethod.PUT,));
      id += 1;
      apis.push(this.getApiConfig(id, appId, element.table_name, element.column_names, RestFulMethod.DELETE,));
      id += 1;
    }

    // Register
    // Register, Login api
    return apis;
  }
  convertArrayToObject(columnNames: string[], exampleData: object | string | number) {
    return columnNames.reduce((result, columnName) => {
      result[columnName] = exampleData;
      return result;
    }, {});
  }

  getApiConfig = (index: number, appId: number, table: string, columns: string[], typeApi: RestFulMethod) => {
    const apiRecord = {};

    const requestBody = this.convertArrayToObject(columns, `put_your_data_`);

    const tableName = table ?? '';
    const apiPath = `/${tableName}`;

    const { ACTION, API_PATH, APP_ID, AUTHENTICATION, CREATED_AT, ENABLE, HEADERS, HTTP_METHOD,
      REQUEST_BODY, RESPONSE_ATTRIBUTES, TABLE_NAME, UPDATED_AT, REQUEST_PARAMS } = EGeneratedApisTableColumns;

    apiRecord[APP_ID] = appId;
    apiRecord[TABLE_NAME] = tableName;
    apiRecord[HEADERS] = JSON.stringify({
      Authenticate: 'eyJhbGciO...',
      'Content-Type': 'application/json'
    });
    apiRecord[AUTHENTICATION] = Authenticate.NEED_AUTH;

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
          orderby: 'id',
          sort: 'DESC/ASC',
          selectes: 'id',
        };
        apiRecord[REQUEST_BODY] = JSON.stringify([requestBody]);
        apiRecord[RESPONSE_ATTRIBUTES] = JSON.stringify([requestBody]);
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
    return { ...apiRecord, id: index };
  }

  createDocsLoginAPI(index: number, appId: number, table: string, columns: string[], typeApi: RestFulMethod) {
    const apiRecord = {};
    const requestBody = {
      username: 'put_your_username',
      password: 'put_your_password',
    }

    const { ACTION, API_PATH, APP_ID, AUTHENTICATION, CREATED_AT, ENABLE, HEADERS, HTTP_METHOD,
      REQUEST_BODY, RESPONSE_ATTRIBUTES, TABLE_NAME, UPDATED_AT, REQUEST_PARAMS } = EGeneratedApisTableColumns;

    apiRecord[APP_ID] = appId;
    apiRecord[TABLE_NAME] = 'http://hostname/api/v1/login';
    apiRecord[API_PATH] = '';
    apiRecord[REQUEST_PARAMS] = {};

    apiRecord[HTTP_METHOD] = RestFulMethod.POST;
    apiRecord[ACTION] = ApiAction.INSERT;
    apiRecord[REQUEST_BODY] = JSON.stringify([requestBody]);
    apiRecord[RESPONSE_ATTRIBUTES] = JSON.stringify([requestBody]);
    return { ...apiRecord, id: index };
  }
}

