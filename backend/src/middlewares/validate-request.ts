import type { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ZodError, type ZodObject, z } from 'zod';
import { APIResponse } from '../utils/api-response';
import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';

export function validateRequest(schema: ZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
      logger.info(
        'REQUEST_RESOUCRCE_PARSE_SUCCESS: Successfully parsed the request resources',
      );
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error(
          'ZOD_ERROR: Request resources are invalid',
          z.treeifyError(err),
        );
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            new APIResponse('error', StatusCodes.BAD_REQUEST, 'Bad request'),
          );
        return;
      }

      logger.error('SERVER_ERROR: Internal Server Error occured', err);
      next(
        new AppError({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          code: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: 'Internal server error occured',
        }),
      );
    }
  };
}
