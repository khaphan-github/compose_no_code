export interface ICreateAPI{
  httpMethod: string;
  domain: string;
  isActive: boolean;
  desc: any,
  accessScope: string;
  query: string;
  availableField: string[];
}

export interface IUpdateCustomAPI extends ICreateAPI {
  id: string;
}
