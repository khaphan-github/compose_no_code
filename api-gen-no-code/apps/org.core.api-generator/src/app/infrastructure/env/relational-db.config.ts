import { registerAs } from "@nestjs/config";

export const RelationalDbConfig = registerAs('relationaldb', () => ({
  type: process.env.DATABASE_TYPE || '',
  host: process.env.DATABASE_HOST_NAME || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'admin',
  password: process.env.DATABASE_PASSWORD || 'admin',
  schema: process.env.DATABASE_SCHEMA || 'public',
}));