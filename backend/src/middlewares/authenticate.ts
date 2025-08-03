import type { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { getAuthSession } from '../api/users/users.services';
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
      logger.error('Invalid cookies found in the request');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        code: ReasonPhrases.UNAUTHORIZED,
        message: 'You are not authorized.',
      });

      return;
    }

    const sessionData = await getAuthSession(sessionId, req.db);

    if (!sessionData) {
      logger.error('No session found.');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        code: ReasonPhrases.UNAUTHORIZED,
        message: 'You are not authorized.',
      });

      return;
    }

    res.locals.user = {
      sessionId,
      userId: sessionData.userId,
    };

    next();
  } catch (err) {
    logger.error('Internal server error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured. Please try again later!',
    });
  }
}
