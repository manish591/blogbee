import type { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ZodError, type ZodObject, z } from 'zod';
import { AppError } from '../../utils/app-error';
import { logger } from '../../utils/logger';

export function validateRequest(schema: ZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error(
          'ZodError: Request resources are invalid',
          z.treeifyError(err),
        );
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          code: ReasonPhrases.BAD_REQUEST,
          message: 'Request resources are invalid.',
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
