import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { logger } from '../../utils/logger';
import {
  uploadFileToCloudinary,
  uploadSingleFile,
} from '../../utils/upload-files';
import type {
  TCreateNewBlogRequestBody,
  TUpdateBlogParams,
  TUpdateBlogRequestBody,
} from './blogs.schema';
import {
  createNewBlog,
  getAllBlogs,
  isSlugTaken,
  updateBlog,
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
      logger.info('User not found');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        code: ReasonPhrases.UNAUTHORIZED,
        message: 'You are not logged in',
      });

      return;
    }

    const { slug } = req.body;
    const isSlugAvailable = await isSlugTaken(slug, req.db);

    if (isSlugAvailable) {
      logger.error('Slug is already taken. Try with another slug name');
      res.status(StatusCodes.CONFLICT).json({
        status: StatusCodes.CONFLICT,
        code: ReasonPhrases.CONFLICT,
        message: 'Slug is taken. Please user a different slug',
      });
      return;
    }

    await createNewBlog(userData.userId, req.body, req.db);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      code: ReasonPhrases.OK,
      message: 'Successfully created the blog',
    });
  } catch (err) {
    logger.error('Internal server error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured. Please try again later!',
    });
  }
}

export async function getAllBlogsHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('User not found');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        code: ReasonPhrases.UNAUTHORIZED,
        message: 'You are not logged in',
      });

      return;
    }

    const query = req.query.query as string;
    const limit = req.query.limit as string;
    const page = req.query.page as string;
    const allBlogs = await getAllBlogs(
      userData.userId,
      req.db,
      query,
      Number(page),
      Number(limit),
    );

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Blogs fetched successfully',
      data: allBlogs,
    });
  } catch (err) {
    logger.error('Internal server error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured. Please try again later!',
    });
  }
}

export async function uploadBlogLogoHandler(req: Request, res: Response) {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        code: ReasonPhrases.BAD_REQUEST,
        message: 'File not found',
      });

      return;
    }

    const profileImageUrl = await uploadSingleFile(
      uploadedFile,
      uploadFileToCloudinary,
    );

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Logo uploaded successfully',
      data: {
        url: profileImageUrl,
      },
    });
  } catch (err) {
    logger.error('Internal server error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured. Please try again later!',
    });
  }
}

export async function updateBlogHandler(
  req: Request<
    TUpdateBlogParams,
    Record<string, unknown>,
    TUpdateBlogRequestBody
  >,
  res: Response,
) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('User not found');
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        code: ReasonPhrases.UNAUTHORIZED,
        message: 'You are not logged in',
      });

      return;
    }

    const userId = userData.userId;
    const blogId = req.params.blogId;
    await updateBlog(userId, blogId, req.body, req.db);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Successfully updated the blog',
    });
  } catch (err) {
    logger.error('Internal server error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured. Please try again later!',
    });
  }
}
