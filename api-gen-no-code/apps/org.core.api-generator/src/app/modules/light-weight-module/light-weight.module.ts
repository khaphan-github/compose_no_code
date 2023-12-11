import { LightWeightController } from './controllers/light-weight.controller';
import { LightWeightService } from './services/light-weight.service';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LightWeightRepository } from './repository/light-weight.repository';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import NodeCache from 'node-cache';
import { TablePermissionService } from './services/table-permission.service';
import { CustomController } from './controllers/custom-api.controller';

@Module({
  imports: [
    TypeOrmModule,
  ],
  controllers: [
    LightWeightController,
    CustomController,
  ],
  providers: [
    LightWeightService,
    TablePermissionService,

    LightWeightRepository,
    LoggingInterceptor,

    NodeCache,
  ],
  exports: [
    LightWeightService,
    TablePermissionService,

    LightWeightRepository,
    LoggingInterceptor,
  ]
})
export class LightWeightModule { }
