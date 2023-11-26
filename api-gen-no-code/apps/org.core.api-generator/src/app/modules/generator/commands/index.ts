import { CreateWorkspaceCommandHandler } from "./create-workspace.command";
import { ExecuteScriptCommandHandler } from "./execute-script.command";
import { CreateApplicationCommandHandler } from "./create-app.command";
import { TaskGenerateAPIsCommandHandler } from "./create-apis-task.command";
import { RunScriptCommandHandler } from "./run-script-command";

export const CommandHandlers = [
  ExecuteScriptCommandHandler,
  CreateWorkspaceCommandHandler,
  CreateApplicationCommandHandler,
  TaskGenerateAPIsCommandHandler,
  RunScriptCommandHandler,
];
