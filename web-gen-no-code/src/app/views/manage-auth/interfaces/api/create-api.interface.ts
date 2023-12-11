export interface ICreateAPI{
  httpMethod: string;
  domain: string;
  isActive: boolean;
  accessScope: string;
  query: string;
  availableField: string[];
}

export interface IUpdateCustomAPI extends ICreateAPI {
  id: string;
}
