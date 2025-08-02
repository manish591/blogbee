import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT ?? 8000,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  ALLOWED_ORIGINS: ['http://localhost:3000'],
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  DATABASE_NAME: process.env.DATABASE_NAME ?? 'writely-dev',
  TEST_DATABASE_NAME: process.env.TEST_DATABASE_NAME ?? 'writely-test',
};
