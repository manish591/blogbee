import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BlogbeeResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import { getBlogById, isBlogOwnedByUser } from '../blogs/blogs.services';
import { getTagById } from '../tags/tags.services';
import {
  addTagToPost,
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPostById,
  isPostContainsTag,
  isPostOwnedByUser,
  removeTagFromPost,
} from './posts.services';

export async function createPostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const userId = userData.userId;
    const blogId = req.body.blogId;
    const isBlogExists = await getBlogById(blogId);

    if (!isBlogExists) {
      logger.error('BLOG_NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const isUserOwner = await isBlogOwnedByUser(userId, blogId);

    if (!isUserOwner) {
      logger.error('FORBIDDEN_ERROR: Blog does not belong to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permission to add post in this blog',
          ),
        );
      return;
    }

    const createdPostData = await createPost(userId, blogId);
    logger.info('CREATE_POST_SUCCESS: Post created successfully');

    res.status(StatusCodes.CREATED).json(
      new BlogbeeResponse('Post created successfully', {
        id: createdPostData.postId,
      }),
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getAllPostsHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const blogId = req.query.blogId as string;
    const isBlogExists = await getBlogById(blogId);

    if (!isBlogExists) {
      logger.error('BLOG_NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const userId = userData.userId;
    const ownsBlog = await isBlogOwnedByUser(userId, blogId);

    if (!ownsBlog) {
      logger.error('FORBIDDEN_ERROR: Blog does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to read the posts content',
          ),
        );
      return;
    }

    const query = (req.query.query as string) ?? '';
    const limit = (req.query.limit as string) ? Number(req.query.limit) : 10;
    const page = (req.query.page as string) ? Number(req.query.page) : 1;
    const postsData = await getAllPosts(blogId, query, Number(page), Number(limit));
    logger.info('GET_POST_SUCCESS: Posts fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Posts fetched successfully', postsData));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getPostByIdHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const postId = req.params.postId;
    const postData = await getPostById(postId);

    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const userId = userData.userId;
    const ownsPost = await isPostOwnedByUser(userId, postId);

    if (!ownsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to read the post content',
          ),
        );
      return;
    }

    logger.info('GET_POST_BY_ID_SUCCESS: Post data returned successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Post data returned successfully', postData));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function editPostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const postId = req.params.postId;
    const postData = await getPostById(postId);

    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const userId = userData.userId;
    const ownsPost = await isPostOwnedByUser(userId, postId);

    if (!ownsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse('You do not have permissions to edit the post'),
        );
      return;
    }

    await editPost(postId, req.body);
    logger.info('EDIT_POST_SUCCESS: Posts edited successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Posts edited successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function deletePostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const postId = req.params.postId;
    const postData = await getPostById(postId);

    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const userId = userData.userId;
    const ownsPost = await isPostOwnedByUser(userId, postId);

    if (!ownsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse('You do not have permissions to delete the post'),
        );
      return;
    }

    await deletePost(postId);
    logger.info('DELETE_POST_SUCCESS: Posts deleted successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Posts deleted successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function addTagToPostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const postId = req.params.postId;
    const tagId = req.params.tagId;
    const userId = userData.userId;

    const postData = await getPostById(postId);
    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const tagData = await getTagById(tagId);
    if (!tagData) {
      logger.error('NOT_FOUND_ERROR: Tag not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Tag not found'));
      return;
    }

    const userOwnsPost = await isPostOwnedByUser(userId, postId);
    if (!userOwnsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to add tag to this post',
          ),
        );
      return;
    }

    const containsTag = await isPostContainsTag(postId, tagId);
    if (containsTag) {
      logger.error('CONFLICT_ERROR: Post already contains this tag');
      res
        .status(StatusCodes.CONFLICT)
        .json(new BlogbeeResponse('Post already contains this tag'));
      return;
    }

    const isPostAndTagFromSameBlog =
      postData.blogId.toString() === tagData.blogId.toString();
    if (!isPostAndTagFromSameBlog) {
      logger.error(
        'FORBIDDEN_ERROR: The post and tag must belong to the same blog',
      );
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse('The post and tag must belong to the same blog'),
        );
      return;
    }

    await addTagToPost(postId, tagId);
    logger.info('ADD_TAG_TO_POST_SUCCESS: Tag added to post successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Tag added to post successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function removeTagFromPostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const postId = req.params.postId;
    const tagId = req.params.tagId;
    const userId = userData.userId;

    const postData = await getPostById(postId);
    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const tagData = await getTagById(tagId);
    if (!tagData) {
      logger.error('NOT_FOUND_ERROR: Tag not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Tag not found'));
      return;
    }

    const userOwnsPost = await isPostOwnedByUser(userId, postId);
    if (!userOwnsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to delete the tag from this post',
          ),
        );
      return;
    }

    const containsTag = await isPostContainsTag(postId, tagId);
    if (!containsTag) {
      logger.error('NOT_FOUND_ERROR: Post does not contains this tag');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post does not contains this tag'));
      return;
    }

    const isPostAndTagFromSameBlog =
      postData.blogId.toString() === tagData.blogId.toString();
    if (!isPostAndTagFromSameBlog) {
      logger.error(
        'FORBIDDEN_ERROR: The post and tag must belong to the same blog',
      );
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse('The post and tag must belong to the same blog'),
        );
      return;
    }

    await removeTagFromPost(postId, tagId);
    logger.info(
      'REMOVE_TAG_FROM_POST_SUCCESS: Tag removed from post successfully',
    );

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Tag removed from post successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}
