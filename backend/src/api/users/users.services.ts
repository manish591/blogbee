import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { type Db, ObjectId } from 'mongodb';
import { config } from '../../config';
import type { Session, Users } from '../../db/schema';
import { AppError } from '../../utils/app-error';
import { generateRandomString } from '../../utils/generate-random-string';
import { hashPassword } from '../../utils/hash-password';
import { logger } from '../../utils/logger';
import type { TUpdateProfileSchema } from './users.schema';

export const USERS_COLLECTION = 'users';
export const SESSION_COLLECTION = 'session';

export async function getUserWithEmail(email: string, db: Db) {
  try {
    const userData = await db
      .collection<Users>(USERS_COLLECTION)
      .findOne({ email });
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
  db: Db,
) {
  try {
    const hashedPassword = await hashPassword(userData.password);

    const user = await db.collection<Users>(USERS_COLLECTION).insertOne({
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

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

export async function createAuthSession(userId: string, db: Db) {
  try {
    const sessionId = generateRandomString();
    const sessionExpiresIn = config.SESSION_EXPIRES_IN;

    await db.collection<Session>(SESSION_COLLECTION).insertOne({
      userId: new ObjectId(userId),
      sessionId,
      expiresIn: sessionExpiresIn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

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

export async function revokeAuthSession(sessionId: string, db: Db) {
  try {
    await db.collection<Session>(SESSION_COLLECTION).deleteOne({ sessionId });
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function getAuthSession(sessionId: string, db: Db) {
  try {
    const authSession = await db
      .collection<Session>(SESSION_COLLECTION)
      .findOne({ sessionId, expiresIn: { $gt: new Date() } });
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

export async function updateProfile(
  userId: string,
  updatedData: TUpdateProfileSchema,
  db: Db,
) {
  try {
    await db.collection<Users>(USERS_COLLECTION).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: updatedData,
      },
    );
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function getUserDetails(userId: string, db: Db) {
  try {
    const userData = await db.collection<Users>(USERS_COLLECTION).findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          name: 1,
          email: 1,
          profileImg: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    );

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
