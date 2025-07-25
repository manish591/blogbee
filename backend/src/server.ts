import compression from 'compression';
import cookieParser from 'cookie-parser';
import type { CorsOptions } from 'cors';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

import { config } from './config';
import { connectToDatabase, disconnectFromDatabase } from './lib/db';
import { v1Routes } from './routes/v1';
import { logger } from './lib/winston';

const app = express();

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !requestOrigin ||
      config.ALLOWED_ORIGINS.includes(requestOrigin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${requestOrigin} is blocked by CORS`),
        false,
      );
    }
  },
};

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
  },
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  compression({
    threshold: '1024',
  }),
);
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Routes);

    const server = app.listen(config.PORT, () => {
      logger.info(`Server running at: http://localhost:${config.PORT}`);
    });

    process.on('SIGTERM', () => {
      server.close(handleServerShutdown);
    });

    process.on('SIGINT', () => {
      server.close(handleServerShutdown);
    });
  } catch (err) {
    logger.error('Failed to start the server', err);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

async function handleServerShutdown() {
  try {
    await disconnectFromDatabase();
    logger.warn('Server Shutdown');
    process.exit(0);
  } catch (err) {
    logger.error('Failed to shutdown server', err);
  }
}
