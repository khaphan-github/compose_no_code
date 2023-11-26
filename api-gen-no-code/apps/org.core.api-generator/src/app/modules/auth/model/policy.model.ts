/* eslint-disable @typescript-eslint/no-explicit-any */
export class PolicyModel {
  private account!: any;
  constructor(
    public readonly roles: Array<any>,
    public readonly apis: Array<any>,
    public readonly accountList: Array<any>,
  ) {
    this.account = accountList[0];
  }

  extractToPolicy() {
    // Duyệt từng role id của tài khoản
    const uniqueSet = new Set([]); // <-- Nếu user có quyền vô api thì sẽ nằm trong nàuy
    const apiMap = Object.fromEntries(this.apis.map((api) => [api.id.toString(), api]));
    const roleMap = Object.fromEntries(this.roles.map((role) => ['_role_' + role.id.toString(), role]));
    const roleIdOfAccount = this.account?.metadata?.roleIds as string[];
    for (let index = 0; index < roleIdOfAccount?.length; index++) {
      const roleId = '_role_' + roleIdOfAccount[index].toString();
      const roleInfo = roleMap[roleId]; // Array of role of this account.
      if (roleInfo) {
        // Duyệt từng api có thể truy cập của this role
        const apis = roleInfo?.metadata?.apis as any[]; // api
        for (let index = 0; index < apis.length; index++) {
          const apiId = apis[index]; // api id.
          const { table_name , http_method} = apiMap[apiId];
          const setKey = PolicyModel.getKeyCachePolicyAPI(this.account.id, table_name, http_method);
          uniqueSet.add(setKey);
        }
      }
    }
    return uniqueSet;
  }

  public static getKeyCachePolicyAPI(userId: string, tableName: string, method: string) {
    return `user_id_${userId}_exec_table_${tableName}_with_method_${method}`
  }

  public static getKeyCachePolicyByUser(authCache: string, userId: string) {
    return `policy_${authCache}_of_user_id_${userId}`;
  }
}
