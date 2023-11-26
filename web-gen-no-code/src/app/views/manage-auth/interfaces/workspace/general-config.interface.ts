export interface Workspace {
  id: number
  owner_id: string
  database_config: any;
  plugin_config: any
  genneral_config: any
  created_at: string
  updated_at: string
}


export interface GenneralConfig {
  defaultRoleIdsWhenRegister: Array<number>;
}
