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
    await db.collection<Blogs>(BLOG_COLLECTION).insertOne({
      userId: new ObjectId(userId),
      name: data.name,
      slug: data.slug,
      about: data.about,
      logo: data.logo,
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
      slug
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
      .find(
        {
          userId: new ObjectId(userId),
          ...(q && {
            $text: {
              $search: q
            }
          })
        }
      ).skip(docsToSkip).limit(docsToInclude)
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

export async function editBlog(
  blogId: string,
  data: TEditBlogBody,
  db: Db,
) {
  try {
    const cleanUpdates = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null));
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

export async function deleteBlog(blogId: string, db: Db) {
  const session = dbClient.startSession();

  try {
    session.startTransaction();

    await db.collection<Blogs>(BLOG_COLLECTION).deleteOne({
      _id: new ObjectId(blogId),
    });
    await db.collection<Tags>(TAGS_COLLECTION).deleteMany({
      blogId: new ObjectId(blogId),
    });
    await db.collection<Posts>(POSTS_COLLECTION).deleteMany({
      blogId: new ObjectId(blogId),
    });

    await session.commitTransaction();
    return {
      isDeleted: true,
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

export async function isBlogOwnedByUser(userId: string, blogId: string, db: Db) {
  try {
    const res = await db.collection<Blogs>(BLOG_COLLECTION).findOne({
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId)
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