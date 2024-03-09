import _ from "lodash";
import { IGeneratedApi } from "../../../core/models/generated-api.model";

export interface IGeneratedApiViewModel {
  id: number;
  app_id: number;
  table_name: string;
  action: string;
  api_path: string;
  http_method: string;
  authentication: string;
  api_authorized: object;
  headers: object;
  request_params: string;
  request_body_type: string;
  request_body: string;
  response_attributes: object;
  enable: boolean;
  created_at: Date;
  updated_at: Date;
}


export class ApiGeneratedViewModel {
  getApiDocsDisplay(apis: Array<IGeneratedApi>): Array<IGeneratedApiViewModel> {
    return _.map(apis, (args) => {
      const viewModel: IGeneratedApiViewModel = {
        id: args.id,
        app_id: args.app_id,
        table_name: args.table_name,
        action: args.action,
        api_path: args.api_path,
        http_method: args.http_method,
        authentication: args.authentication,
        api_authorized: args.api_authorized,
        headers: args.headers,
        request_params: JSON.stringify(args.request_params, null, 1),
        request_body_type: args.request_body_type,
        request_body: JSON.stringify(args.request_body, null, 1),
        response_attributes: args.response_attributes,
        enable: args.enable,
        created_at: args.created_at,
        updated_at: args.updated_at
      };
      return viewModel;
    });
  }
}