/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import { WORKSPACE_VARIABLE } from '../../shared/variables/workspace.variable';

export class PolicyModel {
  public static readonly API_WHITE_LIST = [
    '/api/v1/login',
    '/api/v1/register',
    '/api/v1/generator',
  ];

  private account!: any;
  constructor(
    public readonly roles: Array<any>,
    public readonly apis: Array<any>,
    public readonly accountList: Array<any>,
    public readonly customApi: Array<any>,
  ) {
    this.account = accountList[0];
  }

  extractToPolicy() {
    // Duyệt từng role id của tài khoản
    const uniqueSet = new Set([]); // <-- Nếu user có quyền vô api thì sẽ nằm trong nàuy
    const apiMap = Object.fromEntries(this.apis?.map((api) => [api.id.toString(), api]));
    const roleMap = Object.fromEntries(this.roles?.map((role) => ['_role_' + role.id.toString(), role]));
    const customApiMap = Object.fromEntries(this.customApi?.map((api) => ['_custom_api_' + api.id.toString(), api]));

    const roleIdOfAccount = this.account?.metadata?.roleIds as string[];

    for (let index = 0; index < roleIdOfAccount?.length; index++) {
      const roleId = '_role_' + roleIdOfAccount[index].toString();
      const roleInfo = roleMap[roleId]; // Array of role of this account.
      if (roleInfo) {
        // Duyệt từng api có thể truy cập của this role
        const apis = roleInfo?.metadata?.apis as any[]; // api
        for (let index = 0; index < apis.length; index++) {
          const apiId = apis[index]; // api id.
          const { table_name, action } = apiMap[apiId];
          const setKey = PolicyModel.getKeyCachePolicyAPI(this.account.id, table_name, action);
          uniqueSet.add(setKey);
        }

        // Duyệt custom api
        const customApis = roleInfo?.metadata?.customApis as any[]; // api
        customApis?.forEach((element: string) => {
          const validApi  = customApiMap["_custom_api_" + element];
          if(validApi) {
            const { action, api_path } = validApi
            const setKey = PolicyModel.getKeyCachePolicyAPI(this.account.id, api_path, action);
            uniqueSet.add(setKey);
          }
        });
      }
    }
    return uniqueSet;
  }

  public static getKeyCachePolicyAPI(userId: string, tableName: string, action: string) {
    return `user::${userId}::can:${action.toLowerCase()}::with:${tableName}`
  }

  public static getKeyCachePublicAPI(tableName: string, action: string) {
    return `request:can:${action.toLowerCase()}::table:${tableName}::cause:public`;
  }

  public static getKeyCachePolicyByUser(authCache: string, userId: string) {
    return `policy_${authCache}_of_user_id_${userId}`;
  }

  public static extractTableName(request: Request) {
    const { baseUrl } = request;
    const match = baseUrl.replace(`/api/v1/app/${WORKSPACE_VARIABLE.APP_ID}/schema/`, '');
    return match.split('/')[0];
  }

  // SHOULD Be return UPDATE QUERY INSERT DELETE
  public static getActionFromRequest(request: Request) {
    if (request.method == 'DELETE') { return 'DELETE' }
    if (request.method == 'PUT') { return 'UPDATE' }
    if (request.method == 'POST' && request.baseUrl.includes('query')) {
      return 'QUERY'
    }
    return 'INSERT';
  }
}
