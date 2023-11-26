import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class NotFoundAppByIdError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(appId: string | number, schema: string) {
    super(`Application id ${appId} not found or schema ${schema} not found!`);
    this.name = NotFoundAppByIdError.name;
    this.statusCode = 618;
  }
}