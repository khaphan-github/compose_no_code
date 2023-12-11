
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IColumnInfo } from '../interfaces/table-info.interface';

@Injectable()
export class LightWeightRepository {
  constructor(private readonly dataSource: DataSource) { }

  executeQuery(queryString: string, params?: any[]) {
    Logger.debug(queryString, params)
    return this.dataSource.query(queryString, params);
  }

  getColumnInfoByTableName(tableName: string): Promise<Array<IColumnInfo>> {
    const queryString = `
      SELECT *
      FROM information_schema.columns
      WHERE table_name = $1
    `
    return this.dataSource.query(queryString, [tableName]);
  }


  getQueryByPath(path: string) {
    const queryString = `
      SELECT * FROM _core_custom_api
      WHERE api_path = $1 AND enable = true;
    `
    return this.dataSource.query(queryString, [path]);
  }

  getPublicCustomApi() {
    const queryString = `
    SELECT * FROM _core_custom_api
    WHERE authentication = $1 AND enable = $2;
  `
    return this.dataSource.query(queryString, ['NO_AUTH', true]);
  }

  getAllCustomApi() {
    const queryString = `
    SELECT * FROM _core_custom_api
    WHERE enable = $1;
    `
    return this.dataSource.query(queryString, [true]);
  }
}
