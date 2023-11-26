import { DocumentBuilder } from '@nestjs/swagger';

export const CONFIG_SWAGGER = new DocumentBuilder()
  .setTitle('SERVICE USER')
  .setDescription(``)
  .setVersion('2.0')
  .addTag('microservice - user service')
  .addBearerAuth()
  .build();
