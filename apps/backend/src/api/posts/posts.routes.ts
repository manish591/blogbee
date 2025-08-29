import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validate-request';
import {
  createPostHandler,
  deletePostHandler,
  editPostHandler,
  getPostsHandler,
  getPostByIdHandler,
  removeCategoryFromPostHandler,
  addCategoryToPostHandler,
} from './posts.controllers';
import {
  addCategoryToPostSchema,
  createPostSchema,
  deletePostSchema,
  editPostSchema,
  getPostByIdSchema,
  getPostsSchema,
  removeCategoryFromPostSchema,
} from './posts.schema';

const router = Router();

router.post(
  '/',
  authenticate,
  validateRequest(createPostSchema),
  createPostHandler,
);
router.get(
  '/',
  authenticate,
  validateRequest(getPostsSchema),
  getPostsHandler,
);
router.get(
  '/:postId',
  authenticate,
  validateRequest(getPostByIdSchema),
  getPostByIdHandler,
);
router.patch(
  '/:postId',
  authenticate,
  validateRequest(editPostSchema),
  editPostHandler,
);
router.delete(
  '/:postId',
  authenticate,
  validateRequest(deletePostSchema),
  deletePostHandler,
);
router.post(
  '/:postId/categories/:categoryId',
  authenticate,
  validateRequest(addCategoryToPostSchema),
  addCategoryToPostHandler,
);
router.delete(
  '/:postId/categories/:categoryId',
  authenticate,
  validateRequest(removeCategoryFromPostSchema),
  removeCategoryFromPostHandler,
);

export { router as postsRouter };
