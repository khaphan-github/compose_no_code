import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Ip } from "@nestjs/common";
import { ResponseBase } from "apps/org.core.api-generator/src/app/infrastructure/format/response.base";
import { KafkaProducerService } from "apps/org.core.api-generator/src/app/infrastructure/proxy/kaffka-producer.service";
import { Request, Response } from 'express';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly kafka: KafkaProducerService) { }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errorData = new ResponseBase(500, 'Found server error', {
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
      .status(500)
      .json(errorData);
  }
}
