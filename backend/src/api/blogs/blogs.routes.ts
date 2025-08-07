import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { upload } from '../../utils/upload-files';
import {
  createNewBlogHandler,
  createNewTagHandler,
  createPostHandler,
  deleteBlogHandler,
  deletePostHandler,
  deleteTagsHandler,
  editBlogHandler,
  editPostHandler,
  editTagsHandler,
  getAllBlogsHandler,
  getAllTagsHandler,
  getPostsHandler,
  uploadBlogLogoHandler,
} from './blogs.controllers';
import { validateRequest } from './blogs.middlewares';
import {
  createNewBlogSchema,
  createNewTagSchema,
  createPostsSchema,
  deleteBlogSchema,
  deletePostsSchema,
  deleteTagsSchema,
  editBlogSchema,
  editPostSchema,
  editTagsSchema,
  getAllBlogsSchema,
  getAllTagsSchema,
  getPostsSchema,
} from './blogs.schema';

const router = Router();

/**
 * POST blogs/:blogId/posts - create a new post for a blog
 * GET blogs/:blogId/posts - Get all posts for a blog, filter: pagination, search, sort, categories
 * PATCH blogs/posts/:postId - Update a post by ID
 * DELETE blogs/posts/:postId - Delete a post by ID
 *
 */
router.post(
  '/',
  authenticate,
  validateRequest(createNewBlogSchema),
  createNewBlogHandler,
);
router.get(
  '/',
  authenticate,
  validateRequest(getAllBlogsSchema),
  getAllBlogsHandler,
);
router.post(
  '/logo',
  authenticate,
  upload.single('blogLogo'),
  uploadBlogLogoHandler,
);
router.patch(
  '/:blogId',
  authenticate,
  validateRequest(editBlogSchema),
  editBlogHandler,
);
router.delete(
  '/:blogId',
  authenticate,
  validateRequest(deleteBlogSchema),
  deleteBlogHandler,
);
router.post(
  '/:blogId/tags',
  authenticate,
  validateRequest(createNewTagSchema),
  createNewTagHandler,
);
router.get(
  '/:blogId/tags',
  authenticate,
  validateRequest(getAllTagsSchema),
  getAllTagsHandler,
);
router.patch(
  '/:blogId/tags/:tagId',
  authenticate,
  validateRequest(editTagsSchema),
  editTagsHandler,
);
router.delete(
  '/:blogId/tags/:tagId',
  authenticate,
  validateRequest(deleteTagsSchema),
  deleteTagsHandler,
);
router.post("/:blogId/posts", authenticate, validateRequest(createPostsSchema), createPostHandler);
router.get("/:blogId/posts", authenticate, validateRequest(getPostsSchema), getPostsHandler);
router.patch("/:blogId/posts/:postId", authenticate, validateRequest(editPostSchema), editPostHandler);
router.delete("/:blogId/posts/:postId", authenticate, validateRequest(deletePostsSchema), deletePostHandler);

export { router as blogsRoutes };
