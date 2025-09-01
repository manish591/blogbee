import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PostStatus } from '../../db/schema';
import { BlogbeeResponse } from '../../utils/api-response';
import { logger } from '../../utils/logger';
import { getBlogById, isBlogOwnedByUser } from '../blogs/blogs.services';
import { getCategoryById } from '../categories/categories.services';
import type {
  AddCategoryToPostParams,
  EditPostBody,
  EditPostParams,
  GetPostsQuery,
  RemoveCategoryFromPostParams,
} from './posts.schema';
import {
  addCategoryToPost,
  createPost,
  deletePost,
  editPost,
  getPostById,
  getPosts,
  isPostContainsCategory,
  isPostOwnedByUser,
  isPostSlugTaken,
  removeCategoryFromPost,
} from './posts.services';

export async function createPostHandler(req: Request, res: Response) {
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
    const blogId = req.body.blogId;
    const isBlogExists = await getBlogById(blogId);

    if (!isBlogExists) {
      logger.error('BLOG_NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const isUserOwner = await isBlogOwnedByUser(userId, blogId);

    if (!isUserOwner) {
      logger.error('FORBIDDEN_ERROR: Blog does not belong to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permission to add post in this blog',
          ),
        );
      return;
    }

    const createdPostData = await createPost(userId, blogId);
    logger.info('CREATE_POST_SUCCESS: Post created successfully');

    res.status(StatusCodes.CREATED).json(
      new BlogbeeResponse('Post created successfully', {
        id: createdPostData.postId,
      }),
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getPostsHandler(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    GetPostsQuery
  >,
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

    const blogId = req.query.blogId;
    const isBlogExists = await getBlogById(blogId);

    if (!isBlogExists) {
      logger.error('BLOG_NOT_FOUND_ERROR: Blog not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Blog not found'));
      return;
    }

    const userId = userData.userId;
    const ownsBlog = await isBlogOwnedByUser(userId, blogId);

    if (!ownsBlog) {
      logger.error('FORBIDDEN_ERROR: Blog does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to read the posts content',
          ),
        );
      return;
    }

    const queryParams = req.query;
    const query = queryParams.query;
    const categories = queryParams.categories;
    const sort = queryParams.sort;
    const status = queryParams.status;
    const limit = queryParams.limit ? Number(queryParams.limit) : 10;
    const page = queryParams.page ? Number(queryParams.page) : 1;
    const postsData = await getPosts(blogId, {
      query,
      limit,
      page,
      categories,
      sort,
      status,
    });
    logger.info('GET_POST_SUCCESS: Posts fetched successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Posts fetched successfully', postsData));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function getPostByIdHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const postId = req.params.postId;
    const postData = await getPostById(postId);

    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const userId = userData.userId;
    const ownsPost = await isPostOwnedByUser(userId, postId);

    if (!ownsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to read the post content',
          ),
        );
      return;
    }

    logger.info('GET_POST_BY_ID_SUCCESS: Post data returned successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Post data returned successfully', postData));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function editPostHandler(
  req: Request<EditPostParams, Record<string, unknown>, EditPostBody>,
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

    const postId = req.params.postId;
    const postData = await getPostById(postId);

    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const userId = userData.userId;
    const ownsPost = await isPostOwnedByUser(userId, postId);

    if (!ownsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse('You do not have permissions to edit the post'),
        );
      return;
    }

    const { postStatus, slug } = req.body;

    if (slug) {
      const isTaken = await isPostSlugTaken(slug);

      if (isTaken) {
        logger.error(
          'CONFLICT_ERROR: Post slug is taken',
        );
        res
          .status(StatusCodes.CONFLICT)
          .json(new BlogbeeResponse('Post slug is taken'));
        return;
      }
    }

    if (postStatus === PostStatus.PUBLISHED && !postData.slug && !slug) {
      logger.error(
        'BAD_REQUEST: Publishing post requires a slug to be passed in the body',
      );
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(new BlogbeeResponse('Slug is required'));
      return;
    }

    await editPost(postId, req.body);
    logger.info('EDIT_POST_SUCCESS: Posts edited successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Posts edited successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function deletePostHandler(req: Request, res: Response) {
  try {
    const userData = res.locals.user;

    if (!userData) {
      logger.info('Unauthorized_ERROR: User not found in res.locals');
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new BlogbeeResponse('Unauthorized'));
      return;
    }

    const postId = req.params.postId;
    const postData = await getPostById(postId);

    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const userId = userData.userId;
    const ownsPost = await isPostOwnedByUser(userId, postId);

    if (!ownsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse('You do not have permissions to delete the post'),
        );
      return;
    }

    await deletePost(postId);
    logger.info('DELETE_POST_SUCCESS: Posts deleted successfully');

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Posts deleted successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function addCategoryToPostHandler(
  req: Request<AddCategoryToPostParams>,
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

    const postId = req.params.postId;
    const categoryId = req.params.categoryId;
    const userId = userData.userId;

    const postData = await getPostById(postId);
    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const categoryData = await getCategoryById(categoryId);
    if (!categoryData) {
      logger.error('NOT_FOUND_ERROR: Category not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Category not found'));
      return;
    }

    const userOwnsPost = await isPostOwnedByUser(userId, postId);
    if (!userOwnsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to add category to this post',
          ),
        );
      return;
    }

    const containsCategory = await isPostContainsCategory(postId, categoryId);
    if (containsCategory) {
      logger.error('CONFLICT_ERROR: Post already contains this category');
      res
        .status(StatusCodes.CONFLICT)
        .json(new BlogbeeResponse('Post already contains this category'));
      return;
    }

    const isPostAndCategoryFromSameBlog =
      postData.blogId.toString() === categoryData.blogId.toString();
    if (!isPostAndCategoryFromSameBlog) {
      logger.error(
        'FORBIDDEN_ERROR: The post and category must belong to the same blog',
      );
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'The post and category must belong to the same blog',
          ),
        );
      return;
    }

    await addCategoryToPost(postId, categoryId, categoryData.name);
    logger.info(
      'ADD_CATEGORY_TO_POST_SUCCESS: category added to post successfully',
    );

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('category added to post successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}

export async function removeCategoryFromPostHandler(
  req: Request<RemoveCategoryFromPostParams>,
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

    const postId = req.params.postId;
    const categoryId = req.params.categoryId;
    const userId = userData.userId;

    const postData = await getPostById(postId);
    if (!postData) {
      logger.error('POST_NOT_FOUND_ERROR: Post not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post not found'));
      return;
    }

    const categoryData = await getCategoryById(categoryId);
    if (!categoryData) {
      logger.error('NOT_FOUND_ERROR: Category not found');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Category not found'));
      return;
    }

    const userOwnsPost = await isPostOwnedByUser(userId, postId);
    if (!userOwnsPost) {
      logger.error('FORBIDDEN_ERROR: Post does not belog to user');
      res
        .status(StatusCodes.FORBIDDEN)
        .json(
          new BlogbeeResponse(
            'You do not have permissions to delete the category from this post',
          ),
        );
      return;
    }

    const containscategory = await isPostContainsCategory(postId, categoryId);
    if (!containscategory) {
      logger.error('NOT_FOUND_ERROR: Post does not contains this category');
      res
        .status(StatusCodes.NOT_FOUND)
        .json(new BlogbeeResponse('Post does not contains this category'));
      return;
    }

    await removeCategoryFromPost(postId, categoryId);
    logger.info(
      'REMOVE_CATEGORY_FROM_POST_SUCCESS: Category removed from the post successfully',
    );

    res
      .status(StatusCodes.OK)
      .json(new BlogbeeResponse('Category removed from the post successfully'));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new BlogbeeResponse('Internal server error occured'));
  }
}
