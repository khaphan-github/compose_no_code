import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class DefaultResponseError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(message: string) {
    super(`${message}`);
    this.name = DefaultResponseError.name;
    this.statusCode = 600;
  }
}