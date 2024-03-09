import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly Logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => this.Logger.verbose(`$ Found trafic to server - Execute time: ${Date.now() - now}ms`)),
      );
  }
}
