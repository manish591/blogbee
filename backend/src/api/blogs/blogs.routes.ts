import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { upload } from '../../utils/upload-files';
import {
  createNewBlogHandler,
  getAllBlogsHandler,
  uploadBlogLogoHandler,
} from './blogs.controllers';
import { validateQueryParams, validateRequestBody } from './blogs.middlewares';
import { createNewBlogSchema, getAllBlogsSchema } from './blogs.schema';

const router = Router();

/**
 * PATCH /blogs - update a blog by userid
 * DELETE /blogs/:blogId - Delete a blog by ID
 *
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
  validateRequestBody(createNewBlogSchema),
  authenticate,
  createNewBlogHandler,
);
router.get(
  '/',
  validateQueryParams(getAllBlogsSchema),
  authenticate,
  getAllBlogsHandler,
);
router.post(
  '/logo',
  authenticate,
  upload.single('blogLogo'),
  uploadBlogLogoHandler,
);

export { router as blogsRoutes };
