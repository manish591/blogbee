import type { CookieOptions, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { comparePassword } from '../../utils/compare-password';
import { logger } from '../../utils/logger';
import {
  uploadFileToCloudinary,
  uploadSingleFile,
} from '../../utils/upload-files';
import type {
  TCreateUserRequestBody,
  TLoginUserRequestBody,
  TUpdateProfileSchema,
} from './users.schema';
import {
  createAuthSession,
  createNewUser,
  getUserDetails,
  getUserWithEmail,
  revokeAuthSession,
  updateProfile,
} from './users.services';

export const SESSION_COOKIE_NAME = 'sessionId';

export const cookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 30,
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
};

export async function createUserHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TCreateUserRequestBody
  >,
  res: Response,
) {
  try {
    const { email } = req.body;

    const isUserExists = await getUserWithEmail(email, req.db);

    if (isUserExists) {
      logger.error('User with email already exists');
      res.status(StatusCodes.CONFLICT).json({
        status: StatusCodes.CONFLICT,
        code: ReasonPhrases.CONFLICT,
        message: 'A user with the email already exists!',
      });

      return;
    }

    const userData = await createNewUser(req.body, req.db);
    const sessionId = await createAuthSession(userData.insertedId.toString(), req.db);

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

export async function loginUserHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TLoginUserRequestBody
  >,
  res: Response,
) {
  try {
    const { email, password } = req.body;

    const userData = await getUserWithEmail(email, req.db);

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

    const sessionId = await createAuthSession(userData._id.toString(), req.db);

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

export async function logoutUserHandler(req: Request, res: Response) {
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

    await revokeAuthSession(userData.sessionId, req.db);

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

export async function uploadProfileImageHandler(req: Request, res: Response) {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        code: ReasonPhrases.BAD_REQUEST,
        message: 'File not found',
      });

      return;
    }

    const profileImageUrl = await uploadSingleFile(
      uploadedFile,
      uploadFileToCloudinary,
    );

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'File uploaded successfully',
      data: {
        url: profileImageUrl,
      },
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

export async function updateProfileHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TUpdateProfileSchema
  >,
  res: Response,
) {
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

    const userId = userData.userId;

    await updateProfile(userId, req.body, req.db);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Profile data updated successfully',
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

export async function getUserDetailsHandler(req: Request, res: Response) {
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

    const userId = userData.userId;
    const userDetails = await getUserDetails(userId, req.db);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Successfully fetched user details',
      data: {
        user: userDetails,
      },
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
