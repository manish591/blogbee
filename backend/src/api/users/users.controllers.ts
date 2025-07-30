import type { CookieOptions, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { comparePassword } from '../../utils/compare-password';
import { logger } from '../../utils/logger';
import type {
  TCreateUserRequestBody,
  TLoginUserRequestBody,
} from './users.schema';
import {
  createAuthSession,
  createNewUser,
  getUserWithEmail,
  revokeAuthSession,
} from './users.services';

export const SESSION_COOKIE_NAME = 'sessionId';

export const cookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 30,
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
};

export async function createUser(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TCreateUserRequestBody
  >,
  res: Response,
) {
  try {
    const { email } = req.body;

    const isUserExists = await getUserWithEmail(email);

    if (isUserExists) {
      logger.error('User with email already exists');
      res.status(StatusCodes.CONFLICT).json({
        status: StatusCodes.CONFLICT,
        code: ReasonPhrases.CONFLICT,
        message: 'A user with the email already exists!',
      });

      return;
    }

    const userData = await createNewUser(req.body);
    const sessionId = await createAuthSession(userData.insertedId);

    res.cookie(SESSION_COOKIE_NAME, sessionId, cookieOptions);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: 'User created successfully',
    });
  } catch (err) {
    logger.error('Internal server error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured. Please try again later!',
    });
  }
}

export async function loginUser(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TLoginUserRequestBody
  >,
  res: Response,
) {
  try {
    const { email, password } = req.body;

    const userData = await getUserWithEmail(email);

    if (!userData) {
      logger.error('Unauthenticated user. Credentials are invalid.');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        code: ReasonPhrases.UNAUTHORIZED,
        message: 'The credentials you have provided are incorrect!',
      });

      return;
    }

    const isPasswordCorrect = await comparePassword(
      password,
      userData.password,
    );

    if (!isPasswordCorrect) {
      logger.error('Unauthenticated user. Credentials are invalid.');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        code: ReasonPhrases.UNAUTHORIZED,
        message: 'The credentials you have provided are incorrect!',
      });

      return;
    }

    const sessionId = await createAuthSession(userData._id);

    res.cookie(SESSION_COOKIE_NAME, sessionId, cookieOptions);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Logged in successfully',
    });
  } catch (err) {
    logger.error('Internal server error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured. Please try again later!',
    });
  }
}

export async function logoutUser(_req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('User not found');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        code: ReasonPhrases.UNAUTHORIZED,
        message: 'You are not logged in',
      });

      return;
    }

    await revokeAuthSession(userData.sessionId);

    res.clearCookie(SESSION_COOKIE_NAME);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Logout successfully',
    });
  } catch (err) {
    logger.error('Internal server error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured. Please try again later!',
    });
  }
}

export async function uploadProfilePhoto(_req: Request, res: Response) {
  res.status(200).json({
    message: 'uploaded',
  });
}

export async function updateUserProfile(_req: Request, res: Response) {
  res.status(200).json({
    message: 'Updated',
  });
}

export async function getUserDetails(_req: Request, res: Response) {
  res.status(200).json({
    message: 'success',
  });
}
