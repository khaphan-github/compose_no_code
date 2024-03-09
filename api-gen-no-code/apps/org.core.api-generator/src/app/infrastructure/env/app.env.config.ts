import { registerAs } from "@nestjs/config";

export const AppEnvironmentConfig = registerAs('app', () => ({
  enableCORS: process.env.SERVER_ENABLE_CORS ?? false,
  enableApiDOCs: process.env.SERVER_ENABLE_API_DOCS ?? false,
  serverPort: parseInt(process.env.SERVER_PORT) ?? 3000,
  apiVersion: process.env.SERVER_API_VERSION ?? '0.0.1',
  globalPrefix: process.env.SERVER_GLOBAL_PREFIX ?? '/api/',

  secretKey: process.env.SERVER_SECRET_KEY,
  jwt: {
    publicKey: process.env.JWT_PUBLIC_KEY,
    privateKey: process.env.JWT_PRIVATE_KEY,
  },
}));