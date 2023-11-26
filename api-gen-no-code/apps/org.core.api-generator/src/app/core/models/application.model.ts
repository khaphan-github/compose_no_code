import { DataSourceOptions } from "typeorm";

export enum EAppTableColumns {
  ID = 'id',
  OWNER_ID = 'owner_id',
  WORKSPACE_ID = 'workspace_id',
  APP_NAME = 'app_name',
  TABLES_INFO = 'tables_info',
  DATABASE_CONFIG = 'database_config',
  USE_DEFAULT_DB = 'use_default_db',
  CREATE_DB_UI = 'create_db_ui',
  CREATE_DB_SCRIPT = 'create_db_script',
  ENABLE = 'enable',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export class ApplicationModel {
  id: number;
  owner_id: number;
  workspace_id: number;
  app_name: string;
  tables_info: object[];
  database_config: DataSourceOptions;
  use_default_db: boolean;
  create_db_ui: boolean;
  create_db_script: boolean;
  enable: boolean;
  created_at: string;
  updated_at: string;
}
