import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { InteratedAppModule } from './app/interated-app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule } from '@nestjs/swagger';
import { CONFIG_SWAGGER } from './app/config/swagger.config';
import { HttpExceptionFilter } from './app/middlewares/error.middleware';
import { KafkaProducerService } from './app/infrastructure/proxy/kaffka-producer.service';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(InteratedAppModule);

  app.enableCors();

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
