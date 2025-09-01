import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import * as db from '../../db';
import { type Categories, PostStatus, type Posts } from '../../db/schema';
import { BlogbeeError } from '../../utils/app-error';
import { logger } from '../../utils/logger';
import { CATEGORIES_COLLECTION } from '../categories/categories.services';
import type { EditPostBody } from './posts.schema';

export const POSTS_COLLECTION = 'posts';

export async function createPost(userId: string, blogId: string) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).insertOne({
      _id: new ObjectId(),
      title: 'untitled',
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
      postStatus: PostStatus.DRAFT,
      categories: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return {
      success: res.acknowledged,
      postId: res.insertedId,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function getPostById(postId: string) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      _id: new ObjectId(postId),
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

export async function getPostBySlug(postSlug: string) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      slug: postSlug,
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

export async function isPostSlugAvailable(
  userId: string,
  blogId: string,
  slug: string,
) {
  try {
    const data = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
      slug,
    });
    return data != null;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function isPostContainsCategory(
  postId: string,
  categoryId: string,
) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      _id: new ObjectId(postId),
      'categories.id': new ObjectId(categoryId),
    });
    return res != null;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function isPostOwnedByUser(userId: string, postId: string) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      _id: new ObjectId(postId),
      userId: new ObjectId(userId),
    });
    return res != null;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function getPosts(
  blogId: string,
  options?: {
    query?: string;
    page?: number;
    limit?: number;
    sort?: 'latest' | 'oldest';
    categories?: string;
    status?: PostStatus;
  },
) {
  try {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const query = options?.query ?? '';
    const docsToSkip = (page - 1) * limit;
    const numDocsToReturn = limit;
    const totalItems = await db
      .collection<Posts>(POSTS_COLLECTION)
      .countDocuments({ blogId: new ObjectId(blogId), postStatus: PostStatus.PUBLISHED });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    const cursor = db
      .collection<Posts>(POSTS_COLLECTION)
      .find({
        blogId: new ObjectId(blogId),
        ...(query && {
          $text: {
            $search: query,
          },
        }),
        ...(options?.status && {
          postStatus: options.status,
        }),
        ...(options?.categories && {
          'categories.name': {
            $in: options.categories.split(','),
          },
        })
      })
      .skip(docsToSkip)
      .limit(numDocsToReturn);

    if (options?.sort) {
      if (options.sort === 'latest') {
        cursor.sort({ updatedAt: -1 });
      } else if (options.sort === 'oldest') {
        cursor.sort({ updatedAt: 1 });
      }
    }

    const res = await cursor.toArray();

    return {
      currentPage,
      limit,
      totalItems,
      totalPages,
      items: res,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function editPost(postId: string, data: EditPostBody) {
  try {
    const cleanUpdates = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value !== undefined && key !== 'categories',
      ),
    );

    const res = await db.collection<Posts>(POSTS_COLLECTION).updateOne(
      {
        _id: new ObjectId(postId),
      },
      {
        $set: {
          ...cleanUpdates,
          updatedAt: new Date(),
        },
      },
    );

    if (data.categories) {
      const newCategories = data.categories.split(',');

      const newCategoriesData = await Promise.all(
        newCategories.map((category) => {
          return db
            .collection<Categories>(CATEGORIES_COLLECTION)
            .findOne({ name: category });
        }),
      );

      // add categories in posts
      await db.collection<Posts>(POSTS_COLLECTION).updateOne(
        {
          _id: new ObjectId(postId),
        },
        {
          $addToSet: {
            categories: {
              $each: newCategoriesData
                .map((category) => {
                  if (category) {
                    return { id: category._id, name: category.name };
                  }
                  return null;
                })
                .filter((item) => item != null),
            },
          },
        },
      );

      // add posts in categories document
      await db.collection<Categories>(CATEGORIES_COLLECTION).updateMany(
        {
          name: {
            $in: newCategories,
          },
        },
        {
          $push: {
            posts: {
              id: new ObjectId(postId),
            },
          },
        },
      );
    }

    return {
      success: res.acknowledged,
      editPostCount: res.modifiedCount,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function deletePost(postId: string) {
  try {
    await db.collection<Posts>(POSTS_COLLECTION).updateOne(
      {
        _id: new ObjectId(postId),
      },
      {
        $set: {
          postStatus: PostStatus.ARCHIVED,
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

export async function addCategoryToPost(
  postId: string,
  categoryId: string,
  categoryName: string,
) {
  const dbClient = db.getDBClient();
  const session = dbClient.startSession();
  try {
    session.startTransaction();

    await db.collection<Posts>(POSTS_COLLECTION).updateOne(
      {
        _id: new ObjectId(postId),
      },
      {
        $push: {
          categories: {
            id: new ObjectId(categoryId),
            name: categoryName,
          },
        },
      },
    );

    await db.collection<Categories>(CATEGORIES_COLLECTION).updateOne(
      {
        _id: new ObjectId(categoryId),
      },
      {
        $push: {
          posts: {
            id: new ObjectId(postId),
          },
        },
      },
    );

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

export async function removeCategoryFromPost(
  postId: string,
  categoryId: string,
) {
  const dbClient = db.getDBClient();
  const session = dbClient.startSession();
  try {
    session.startTransaction();

    await db.collection<Posts>(POSTS_COLLECTION).updateOne(
      {
        _id: new ObjectId(postId),
      },
      {
        $pull: {
          categories: {
            id: new ObjectId(categoryId),
          },
        },
      },
    );

    await db.collection<Categories>(CATEGORIES_COLLECTION).updateOne(
      {
        _id: new ObjectId(categoryId),
      },
      {
        $pull: {
          posts: {
            id: new ObjectId(postId),
          },
        },
      },
    );

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

export async function isPostSlugTaken(slug: string) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      slug,
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
