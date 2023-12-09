/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class LightWeightRepository {
  constructor(private readonly dataSource: DataSource) { }

  executeQuery(queryString: string, params?: any[]) {
    return this.dataSource.query(queryString, params);
  }

  getColumnInfoByTableName(tableName: string) {
    const queryString = `
      SELECT *
      FROM information_schema.columns
      WHERE table_name = '$1'
    `
    return this.dataSource.query(queryString, [tableName]);
  }
}
