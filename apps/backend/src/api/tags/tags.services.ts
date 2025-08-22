import * as db from "../../db";
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import type { Posts, Tags } from '../../db/schema';
import { BlogbeeError } from '../../utils/app-error';
import { logger } from '../../utils/logger';
import type { TCreateTagBody, TEditTagBody } from './tags.schema';
import { POSTS_COLLECTION } from "../posts/posts.services";

export const TAGS_COLLECTION = "tags";

export async function createTag(
  userId: string,
  blogId: string,
  data: TCreateTagBody,
) {
  try {
    const res = await db.collection<Tags>(TAGS_COLLECTION).insertOne({
      _id: new ObjectId(),
      posts: [],
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: data.description ? data.description : null,
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
    });
    return {
      success: res.acknowledged,
      tagId: res.insertedId,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function getTagById(tagId: string) {
  try {
    const res = await db.collection<Tags>(TAGS_COLLECTION).findOne({
      _id: new ObjectId(tagId),
    });
    return res;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function getBlogTags(blogId: string) {
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
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function editTag(tagId: string, data: TEditTagBody) {
  try {
    const cleanUpdates = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => !!value),
    );
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
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function deleteTag(tagId: string) {
  const dbClient = db.getDBClient();
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
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  } finally {
    await session.endSession();
  }
}

export async function isTagOwnedByUser(userId: string, tagId: string) {
  try {
    const res = await db.collection<Tags>(TAGS_COLLECTION).findOne({
      userId: new ObjectId(userId),
      _id: new ObjectId(tagId),
    });
    return res !== null;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}
