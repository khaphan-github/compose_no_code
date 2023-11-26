import { HttpException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { AuthService } from 'apps/org.core.api-generator/src/app/modules/auth/auth.service';
import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from './middlewares.variable';
@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
  ) { }

  private readonly logger = new Logger(AuthorizationMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    if (req['is_white_list'] || req['auth_with_config_mode']) {
      this.logger.log(`\nPass authorize because white list or config mode\n API: ${req.baseUrl}`)
      return next();
    }

    const tokenPayload = req['token_payload'] as TokenPayload;
    if (! await this.authService.canExecThisAPI(tokenPayload, req)) {
      throw new HttpException({
        'message': 'User can not exec this api',
      }, 403)
    }
    return next();
  }
}
