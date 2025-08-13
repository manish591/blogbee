import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { type Db, ObjectId } from 'mongodb';
import { dbClient } from '../../db';
import { PostStatus, type Posts, type Tags } from '../../db/schema';
import { AppError } from '../../utils/app-error';
import { POSTS_COLLECTION, TAGS_COLLECTION } from '../../utils/constants';
import { logger } from '../../utils/logger';
import type { TEditPostBody } from './posts.schema';

export async function createPost(userId: string, blogId: string, db: Db) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).insertOne({
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
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function getPostById(postId: string, db: Db) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      _id: new ObjectId(postId),
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

export async function getPostBySlug(postSlug: string, db: Db) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      slug: postSlug,
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

export async function getAllPosts(
  blogId: string,
  db: Db,
  q: string = '',
  page: number = 1,
  limit: number = 10,
) {
  try {
    const docsToSkip = (page - 1) * limit;
    const numDocsToReturn = limit;

    const res = db
      .collection<Posts>(POSTS_COLLECTION)
      .find({
        blogId: new ObjectId(blogId),
        ...(q && {
          $text: {
            $search: q,
          },
        }),
      })
      .skip(docsToSkip)
      .limit(numDocsToReturn)
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

export async function editPost(postId: string, data: TEditPostBody, db: Db) {
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
      editPostCount: res.modifiedCount
    }
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function deletePost(postId: string, db: Db) {
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
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function isPostSlugAvailable(
  userId: string,
  blogId: string,
  slug: string,
  db: Db,
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
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function isPostOwnedByUser(
  userId: string,
  postId: string,
  db: Db,
) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      _id: new ObjectId(postId),
      userId: new ObjectId(userId),
    });
    return res != null;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}

export async function addTagToPost(postId: string, tagId: string, db: Db) {
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
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  } finally {
    await session.endSession();
  }
}

export async function removeTagFromPost(postId: string, tagId: string, db: Db) {
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
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  } finally {
    await session.endSession();
  }
}

export async function isPostContainsTag(postId: string, tagId: string, db: Db) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      _id: new ObjectId(postId),
      tags: new ObjectId(tagId),
    });
    return res != null;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}
