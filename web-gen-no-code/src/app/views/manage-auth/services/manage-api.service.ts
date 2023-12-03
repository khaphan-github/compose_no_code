import { HttpClient } from '@angular/common/http';
import { STORAGED_KEY } from '../../../core/config/storage-key/localstorage.const';
import { apiPathBuilder, getHostName } from '../../../core/config/http-client/helper';
import { SResponse } from '../../../core/config/http-client/response-base';
import { Injectable } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { GeneratedAPI } from '../interfaces/response/generated-api.interface';
import { Role } from '../interfaces/roles/role.interface';
import { ICreateRole } from '../interfaces/roles/create-role.interface';
import { IUpdateRole } from '../interfaces/roles/update-role.interface';
import { Account } from '../interfaces/account/account.interface';
import { IUpdateAccount } from '../interfaces/account/update-account.interface';
import { ICreateAccount, ICreateAccountResponse } from '../interfaces/account/create-account.interface';
@Injectable()
export class ManageApiService {
  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  private apiListCache: SResponse<Array<GeneratedAPI>> | null = null;
  private apiRoleCache: SResponse<Array<Role>> | null = null;

  connectToServer(hostName: string, secretKey: string) {
    localStorage.setItem(STORAGED_KEY.modules.manageApi.connection.hostName, hostName);
    sessionStorage.setItem(STORAGED_KEY.modules.manageApi.connection.secretKey, secretKey);

    return this.httpClient.post<SResponse<any>>(`${hostName}/api/v1/connect`, {
      secretKey: secretKey,
    })
  }

  countGeneratedApi() {
    return this.httpClient.get<SResponse<[{ count: number }]>>(apiPathBuilder('/_core_generated_apis/count'));
  }
  countTotalTable() {
    return this.httpClient.get<SResponse<[{ count: number }]>>(apiPathBuilder('/_core_x/total-table'));
  }
  countRole() {
    return this.httpClient.get<SResponse<[{ count: number }]>>(apiPathBuilder('/_core_role/count'));
  }
  countAccount() {
    return this.httpClient.get<SResponse<[{ count: number }]>>(apiPathBuilder('/_core_account/count'));
  }

  // #region apis
  apiList() {
    return this.httpClient.post<SResponse<Array<GeneratedAPI>>>(apiPathBuilder('/_core_generated_apis/query'), {});
  }

  updateApi = (id: number, scope: string, enable: boolean, displayColumns: any[]) => {
    const requestBody = {
      authentication: scope == 'public' ? 'NO_AUTH' : 'NEED_AUTH',
      enable: enable,
      api_authorized: { columns: displayColumns }
    }
    return this.httpClient.put<SResponse<GeneratedAPI>>(apiPathBuilder(`/_core_generated_apis/${id}?id_column=id`), requestBody);

  }

  // #endregion apisvs

  // #region roles
  roleList() {
    return this.httpClient.post<SResponse<Array<Role>>>(apiPathBuilder('/_core_role/query'), {}).pipe(
      tap((res) => {
        this.apiRoleCache = res;
      })
    );
  }

  createRole(role: ICreateRole) {
    const requestBody = [role];
    return this.httpClient.post<SResponse<Role>>(apiPathBuilder('/_core_role'), requestBody).pipe(
      tap((res) => {
        if (res.status == 201) {
          this.apiRoleCache = null;
        }
      })
    );
  }

  updateRole(role: IUpdateRole,) {
    const requestBody = role;
    return this.httpClient.put<SResponse<Role>>(apiPathBuilder(`/_core_role/${role.id}?id_column=id`), requestBody)
      .pipe(
        tap((res) => {
          if (res.status == 200) {
            this.apiRoleCache = null;
          }
        })
      );;

  }

  deleteRole(id: number) {
    return this.httpClient.delete<SResponse<any>>(apiPathBuilder(`/_core_role/${id}?id_column=id`)).pipe(
      tap((res) => {
        if (res.status == 200) {
          this.apiRoleCache = null;
        }
      })
    );;
  }
  // #endregion roles

  // #region
  accountList() {
    return this.httpClient.post<SResponse<Array<Account>>>(apiPathBuilder('/_core_account/query'), {});
  }

  createAccount(createAccount: ICreateAccount) {
    const requestBody = createAccount;
    return this.httpClient.post<SResponse<ICreateAccountResponse>>(`${getHostName()}/api/v1/register`, requestBody);
  }

  updateAccount(account: IUpdateAccount) {
    return this.httpClient.put<SResponse<Account>>(apiPathBuilder(`/_core_account/${account.id}?id_column=id`),
      {
        metadata: account.metadata,
        enable: account.enable
      });
  }
  deleteAccount(id: number) {
    return this.httpClient.delete<SResponse<any>>(apiPathBuilder(`/_core_account/${id}?id_column=id`));
  }
  // #endregion

  // #region worksspace
  // #region connect to manage:

  // #region generator
  // #endregion generator
}
