import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { API_WHITE_LIST, TokenPayload } from './middlewares.variable';
import { ManageApiService } from 'apps/org.core.api-generator/src/app/modules/manage/services/manage-api.service';
import { AuthService } from 'apps/org.core.api-generator/src/app/modules/auth/auth.service';

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor(
    private readonly mangageApiService: ManageApiService,
    private readonly authService: AuthService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    if (_.includes(API_WHITE_LIST, req.baseUrl)) {
      req['is_white_list'] = true;
      return next();
    }

    // Case request with secret key.
    const secretKey = req.header('X-Secretkey');
    if (secretKey && secretKey?.length !== 0) {
      if (!this.mangageApiService.isValidSecetKey(secretKey)) {
        throw new HttpException({
          'message': 'Secretkey invalid, please auth to exec this api',
          'action': 'Auth with config mode'
        }, 401)
      }
      req['auth_with_config_mode'] = true;
      return next();
    }

    // Case exec api
    const authToken = req.header('Authenticate');
    try {
      const verify = this.authService.verifyToken(authToken) as TokenPayload;
      req['token_payload'] = verify;
      return next();
    } catch (error) {
      const protocol = req.secure ? 'https' : 'http';
      const domain = `${protocol}://${req.headers.host}/api/v1/login`;
      throw new HttpException({
        code: 401,
        message: 'Invalid access token,',
        auth_endpoint: domain
      }, 401)
    }
  }
}
