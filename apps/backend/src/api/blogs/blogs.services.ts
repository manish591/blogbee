import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import * as db from '../../db';
import type { Blogs, Categories, Posts } from '../../db/schema';
import { BlogbeeError } from '../../utils/app-error';
import { logger } from '../../utils/logger';
import { POSTS_COLLECTION } from '../posts/posts.services';
import type { CreateBlogBody, EditBlogBody } from './blogs.schema';
import { CATEGORIES_COLLECTION } from '../categories/categories.services';

export const BLOG_COLLECTION = 'blogs';

export async function isSlugTaken(slug: string) {
  try {
    const res = await db.collection<Blogs>('blogs').findOne({
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

export async function createBlog(userId: string, data: CreateBlogBody) {
  try {
    const res = await db.collection<Blogs>(BLOG_COLLECTION).insertOne({
      _id: new ObjectId(),
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
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function getBlogById(blogId: string) {
  try {
    const res = await db.collection<Blogs>(BLOG_COLLECTION).findOne({
      _id: new ObjectId(blogId),
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

export async function getBlogBySlug(slug: string) {
  try {
    const res = await db.collection<Blogs>(BLOG_COLLECTION).findOne({
      slug,
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

export async function getAllBlogsByUser(
  userId: string,
  options?: {
    query?: string,
    page?: number,
    limit?: number,
    sort?: "latest" | "oldest"
  }
) {
  try {
    const query = options?.query ?? "";
    const limit = options?.limit ?? 10;
    const page = options?.page ?? 1;
    const sort = options?.sort;
    const docsToSkip = (page - 1) * limit;
    const docsToInclude = limit;
    const totalItems = await db
      .collection<Blogs>(BLOG_COLLECTION)
      .countDocuments({ userId: new ObjectId(userId) });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    const cursor = db.collection<Blogs>(BLOG_COLLECTION).aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          ...(query && {
            $text: {
              $search: query,
            },
          }),
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "blogId",
          pipeline: [
            {
              $group: { _id: "$blogId", total: { $sum: 1 } }
            }
          ],
          as: "posts"
        }
      },
      {
        $addFields: {
          postsCount: {
            $ifNull: [{ $arrayElemAt: ["$posts.total", 0] }, 0]
          }
        }
      },
      {
        $limit: docsToInclude
      },
      {
        $skip: docsToSkip
      }
    ]);

    if (sort) {
      if (sort === 'latest') {
        cursor.sort({
          createdAt: -1,
        });
      } else if (sort === 'oldest') {
        cursor.sort({
          createdAt: 1,
        });
      }
    }

    const res = await cursor.toArray();
    return {
      currentPage,
      limit,
      totalItems,
      totalPages,
      items: res
    };
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function editBlog(blogId: string, data: EditBlogBody) {
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
    throw new BlogbeeError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal server error occured',
    );
  }
}

export async function deleteBlog(blogId: string) {
  const dbClient = db.getDBClient();
  const session = dbClient.startSession();

  try {
    session.startTransaction();

    const deleteBlogResult = await db
      .collection<Blogs>(BLOG_COLLECTION)
      .deleteOne({
        _id: new ObjectId(blogId),
      });
    const deletedCategoriesResult = await db
      .collection<Categories>(CATEGORIES_COLLECTION)
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
      deleteCategoriesCount: deletedCategoriesResult.deletedCount,
    };
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

export async function isBlogOwnedByUser(userId: string, blogId: string) {
  try {
    const res = await db.collection<Blogs>(BLOG_COLLECTION).findOne({
      _id: new ObjectId(blogId),
      userId: new ObjectId(userId),
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
