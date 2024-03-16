import { DataSourceOptions } from 'typeorm';

export enum EWorkspaceColumns {
  ID = 'id',
  OWNER_ID = 'owner_id',
  DATABASE_CONFIG = 'database_config',
  PLUGIN_CONFIG = 'plugin_config',
  GENERAL_CONFIG = 'genneral_config',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export class WorkspaceModel {
  id: number;
  owner_id: string;
  database_config: DataSourceOptions;
  plugin_config: object[];
  general_config: object[];
  created_at: Date;
  updated_at: Date;
}
