import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { type Db, ObjectId } from 'mongodb';
import { dbClient } from '../../db';
import type { Blogs, Posts, Tags } from '../../db/schema';
import { AppError } from '../../utils/app-error';
import {
  BLOG_COLLECTION,
  POSTS_COLLECTION,
  TAGS_COLLECTION,
} from '../../utils/constants';
import { logger } from '../../utils/logger';
import type { TCreateBlogBody, TEditBlogBody } from './blogs.schema';

export async function isSlugTaken(slug: string, db: Db) {
  try {
    const res = await db.collection<Blogs>('blogs').findOne({
      slug,
    });
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

export async function createBlog(
  userId: string,
  data: TCreateBlogBody,
  db: Db,
) {
  try {
    const res = await db.collection<Blogs>(BLOG_COLLECTION).insertOne({
      userId: new ObjectId(userId),
      name: data.name,
      slug: data.slug,
      about: data.about ? data.about : null,
      logo: data.logo ? data.logo : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return {
      success: res.acknowledged,
      blogId: res.insertedId,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function getBlogById(blogId: string, db: Db) {
  try {
    const res = await db.collection<Blogs>(BLOG_COLLECTION).findOne({
      _id: new ObjectId(blogId),
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

export async function getBlogBySlug(slug: string, db: Db) {
  try {
    const res = await db.collection<Blogs>(BLOG_COLLECTION).findOne({
      slug,
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

export async function getAllBlogsByUser(
  userId: string,
  db: Db,
  q: string = '',
  page: number = 1,
  limit: number = 10,
) {
  try {
    const docsToSkip = (page - 1) * limit;
    const docsToInclude = limit;

    const res = await db
      .collection<Blogs>(BLOG_COLLECTION)
      .find({
        userId: new ObjectId(userId),
        ...(q && {
          $text: {
            $search: q,
          },
        }),
      })
      .skip(docsToSkip)
      .limit(docsToInclude)
      .toArray();
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

export async function editBlog(blogId: string, data: TEditBlogBody, db: Db) {
  try {
    const cleanUpdates = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => !!value),
    );
    const res = await db.collection<Blogs>(BLOG_COLLECTION).updateOne(
      {
        _id: new ObjectId(blogId),
      },
      {
        $set: {
          ...cleanUpdates,
          updatedAt: new Date(),
        },
      },
    );
    return {
      success: res.acknowledged,
      editedCount: res.modifiedCount,
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function deleteBlog(blogId: string, db: Db) {
  const session = dbClient.startSession();

  try {
    session.startTransaction();

    const deleteBlogResult = await db
      .collection<Blogs>(BLOG_COLLECTION)
      .deleteOne({
        _id: new ObjectId(blogId),
      });
    const deleteTagsResult = await db
      .collection<Tags>(TAGS_COLLECTION)
      .deleteMany({
        blogId: new ObjectId(blogId),
      });
    const deletePostsResult = await db
      .collection<Posts>(POSTS_COLLECTION)
      .deleteMany({
        blogId: new ObjectId(blogId),
      });

    await session.commitTransaction();
    return {
      sucesss: true,
      deleteBlogCount: deleteBlogResult.deletedCount,
      deletePostCount: deletePostsResult.deletedCount,
      deleteTagCount: deleteTagsResult.deletedCount,
    };
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

export async function isBlogOwnedByUser(
  userId: string,
  blogId: string,
  db: Db,
) {
  try {
    const res = await db.collection<Blogs>(BLOG_COLLECTION).findOne({
      _id: new ObjectId(blogId),
      userId: new ObjectId(userId),
    });
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
