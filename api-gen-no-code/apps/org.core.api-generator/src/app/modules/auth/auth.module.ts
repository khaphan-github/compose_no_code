import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GeneratorModule } from '../generator/generator.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CrudModule } from '../crud-pg/crud.module';
import { BCryptService } from './bscript.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import NodeCache from 'node-cache';
import { LightWeightModule } from '../light-weight-module/light-weight.module';

@Module({
  imports: [
    GeneratorModule,
    CqrsModule,
    CrudModule,
    LightWeightModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('app.jwt.privateKey'),
        signOptions: { expiresIn: '1d', algorithm: 'RS256' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    BCryptService,
    NodeCache,
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule { }
