import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
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
    const blogId = req.params.blogId;
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

    const userId = userData.userId;
    const blogId = req.params.blogId;
    const data = await getAllPosts(userId, blogId, req.db);
    logger.info('GET_POST_SUCCESS: Posts fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Posts fetched successfully',
          data,
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

    const userId = userData.userId;
    const blogId = req.params.blogId;
    console.log(userId, blogId);

    res.send('Data');
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

    const userId = userData.userId;
    const blogId = req.params.blogId;
    const postId = req.params.postId;
    await editPost(userId, blogId, postId, req.body, req.db);
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

    const userId = userData.userId;
    const blogId = req.params.blogId;
    const postId = req.params.postId;
    await deletePost(userId, blogId, postId, req.db);
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
