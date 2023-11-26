/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { ConnectToServerDTO } from '../dto/connect-to-server.dto';
import { ManageApiService } from '../services/manage-api.service';
import { ResponseBase } from '../../../infrastructure/format/response.base';

@Controller()
export class ManageApiController {
  constructor(private readonly service: ManageApiService) {

  }
  @Post('connect')
  async connectToServer(@Body() body: ConnectToServerDTO) {
    try {
      const info = this.service.getServerInfo(body);
      return new ResponseBase(200, 'Get create data base script success', { valid: info });
    } catch (error) {
      return new ResponseBase(401, error.message);
    }
  }
}
