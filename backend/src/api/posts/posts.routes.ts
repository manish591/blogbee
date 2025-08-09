import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validate-request';
import {
  createPostHandler,
  deletePostHandler,
  editPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
} from './posts.controllers';
import {
  createPostSchema,
  deletePostSchema,
  editPostSchema,
  getAllPostsSchema,
  getPostByIdSchema,
} from './posts.schema';

const router = Router();

router.post(
  '/',
  authenticate,
  validateRequest(createPostSchema),
  createPostHandler,
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
router.get(
  '/',
  authenticate,
  validateRequest(getAllPostsSchema),
  getAllPostsHandler,
);
router.get(
  '/:postId',
  authenticate,
  validateRequest(getPostByIdSchema),
  getPostByIdHandler,
);

export { router as postsRouter };
