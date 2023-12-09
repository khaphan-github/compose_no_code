import { select } from "json-sql-utility"

import _ from "lodash";
import { ICustomQuery, QueryBuilderResult } from "../interfaces/query-builder.interface";

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
    return select(object);
  }
}
