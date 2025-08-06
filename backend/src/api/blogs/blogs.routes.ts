import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { upload } from '../../utils/upload-files';
import {
  createNewBlogHandler,
  deleteBlogHandler,
  getAllBlogsHandler,
  updateBlogHandler,
  uploadBlogLogoHandler,
} from './blogs.controllers';
import { validateRequest } from './blogs.middlewares';
import {
  createNewBlogSchema,
  deleteBlogSchema,
  getAllBlogsSchema,
  updateBlogSchema,
} from './blogs.schema';

const router = Router();

/**
 * POST blogs/:blogId/posts - create a new post for a blog
 * GET blogs/:blogId/posts - Get all posts for a blog, filter: pagination, search, sort, categories
 * PATCH blogs/posts/:postId - Update a post by ID
 * DELETE blogs/posts/:postId - Delete a post by ID
 *
 * GET blogs/:blogId/tags - Get all tags for a blog
 * POST blogs/:blogId/tags - Create a new tag for a blog
 * PATCH blogs/:blogId/tags/:tagId - Update a tag by ID
 * DELETE blogs/:blogId/tags/:tagId - Delete a tag by ID
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
  validateRequest(updateBlogSchema),
  updateBlogHandler,
);
router.delete(
  '/:blogId',
  authenticate,
  validateRequest(deleteBlogSchema),
  deleteBlogHandler,
);

export { router as blogsRoutes };
