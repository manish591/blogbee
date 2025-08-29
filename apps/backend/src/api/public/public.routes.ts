import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate-request';
import {
  getPublicBlogDetailsHandler,
  getPublicPostDetailsHandler,
  getPublicPostsListHandler,
} from './public.controllers';
import { getPublicBlogSchema, getPublicPostSchema, getPublicPostsSchema } from './public.schema';

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

export { router as publiRoutes };
