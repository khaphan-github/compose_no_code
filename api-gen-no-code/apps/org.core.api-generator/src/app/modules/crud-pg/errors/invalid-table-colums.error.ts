import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class InvalidColumnOfTableError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(appId: string | number, schema: string, err: string) {
    super(`Table ${schema} of app ${appId} ${err}`);
    this.name = InvalidColumnOfTableError.name;
    this.statusCode = 617;
  }
}