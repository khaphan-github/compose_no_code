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

export interface IJoinQuery {
  fields: Array<{ table: string, fields: Array<string> }>;
  from: string;
  joins: Array<IJoinOperator>;
  aggregation?: Aggregation[];
  where?: Where[];
  groupBy?: string[];
  orderBy?: string[];
  limit?: number;
  offset?: number;
}

// Join
export interface IJoinOperator {
  operator: 'left' | 'right' | 'inner' | string,
  from: string
  to: string
  condition: {
    fromField: string,
    toField: string,
    operator: '=' | string
  }
}

