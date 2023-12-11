import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { tap } from 'rxjs/operators';
import { ExtractDataFromRequestUtils } from '../utils/extract-data-from-req.util';
import { TablePermissionService } from '../services/table-permission.service';

@Injectable()
export class TablePermissionInterceptor implements NestInterceptor {
  private readonly Logger = new Logger(TablePermissionInterceptor.name);
  constructor(private readonly tableService: TablePermissionService) { }
  async intercept(context: ExecutionContext, next: CallHandler) {
    const incomingMessage = context.getArgs().at(0) as IncomingMessage;
    this.Logger.verbose(ExtractDataFromRequestUtils.extractTableName(incomingMessage));
    this.Logger.log(await this.tableService.getTableInfo(ExtractDataFromRequestUtils.extractTableName(incomingMessage)))
    return next
      .handle()
      .pipe(
        tap(() => this.Logger.verbose(`Check table permission success`)),
      );
  }
}
