import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class CanNotDeleteResultError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(appId: string | number, schema: string, recordId: string | number, err: string) {
    super(`Can not delete record ${recordId} from ${schema} in ${appId} because ${err}`);
    this.name = CanNotDeleteResultError.name;
    this.statusCode = 610;
  }
}