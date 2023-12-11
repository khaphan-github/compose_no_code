import { Injectable } from '@nestjs/common';
import { CustomQueryBuilder } from '../models/light-weight.model';
import { LightWeightRepository } from '../repository/light-weight.repository';
import { ICustomQuery, IJoinQuery } from '../interfaces/query-builder.interface';
import _ from 'lodash';

@Injectable()
export class LightWeightService {
  constructor(private readonly repository: LightWeightRepository) { }

  delete(tableName: string, idValue: string, idColumnsName: string) {
    const queryBuilder = new CustomQueryBuilder(tableName);
    const query = queryBuilder.deleteBy(idColumnsName, idValue);
    return this.repository.executeQuery(query.queryString, query.params);;
  }

  insert(tableName: string, data: Array<object>) {
    const queryBuilder = new CustomQueryBuilder(tableName);
    const query = queryBuilder.insertMany(data);
    return this.repository.executeQuery(query.queryString, query.params);
  }

  update(tableName: string, idColumnsName: string, data: object) {
    const queryBuilder = new CustomQueryBuilder(tableName);
    const query = queryBuilder.update(idColumnsName, data[idColumnsName], data);
    return this.repository.executeQuery(query.queryString, query.params);
  }

  query(q: ICustomQuery) {
    const queryBuilder = new CustomQueryBuilder();
    const query = queryBuilder.query(q);
    return this.repository.executeQuery(query);
  }

  join(j: IJoinQuery) {
    const queryBuilder = new CustomQueryBuilder();
    const query = queryBuilder.joinQuery(j);
    return this.repository.executeQuery(query.sql, query.params);
  }

  // SQL injection err
  findById(tableName: string, fields: string[], idColumnsName: string, idValue: string) {
    const queryBuilder = new CustomQueryBuilder();
    const query = queryBuilder.query({
      fields: fields,
      from: tableName,
      where: [
        { field: idColumnsName, operator: '=', value: idValue, }
      ]
    });
    return this.repository.executeQuery(query);
  }

  // Featurre
  async executeCustomApi(path: string, data: object) {
    const customApiInfo = await this.repository.getQueryByPath(path);
    if(!customApiInfo[0]) {
      throw new Error(`Api not found or disabled`);
    }
    const script = customApiInfo[0]?.querystring;
    const param = _.sortBy(customApiInfo[0]?.availablecolumns, ['index']);
    if (!_.isEmpty(data) && data != null) {
      const params = param.map((param) => data[param.columnName]);
      return this.repository.executeQuery(script, params);
    }
    return this.repository.executeQuery(script);

  }
}
