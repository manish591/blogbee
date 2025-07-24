import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT ?? 8000,
  NODE_ENV: 'developement',
  ALLOWED_ORIGINS: ['http://localhost:3000'],
};
