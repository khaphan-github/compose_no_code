import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSourceOptions } from 'typeorm';
import _ from 'lodash';
import NodeCache from 'node-cache';
import { JsonIoService } from '../../../shared/json.io.service';
import { ErrorStatusCode } from '../../../../infrastructure/format/status-code';

// #region error
export class SQLConnectionNotFoundError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor() {
    super(`SQL connection not found - you should create file 'connection.json' in assets folder`);
    this.name = SQLConnectionNotFoundError.name;
    this.statusCode = 604;
  }
}
// #endregion error

export class GetSQLConnectionQuery {
}

@QueryHandler(GetSQLConnectionQuery)
export class GetSQLConnectionQueryHandler
  implements IQueryHandler<GetSQLConnectionQuery, DataSourceOptions>
{
  constructor(
    private readonly jsonIO: JsonIoService,
    private readonly nodeCache: NodeCache,
  ) {
  }

  execute(): Promise<DataSourceOptions> {
    const fileName = `connection.json`;

    const sqlConnectionFromCache = this.nodeCache.get<DataSourceOptions>(fileName);

    if (sqlConnectionFromCache) {
      return Promise.resolve(sqlConnectionFromCache);
    }

    let sqlConnectionConfig: DataSourceOptions;

    try {
      sqlConnectionConfig =
        this.jsonIO.readJsonFile<DataSourceOptions>(fileName);

      this.nodeCache.set(fileName, sqlConnectionConfig);
    } catch (error) {
      return Promise.reject(new Error(error.message));
    }

    if (_.isNil(sqlConnectionConfig)) {
      return Promise.reject(new SQLConnectionNotFoundError());
    }

    return Promise.resolve(sqlConnectionConfig);
  }
}
