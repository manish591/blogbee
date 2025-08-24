import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BlogbeeResponse } from '../../utils/api-response';
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
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const blogId = req.body.blogId;
    const isExists = await getBlogById(blogId);

    if (!isExists) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const userId = userData.userId;
    const isUserOwner = await isBlogOwnedByUser(userId, blogId);

    if (!isUserOwner) {
      logger.error('FORBIDDEN_ERROR: Blog does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to create the tag in this blog',
          ),
        );
      return;
    }

    await createTag(userId, blogId, req.body);
    logger.info('CREATE_TAG_SUCCESS: Tag created successfully');

    res
      .status(StatusCodes.CREATED)
      .json(new BlogbeeResponse('Tag created successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getBlogTagsHandler(req: Request, res: Response) {
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
    const isExists = await getBlogById(blogId);

    if (!isExists) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const userId = userData.userId;
    const isUserOwner = await isBlogOwnedByUser(userId, blogId);

    if (!isUserOwner) {
      logger.error('FORBIDDEN_ERROR: Blog does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to read the content of the tags',
          ),
        );
      return;
    }

    const data = await getBlogTags(blogId);
    logger.info('GET_ALL_TAGS_SUCCESS: Tags fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Tags fetched successfuly', data));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function editTagHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const tagId = req.params.tagId;
    const tagData = await getTagById(tagId);

    if (!tagData) {
      logger.error('NOT_FOUND_ERROR: Tag not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Tag not found'));
      return;
    }

    const userId = userData.userId;
    const ownsTag = await isTagOwnedByUser(userId, tagId);

    if (!ownsTag) {
      logger.error('FORBIDDEN_ERROR: Tag does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to edit the content of the tags',
          ),
        );
      return;
    }

    await editTag(tagId, req.body);
    logger.info('EDIT_TAG_SUCCESS: Edited tag successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Edited tag successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function deleteTagHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const tagId = req.params.tagId;
    const tagData = await getTagById(tagId);

    if (!tagData) {
      logger.error('NOT_FOUND_ERROR: Tag not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Tag not found'));
      return;
    }

    const userId = userData.userId;
    const ownsTag = await isTagOwnedByUser(userId, tagId);

    if (!ownsTag) {
      logger.error('FORBIDDEN_ERROR: Tag does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to delete the content of the tags',
          ),
        );
      return;
    }

    await deleteTag(tagId);
    logger.info('DELETE_TAG_SUCCESS: Deleted tag successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Deleted tag successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}
