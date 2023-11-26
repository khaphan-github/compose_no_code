import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import NodeCache from 'node-cache';
import { FileReaderService } from '../../../shared/file-reader.service';
import { ErrorStatusCode } from '../../../../infrastructure/format/status-code';

// #region error
export class SQLScripFileNotFoundError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor() {
    super(`SQL script not found - you should create file 'database.sql' in assets folder`);
    this.name = SQLScripFileNotFoundError.name;
    this.statusCode = 604;
  }
}
// #endregion error

export class GetCreateAuthTableScriptQuery { }

@QueryHandler(GetCreateAuthTableScriptQuery)
export class GetCreateAuthTableScriptQueryHandler
  implements IQueryHandler<GetCreateAuthTableScriptQuery>
{
  constructor(
    private readonly fileReader: FileReaderService,
    private readonly nodeCache: NodeCache,
  ) {
  }

  execute(): Promise<string> {
    const fileName = `private/scripts/pg/create-auth-tables.sql`;
    const sqlScriptCache = this.nodeCache.get<string>(fileName);
    if (sqlScriptCache) {
      return Promise.resolve(sqlScriptCache);
    }

    let sqlScript = '';
    try {
      sqlScript =
        this.fileReader.readFileStringByFileName(fileName);
      this.nodeCache.set(fileName, sqlScript);
      return Promise.resolve(sqlScript);
    } catch (error) {
      return Promise.reject(new SQLScripFileNotFoundError());
    }
  }
}
