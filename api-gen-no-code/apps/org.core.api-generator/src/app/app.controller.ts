import { Controller, Get, Logger, Post } from '@nestjs/common';

import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  tes() {
    Logger.log(`Xin chafo`);
    const a = 1 + 2;
    return a;
  }
}
