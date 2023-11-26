import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class InvalidFormatError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = InvalidFormatError.name;
    this.statusCode = 619;
  }
}