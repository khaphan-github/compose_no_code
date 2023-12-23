import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { InteratedAppModule } from './app/interated-app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule } from '@nestjs/swagger';
import { CONFIG_SWAGGER } from './config/swagger.config';
import { KafkaProducerService } from 'apps/org.core.api-generator/src/app/infrastructure/proxy/kaffka-producer.service';
import { HttpExceptionFilter } from './infrastructure/middlewares/error.middleware';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(InteratedAppModule, {
    cors: {
      origin: ['http://13.211.91.77', '*'],
      methods: ['POST', 'PUT', 'DELETE', 'GET'],
      credentials: true,
    }
  });

  // Provider html page to display api docs
  app.useStaticAssets(join(__dirname, './assets/public'));
  app.setBaseViewsDir(join(__dirname, './assets/public/views'));
  app.setViewEngine('hbs');
  // Provider html page to display api docs
  app.useGlobalFilters(new HttpExceptionFilter(
    app.get(KafkaProducerService)
  ))

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidUnknownValues: true }),
  );

  const globalPrefix = 'api/v1/';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  // Swagger docs config
  const document = SwaggerModule.createDocument(app, CONFIG_SWAGGER);
  SwaggerModule.setup('swagger', app, document);
  // Swagger docs config

  await app.listen(port);


  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
