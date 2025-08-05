import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { Db } from 'mongodb';
import type { Blogs } from '../../db/schema';
import { AppError } from '../../utils/app-error';
import { logger } from '../../utils/logger';
import type { TCreateNewBlogRequestBody } from './blogs.schema';

export const BLOG_COLLECTION = 'blogs';

export async function isSlugTaken(slug: string, db: Db) {
  try {
    const isBlogFound = await db.collection<Blogs>('blogs').findOne({
      slug,
    });

    return isBlogFound !== null;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function createNewBlog(
  userId: string,
  blogData: TCreateNewBlogRequestBody,
  db: Db,
) {
  try {
    await db.collection<Blogs>(BLOG_COLLECTION).insertOne({
      userId,
      name: blogData.name,
      slug: blogData.slug,
      about: blogData.about,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function getAllBlogs(
  userId: string,
  db: Db,
  query: string = '',
  page: number = 0,
  limit: number = 10,
) {
  try {
    const allBlogs = db
      .collection<Blogs>(BLOG_COLLECTION)
      .find(
        {
          userId,
          slug: {
            $regex: query,
            $options: 'i',
          },
        },
        {
          skip: page,
          limit,
        },
      )
      .toArray();
    return allBlogs;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}
