import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { type Db, ObjectId } from 'mongodb';
import { dbClient } from '../../db';
import type { Posts, Tags } from '../../db/schema';
import { AppError } from '../../utils/app-error';
import { POSTS_COLLECTION, TAGS_COLLECTION } from '../../utils/constants';
import { logger } from '../../utils/logger';
import type { TCreateTagBody, TEditTagBody } from './tags.schema';

export async function createTag(
  userId: string,
  blogId: string,
  data: TCreateTagBody,
  db: Db,
) {
  try {
    const res = await db.collection<Tags>(TAGS_COLLECTION).insertOne({
      posts: [],
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: data.description,
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
    });
    return {
      success: res.acknowledged,
      tagId: res.insertedId
    }
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function getTagById(
  tagId: string,
  db: Db,
) {
  try {
    const res = await db.collection<Tags>(TAGS_COLLECTION).findOne({
      _id: new ObjectId(tagId),
    });
    return res;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function getAllUserTags(userId: string, db: Db) {
  try {
    const res = await db.collection<Tags>(TAGS_COLLECTION).find({
      userId: new ObjectId(userId)
    }).limit(10).toArray();
    return res;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function getBlogTags(blogId: string, db: Db) {
  try {
    const allTagsData = await db
      .collection<Tags>(TAGS_COLLECTION)
      .find({
        blogId: new ObjectId(blogId),
      })
      .toArray();
    return allTagsData;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function editTag(
  tagId: string,
  data: TEditTagBody,
  db: Db,
) {
  try {
    const cleanUpdates = Object.fromEntries(Object.entries(data).filter(([_, value]) => value != null));
    await db.collection<Tags>(TAGS_COLLECTION).updateOne(
      {
        _id: new ObjectId(tagId),
      },
      {
        $set: {
          ...cleanUpdates,
          updatedAt: new Date(),
        },
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

export async function deleteTag(
  tagId: string,
  db: Db,
) {
  const session = dbClient.startSession();
  try {
    session.startTransaction();

    const tagData = await db.collection<Tags>(TAGS_COLLECTION).findOne({
      _id: new ObjectId(tagId),
    });

    await db.collection<Posts>(POSTS_COLLECTION).updateMany(
      {
        _id: { $in: tagData?.posts },
      },
      {
        $pull: { tags: tagData?._id },
      },
    );

    await db.collection<Tags>(TAGS_COLLECTION).deleteOne({
      _id: new ObjectId(tagId),
    });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  } finally {
    await session.endSession();
  }
}

export async function isTagOwnedByUser(userId: string, tagId: string, db: Db) {
  try {
    const res = await db.collection<Tags>(TAGS_COLLECTION).findOne({
      userId: new ObjectId(userId),
      _id: new ObjectId(tagId)
    })
    return res !== null;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}