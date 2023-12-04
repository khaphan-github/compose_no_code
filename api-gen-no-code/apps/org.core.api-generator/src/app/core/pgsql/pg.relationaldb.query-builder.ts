import _ from "lodash";

export interface ConditionObject {
  and?: ConditionObject[];
  or?: ConditionObject[];
  [key: string]: string | ConditionObject[] | undefined;
}
export type SortType = 'ASC' | 'DESC';
export type SelectQueryType = {
  orderby?: string;
  page?: number;
  size?: number;
  sort?: SortType;
  conditions?: ConditionObject;
}

export class TableAttribute {
  name: string;
  dataTypeFormat: string;
}

export type QueryBuilderResult = {
  queryString: string;
  params: Array<unknown>;
}


// Relationship
export interface JoinTable {
  withTableName: string, // Table name
  mainColumnKey: string,
  childColumnKey: string,
  selectColumns: string[], // In this column ? with col need to select
}

export class RelationalDBQueryBuilder {
  constructor(
    private table?: string,
    public columns?: string[]
  ) {
    this.table = table ?? '';
    this.columns = columns ?? [];
  }

  setTableName = (tableName: string) => {
    this.table = tableName;
  }

  setColumns = (columns: string[]) => {
    this.columns = columns;
  }

  deleteBy = (columnName: string, value: unknown): QueryBuilderResult => {
    this.validateColumns([columnName]);

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

    this.validateColumns(columns);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

    let returningQuery = '*';
    if (returning && returning?.length > 0) {
      this.validateColumns(returning);
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
      this.validateColumns(columns);

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
      this.validateColumns(returning);
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
    this.validateColumns([idColumnName]);

    const columns = Object.keys(data);
    const values = Object.values(data);
    this.validateColumns(columns);

    const queryParams = columns.map((col, index) => `${col} = $${index + 1}`);
    const attributeUpdateQuery = queryParams.join(', ');

    values.push(idColumnValue);
    let returningQuery = '';
    if (returning && returning?.length > 0) {
      this.validateColumns(returning);
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

  // Need to check
  getByQuery = (
    types?: SelectQueryType,
    selected?: string[],
    joinTable?: JoinTable[],
    returning?: string[]
  ): QueryBuilderResult => {
    // Trường hợp không có join bảng mà vừa có selected và returing;
    // select ['id', 'name', 'password']
    // returning: ['id', 'name', 'description']
    /// result : ['id', 'name'];
    let selectedQuery =  '*';

    let columnsNeedToSelect: string[] = [];
    if (selected?.length !== 0 && returning?.length !== 0) {
      columnsNeedToSelect = selected?.filter(item => returning?.includes(item)) ?? [];
    }

    if(columnsNeedToSelect?.length !== 0) {
      selectedQuery = columnsNeedToSelect?.join(',');
    }
    console.log(selectedQuery);
    let joinTableQuery = '';

    if (joinTable && joinTable.length !== 0) {
      // TODO: Validate columns
      for (let index = 0; index < joinTable.length; index++) {
        const element = joinTable[index];
        joinTableQuery += `
          JOIN ${element.withTableName}
          ON ${this.table}.${element.mainColumnKey} = ${element.withTableName}.${element.childColumnKey}
        `
      }
    }

    // if (!_.isNil(selected)) {
    //   this.validateColumns(selected);

    //   const buildSelectValue: string[] = [];

    //   // Nếu có select luôn
    //   if (joinTable && joinTable.length != 0) {
    //     for (let index = 0; index < joinTable.length; index++) {
    //       const element = joinTable[index];
    //       if (joinTable && element?.selectColumns?.length !== 0) {

    //         for (let index = 0; index < element?.selectColumns?.length; index++) {
    //           buildSelectValue.push(`${element?.withTableName}.${element?.selectColumns[index]} AS ${element?.withTableName}_${element?.selectColumns[index]}`)
    //         }
    //       }
    //     }

    //     for (let index = 0; index < selected.length; index++) {
    //       const element = selected[index];
    //       buildSelectValue.push(`${this.table}.${element}`)
    //     }

    //     selectedQuery = buildSelectValue.join(', ');
    //   } else {
    //     selectedQuery = selected.join(', ');
    //   }
    // }

    const defaultQuery = `
      SELECT ${selectedQuery}
      FROM ${this.table}
    `;

    if (!_.isNil(types)) {
      const { orderby, page, size, sort, conditions } = types;
      if (orderby) {
        this.validateColumns([orderby]);
      }

      // Prepare where condition
      let whereQuery = '';
      const conditionParams: string[] = [];
      if (!_.isNil(conditions) && !_.isEmpty(conditions)) {
        const conditionQuery = this.generateConditionQuery(conditions, conditionParams);
        whereQuery = !_.isNil(conditions) ? ` WHERE ${conditionQuery} ` : '';
      }

      // Prepare orderby contidion;
      const sortQuery = sort ? 'ASC' : 'DESC';
      const orderByQuery = orderby ? ` ORDER BY ${orderby} ${sortQuery}` : '';

      // Prepare page and size contition;
      if (page && page < 0) {
        throw new Error(`Page should be greater than 0`);
      }
      if (size && size < 0) {
        throw new Error(`Size should be greater than 0`);
      }
      const sizeQuery = size ? ` LIMIT ${+size} ` : '';
      const pageQuery = page ? ` OFFSET ${+page} ` : '';

      const queryString = `
        ${defaultQuery}
        ${joinTableQuery}
        ${whereQuery}
        ${orderByQuery}
        ${sizeQuery}
        ${pageQuery}
        ;
      `;

      return {
        queryString: queryString,
        params: conditionParams
      }
    } else {
      return {
        queryString: defaultQuery,
        params: []
      }
    }
  }

  createTable = (attribute: Array<TableAttribute>): QueryBuilderResult => {
    const attributeQuery = attribute.map((attribute) =>
      ` ${attribute.name} ${attribute.dataTypeFormat} `).join(", ");

    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id SERIAL PRIMARY KEY,
        ${attributeQuery}
      );
    `;
    return {
      queryString: queryString,
      params: [],
    }
  }

  dropTable = (): QueryBuilderResult => {
    const queryString = `DROP TABLE ${this.table};`;
    return {
      queryString: queryString,
      params: [],
    }
  }

  // app_id_44%
  getSchemaInfo = (tableName: string): QueryBuilderResult => {
    const queryString = `
      SELECT *
      FROM information_schema.columns
      WHERE table_name LIKE $1
    `;
    return {
      queryString: queryString,
      params: [tableName],
    }
  }

  validateColumns = (columns: string[]) => {
    if (!columns || columns.length == 0) {
      throw new Error(`Can not validate columns because columns be empty`);
    }
    const invalidColumns = columns?.filter(col => !this.columns.includes(col));
    if (invalidColumns.length > 0) {
      throw new Error(`Invalid columns specified: ${invalidColumns.join(', ')}, columns shoud include: ${this.columns.join(', ')}`);
    };
  }

  generateConditionQuery = (conditionObject: ConditionObject, params: unknown[]): string => {
    if (_.isNil(conditionObject)) {
      throw new Error(`conditionObject should not be empty`);
    }
    if ('and' in conditionObject) {
      const andConditions = conditionObject.and?.map((condition) => this.generateConditionQuery(condition, params));
      return `(${andConditions.join(' AND ')})`;
    } else if ('or' in conditionObject) {
      const orConditions = conditionObject.or?.map((condition) => this.generateConditionQuery(condition, params));
      return `(${orConditions.join(' OR ')})`;
    } else {
      const key = Object.keys(conditionObject)[0];
      this.validateColumns([key]);
      const value = conditionObject[key];
      if (value !== undefined) {
        params.push(value);
      }
      return `${key} = $${params.length}`;
    }
  }
}
