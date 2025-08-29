import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import * as db from '../../db';
import type { Categories, Posts } from '../../db/schema';
import { BlogbeeError } from '../../utils/app-error';
import { logger } from '../../utils/logger';
import { POSTS_COLLECTION } from '../posts/posts.services';
import type { CreateCategoryBody, EditCategoryBody } from './categories.schema';

export const CATEGORIES_COLLECTION = 'categories';

export async function createCategory(
  userId: string,
  blogId: string,
  data: CreateCategoryBody,
) {
  try {
    const res = await db.collection<Categories>(CATEGORIES_COLLECTION).insertOne({
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
      categoryId: res.insertedId,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function getCategoryById(categoryId: string) {
  try {
    const res = await db.collection<Categories>(CATEGORIES_COLLECTION).findOne({
      _id: new ObjectId(categoryId),
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

export async function getCategories(blogId: string) {
  try {
    const res = await db
      .collection<Categories>(CATEGORIES_COLLECTION)
      .find({
        blogId: new ObjectId(blogId),
      })
      .toArray();
    return res;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function editCategory(categoryId: string, data: EditCategoryBody) {
  try {
    const cleanUpdates = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );

    await db.collection<Categories>(CATEGORIES_COLLECTION).updateOne(
      {
        _id: new ObjectId(categoryId),
      },
      {
        $set: {
          ...cleanUpdates,
          updatedAt: new Date(),
        },
      },
    );

    if (data.name) {
      await db.collection<Posts>(POSTS_COLLECTION).updateMany({
        "categories.id": new ObjectId(categoryId)
      }, {
        $set: {
          "categories.$.name": data.name
        }
      })
    }

    return {
      isSuccess: true
    }
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function deleteCategory(categoryId: string) {
  const dbClient = db.getDBClient();
  const session = dbClient.startSession();

  try {
    session.startTransaction();

    const categoryData = await db.collection<Categories>(CATEGORIES_COLLECTION).findOne({
      _id: new ObjectId(categoryId),
    });

    await db.collection<Posts>(POSTS_COLLECTION).updateMany(
      {
        categories: {
          $elemMatch: {
            id: categoryData?._id
          }
        }
      },
      {
        $pull: {
          categories: {
            id: categoryData?._id
          }
        },
      },
    );

    await db.collection<Categories>(CATEGORIES_COLLECTION).deleteOne({
      _id: new ObjectId(categoryId),
    });

    await session.commitTransaction();

    return {
      isSuccess: true
    }
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

export async function isCategoryOwnedByUser(userId: string, categoryId: string) {
  try {
    const res = await db.collection<Categories>(CATEGORIES_COLLECTION).findOne({
      userId: new ObjectId(userId),
      _id: new ObjectId(categoryId),
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

export async function isCategoryNameTaken(blogId: string, name: string) {
  try {
    const res = await db.collection<Categories>(CATEGORIES_COLLECTION).findOne({
      blogId: new ObjectId(blogId),
      name
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