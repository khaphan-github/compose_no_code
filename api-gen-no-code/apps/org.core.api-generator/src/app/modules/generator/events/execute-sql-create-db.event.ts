import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AST } from 'node-sql-parser';
import { DataSourceOptions } from 'typeorm';

export class ExecutedSQLScriptEvent {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly ownerId: string,
    public readonly appId: number,
    public readonly tableInfo: AST | AST[]
  ) {}
}

@EventsHandler(ExecutedSQLScriptEvent)
export class ExecutedSQLScriptEventHandler
  implements IEventHandler<ExecutedSQLScriptEvent>
{
  private readonly logger = new Logger(ExecutedSQLScriptEventHandler.name);

  async handle() {
    this.logger.log(ExecutedSQLScriptEventHandler.name);
  }
}
