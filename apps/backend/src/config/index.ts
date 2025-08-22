import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT ?? 8000,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  ALLOWED_ORIGINS: ['http://localhost:3000'],
  DB_URL: process.env.DB_URL ?? '',
  DB_NAME: process.env.DB_NAME ?? 'blogbee-dev',
  TEST_DB_URL: process.env.TEST_DB_URL ?? "",
  TEST_DB_NAME: process.env.TEST_DB_NAME ?? 'blogbee-test',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  SESSION_EXPIRES_IN: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
};
