import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { logger } from '../../utils/logger';
import type { TCreateNewBlogRequestBody } from './blogs.schema';
import { createNewBlog, isSlugTaken } from './blogs.services';

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
