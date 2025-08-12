import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validate-request';
import {
  addTagToPostHandler,
  createPostHandler,
  deletePostHandler,
  editPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
  removeTagFromPostHandler,
} from './posts.controllers';
import {
  addTagToPostSchema,
  createPostSchema,
  deletePostSchema,
  editPostSchema,
  getAllPostsSchema,
  getPostByIdSchema,
  removeTagFromPostSchema,
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
  validateRequest(getAllPostsSchema),
  getAllPostsHandler,
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
router.post("/:postId/tags/:tagId", authenticate, validateRequest(addTagToPostSchema), addTagToPostHandler);
router.delete("/:postId/tags/:tagId", authenticate, validateRequest(removeTagFromPostSchema), removeTagFromPostHandler);

export { router as postsRouter };
