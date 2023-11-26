export interface Account {
  id: number
  username: string
  // password: string
  metadata: IAccountMetadata
  enable: boolean
  created_at: string
  updated_at: string
}

export interface IAccountMetadata {
  roleIds: Array<number>;
}
