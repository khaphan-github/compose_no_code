import { ManageApiService } from './services/manage-api.service';
import { ManageApiController } from './controllers/manage-api.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GeneratorModule } from '../generator/generator.module';
import { CrudModule } from '../crud-pg/crud.module';
@Module({
  imports: [
    GeneratorModule,
    CqrsModule,
    CrudModule,
  ],
  controllers: [
    ManageApiController,
  ],
  providers: [
    ManageApiService,],
  exports: [ManageApiService]
})
export class ManageApiModule { }
