import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => Logger.verbose(`$ Found trafic to server - Execute time: ${Date.now() - now}ms`)),
      );
  }
}
