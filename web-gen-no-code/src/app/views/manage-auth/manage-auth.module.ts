import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAuthComponent } from './manage-auth.component';
import { HttpClientModule } from '@angular/common/http';
import { ManageApiService } from './services/manage-api.service';
import { RouterModule } from '@angular/router';
import { AccountListComponent } from './components/account/account-list/account-list.component';
import { PolicyListComponent } from './components/policy/policy-list/policy-list.component';
import { AlertModule, BadgeModule, ButtonModule, CalloutModule, CardModule, DropdownModule, FormCheckComponent, FormModule, GridModule, ModalModule, TableModule } from '@coreui/angular';
import { RoleListComponent } from './components/roles/role-list/role-list.component';
import { WaitingToLoadComponent } from '../shared/waiting-to-load/waiting-to-load.component';
import { CreateRoleComponent } from './components/roles/create-role/create-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateRoleComponent } from './components/roles/update-role/update-role.component';
import { CreatePolicyComponent } from './components/policy/create-policy/create-policy.component';
import { UpdatePolicyComponent } from './components/policy/update-policy/update-policy.component';
import { DecentralizeComponent } from './components/roles/decentralize/decentralize.component';
import { IconModule } from '@coreui/icons-angular';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { UpdateAccountComponent } from './components/account/update-account/update-account.component';
import { ApiListComponent } from './components/apis/api-list/api-list.component';
import { CreateAccountComponent } from './components/account/create/setting.component';
import { HighlightModule } from 'ngx-highlightjs';
import { ExecuteScriptComponent } from './components/database/execute-script/execute-script.component';
import { ApiDocsComponent } from './components/apis/docs/api-docs.component';
import { UpdateApiComponent } from './components/apis/update-api/update-api.component';
import { AppListComponent } from './components/application/app-list/app-list.component';
import { CreateApiComponent } from './components/custom-api/create-api/create-api.component';
import { QueryParamKeyMapDirective } from '../shared/directive/query-param-key-map.directive';
import { InputFieldComponent } from './components/custom-api/input-field/input-field.component';
import { CustomApiListComponent } from './components/custom-api/custom-api-list/custom-api-list.component';
import { UpdateCustomApiComponent } from './components/custom-api/update-custom-api/update-custom-api.component';
import { ChatBoxComponent } from './components/bot/chat-box/chat-box.component';
import { LogComponent } from './components/log/log.component';
import { OverideCodeComponent } from './components/custom-api/overide-code/overide-code.component';
import { CodeEditorModule } from '@ngstack/code-editor';
import { GenerateFormComponent } from '../pages/generate-form/generate-form.component';
import { GenerateTableComponent } from '../pages/generate-table/generate-table.component';
import { TableComponent } from '../pages/table/table.component';

const UI_MODULES = [
  IconModule,
  CardModule,
  BadgeModule,
  TableModule,
  GridModule,
  ButtonModule,
  DropdownModule,
  ModalModule,
  FormCheckComponent,
  FormModule,

  NotFoundComponent,
  WaitingToLoadComponent,
  AlertModule,
  CalloutModule,

  HighlightModule,

  InputFieldComponent,
]

const MODULE_COMPONENTS = [
  QueryParamKeyMapDirective,
  ManageAuthComponent,

  // Custom api
  CustomApiListComponent,
  UpdateCustomApiComponent,
  OverideCodeComponent,

  // Chat box
  ChatBoxComponent,

  AppListComponent,

  ApiListComponent,
  ApiDocsComponent,
  UpdateApiComponent,
  CreateApiComponent,

  CreateAccountComponent,
  AccountListComponent,
  UpdateAccountComponent,

  PolicyListComponent,
  CreatePolicyComponent,
  UpdatePolicyComponent,

  RoleListComponent,
  CreateRoleComponent,
  UpdateRoleComponent,
  DecentralizeComponent,
 
  // Database.
  ExecuteScriptComponent,
  GenerateFormComponent,
  GenerateTableComponent,
  TableComponent,
  LogComponent,
]

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

    CodeEditorModule.forRoot(),

    ...UI_MODULES,
    RouterModule.forChild([
      {
        path: 'apis',
        component: ApiListComponent
      },
      {
        path: 'genform',
        component: GenerateFormComponent
      },
      {
        path: 'custom-api',
        component: CustomApiListComponent,
      },
      {
        path: 'account',
        component: AccountListComponent
      },
      {
        path: 'gentable',
        component: GenerateTableComponent,
      },
      {
        path: 'role',
        component: RoleListComponent
      },
      {
        path: 'database',
        component: ExecuteScriptComponent,
      },
      {
        path: 'bot',
        component: ChatBoxComponent,
      },
      {
        path: 'logs',
        component: LogComponent,
      },
      {
        path: 'app',
        component: AppListComponent,
      }
    ]),
  ],
  providers: [ManageApiService],
  declarations: [...MODULE_COMPONENTS]
})
export class ManageAuthModule { }
