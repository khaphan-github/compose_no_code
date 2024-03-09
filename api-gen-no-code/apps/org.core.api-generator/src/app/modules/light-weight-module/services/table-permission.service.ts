import { Injectable } from '@nestjs/common';
import { LightWeightRepository } from '../repository/light-weight.repository';
import NodeCache from 'node-cache';

@Injectable()
export class TablePermissionService {
  constructor(
    private readonly repository: LightWeightRepository,
    private readonly nodeCache: NodeCache,
  ) { }

  getTableInfo(name: string) {
    return this.repository.getColumnInfoByTableName(name);
  }


}
