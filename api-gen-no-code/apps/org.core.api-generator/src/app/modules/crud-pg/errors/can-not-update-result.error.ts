import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class CanNotUpdateResultError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(appId: string | number, schema: string, recordId: string | number, err: string) {
    super(`Can not update record ${recordId} from ${schema} in ${appId} because ${err}`);
    this.name = CanNotUpdateResultError.name;
    this.statusCode = 614;
  }
}
