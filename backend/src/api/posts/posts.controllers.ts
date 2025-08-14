import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '../../utils/api-response';
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
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const userId = userData.userId;
    const blogId = req.body.blogId;
    const isBlogExists = await getBlogById(blogId, req.db);

    if (!isBlogExists) {
      logger.error('BLOG_NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse('error', StatusCodes.NOT_FOUND, 'Blog not found'),
        );
      return;
    }

    const isUserOwner = await isBlogOwnedByUser(userId, blogId, req.db);

    if (!isUserOwner) {
      logger.error('FORBIDDEN_ERROR: Blog does not belong to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permission to add post in this blog',
          ),
        );
      return;
    }

    await createPost(userId, blogId, req.db);
    logger.info('CREATE_POST_SUCCESS: Post created successfully');

    res
      .status(StatusCodes.CREATED)
      .json(
        new APIResponse(
          'success',
          StatusCodes.CREATED,
          'Post created successfully',
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function getAllPostsHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const blogId = req.query.blogId as string;
    const isBlogExists = await getBlogById(blogId, req.db);

    if (!isBlogExists) {
      logger.error('BLOG_NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse('error', StatusCodes.NOT_FOUND, 'Blog not found'),
        );
      return;
    }

    const userId = userData.userId;
    const ownsBlog = await isBlogOwnedByUser(userId, blogId, req.db);

    if (!ownsBlog) {
      logger.error('FORBIDDEN_ERROR: Blog does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to read the posts content',
          ),
        );
      return;
    }

    const q = req.query.q as string ?? "";
    const limit = req.query.limit as string ? Number(req.query.limit) : 10;
    const page = req.query.page as string ? Number(req.query.page) : 1;
    const postsData = await getAllPosts(
      blogId,
      req.db,
      q,
      Number(page),
      Number(limit),
    );
    logger.info('GET_POST_SUCCESS: Posts fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Posts fetched successfully',
          postsData,
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function getPostByIdHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const postId = req.params.postId;
    const postData = await getPostById(postId, req.db);

    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse('error', StatusCodes.NOT_FOUND, 'Post not found'),
        );
      return;
    }

    const userId = userData.userId;
    const ownsPost = await isPostOwnedByUser(userId, postId, req.db);

    if (!ownsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to read the post content',
          ),
        );
      return;
    }

    logger.info('GET_POST_BY_ID_SUCCESS: Post data returned successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Post data returned successfully',
          postData,
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function editPostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const postId = req.params.postId;
    const postData = await getPostById(postId, req.db);

    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse('error', StatusCodes.NOT_FOUND, 'Post not found'),
        );
      return;
    }

    const userId = userData.userId;
    const ownsPost = await isPostOwnedByUser(userId, postId, req.db);

    if (!ownsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to edit the post',
          ),
        );
      return;
    }

    await editPost(postId, req.body, req.db);
    logger.info('EDIT_POST_SUCCESS: Posts edited successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse('success', StatusCodes.OK, 'Posts edited successfully'),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function deletePostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const postId = req.params.postId;
    const postData = await getPostById(postId, req.db);

    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse('error', StatusCodes.NOT_FOUND, 'Post not found'),
        );
      return;
    }

    const userId = userData.userId;
    const ownsPost = await isPostOwnedByUser(userId, postId, req.db);

    if (!ownsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to delete the post',
          ),
        );
      return;
    }

    await deletePost(postId, req.db);
    logger.info('DELETE_POST_SUCCESS: Posts deleted successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Posts deleted successfully',
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function addTagToPostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const postId = req.params.postId;
    const tagId = req.params.tagId;
    const userId = userData.userId;

    const postData = await getPostById(postId, req.db);
    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse('error', StatusCodes.NOT_FOUND, 'Post not found'),
        );
      return;
    }

    const tagData = await getTagById(tagId, req.db);
    if (!tagData) {
      logger.error('NOT_FOUND_ERROR: Tag not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new APIResponse('error', StatusCodes.NOT_FOUND, 'Tag not found'));
      return;
    }

    const userOwnsPost = await isPostOwnedByUser(userId, postId, req.db);
    if (!userOwnsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to add tag to this post',
          ),
        );
      return;
    }

    const containsTag = await isPostContainsTag(postId, tagId, req.db);
    if (containsTag) {
      logger.error('CONFLICT_ERROR: Post already contains this tag');
      res
        .status(StatusCodes.CONFLICT)
        .json(
          new APIResponse(
            'error',
            StatusCodes.CONFLICT,
            'Post already contains this tag',
          ),
        );
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
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'The post and tag must belong to the same blog',
          ),
        );
      return;
    }

    await addTagToPost(postId, tagId, req.db);
    logger.info('ADD_TAG_TO_POST_SUCCESS: Tag added to post successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Tag added to post successfully',
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function removeTagFromPostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const postId = req.params.postId;
    const tagId = req.params.tagId;
    const userId = userData.userId;

    const postData = await getPostById(postId, req.db);
    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse('error', StatusCodes.NOT_FOUND, 'Post not found'),
        );
      return;
    }

    const tagData = await getTagById(tagId, req.db);
    if (!tagData) {
      logger.error('NOT_FOUND_ERROR: Tag not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new APIResponse('error', StatusCodes.NOT_FOUND, 'Tag not found'));
      return;
    }

    const userOwnsPost = await isPostOwnedByUser(userId, postId, req.db);
    if (!userOwnsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to delete the tag from this post',
          ),
        );
      return;
    }

    const containsTag = await isPostContainsTag(postId, tagId, req.db);
    if (!containsTag) {
      logger.error('NOT_FOUND_ERROR: Post does not contains this tag');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse(
            'error',
            StatusCodes.NOT_FOUND,
            'Post does not contains this tag',
          ),
        );
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
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'The post and tag must belong to the same blog',
          ),
        );
      return;
    }

    await removeTagFromPost(postId, tagId, req.db);
    logger.info(
      'REMOVE_TAG_FROM_POST_SUCCESS: Tag removed from post successfully',
    );

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Tag removed from post successfully',
        ),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}
