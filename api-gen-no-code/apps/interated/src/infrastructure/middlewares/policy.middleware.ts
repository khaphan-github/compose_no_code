import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from 'apps/org.core.api-generator/src/app/modules/auth/auth.service';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class PolicyMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
  ) { }

  use(req: Request, res: Response, next: NextFunction) {
    this.authService.executeTaskFollowPrivatePolicy(req);
    console.log(`Logger Middleware: PolicyMiddleware...`);
    return next();
  }
}
