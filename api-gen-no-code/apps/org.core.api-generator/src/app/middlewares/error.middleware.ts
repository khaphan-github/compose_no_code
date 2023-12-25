import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Ip } from "@nestjs/common";
import { Request, Response } from 'express';
import { KafkaProducerService } from "../infrastructure/proxy/kaffka-producer.service";
import { ResponseBase } from "../infrastructure/format/response.base";

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly kafka: KafkaProducerService) { }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errorData = new ResponseBase((exception as any).response.status, 'Found server error', {
      timestamp: new Date().toISOString(),
      path: request.baseUrl,
      header: request.headers,
      body: request.body,
      metadata: {
        ips: request.ip,
      },
      exception: exception,
    });
    this.kafka.produceMessage('server.error', JSON.stringify(errorData));

    response
      .status(errorData.status)
      .json(errorData);
  }
}
