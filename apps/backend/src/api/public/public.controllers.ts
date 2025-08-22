import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BlogbeeResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import { getBlogBySlug } from '../blogs/blogs.services';
import { getAllPosts, getPostBySlug } from '../posts/posts.services';
import { getBlogTags } from '../tags/tags.services';

export async function getPublicBlogDetailsHandler(req: Request, res: Response) {
  try {
    const blogSlug = req.query.blog as string;
    const blogData = await getBlogBySlug(blogSlug);

    if (!blogData) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new BlogbeeResponse('Blog not found'),
        );
      return;
    }

    const blogId = blogData._id.toString();
    const topBlogPosts = await getAllPosts(blogId);
    const allBlogTags = await getBlogTags(blogId);

    logger.info('EMBED_BLOG_SUCCESS: Blog data retrieved successfully');

    res.status(StatusCodes.OK).json(
      new BlogbeeResponse(
        'Blog data retrieved successfully',
        {
          blog: blogData,
          posts: topBlogPosts.items,
          tags: allBlogTags,
        },
      ),
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new BlogbeeResponse(
          'Internal server error occured',
        ),
      );
  }
}

export async function getPublicPostsListHandler(req: Request, res: Response) {
  try {
    const blogSlug = req.query.blog as string;
    const blogData = await getBlogBySlug(blogSlug);

    if (!blogData) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new BlogbeeResponse('Blog not found'),
        );
      return;
    }

    const blogId = blogData._id.toString();
    const q = (req.query.q as string) ?? '';
    const limit = (req.query.limit as string) ? Number(req.query.limit) : 10;
    const page = (req.query.page as string) ? Number(req.query.page) : 1;
    const postsData = await getAllPosts(blogId, q, page, limit);

    logger.info('GET_POSTS_LIST_SUCCESS: Fetching posts list for blog');

    res.status(StatusCodes.OK).json(
      new BlogbeeResponse(
        'Posts list fetched successfully',
        {
          blog: blogData,
          posts: postsData,
        },
      ),
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new BlogbeeResponse(
          'Internal server error occured',
        ),
      );
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
        .json(
          new BlogbeeResponse('Blog not found'),
        );
      return;
    }

    const blogId = blogData._id.toString();
    const postSlug = req.params.postSlug;
    const postData = await getPostBySlug(postSlug);

    if (!postData) {
      logger.error('NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new BlogbeeResponse('Post not found'),
        );
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
          new BlogbeeResponse(
            'Post does not belong to the specified blog',
          ),
        );
      return;
    }

    res.status(StatusCodes.OK).json(
      new BlogbeeResponse(
        'Post details fetched successfully',
        {
          blog: blogData,
          post: postData,
        },
      ),
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new BlogbeeResponse(
          'Internal server error occured',
        ),
      );
  }
}
