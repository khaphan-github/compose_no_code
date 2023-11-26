import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AST } from "node-sql-parser";
import { DataSourceOptions } from "typeorm";

export class ExecutedSQLByUIEvent {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly ownerId: string,
    public readonly appId: number,
    public readonly tableInfo: AST | AST[],
  ) { }
}

@EventsHandler(ExecutedSQLByUIEvent)
export class ExecutedSQLByUIEventHandler implements IEventHandler<ExecutedSQLByUIEvent> {
  private readonly logger = new Logger(ExecutedSQLByUIEventHandler.name);

  async handle() {
    this.logger.log(ExecutedSQLByUIEventHandler.name);
  }
}
