import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import { getBlogById, isBlogOwnedByUser } from '../blogs/blogs.services';
import {
  createTag,
  deleteTag,
  editTag,
  getBlogTags,
  getTagById,
  isTagOwnedByUser,
} from './tags.services';

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

    const blogId = req.body.blogId;
    const isExists = await getBlogById(blogId, req.db);

    if (!isExists) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse('error', StatusCodes.NOT_FOUND, 'Blog not found'),
        );
      return;
    }

    const userId = userData.userId;
    const isUserOwner = await isBlogOwnedByUser(userId, blogId, req.db);

    if (!isUserOwner) {
      logger.error('FORBIDDEN_ERROR: Blog does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to create the tag in this blog',
          ),
        );
      return;
    }

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

export async function getBlogTagsHandler(req: Request, res: Response) {
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
    const isExists = await getBlogById(blogId, req.db);

    if (!isExists) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new APIResponse('error', StatusCodes.NOT_FOUND, 'Blog not found'),
        );
      return;
    }

    const userId = userData.userId;
    const isUserOwner = await isBlogOwnedByUser(userId, blogId, req.db);

    if (!isUserOwner) {
      logger.error('FORBIDDEN_ERROR: Blog does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to read the content of the tags',
          ),
        );
      return;
    }

    const data = await getBlogTags(blogId, req.db);
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

    const tagId = req.params.tagId;
    const tagData = await getTagById(tagId, req.db);

    if (!tagData) {
      logger.error('NOT_FOUND_ERROR: Tag not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new APIResponse('error', StatusCodes.NOT_FOUND, 'Tag not found'));
      return;
    }

    const userId = userData.userId;
    const ownsTag = await isTagOwnedByUser(userId, tagId, req.db);

    if (!ownsTag) {
      logger.error('FORBIDDEN_ERROR: Tag does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to edit the content of the tags',
          ),
        );
      return;
    }

    await editTag(tagId, req.body, req.db);
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

    const tagId = req.params.tagId;
    const tagData = await getTagById(tagId, req.db);

    if (!tagData) {
      logger.error('NOT_FOUND_ERROR: Tag not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new APIResponse('error', StatusCodes.NOT_FOUND, 'Tag not found'));
      return;
    }

    const userId = userData.userId;
    const ownsTag = await isTagOwnedByUser(userId, tagId, req.db);

    if (!ownsTag) {
      logger.error('FORBIDDEN_ERROR: Tag does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new APIResponse(
            'error',
            StatusCodes.FORBIDDEN,
            'You do not have permissions to delete the content of the tags',
          ),
        );
      return;
    }

    await deleteTag(tagId, req.db);
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
