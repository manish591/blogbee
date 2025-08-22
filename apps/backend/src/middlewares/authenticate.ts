import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getAuthSession } from '../api/users/users.services';
import { BlogbeeResponse } from '../utils/api-response';
import { logger } from '../utils/logger';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cookie = req.cookies;
    const sessionId: string | undefined = cookie.sessionId;

    if (!sessionId) {
      logger.error('UNAUTHORIZED_ERROR: Authorization cookies not found in the request');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new BlogbeeResponse('Unauthorized'),
        );
      return;
    }

    const sessionData = await getAuthSession(sessionId);

    if (!sessionData) {
      logger.error('UNAUTHORIZED_ERROR: Session not found');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new BlogbeeResponse('Unauthorized'),
        );
      return;
    }

    res.locals.user = {
      sessionId,
      userId: sessionData.userId.toString(),
    };

    next();
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new BlogbeeResponse(
          'Internal server error occured',
        ),
      );
  }
}
