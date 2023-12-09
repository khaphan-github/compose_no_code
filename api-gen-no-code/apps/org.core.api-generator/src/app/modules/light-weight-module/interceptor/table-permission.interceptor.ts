import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { tap } from 'rxjs/operators';
import { ExtractDataFromRequestUtils } from '../utils/extract-data-from-req.util';

@Injectable()
export class TablePermissionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const incomingMessage = context.getArgs().at(0) as IncomingMessage;
    Logger.verbose(ExtractDataFromRequestUtils.extractTableName(incomingMessage));

    return next
      .handle()
      .pipe(
        tap(() => Logger.verbose(`Check table permission success`)),
      );
  }
}
