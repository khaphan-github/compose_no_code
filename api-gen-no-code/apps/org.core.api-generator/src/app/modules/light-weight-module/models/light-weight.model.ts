// https://github.com/ppiyush13/json-sql-utility
import { select } from "json-sql-utility";

import _ from "lodash";
import { ICustomQuery, IJoinQuery, QueryBuilderResult, Where } from "../interfaces/query-builder.interface";

export class CustomQueryBuilder {
  constructor(private table?: string,) {
    this.table = table ?? '';
  }

  setTableName = (tableName: string) => {
    this.table = tableName;
  }

  deleteBy = (columnName: string, value: unknown): QueryBuilderResult => {
    const queryString = `
      DELETE FROM ${this.table}
      WHERE ${columnName} = $1;
    `;
    return {
      queryString: queryString,
      params: [value]
    };
  }

  // @param data: key is table columns name and value is table value.
  // @param returning: attribute want to turn after insert;
  insert = (data: object, returning?: string[]): QueryBuilderResult => {
    const columns = Object.keys(data);

    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

    let returningQuery = '*';
    if (returning && returning?.length > 0) {
      returningQuery = returning.join(', ');
    }

    const queryString = `
     INSERT INTO ${this.table} (${columns.join(', ')})
     VALUES (${placeholders})
     RETURNING ${returningQuery};
    `;

    const values = Object.values(data);

    return {
      queryString: queryString,
      params: values
    };
  }

  insertMany = (data: object[], returning?: string[]): QueryBuilderResult => {
    let valueArray: unknown[] = [];
    const placeholdersValue: string[] = [];

    const availableColums = Object.keys(data[0]);
    let paramIndex = 0;
    data?.forEach((obj) => {
      const columns = Object.keys(obj);

      const placeholders = columns?.map(() => {
        paramIndex += 1;
        return `$${paramIndex}`;
      });
      placeholdersValue.push(`(${placeholders.join(', ')})`);

      const values = Object.values(obj);
      valueArray = valueArray.concat(values);
    })

    let returningQuery = 'RETURNING true AS success';
    if (returning && returning?.length > 0) {
      returningQuery = `RETURNING ${returning.join(', ')}`;
    }

    const queryString = `
    INSERT INTO ${this.table} (${availableColums.join(', ')})
    VALUES ${placeholdersValue.join(`,`)}
    ${returningQuery};
   `;

    const result: QueryBuilderResult = {
      queryString: queryString,
      params: valueArray
    };
    return result
  }

  // should update by id
  update = (idColumnName: string, idColumnValue: unknown, data: object, returning?: string[]): QueryBuilderResult => {
    if (_.isEmpty(data)) {
      throw new Error(`Error when update data id: ${idColumnValue}, data shoud not be empty!`);
    }

    const columns = Object.keys(data);
    const values = Object.values(data);

    const queryParams = columns.map((col, index) => `${col} = $${index + 1}`);
    const attributeUpdateQuery = queryParams.join(', ');

    values.push(idColumnValue);
    let returningQuery = '';
    if (returning && returning?.length > 0) {
      returningQuery = `RETURNING ${returning.join(', ')}`;
    }

    const queryString = `
      UPDATE ${this.table}
      SET ${attributeUpdateQuery}
      WHERE ${idColumnName} = $${values.length}
      ${returningQuery};
    `;

    const result: QueryBuilderResult = {
      queryString: queryString,
      params: values
    };
    return result
  }

  query(object: ICustomQuery) {
    return select({
      ...object
    });
  }

  joinQuery(query: IJoinQuery): { sql: string, params: any[] } {
    const selectFields = query.fields.map((table) => table.fields.map((field) => `${table.table}.${field} AS ${table.table}_${field}`)).flat().join(', ');
    const fromClause = `FROM ${query.from}`;

    const joinClauses = query.joins.map((join) => {
      const joinType = join.operator.toUpperCase();
      const onClause = `${join.from}.${join.condition.fromField} ${join.condition.operator} ${join.to}.${join.condition.toField}`;
      return `${joinType} JOIN ${join.to} ON ${onClause}`;
    }).join(' ');

    const aggregationClause = query.aggregation ? query.aggregation.map(agg => `${agg.fn}(${agg.args}) AS ${agg.alias}`).join(', ') : '';

    const { whereClause, queryParams } = this.buildWhereClause(query.where);

    const groupByClause = query.groupBy ? `GROUP BY ${query.groupBy.join(', ')}` : '';

    const orderByClause = query.orderBy ? `ORDER BY ${query.orderBy.join(', ')}` : '';

    const limitClause = +query.limit >= 0 ? `LIMIT $${queryParams.length + 1}` : '';
    queryParams.push(query.limit);
    const offsetClause = +query.offset >= 0 ? `OFFSET $${queryParams.length + 1}` : '';
    queryParams.push(query.offset);

    const sqlQuery = `
    SELECT
      ${aggregationClause ? aggregationClause + ',' : ''}
      ${selectFields}
      ${fromClause}
      ${joinClauses}
      ${whereClause ? `WHERE ${whereClause}` : ''}
      ${groupByClause}
      ${orderByClause}
      ${limitClause}
      ${offsetClause};`;

    return { sql: sqlQuery, params: queryParams };
  }

  private buildWhereClause(conditions: Where[]): { whereClause: string, queryParams: any[] } {
    const queryParams: any[] = [];
    const whereClause = conditions.map(condition => {
      if (condition.conditions) {
        const { whereClause, queryParams: innerParams } = this.buildWhereClause(condition.conditions);
        queryParams.push(...innerParams);
        return `${whereClause}`;
      } else {
        queryParams.push(condition.value);
        return `${condition.field} ${condition.operator} $${queryParams.length}`;
      }
    }).join(` ${conditions[0].operator.toUpperCase()} `);

    return { whereClause, queryParams };
  }
}
