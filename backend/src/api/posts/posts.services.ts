import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { type Db, ObjectId } from 'mongodb';
import { PostStatus, type Posts } from '../../db/schema';
import { AppError } from '../../utils/app-error';
import { POSTS_COLLECTION } from '../../utils/constants';
import { logger } from '../../utils/logger';
import type { TEditPostBody } from './posts.schema';

export async function createPost(userId: string, blogId: string, db: Db) {
  try {
    await db.collection<Posts>(POSTS_COLLECTION).insertOne({
      title: 'untitled',
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
      postStatus: PostStatus.DRAFT,
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

export async function getPostById(
  userId: string,
  blogId: string,
  postId: string,
  db: Db,
) {
  try {
    const res = await db.collection<Posts>(POSTS_COLLECTION).findOne({
      _id: new ObjectId(postId),
      userId: new ObjectId(userId),
      blogId: new ObjectId(blogId),
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
  userId: string,
  blogId: string,
  db: Db,
  search: string = '',
  filter: string = '',
  page: number = 1,
  limit: number = 10,
) {
  try {
    const docsToSkip = (page - 1) * limit;
    const numDocsToReturn = limit;
    const allTagIds = filter.split(',').map((tagId) => new ObjectId(tagId));

    const res = db
      .collection<Posts>(POSTS_COLLECTION)
      .find({
        userId: new ObjectId(userId),
        blogId: new ObjectId(blogId),
        $text: {
          $search: search,
        },
        tags: {
          $all: allTagIds,
        },
      })
      .skip(docsToSkip)
      .limit(numDocsToReturn);
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

export async function editPost(
  userId: string,
  blogId: string,
  postId: string,
  postData: TEditPostBody,
  db: Db,
) {
  try {
    const tagIds = postData.tags?.map((tag) => new ObjectId(tag));

    await db.collection<Posts>(POSTS_COLLECTION).updateOne(
      {
        _id: new ObjectId(postId),
        userId: new ObjectId(userId),
        blogId: new ObjectId(blogId),
      },
      {
        $set: {
          ...postData,
          tags: tagIds,
          updatedAt: new Date(),
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

export async function deletePost(
  userId: string,
  blogId: string,
  postId: string,
  db: Db,
) {
  try {
    await db.collection<Posts>(POSTS_COLLECTION).updateOne(
      {
        _id: new ObjectId(postId),
        userId: new ObjectId(userId),
        blogId: new ObjectId(blogId),
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
