import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import {
  uploadFileToCloudinary,
  uploadSingleFile,
} from '../../utils/upload-files';
import type {
  TCreateNewBlogRequestBody,
  TEditBlogParams,
  TEditBlogRequestBody,
} from './blogs.schema';
import {
  createNewBlog,
  createNewTag,
  deleteBlog,
  editBlog,
  editTags,
  getAllBlogs,
  getAllTags,
  isSlugTaken,
} from './blogs.services';

export async function createNewBlogHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TCreateNewBlogRequestBody
  >,
  res: Response,
) {
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

    const { slug } = req.body;
    const isSlugAvailable = await isSlugTaken(slug, req.db);

    if (isSlugAvailable) {
      logger.error('SLUG_CONFLICT_ERROR: Slug not available');
      res
        .status(StatusCodes.CONFLICT)
        .json(
          new APIResponse('error', StatusCodes.CONFLICT, 'Slug not available'),
        );
      return;
    }

    await createNewBlog(userData.userId, req.body, req.db);
    logger.info('CREATE_BLOG_SUCCESS: Created the blog successfully');

    res
      .status(StatusCodes.CREATED)
      .json(
        new APIResponse(
          'success',
          StatusCodes.CREATED,
          'Created the blog successfully',
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

export async function getAllBlogsHandler(req: Request, res: Response) {
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

    const query = req.query.query as string;
    const limit = req.query.limit as string;
    const page = req.query.page as string;
    const data = await getAllBlogs(
      userData.userId,
      req.db,
      query,
      Number(page),
      Number(limit),
    );
    logger.info('FETCH_ALL_BLOG_SUCCESS: Blogs fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Blogs fetched successfully',
          data,
        ),
      );
  } catch (err) {
    logger.error('Internal server error', err);
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

export async function uploadBlogLogoHandler(req: Request, res: Response) {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      logger.error('UPLOAD_FILE_ERROR: File not found in req.file');
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(new APIResponse('error', StatusCodes.BAD_REQUEST, 'Bad request'));
      return;
    }

    const profileImageUrl = await uploadSingleFile(
      uploadedFile,
      uploadFileToCloudinary,
    );
    logger.info('BLOG_LOGO_UPLOAD_SUCCESS: Blog logo uploaded successfully');

    res.status(StatusCodes.OK).json(
      new APIResponse(
        'success',
        StatusCodes.OK,
        'Blog logo uploaded successfully',
        {
          url: profileImageUrl,
        },
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

export async function editBlogHandler(
  req: Request<TEditBlogParams, Record<string, unknown>, TEditBlogRequestBody>,
  res: Response,
) {
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
    await editBlog(userId, blogId, req.body, req.db);
    logger.info('EDIT_BLOG_SUCCESS: Edited the blog successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Edited the blog successfully',
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

export async function deleteBlogHandler(req: Request, res: Response) {
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

    await deleteBlog(userId, blogId, req.db);
    logger.info('DELETE_BLOG_SUCCESS: Deleted the blog successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse(
          'success',
          StatusCodes.OK,
          'Deleted the blog successfully',
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
          'Internal Server error occured',
        ),
      );
  }
}

export async function createNewTagHandler(req: Request, res: Response) {
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
    await createNewTag(userId, blogId, req.body, req.db);
    logger.info('CREATE_NEW_TAG_SUCCESS: Tags created successfully');

    res
      .status(StatusCodes.CREATED)
      .json(
        new APIResponse(
          'success',
          StatusCodes.CREATED,
          'Tags created successfully',
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
    logger.error('SERVER_ERRRO: Internal server error occured', err);
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

export async function editTagsHandler(req: Request, res: Response) {
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
    await editTags(userId, blogId, tagId, req.body, req.db);
    logger.info('EDIT_TAG_SUCCESS: Edited tag successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new APIResponse('success', StatusCodes.OK, 'Edited tag successfully'),
      );
  } catch (err) {
    logger.error('SERVER_ERRRO: Internal server error occured', err);
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
