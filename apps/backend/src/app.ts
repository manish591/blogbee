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
import { StatusCodes } from 'http-status-codes';
import { MulterError } from 'multer';
import { config } from './config';
import { v1Routes } from './routes';
import { BlogbeeResponse } from './utils/api-response';
import { BlogbeeError } from './utils/app-error';
import { logger } from './utils/logger';

export function buildServer() {
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

  app.use('/v1', v1Routes);

  app.use((_req, _res, next) => {
    next(
      new BlogbeeError(
        StatusCodes.NOT_FOUND,
        'Not found',
      ),
    );
  });

  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        logger.error('FILE_LIMIT_ERROR: Allowed file size limit is 10MB');
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            new BlogbeeResponse(
              'Allowed file size limit is 10MB',
            ),
          );
        return;
      }

      next(
        new BlogbeeError(
          StatusCodes.BAD_REQUEST,
          err.message,
        ),
      );
    }

    if (err instanceof BlogbeeError) {
      res.status(err.status).json(
        new BlogbeeResponse(err.message)
      );

      return;
    }

    next(err);
  });

  return app;
}
