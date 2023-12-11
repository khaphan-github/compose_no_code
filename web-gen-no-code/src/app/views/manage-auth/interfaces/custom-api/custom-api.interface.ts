export interface ICustomAPI {
  id: number
  action: string
  api_path: string
  http_method: string
  authentication: string
  availablecolumns: Availablecolumn[]
  metadata: any
  querystring: string
  enable: boolean
  created_at: string
  updated_at: string
}

export interface Availablecolumn {
  index: number
  columnName: string
}
