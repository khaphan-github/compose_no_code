import { LightWeightController } from './light-weight.controller';
import { LightWeightService } from './services/light-weight.service';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LightWeightRepository } from './light-weight.repository';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import NodeCache from 'node-cache';
import { TablePermissionService } from './services/table-permission.service';

@Module({
  imports: [
    TypeOrmModule,
  ],
  controllers: [
    LightWeightController,
  ],
  providers: [
    LightWeightService,
    TablePermissionService,

    LightWeightRepository,
    LoggingInterceptor,

    NodeCache,
  ],
  exports: []
})
export class LightWeightModule { }
