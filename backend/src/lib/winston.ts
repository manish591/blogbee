import winston from 'winston';
import { config } from '../config';

const transports: winston.transport[] = [];

if (config.NODE_ENV !== 'production') {
  transports.push(new winston.transports.Console());
}

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
});
