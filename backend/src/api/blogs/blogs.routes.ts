import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validate-request';
import { UPLOADED_BLOG_LOGO_FILE_NAME } from '../../utils/constants';
import { upload } from '../../utils/upload-files';
import {
  createBlogHandler,
  deleteBlogHandler,
  editBlogHandler,
  getAllBlogsHandler,
  getBlogByIdHandler,
  uploadBlogLogoHandler,
} from './blogs.controllers';
import {
  createBlogSchema,
  deleteBlogSchema,
  editBlogSchema,
  getAllBlogsSchema,
  getBlogByIdSchema,
} from './blogs.schema';

const router = Router();

router.post(
  '/',
  authenticate,
  validateRequest(createBlogSchema),
  createBlogHandler,
);
router.get(
  '/',
  authenticate,
  validateRequest(getAllBlogsSchema),
  getAllBlogsHandler,
);
router.get('/:blogId', authenticate, validateRequest(getBlogByIdSchema), getBlogByIdHandler);
router.post(
  '/logo',
  authenticate,
  upload.single(UPLOADED_BLOG_LOGO_FILE_NAME),
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
