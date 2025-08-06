import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { type Db, ObjectId } from 'mongodb';
import { dbClient } from '../../db';
import type { Blogs, Posts, Tags } from '../../db/schema';
import { AppError } from '../../utils/app-error';
import { logger } from '../../utils/logger';
import type {
  TCreateNewBlogRequestBody,
  TCreateNewTagRequestBody,
  TEditBlogRequestBody,
} from './blogs.schema';

export const BLOG_COLLECTION = 'blogs';
export const TAGS_COLLECTION = 'tags';
export const POSTS_COLLECTION = 'posts';

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
    const data = await db.collection<Blogs>(BLOG_COLLECTION).insertOne({
      userId: new ObjectId(userId),
      name: blogData.name,
      slug: blogData.slug,
      about: blogData.about,
      blogLogo: blogData.blogLogo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      isSuccess: data.acknowledged,
      blogId: data.insertedId,
    };
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function getBlog(userId: string, blogId: string, db: Db) {
  try {
    const blogData = await db.collection<Blogs>(BLOG_COLLECTION).findOne({
      userId: new ObjectId(userId),
      _id: new ObjectId(blogId),
    });

    return blogData;
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
          userId: new ObjectId(userId),
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

export async function editBlog(
  userId: string,
  blogId: string,
  blogData: TEditBlogRequestBody,
  db: Db,
) {
  try {
    await db.collection<Blogs>(BLOG_COLLECTION).updateOne(
      {
        _id: new ObjectId(blogId),
        userId: new ObjectId(userId),
      },
      {
        $set: blogData,
      },
    );
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function deleteBlog(userId: string, blogId: string, db: Db) {
  const session = dbClient.startSession();

  try {
    session.startTransaction();

    await db.collection<Blogs>(BLOG_COLLECTION).deleteOne({
      _id: new ObjectId(blogId),
      userId: new ObjectId(userId),
    });
    await db.collection<Tags>(TAGS_COLLECTION).deleteMany({
      blogId: new ObjectId(blogId),
      userId: new ObjectId(userId),
    });
    await db.collection<Posts>(POSTS_COLLECTION).deleteMany({
      blogId: new ObjectId(blogId),
      userId: new ObjectId(userId),
    });

    await session.commitTransaction();
    logger.info('Successfully deleted the blog data');
  } catch (err) {
    await session.abortTransaction();
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  } finally {
    await session.endSession();
  }
}

export async function createNewTag(
  userId: string,
  blogId: string,
  tagsData: TCreateNewTagRequestBody,
  db: Db,
) {
  try {
    const blogData = await db.collection<Tags>(TAGS_COLLECTION).insertOne({
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
      name: tagsData.name,
      description: tagsData.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return blogData.insertedId;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}

export async function getAllTags(userId: string, blogId: string, db: Db) {
  try {
    const allTagsData = db
      .collection<Tags>(TAGS_COLLECTION)
      .find({
        userId: new ObjectId(userId),
        blogId: new ObjectId(blogId),
      })
      .toArray();
    return allTagsData;
  } catch (err) {
    logger.error('An internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occured. Try again later!',
    });
  }
}
