import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import {
  uploadFileToCloudinary,
  uploadSingleFile,
} from '../../utils/upload-files';
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
        .json(
          new APIResponse('error', StatusCodes.UNAUTHORIZED, 'Unauthorized'),
        );
      return;
    }

    const { slug } = req.body;
    const isTaken = await isSlugTaken(slug, req.db);

    if (isTaken) {
      logger.error('SLUG_CONFLICT_ERROR: Slug not available');
      res
        .status(StatusCodes.CONFLICT)
        .json(
          new APIResponse('error', StatusCodes.CONFLICT, 'Slug not available'),
        );
      return;
    }

    const userId = userData.userId;
    await createBlog(userId, req.body, req.db);
    logger.info('CREATE_USER_BLOG_SUCCESS: Created the blog successfully');

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

export async function getAllBlogsByUserHandler(req: Request, res: Response) {
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

    const q = req.query.q as string;
    const limit = req.query.limit as string;
    const page = req.query.page as string;
    const allUserBlogsData = await getAllBlogsByUser(
      userData.userId,
      req.db,
      q,
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
          allUserBlogsData,
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

export async function getBlogByIdHandler(req: Request, res: Response) {
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
    const blogData = await getBlogById(blogId, req.db);

    if (!blogData) {
      logger.error("NOT_FOUND_ERROR: Blog not found");
      res.status(StatusCodes.NOT_FOUND).json(new APIResponse("error", StatusCodes.NOT_FOUND, "Blog not found"));
      return;
    }

    const ownsBlog = await isBlogOwnedByUser(userId, blogId, req.db);

    if (!ownsBlog) {
      logger.error("FORBIDDEN_ERROR: User does not have permission to read the content of the blog.");
      res.status(StatusCodes.FORBIDDEN).json(new APIResponse("error", StatusCodes.FORBIDDEN, "You do not have permission to read the content of the blog"));
      return;
    }

    logger.info("GET_BLOG_BY_ID_SUCCESS: Blog data returned successfully");

    res.status(StatusCodes.OK).json(new APIResponse("success", StatusCodes.OK, "Blog data returned successfully", blogData))
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
        .json(new APIResponse('error', StatusCodes.BAD_REQUEST, 'File not found'));
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
  req: Request<TEditBlogParams, Record<string, unknown>, TEditBlogBody>,
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

    const blogId = req.params.blogId;
    const blogData = await getBlogById(blogId, req.db);

    if (!blogData) {
      logger.error("NOT_FOUND_ERROR: Blog not found");
      res.status(StatusCodes.NOT_FOUND).json(new APIResponse("error", StatusCodes.NOT_FOUND, "Blog not found"));
      return;
    }

    const userId = userData.userId;
    const isUserOwner = await isBlogOwnedByUser(userId, blogId, req.db);

    if (!isUserOwner) {
      logger.error("FORBIDDEN_ERROR: Blog does not belog to user");
      res.status(StatusCodes.FORBIDDEN).json(new APIResponse("error", StatusCodes.FORBIDDEN, "You do not have permissions to edit the blog"));
      return;
    }

    await editBlog(blogId, req.body, req.db);
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

    const blogId = req.params.blogId;
    const blogData = await getBlogById(blogId, req.db);

    if (!blogData) {
      logger.error("NOT_FOUND_ERROR: Blog not found");
      res.status(StatusCodes.NOT_FOUND).json(new APIResponse("error", StatusCodes.NOT_FOUND, "Blog not found"));
      return;
    }

    const userId = userData.userId;
    const isUserOwner = await isBlogOwnedByUser(userId, blogId, req.db);

    if (!isUserOwner) {
      logger.error("FORBIDDEN_ERROR: Blog does not belog to user");
      res.status(StatusCodes.FORBIDDEN).json(new APIResponse("error", StatusCodes.FORBIDDEN, "You do not have permissions to delete the blog"));
      return;
    }

    await deleteBlog(blogId, req.db);
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
