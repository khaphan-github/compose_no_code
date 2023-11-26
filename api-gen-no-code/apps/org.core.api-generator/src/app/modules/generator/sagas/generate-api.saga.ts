import { Injectable, Logger } from "@nestjs/common";
import { ICommand, Saga, ofType } from "@nestjs/cqrs";
import { Observable, map } from "rxjs";
import { TaskGenerateAPIsCommand } from "../commands/create-apis-task.command";
import { ExecutedSQLScriptEvent } from "../events/execute-sql-create-db.event";
import { ExecutedSQLByUIEvent } from "../events/execute-sql-create-db-UI";

@Injectable()
export class GenerateAPISagas {
  private readonly logger!: Logger;

  constructor() {
    this.logger = new Logger(GenerateAPISagas.name);
  }

  @Saga()
  executeSQLSCriptCreateDB = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ExecutedSQLScriptEvent, ExecutedSQLByUIEvent),
      map((event) => {
        this.logger.log(`TaskGenerateAPIsCommand`);
        return new TaskGenerateAPIsCommand(
          event.workspaceConnections,
          event.ownerId,
          event.appId,
          event.tableInfo
        );
      }),
    );
  }
}