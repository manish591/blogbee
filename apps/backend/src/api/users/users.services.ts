import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { config } from '../../config';
import * as db from '../../db';
import type { Session, Users } from '../../db/schema';
import { BlogbeeError } from '../../utils/app-error';
import { generateRandomString, hashPassword } from '../../utils/auth';
import { logger } from '../../utils/logger';
import type { TEditUserProfileBody } from './users.schema';

export const USERS_COLLECTION = 'users';
export const SESSION_COLLECTION = 'session';

export async function getUserByEmail(email: string) {
  try {
    const res = await db.collection<Users>(USERS_COLLECTION).findOne({ email });
    return res;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function createUser(data: Omit<Users, 'createdAt' | 'updatedAt'>) {
  try {
    const hashedPassword = await hashPassword(data.password);
    const res = await db.collection<Users>(USERS_COLLECTION).insertOne({
      _id: new ObjectId(),
      email: data.email,
      name: data.name,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return {
      userId: res.insertedId,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function createAuthSession(userId: string) {
  try {
    const sessionId = generateRandomString();
    const sessionExpiresIn = config.SESSION_EXPIRES_IN;
    await db.collection<Session>(SESSION_COLLECTION).insertOne({
      _id: new ObjectId(),
      sessionId,
      userId: new ObjectId(userId),
      expiresIn: sessionExpiresIn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return {
      sessionId,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function revokeAuthSession(sessionId: string) {
  try {
    const res = await db
      .collection<Session>(SESSION_COLLECTION)
      .deleteOne({ sessionId });
    return {
      success: res.acknowledged,
      deleteCount: res.deletedCount,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function getAuthSession(sessionId: string) {
  try {
    const res = await db
      .collection<Session>(SESSION_COLLECTION)
      .findOne({ sessionId, expiresIn: { $gt: new Date() } });
    return res;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function getUserAuthSessions(userId: string) {
  try {
    const data = db
      .collection<Session>(SESSION_COLLECTION)
      .find({
        userId: new ObjectId(userId),
      })
      .toArray();
    return data;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function editUserProfile(
  userId: string,
  data: TEditUserProfileBody,
) {
  try {
    const cleanUpdates = Object.fromEntries(
      Object.entries(data).filter(([_, val]) => !!val),
    );
    const res = await db.collection<Users>(USERS_COLLECTION).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...cleanUpdates,
        },
      },
    );
    return {
      success: res.acknowledged,
      editedCount: res.modifiedCount,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function getUserDetails(userId: string) {
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
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}
