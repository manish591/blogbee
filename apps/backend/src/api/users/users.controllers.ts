import type { CookieOptions, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '../../utils/api-response';
import { comparePassword } from '../../utils/compare-password';
import { SESSION_COOKIE_NAME } from '../../utils/constants';
import { logger } from '../../utils/logger';
import {
  uploadFileToCloudinary,
  uploadSingleFile,
} from '../../utils/upload-files';
import type {
  TCreateUserBody,
  TEditUserProfileBody,
  TLoginUserBody,
} from './users.schema';
import {
  createAuthSession,
  createUser,
  editUserProfile,
  getUserByEmail,
  getUserDetails,
  revokeAuthSession,
} from './users.services';

export const COOKIE_OPTIONS: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 30,
};

export async function createUserHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TCreateUserBody
  >,
  res: Response,
) {
  try {
    const { email } = req.body;

    const isUserExists = await getUserByEmail(email, req.db);

    if (isUserExists) {
      logger.error('CONFLICT_ERROR: User with email already exists');
      res
        .status(StatusCodes.CONFLICT)
        .json(
          new APIResponse(
            'error',
            StatusCodes.CONFLICT,
            'User with email already exists',
          ),
        );

      return;
    }

    const createUserResult = await createUser(req.body, req.db);
    const userId = createUserResult.userId.toString();
    const createSessionResult = await createAuthSession(userId, req.db);
    logger.info('CREATE_USER_SUCCESS', 'User created successfully');

    res.cookie(
      SESSION_COOKIE_NAME,
      createSessionResult.sessionId,
      COOKIE_OPTIONS,
    );
    res
      .status(StatusCodes.CREATED)
      .json(
        new APIResponse(
          'success',
          StatusCodes.CREATED,
          'User created successfully',
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function loginUserHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TLoginUserBody
  >,
  res: Response,
) {
  try {
    const { email, password } = req.body;

    const userData = await getUserByEmail(email, req.db);

    if (!userData) {
      logger.error('UNAUTHORIZED_ERROR: Invalid credentials');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse(
            'error',
            StatusCodes.UNAUTHORIZED,
            'Invalid credentials',
          ),
        );
      return;
    }

    const isPasswordCorrect = await comparePassword(
      password,
      userData.password,
    );

    if (!isPasswordCorrect) {
      logger.error('UNAUTHORIZED_ERROR: Invalid credentials');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse(
            'error',
            StatusCodes.UNAUTHORIZED,
            'Invalid credentials',
          ),
        );
      return;
    }

    const createSessionResult = await createAuthSession(
      userData._id.toString(),
      req.db,
    );
    logger.info('LOGIN_USER_SUCCESS: Logged in successfully');

    res.cookie(
      SESSION_COOKIE_NAME,
      createSessionResult.sessionId,
      COOKIE_OPTIONS,
    );
    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse('success', StatusCodes.OK, 'Logged in successfully'),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function logoutUserHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('UNAUTHORIZED_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    await revokeAuthSession(userData.sessionId, req.db);
    logger.info('LOGOUT_USER_SUCCESS: Logout successfully');

    res.clearCookie(SESSION_COOKIE_NAME);
    res
      .status(StatusCodes.OK)
      .json(new APIResponse('success', StatusCodes.OK, 'Logout successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function uploadProfileImageHandler(req: Request, res: Response) {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      logger.error('BAD_REQUEST_ERROR: Upload profile image not found');
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(new APIResponse('error', StatusCodes.BAD_REQUEST, 'Bad request'));
      return;
    }

    const data = await uploadSingleFile(uploadedFile, uploadFileToCloudinary);
    logger.info(
      'UPLOAD_PROFILE_IMAGE_SUCCESS: Profile image uploaded successfully',
    );
    res.status(StatusCodes.OK).json(
      new APIResponse(
        'success',
        StatusCodes.OK,
        'Profile image uploaded successfully',
        {
          url: data,
        },
      ),
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function editProfileHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TEditUserProfileBody
  >,
  res: Response,
) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('UNAUTHORIZED_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const userId = userData.userId;

    await editUserProfile(userId, req.body, req.db);
    logger.info('EDIT_USER_SUCCESS: User data edited successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'User data edited successfully',
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function getUserDetailsHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('UNAUTHORIZED_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const userId = userData.userId;
    const data = await getUserDetails(userId, req.db);
    logger.info('GET_USER_DETAILS_SUCCESS: User details fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'User details fetched successfully',
          data,
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}
