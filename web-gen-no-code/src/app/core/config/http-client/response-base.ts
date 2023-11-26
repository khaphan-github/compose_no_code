export interface SResponse<T> {
  id: string
  timestamp: string
  apiVersion: string
  status: number
  message: string
  data: T;
}
