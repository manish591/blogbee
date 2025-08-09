import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import { createTag, deleteTag, editTag, getAllTags } from './tags.services';

export async function createTagHandler(req: Request, res: Response) {
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
    await createTag(userId, blogId, req.body, req.db);
    logger.info('CREATE_TAG_SUCCESS: Tag created successfully');

    res
      .status(StatusCodes.CREATED)
      .json(
        new APIResponse(
          'success',
          StatusCodes.CREATED,
          'Tag created successfully',
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

export async function getAllTagsHandler(req: Request, res: Response) {
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
    const data = await getAllTags(userId, blogId, req.db);
    logger.info('GET_ALL_TAGS_SUCCESS: Tags fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Tags fetched successfuly',
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

export async function editTagHandler(req: Request, res: Response) {
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
    const tagId = req.params.tagId;
    const blogId = req.params.blogId;
    await editTag(userId, blogId, tagId, req.body, req.db);
    logger.info('EDIT_TAG_SUCCESS: Edited tag successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse('success', StatusCodes.OK, 'Edited tag successfully'),
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

export async function deleteTagHandler(req: Request, res: Response) {
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
    const tagId = req.params.tagId;
    const blogId = req.params.blogId;
    await deleteTag(userId, blogId, tagId, req.db);
    logger.info('DELETE_TAG_SUCCESS: Deleted tag successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse('success', StatusCodes.OK, 'Deleted tag successfully'),
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
