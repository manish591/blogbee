import type { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ZodError, type ZodObject, z } from 'zod';
import { AppError } from '../../utils/app-error';
import { logger } from '../../utils/logger';

export function validateRequestBody(schema: ZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error('ZodError: Request Body Is Invalid', err);
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          code: ReasonPhrases.BAD_REQUEST,
          message: 'Request body is invalid.',
        });
      }

      logger.error('Internal Server Error', err);
      next(
        new AppError({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          code: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: 'An internal server error occured. Try again later!',
        }),
      );
    }
  };
}

export function validateQueryParams(schema: ZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error('ZodError: Request query params are invalid', z.treeifyError(err));
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          code: ReasonPhrases.BAD_REQUEST,
          message: 'Request query params are invalid.',
        });
      }

      logger.error('Internal Server Error', err);
      next(
        new AppError({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          code: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: 'An internal server error occured. Try again later!',
        }),
      );
    }
  };
}
