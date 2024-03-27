import { CreateWorkspaceCommandHandler } from './create-workspace.command';
import { ExecuteScriptCommandHandler } from './execute-script.command';
import { CreateApplicationCommandHandler } from './create-app.command';
import { TaskGenerateAPIsCommandHandler } from './create-apis-task.command';
import { RunScriptCommandHandler } from './run-script-command';
import { CreateDynamicMenuCommandHandler } from './create-dynamic-menu-command';

export const CommandHandlers = [
  ExecuteScriptCommandHandler,
  CreateWorkspaceCommandHandler,
  CreateApplicationCommandHandler,
  TaskGenerateAPIsCommandHandler,
  RunScriptCommandHandler,
  CreateDynamicMenuCommandHandler,
];
