export interface ICustomQuery {
  fields: string[]
  from: string
  aggregation?: Aggregation[]
  where?: Where[]
  groupBy?: string[]
  orderBy?: string[]
  misc?: string[],
  limit?: number,
  offset?: number,
}

export interface Aggregation {
  fn: string
  args: string
  alias: string
}

export interface Where {
  operator: string
  field?: string
  value: any
  conditions?: Condition[]
}

export interface Condition {
  operator: string
  field: string
  value: number
}

export type QueryBuilderResult = {
  queryString: string;
  params: Array<unknown>;
}
