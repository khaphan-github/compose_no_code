import { IAccountMetadata } from "./account.interface"

export interface IUpdateAccount {
  id: number
  metadata: IAccountMetadata
  enable: boolean
}
