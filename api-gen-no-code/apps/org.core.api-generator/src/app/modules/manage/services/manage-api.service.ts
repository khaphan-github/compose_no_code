/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException, Injectable } from '@nestjs/common';
import { ConnectToServerDTO } from '../dto/connect-to-server.dto';
import { ConfigService } from '@nestjs/config';
import { CrudService } from '../../crud-pg/services/crud-pg.service';

@Injectable()
export class ManageApiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly crudService: CrudService,
  ) { }

  // Connect:
  getServerInfo(body: ConnectToServerDTO) {
    if (this.isValidSecetKey(body.secretKey)) {
      return true;
    }
    throw new HttpException({
      'message': 'Secretkey invalid, please auth to exec this api',
      'action': 'Auth with config mode'
    }, 401)
  }


  isValidSecetKey(key: string) {
    const serverSecretKey = this.configService.get('app.secretKey');
    return key === serverSecretKey;
  }
}
