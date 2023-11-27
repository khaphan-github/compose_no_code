import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModule } from '@org.api-generator/core';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticateMiddleware } from '../infrastructure/middlewares/auth.middleware';
import { AuthorizationMiddleware } from '../infrastructure/middlewares/authorization.middleware';
import { CustomizeInputMiddleware } from '../infrastructure/middlewares/customize-input.middleware';
import { ValidateInputMiddleware } from '../infrastructure/middlewares/validate-input.middleware';
import { CrudModule } from 'apps/org.core.api-generator/src/app/modules/crud-pg/crud.module';
import { ManageApiModule } from 'apps/org.core.api-generator/src/app/modules/manage/manage-api.module';
import { AuthModule } from 'apps/org.core.api-generator/src/app/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PolicyMiddleware } from '../infrastructure/middlewares/policy.middleware';

@Module({
  imports: [
    AppModule,
    CqrsModule,
    CrudModule,
    ManageApiModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class InteratedAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthenticateMiddleware,
        AuthorizationMiddleware,
        PolicyMiddleware,
        CustomizeInputMiddleware,
        ValidateInputMiddleware
      )
      .forRoutes('*');
  }

}
