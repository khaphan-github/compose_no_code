import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const TypeOrmPostgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get<string>('relationaldb.host', 'localhost'),
    port: configService.get<number>('relationaldb.port', 5432),
    username: configService.get<string>('relationaldb.username', 'postgres'),
    password: configService.get<string>('relationaldb.password', 'postgres'),
    database: configService.get<string>(
      'relationaldb.schema',
      'postgres',
    ),
    autoLoadEntities: true,
    synchronize: true,
  };
};
