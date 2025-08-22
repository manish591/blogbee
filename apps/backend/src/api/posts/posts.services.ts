import * as db from "../../db";
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { PostStatus, type Posts, type Tags } from '../../db/schema';
import { BlogbeeError } from '../../utils/app-error';
import { logger } from '../../utils/logger';
import type { TEditPostBody } from './posts.schema';
import { TAGS_COLLECTION } from "../tags/tags.services";

export const POSTS_COLLECTION = "posts";

export async function createPost(userId: string, blogId: string) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).insertOne({
      _id: new ObjectId(),
      title: 'untitled',
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
      postStatus: PostStatus.DRAFT,
      tags: [],
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

export async function getAllPosts(
  blogId: string,
  q: string = '',
  page: number = 1,
  limit: number = 10,
) {
  try {
    const docsToSkip = (page - 1) * limit;
    const numDocsToReturn = limit;
    const totalItems = await db
      .collection<Posts>(POSTS_COLLECTION)
      .countDocuments({ blogId: new ObjectId(blogId) });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    const res = await db
      .collection<Posts>(POSTS_COLLECTION)
      .find({
        blogId: new ObjectId(blogId),
        ...(q && {
          $text: {
            $search: q,
          },
        }),
      })
      .sort({ updatedAt: -1 })
      .skip(docsToSkip)
      .limit(numDocsToReturn)
      .toArray();
    return {
      currentPage,
      limit,
      totalItems,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
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

export async function editPost(postId: string, data: TEditPostBody) {
  try {
    const cleanUpdates = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => !!value),
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

export async function isPostOwnedByUser(
  userId: string,
  postId: string,
) {
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

export async function addTagToPost(postId: string, tagId: string) {
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
          tags: new ObjectId(tagId),
        },
      },
    );

    await db.collection<Tags>(TAGS_COLLECTION).updateOne(
      {
        _id: new ObjectId(tagId),
      },
      {
        $push: {
          posts: new ObjectId(postId),
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

export async function removeTagFromPost(postId: string, tagId: string) {
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
          tags: new ObjectId(tagId),
        },
      },
    );

    await db.collection<Tags>(TAGS_COLLECTION).updateOne(
      {
        _id: new ObjectId(tagId),
      },
      {
        $pull: {
          posts: new ObjectId(postId),
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

export async function isPostContainsTag(postId: string, tagId: string,) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      _id: new ObjectId(postId),
      tags: new ObjectId(tagId),
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
