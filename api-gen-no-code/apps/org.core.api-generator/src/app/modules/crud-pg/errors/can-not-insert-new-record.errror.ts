import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class CanNotInsertNewRecordError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(appId: string | number, schema: string, message: string) {
    super(`Can not insert new record into ${schema} in ${appId} because ${message}`);
    this.name = CanNotInsertNewRecordError.name;
    this.statusCode = 613;
  }
}