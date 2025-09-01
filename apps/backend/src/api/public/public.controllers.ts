import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PostStatus } from '../../db/schema';
import { BlogbeeResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import { getBlogBySlug } from '../blogs/blogs.services';
import { getCategories } from '../categories/categories.services';
import { getPostById, getPostBySlug, getPosts } from '../posts/posts.services';
import type {
  GetPublicBlogQuery,
  GetPublicPostParms,
  GetPublicPostQuery,
  GetPublicPostsQuery,
  GetPublicPreviewPostParms,
  GetPublicPreviewPostQuery,
} from './public.schema';

export async function getPublicBlogDetailsHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    GetPublicBlogQuery
  >,
  res: Response,
) {
  try {
    const blogSlug = req.query.blog;
    const blogData = await getBlogBySlug(blogSlug);

    if (!blogData) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    logger.info(
      'GET_PUBLIC_BLOG_DATA_SUCCESS: Blog data retrieved successfully',
    );
    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Blog data retrieved successfully', blogData));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getPublicPostsListHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    GetPublicPostsQuery
  >,
  res: Response,
) {
  try {
    const blogSlug = req.query.blog;
    const blogData = await getBlogBySlug(blogSlug);

    if (!blogData) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const blogId = blogData._id.toString();
    const queryParams = req.query;
    const query = queryParams.query;
    const limit = queryParams.limit ? Number(queryParams.limit) : 10;
    const page = queryParams.page ? Number(queryParams.page) : 1;
    const category = queryParams.category;
    const postsData = await getPosts(blogId, {
      query,
      limit,
      page,
      categories: category,
      status: PostStatus.PUBLISHED,
    });

    logger.info('SUCCESS: Posts list fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Posts list fetched successfully', postsData));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getPublicPostDetailsHandler(
  req: Request<
    GetPublicPostParms,
    Record<string, unknown>,
    Record<string, unknown>,
    GetPublicPostQuery
  >,
  res: Response,
) {
  try {
    const blogSlug = req.query.blog;
    const blogData = await getBlogBySlug(blogSlug);

    if (!blogData) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const blogId = blogData._id.toString();
    const postSlug = req.params.postSlug;
    const postData = await getPostBySlug(postSlug);

    if (
      !postData ||
      postData.postStatus === PostStatus.DRAFT ||
      postData.postStatus === PostStatus.ARCHIVED
    ) {
      logger.error('NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const isPostBelongsToBlog = postData.blogId.toString() === blogId;

    if (!isPostBelongsToBlog) {
      logger.error(
        'FORBIDDEN_ERROR: Post does not belong to the specified blog',
      );
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse('Post does not belong to the specified blog'),
        );
      return;
    }

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Post details fetched successfully', postData));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getPublicPreviewPostHandler(
  req: Request<
    GetPublicPreviewPostParms,
    Record<string, unknown>,
    Record<string, unknown>,
    GetPublicPreviewPostQuery
  >,
  res: Response,
) {
  try {
    const blogSlug = req.query.blog;
    const blogData = await getBlogBySlug(blogSlug);

    if (!blogData) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const blogId = blogData._id.toString();
    const postId = req.params.postId;
    const postData = await getPostById(postId);

    if (!postData || postData.postStatus === PostStatus.ARCHIVED) {
      logger.error('NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const isPostBelongsToBlog = postData.blogId.toString() === blogId;

    if (!isPostBelongsToBlog) {
      logger.error(
        'FORBIDDEN_ERROR: Post does not belong to the specified blog',
      );
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse('Post does not belong to the specified blog'),
        );
      return;
    }

    res
      .status(StatusCodes.OK)
      .json(
        new BlogbeeResponse(
          'Post preview details fetched successfully',
          postData,
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getPublicCategoriesHandler(req: Request, res: Response) {
  try {
    const blogSlug = req.query.blog as string;
    const blogData = await getBlogBySlug(blogSlug);

    if (!blogData) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const blogId = blogData._id.toString();
    const allCategories = await getCategories(blogId);

    res
      .status(StatusCodes.OK)
      .json(
        new BlogbeeResponse('Categories fetched successfully', allCategories),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}
