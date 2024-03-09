import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class CanNotInitDataSourceConnectionError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(err: string) {
    super(`Can not init data source with connection: ${err}`);
    this.name = CanNotInitDataSourceConnectionError.name;
    this.statusCode = 619;
  }
}