import { IncomingMessage } from "http";

export class ExtractDataFromRequestUtils {
  public static extractTableName(incomingMessage: IncomingMessage) {
    const { url } = incomingMessage;
    const match = url.replace(`/api/v1/schema/`, '');
    return match.split('/')[0];
  }

  public static extractMethod(incomingMessage: IncomingMessage) {
    return incomingMessage.method;
  }
}
