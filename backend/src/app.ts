import compression from 'compression';
import cookieParser from 'cookie-parser';
import type { CorsOptions } from 'cors';
import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type * as mongo from 'mongodb';

import { config } from './config';
import { v1Routes } from './routes';
import { AppError } from './utils/app-error';

declare global {
  namespace Express {
    interface Request {
      db: mongo.Db;
    }
  }
}

export function buildServer({ db }: { db: mongo.Db }) {
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

  app.use((req, _res, next) => {
    req.db = db;
    next();
  });

  app.use('/api/v1', v1Routes);

  app.use((_req, _res, next) => {
    next(
      new AppError({
        status: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: '404 not found',
      }),
    );
  });

  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.status).json({
        status: err.status,
        code: err.code,
        message: err.message,
      });

      return;
    }

    next(err);
  });

  return app;
}
