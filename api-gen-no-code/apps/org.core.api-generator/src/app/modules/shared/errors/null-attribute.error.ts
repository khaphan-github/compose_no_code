import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class NullAttributeError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(attribute: string) {
    super(`${attribute} should not be empty`);
    this.name = NullAttributeError.name;
    this.statusCode = 620;
  }
}

