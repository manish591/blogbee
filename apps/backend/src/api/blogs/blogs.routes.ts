import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validate-request';
import { upload } from '../../utils/upload';
import {
  createBlogHandler,
  deleteBlogHandler,
  editBlogHandler,
  getBlogByIdHandler,
  getBlogsHandler,
  uploadBlogLogoHandler,
} from './blogs.controllers';
import {
  createBlogSchema,
  deleteBlogSchema,
  editBlogSchema,
  getBlogByIdSchema,
  getBlogsSchema,
} from './blogs.schema';

const router = Router();

export const UPLOADED_BLOG_LOGO_IDENTIFIER = 'blog-logo';

router.post(
  '/',
  authenticate,
  validateRequest(createBlogSchema),
  createBlogHandler,
);
router.get('/', authenticate, validateRequest(getBlogsSchema), getBlogsHandler);
router.get(
  '/:blogId',
  authenticate,
  validateRequest(getBlogByIdSchema),
  getBlogByIdHandler,
);
router.post(
  '/logo',
  authenticate,
  upload.single(UPLOADED_BLOG_LOGO_IDENTIFIER),
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

export { router as blogsRoutes };
