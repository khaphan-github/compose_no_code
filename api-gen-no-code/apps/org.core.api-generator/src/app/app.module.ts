import { Module } from '@nestjs/common';

import { CrudModule } from './modules/crud-pg/crud.module';
import { GeneratorModule } from './modules/generator/generator.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JsonIoService } from './modules/shared/json.io.service';
import { FileReaderService } from './modules/shared/file-reader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationalDbConfig } from './infrastructure/env/relational-db.config';
import { TypeOrmPostgresConfig } from './infrastructure/env/postgres-typeorm.config';
import { ManageApiModule } from './modules/manage/manage-api.module';
import { AppEnvironmentConfig } from './infrastructure/env/app.env.config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

const FEATUREMODULES = [
  CrudModule,
  GeneratorModule,
  ManageApiModule,
  AuthModule,
]

@Module({
  imports: [
    ...FEATUREMODULES,

    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        RelationalDbConfig,
        AppEnvironmentConfig
      ]
    }),



    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: TypeOrmPostgresConfig,
    }),

  ],
  providers: [
    JsonIoService,
    FileReaderService,
  ]
})
export class AppModule { }
