import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate-request';
import {
  getPublicBlogDetailsHandler,
  getPublicCategoriesHandler,
  getPublicPostDetailsHandler,
  getPublicPostsListHandler,
  getPublicPreviewPostHandler,
} from './public.controllers';
import {
  getPublicBlogSchema,
  getPublicCategoriesSchema,
  getPublicPostSchema,
  getPublicPostsSchema,
  getPublicPreviewPostSchema,
} from './public.schema';

const router = Router();

router.get(
  '/blogs',
  validateRequest(getPublicBlogSchema),
  getPublicBlogDetailsHandler,
);
router.get(
  '/posts',
  validateRequest(getPublicPostsSchema),
  getPublicPostsListHandler,
);
router.get(
  '/posts/:postSlug',
  validateRequest(getPublicPostSchema),
  getPublicPostDetailsHandler,
);
router.get('/preview/:postId', validateRequest(getPublicPreviewPostSchema), getPublicPreviewPostHandler);
router.get('/categories', validateRequest(getPublicCategoriesSchema), getPublicCategoriesHandler);

export { router as publiRoutes };
