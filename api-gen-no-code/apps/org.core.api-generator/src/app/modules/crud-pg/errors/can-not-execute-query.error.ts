import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class CanNotExecuteQueryError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(appId: string | number, schema: string, message: string) {
    super(`Can not select data from ${schema} in ${appId} because ${message}`);
    this.name = CanNotExecuteQueryError.name;
    this.statusCode = 611;
  }
}
