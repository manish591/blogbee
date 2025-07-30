import type { NextFunction, Request, Response } from 'express';
import { collections } from '../db';
import type { Session } from '../db/schema';
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
      res.status(401).json({
        status: 401,
        code: 'UNAUTHENTICATED',
        message: 'You are not logged in.',
      });
    }

    const sessionData = (await collections.session?.findOne({
      sessionId,
    })) as Session | null;

    if (!sessionData) {
      logger.error('No session found.');
      res.status(401).json({
        status: 401,
        code: 'UNAUTHENTICATED',
        message: 'You are not logged in.',
      });

      return;
    }

    if (new Date() > sessionData.expiresIn) {
      logger.error('session token expired');
      res.status(401).json({
        status: 401,
        code: 'UNAUTHENTICATED',
        message: 'You are not logged in.',
      });
    }

    res.locals.user = {
      userId: sessionData.userId,
    };

    next();
  } catch (err) {
    logger.error('Internal server error', err);
    res.status(500).json({
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error on the server side. Please try again later',
    });
  }
}
