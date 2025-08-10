import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { type Db, ObjectId } from 'mongodb';
import { config } from '../../config';
import type { Session, Users } from '../../db/schema';
import { AppError } from '../../utils/app-error';
import { SESSION_COLLECTION, USERS_COLLECTION } from '../../utils/constants';
import { generateRandomString } from '../../utils/generate-random-string';
import { hashPassword } from '../../utils/hash-password';
import { logger } from '../../utils/logger';
import type { TEditUserProfileBody } from './users.schema';

export async function getUserByEmail(email: string, db: Db) {
  try {
    const userData = await db
      .collection<Users>(USERS_COLLECTION)
      .findOne({ email });
    return userData;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function createUser(
  data: Omit<Users, 'createdAt' | 'updatedAt'>,
  db: Db,
) {
  try {
    const hashedPassword = await hashPassword(data.password);
    await db.collection<Users>(USERS_COLLECTION).insertOne({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function createAuthSession(userId: string, db: Db) {
  try {
    const sessionId = generateRandomString();
    const sessionExpiresIn = config.SESSION_EXPIRES_IN;
    await db.collection<Session>(SESSION_COLLECTION).insertOne({
      sessionId,
      userId: new ObjectId(userId),
      expiresIn: sessionExpiresIn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return sessionId;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function revokeAuthSession(sessionId: string, db: Db) {
  try {
    await db.collection<Session>(SESSION_COLLECTION).deleteOne({ sessionId });
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
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
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function getUserAuthSessions(userId: string, db: Db) {
  try {
    const data = db.collection<Session>(SESSION_COLLECTION).find({
      userId: new ObjectId(userId)
    }).toArray();
    return data;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function getAllAuthSessions(db: Db) {
  try {
    const data = await db.collection<Session>(SESSION_COLLECTION).find({}).toArray();
    return data;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function editUserProfile(
  userId: string,
  data: TEditUserProfileBody,
  db: Db,
) {
  try {
    await db.collection<Users>(USERS_COLLECTION).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: data,
      },
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function getUserDetails(userId: string, db: Db) {
  try {
    const data = await db.collection<Users>(USERS_COLLECTION).findOne(
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
    return data;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}
