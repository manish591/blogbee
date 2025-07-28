import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT ?? 8000,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  ALLOWED_ORIGINS: ['http://localhost:3000'],
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  DATABASE_NAME: process.env.DB_NAME,
  SESSION_COOKIE_OPTIONS: {
    NAME: "sessionId",
    MAX_AGE: 1000 * 60 * 60 * 24 * 30,
    SAME_SITE: "lax" as const,
    HTTP_ONLY: true,
    SECURE: true
  }
};
