import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticateMiddleware } from './middlewares/auth.middleware';
import { AuthorizationMiddleware } from './middlewares/authorization.middleware';
import { CustomizeInputMiddleware } from './middlewares/customize-input.middleware';
import { ValidateInputMiddleware } from './middlewares/validate-input.middleware';
import { CrudModule } from 'apps/org.core.api-generator/src/app/modules/crud-pg/crud.module';
import { ManageApiModule } from 'apps/org.core.api-generator/src/app/modules/manage/manage-api.module';
import { AuthModule } from 'apps/org.core.api-generator/src/app/modules/auth/auth.module';

import { PolicyMiddleware } from './middlewares/policy.middleware';
import { AppModule } from './app.module';

@Module({
  imports: [
    InteratedAppModule,
    CqrsModule,
    CrudModule,
    ManageApiModule,
    AuthModule,
    AppModule,
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
        ValidateInputMiddleware,
      )
      .forRoutes('*');
  }

}
