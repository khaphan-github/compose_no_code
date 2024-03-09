import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class DataToInsertNotHaveSameKeyError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(appId: string | number, schema: string) {
    super(`Can not insert new record into ${schema} in ${appId} because data insert not have same key each object`);
    this.name = DataToInsertNotHaveSameKeyError.name;
    this.statusCode = 615;
  }
}
