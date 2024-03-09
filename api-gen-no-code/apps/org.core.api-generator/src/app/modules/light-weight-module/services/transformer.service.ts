import { Injectable } from '@nestjs/common';
import { LightWeightRepository } from '../repository/light-weight.repository';
import { SQLTransformerProxy } from '../proxy/sql.transformer.proxy';

@Injectable()
export class TransformerSerivce {
  constructor(
    private readonly repository: LightWeightRepository,
    private readonly proxy: SQLTransformerProxy,
  ) { }

  async transform(question: string) {
    const script = await this.repository.getSqlScript();
    const queryString = await this.proxy.transform(script, question);
    return {
      result: await this.repository.executeQuery(queryString.data),
      queryString: queryString.data
    }
  }

  getAllTableName() {
    return this.repository.getAllTableName()
  }
}
