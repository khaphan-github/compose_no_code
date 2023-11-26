import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class WorkspaceConnectionShouldNotBeEmpty extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor() {
    super(`Workspace connection should not be empty`);
    this.name = WorkspaceConnectionShouldNotBeEmpty.name;
    this.statusCode = 601
  }
}