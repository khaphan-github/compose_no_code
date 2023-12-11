import { LightWeightController } from './controllers/light-weight.controller';
import { LightWeightService } from './services/light-weight.service';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LightWeightRepository } from './repository/light-weight.repository';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import NodeCache from 'node-cache';
import { TablePermissionService } from './services/table-permission.service';
import { CustomController } from './controllers/custom-api.controller';
import { SQLTransformerProxy } from './proxy/sql.transformer.proxy';
import { HttpModule } from '@nestjs/axios';
import { TransformerSerivce } from './services/transformer.service';
import { TransformController } from './controllers/transformer.controller';

@Module({
  imports: [
    TypeOrmModule,
    HttpModule,
  ],
  controllers: [
    LightWeightController,
    CustomController,
    TransformController,
  ],
  providers: [
    LightWeightService,
    TablePermissionService,
    TransformerSerivce,

    LightWeightRepository,
    LoggingInterceptor,

    NodeCache,

    SQLTransformerProxy,
  ],
  exports: [
    LightWeightService,
    TablePermissionService,

    LightWeightRepository,
    LoggingInterceptor,
  ]
})
export class LightWeightModule { }
