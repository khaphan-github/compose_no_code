import { IAccountMetadata } from "./account.interface"

export interface ICreateAccount {
  id: number
  username: string
  password: string
  metadata: IAccountMetadata
  enable: boolean
}

