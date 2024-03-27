import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import { TaskGenerateAPIsCommand } from '../commands/create-apis-task.command';
import { ExecutedSQLScriptEvent } from '../events/execute-sql-create-db.event';
import { ExecutedSQLByUIEvent } from '../events/execute-sql-create-db-UI';
import { GeneratedApiEvent } from '../events/generated-api.event';
import { CreateDynamicMenuCommand } from '../commands/create-dynamic-menu-command';

@Injectable()
export class GenerateAPISagas {
  private readonly logger!: Logger;

  constructor() {
    this.logger = new Logger(GenerateAPISagas.name);
  }

  @Saga()
  executeSQLSCriptCreateDB = (
    events$: Observable<unknown>
  ): Observable<ICommand> => {
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
      })
    );
  };

  @Saga()
  executeSQLSCriptCreateDBThenCreateDymamicMenu = (
    events$: Observable<unknown>
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(GeneratedApiEvent),
      map((event) => {
        this.logger.log(`executeSQLSCriptCreateDBThenCreateDymamicMenu`);
        return new CreateDynamicMenuCommand(event.args, event.apis);
      })
    );
  };
}
