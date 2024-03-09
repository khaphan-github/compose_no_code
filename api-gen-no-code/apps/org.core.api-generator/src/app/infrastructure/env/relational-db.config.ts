import { registerAs } from '@nestjs/config';

export const RelationalDbConfig = registerAs('relationaldb', () => ({
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST_NAME || 'rosie.db.elephantsql.com',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'jpvjyyeg',
  password: process.env.DATABASE_PASSWORD || 'NgbFSmvfEvfiSiAK2_taiv9XtiKHb3nJ',
  schema: process.env.DATABASE_SCHEMA || 'jpvjyyeg',
}));
