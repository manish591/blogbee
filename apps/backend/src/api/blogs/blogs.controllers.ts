import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BlogbeeResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import { uploadFileToCloudinary } from '../../utils/upload';
import type {
  TCreateBlogBody,
  TEditBlogBody,
  TEditBlogParams,
} from './blogs.schema';
import {
  createBlog,
  deleteBlog,
  editBlog,
  getAllBlogsByUser,
  getBlogById,
  isBlogOwnedByUser,
  isSlugTaken,
} from './blogs.services';

export async function createBlogHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    TCreateBlogBody
  >,
  res: Response,
) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('UNAUTHORIZED_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const { slug } = req.body;
    const isTaken = await isSlugTaken(slug);

    if (isTaken) {
      logger.error('SLUG_CONFLICT_ERROR: Slug not available');
      res
        .status(StatusCodes.CONFLICT)
        .json(new BlogbeeResponse('Slug not available'));
      return;
    }

    const userId = userData.userId;
    await createBlog(userId, req.body);
    logger.info('CREATE_USER_BLOG_SUCCESS: Created the blog successfully');

    res
      .status(StatusCodes.CREATED)
      .json(new BlogbeeResponse('Created the blog successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getAllBlogsByUserHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const query = req.query.query as string;
    const limit = req.query.limit as string;
    const page = req.query.page as string;
    const sort = req.query.sort as "latest" | "oldest";
    const allUserBlogsData = await getAllBlogsByUser(
      userData.userId,
      query,
      Number(page),
      Math.min(20, Number(limit)),
      sort
    );
    logger.info('FETCH_ALL_BLOG_SUCCESS: Blogs fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(
        new BlogbeeResponse('Blogs fetched successfully', allUserBlogsData),
      );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getBlogByIdHandler(req: Request, res: Response) {
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
    const blogId = req.params.blogId;
    const blogData = await getBlogById(blogId);

    if (!blogData) {
      logger.error('NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const ownsBlog = await isBlogOwnedByUser(userId, blogId);

    if (!ownsBlog) {
      logger.error(
        'FORBIDDEN_ERROR: User does not have permission to read the content of the blog.',
      );
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permission to read the content of the blog',
          ),
        );
      return;
    }

    logger.info('GET_BLOG_BY_ID_SUCCESS: Blog data returned successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Blog data returned successfully', blogData));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function uploadBlogLogoHandler(req: Request, res: Response) {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      logger.error('UPLOAD_FILE_ERROR: File not found in req.file');
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(new BlogbeeResponse('File not found'));
      return;
    }

    const profileImageUrl = await uploadFileToCloudinary(uploadedFile);
    logger.info('BLOG_LOGO_UPLOAD_SUCCESS: Blog logo uploaded successfully');

    res.status(StatusCodes.OK).json(
      new BlogbeeResponse('Blog logo uploaded successfully', {
        url: profileImageUrl,
      }),
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function editBlogHandler(
  req: Request<TEditBlogParams, Record<string, unknown>, TEditBlogBody>,
  res: Response,
) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const blogId = req.params.blogId;
    const blogData = await getBlogById(blogId);

    if (!blogData) {
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
          new BlogbeeResponse('You do not have permissions to edit the blog'),
        );
      return;
    }

    await editBlog(blogId, req.body);
    logger.info('EDIT_BLOG_SUCCESS: Edited the blog successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Edited the blog successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function deleteBlogHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const blogId = req.params.blogId;
    const blogData = await getBlogById(blogId);

    if (!blogData) {
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
          new BlogbeeResponse('You do not have permissions to delete the blog'),
        );
      return;
    }

    await deleteBlog(blogId);
    logger.info('DELETE_BLOG_SUCCESS: Deleted the blog successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Deleted the blog successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}
