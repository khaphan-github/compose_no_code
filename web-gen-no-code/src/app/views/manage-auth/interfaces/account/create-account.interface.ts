import { IAccountMetadata } from "./account.interface"

export interface ICreateAccount {
  username: string
  password: string
  metadata: IAccountMetadata
  enable: boolean
}

