import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { collections } from '../../db';
import type { Session, Users } from '../../db/schema';
import { AppError } from '../../utils/app-error';
import { generateRandomString } from '../../utils/generate-random-string';
import { hashPassword } from '../../utils/hash-password';
import { logger } from '../../utils/logger';

export async function getUserWithEmail(email: string) {
  try {
    const userData = (await collections.users?.findOne({
      email,
    })) as Required<Users> | null;

    return userData;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function createNewUser(
  userData: Omit<Users, 'createdAt' | 'updatedAt'>,
) {
  try {
    const hashedPassword = await hashPassword(userData.password);

    const user = await collections.users?.insertOne({
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!user) {
      logger.error('Failed to insert user');
      throw new AppError({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: 'An internal server error occured. Try again later!',
      });
    }

    return user;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function createAuthSession(userId: string) {
  try {
    const sessionId = generateRandomString();
    const sessionExpiresIn = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    const createdSession = await collections.session?.insertOne({
      userId,
      sessionId,
      expiresIn: sessionExpiresIn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!createdSession) {
      logger.error('Failed to insert user');
      throw new AppError({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: 'An internal server error occured. Try again later!',
      });
    }

    return sessionId;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function revokeAuthSession(sessionId: string) {
  try {
    await collections.session?.deleteOne({ sessionId });
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function getAuthSession(sessionId: string) {
  try {
    const authSession = (await collections.session?.findOne({ sessionId })) as Session | null;
    return authSession;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}
