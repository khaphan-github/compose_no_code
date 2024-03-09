import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import { TaskGenerateAPIsCommand } from '../commands/create-apis-task.command';
import { ExecutedSQLScriptEvent } from '../events/execute-sql-create-db.event';
import { ExecutedSQLByUIEvent } from '../events/execute-sql-create-db-UI';
import { CreateDynamicMenuCommand } from '../commands/create-dynamic-menu-command';
import { GeneratedApiEvent } from '../events/generated-api.event';
import { CreateDynamicFormCommand } from '../commands/create-dyamic-form.comand';

@Injectable()
export class GenerateAPISagas {
  private readonly logger!: Logger;

  constructor() {
    this.logger = new Logger(GenerateAPISagas.name);
  }

  @Saga()
  executeSQLSCriptCreateDBThenGenerateAPI = (
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
  executeSQLSCriptCreateDBThenCreateDynamicForm = (
    events$: Observable<unknown>
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(GeneratedApiEvent),
      map((event) => {
        this.logger.log(`executeSQLSCriptCreateDBThenCreateDynamicTable`);
        return new CreateDynamicFormCommand(event.args, event.apis);
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
