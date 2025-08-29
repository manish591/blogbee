import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BlogbeeResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import { getBlogById, isBlogOwnedByUser } from '../blogs/blogs.services';
import { createCategory, deleteCategory, editCategory, getCategories, getCategoryById, isCategoryNameTaken, isCategoryOwnedByUser } from './categories.services';
import type { CreateCategoryBody } from './categories.schema';

export async function createCategoryHandler(req: Request<Record<string, unknown>, Record<string, unknown>, CreateCategoryBody>, res: Response) {
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
            'You do not have permissions to create the category in this blog',
          ),
        );
      return;
    }

    const isTaken = await isCategoryNameTaken(blogId, req.body.name);

    if (isTaken) {
      logger.error('CONFLICT_ERROR: Category name already taken');
      res.status(StatusCodes.CONFLICT).json(new BlogbeeResponse("Category name already exists"));
      return;
    }

    await createCategory(userId, blogId, req.body);
    logger.info('CREATE_CATEGORY_SUCCESS: category created successfully');

    res
      .status(StatusCodes.CREATED)
      .json(new BlogbeeResponse('Category created successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getCategoriesHandler(req: Request, res: Response) {
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
            'You do not have permissions to read the content of the categories',
          ),
        );
      return;
    }

    const data = await getCategories(blogId);
    logger.info('GET_ALL_CATEGORIES_SUCCESS: categories fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Categories fetched successfuly', data));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function editCategoryHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const categoryId = req.params.categoryId;
    const categoryData = await getCategoryById(categoryId);

    if (!categoryData) {
      logger.error('NOT_FOUND_ERROR: Category not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Category not found'));
      return;
    }

    const userId = userData.userId;
    const ownscategory = await isCategoryOwnedByUser(userId, categoryId);

    if (!ownscategory) {
      logger.error('FORBIDDEN_ERROR: Category does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to edit the content of the categories',
          ),
        );
      return;
    }

    await editCategory(categoryId, req.body);
    logger.info('EDIT_CATEGORY_SUCCESS: Edited category successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Edited the category successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function deleteCategoryHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const categoryId = req.params.categoryId;
    const categoryData = await getCategoryById(categoryId);

    if (!categoryData) {
      logger.error('NOT_FOUND_ERROR: Category not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Category not found'));
      return;
    }

    const userId = userData.userId;
    const ownsCategory = await isCategoryOwnedByUser(userId, categoryId);

    if (!ownsCategory) {
      logger.error('FORBIDDEN_ERROR: Category does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to delete the content of the categories',
          ),
        );
      return;
    }

    await deleteCategory(categoryId);
    logger.info('DELETE_CATEGORY_SUCCESS: Deleted the category successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Deleted the category successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}
