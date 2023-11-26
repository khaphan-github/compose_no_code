export interface GeneratedAPI {
  id: number
  app_id: number
  table_name: string
  action: string
  api_path: string
  http_method: string
  authentication: string
  api_authorized: any
  headers: Headers
  request_params: RequestParams
  request_body_type: any
  request_body: RequestBody
  response_attributes: ResponseAttributes
  enable: boolean
  created_at: string
  updated_at: string
}

export interface Headers {
  AppClientSecretKey: string
}

export interface RequestParams {
  page: number
  size: number
  sort: string
  orderby: string
  selectes: string
}

export interface RequestBody {}

export interface ResponseAttributes {}
