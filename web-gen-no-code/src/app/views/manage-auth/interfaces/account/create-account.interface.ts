import { IAccountMetadata } from "./account.interface"

export interface ICreateAccount {
  username: string
  password: string
  metadata: IAccountMetadata
  enable: boolean
}

export interface ICreateAccountResponse {
  id: number
  metadata: Metadata
  created_at: string
  username: string
  enable: boolean
}

export interface Metadata {
  info: object,
  roleIds: number[]
}
