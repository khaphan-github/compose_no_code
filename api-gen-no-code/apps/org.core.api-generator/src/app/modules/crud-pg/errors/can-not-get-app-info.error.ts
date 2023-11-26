import { ErrorStatusCode } from "../../../infrastructure/format/status-code";

export class CanNotGetAppInforError extends Error implements ErrorStatusCode {
  statusCode: number;
  constructor(appId: string | number, errorMessage: string) {
    super(`Can not get informatiion of app id ${appId} because ${errorMessage}`);
    this.name = CanNotGetAppInforError.name;
    this.statusCode = 612;
  }
}
