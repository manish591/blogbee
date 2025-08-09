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
    await db.collection<Tags>(TAGS_COLLECTION).insertOne({
      posts: [],
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: data.description,
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
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

export async function getTag(
  userId: string,
  blogId: string,
  tagId: string,
  db: Db,
) {
  try {
    const data = await db.collection<Tags>(TAGS_COLLECTION).findOne({
      _id: new ObjectId(tagId),
      blogId: new ObjectId(blogId),
      userId: new ObjectId(userId),
    });
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

export async function getAllTags(userId: string, blogId: string, db: Db) {
  try {
    const allTagsData = await db
      .collection<Tags>(TAGS_COLLECTION)
      .find({
        userId: new ObjectId(userId),
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
  userId: string,
  blogId: string,
  tagId: string,
  tagData: TEditTagBody,
  db: Db,
) {
  try {
    const data = await db.collection<Tags>(TAGS_COLLECTION).updateOne(
      {
        _id: new ObjectId(tagId),
        userId: new ObjectId(userId),
        blogId: new ObjectId(blogId),
      },
      {
        $set: {
          ...tagData,
          updatedAt: new Date(),
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

export async function deleteTag(
  userId: string,
  blogId: string,
  tagId: string,
  db: Db,
) {
  const session = dbClient.startSession();
  try {
    session.startTransaction();

    const tagData = await db.collection<Tags>(TAGS_COLLECTION).findOne({
      _id: new ObjectId(tagId),
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
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
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
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
