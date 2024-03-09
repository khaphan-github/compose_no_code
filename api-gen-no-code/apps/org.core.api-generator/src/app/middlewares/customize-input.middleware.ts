import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from 'apps/org.core.api-generator/src/app/modules/auth/auth.service';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class CustomizeInputMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
  ) { }

  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Logger Middleware: CustomizeInputMiddleware...`);
    return next();
  }
}
