import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate-request';
import {
  getPublicBlogDetailsHandler,
  getPublicPostDetailsHandler,
  getPublicPostsListHandler,
} from './public.controllers';
import {
  getPublicBlogDetailsSchema,
  getPublicPostDetailsSchema,
  getPublicPostsListSchema,
} from './public.schema';

const router = Router();

router.get(
  '/blogs',
  validateRequest(getPublicBlogDetailsSchema),
  getPublicBlogDetailsHandler,
);
router.get(
  '/posts',
  validateRequest(getPublicPostsListSchema),
  getPublicPostsListHandler,
);
router.get(
  '/posts/:postSlug',
  validateRequest(getPublicPostDetailsSchema),
  getPublicPostDetailsHandler,
);

export { router as publiRoutes };
