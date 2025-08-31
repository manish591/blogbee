import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BlogbeeResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import { getBlogBySlug } from '../blogs/blogs.services';
import { getCategories } from '../categories/categories.services';
import { getPostBySlug, getPosts } from '../posts/posts.services';
import type { GetPublicPostsQuery } from './public.schema';

export async function getPublicBlogDetailsHandler(req: Request, res: Response) {
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
    const topBlogPosts = await getPosts(blogId, {
      "sort": "latest"
    });
    const allBlogCategories = await getCategories(blogId);

    logger.info('EMBED_BLOG_SUCCESS: Blog data retrieved successfully');

    res.status(StatusCodes.OK).json(
      new BlogbeeResponse('Blog data retrieved successfully', {
        blog: blogData,
        posts: topBlogPosts.items,
        categories: allBlogCategories,
      }),
    );
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
    });

    logger.info('GET_POSTS_LIST_SUCCESS: Fetching posts list for blog');

    res.status(StatusCodes.OK).json(
      new BlogbeeResponse('Posts list fetched successfully', postsData),
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getPublicPostDetailsHandler(req: Request, res: Response) {
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
    const postSlug = req.params.postSlug;
    const postData = await getPostBySlug(postSlug);

    if (!postData) {
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

    res.status(StatusCodes.OK).json(
      new BlogbeeResponse('Post details fetched successfully', postData),
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}
