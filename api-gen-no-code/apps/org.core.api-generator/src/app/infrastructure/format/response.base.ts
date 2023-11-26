import { v4 as uuidv4 } from 'uuid';
export class ResponseBase {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly apiVersion: string;
  public readonly status: number;
  public readonly message: string;
  public readonly data: object;

  constructor(status: number, message: string, data?: object) {
    this.id = uuidv4();
    this.timestamp = new Date();
    this.apiVersion = '2.0';
    this.status = status;
    this.message = message;
    this.data = data;
  }

  protected toJSON(): object {
    return {
      id: this.id,
      timestamp: this.timestamp.toISOString(),
      apiVersion: this.apiVersion,
      status: this.status,
      message: this.message,
      data: this.data,
    };
  }
}

export class ErrorBase extends ResponseBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(err: any) {
    super(err?.statusCode ?? 0, err?.message);
  }
}


