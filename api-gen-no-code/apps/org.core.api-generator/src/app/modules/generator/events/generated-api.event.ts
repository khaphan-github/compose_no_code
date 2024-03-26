import { AST } from 'node-sql-parser';
import { DataSourceOptions } from 'typeorm';

export class GeneratedApiEvent {
  constructor(
    public readonly args: {
      workspaceConnections: DataSourceOptions;
      ownerId: string;
      appId: number;
      tableInfo: AST | AST[];
    },
    public readonly apis: Array<any>
  ) {}
}
