import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT ?? 8000,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  NODE_ENV: 'developement',
  ALLOWED_ORIGINS: ['http://localhost:3000'],
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  DATABASE_NAME: process.env.DB_NAME,
};
