import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class EmptyRecordWhenInsertError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(appId: string | number, schema: string) {
    super(`Can not insert new record into ${schema} in ${appId} because data to insert empty`);
    this.name = EmptyRecordWhenInsertError.name;
    this.statusCode = 616;
  }
}