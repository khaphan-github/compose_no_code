import { Injectable } from '@nestjs/common';
import { CustomQueryBuilder } from '../models/light-weight.model';
import { LightWeightRepository } from '../light-weight.repository';
import { ICustomQuery } from '../interfaces/query-builder.interface';

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

  findById(tableName: string, fields: string[], idColumnsName: string, idValue: string) {
    const queryBuilder = new CustomQueryBuilder();
    const query = queryBuilder.query({
      fields: fields,
      from: tableName,
      where: [
        { field: idColumnsName, operator: '=', value: idValue, }
      ],
      limit: 1,
    });
    return this.repository.executeQuery(query)[0];
  }
}
