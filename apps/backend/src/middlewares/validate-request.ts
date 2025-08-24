import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, type ZodObject, z } from 'zod';
import { BlogbeeResponse } from '../utils/api-response';
import { BlogbeeError } from '../utils/app-error';
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
          .json(new BlogbeeResponse('Bad request'));
        return;
      }

      logger.error('SERVER_ERROR: Internal Server Error occured', err);
      next(
        new BlogbeeError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
    }
  };
}
