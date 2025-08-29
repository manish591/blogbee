import { Router } from 'express';
import { blogsRoutes } from './api/blogs/blogs.routes';
import { categoriesRoutes } from './api/categories/categories.routes';
import { healthCheckRoutes } from './api/healthcheck/healthcheck.routes';
import { postsRouter } from './api/posts/posts.routes';
import { publiRoutes } from './api/public/public.routes';
import { usersRoutes } from './api/users/users.routes';

const router = Router();

router.use('/public', publiRoutes);
router.use('/users', usersRoutes);
router.use('/blogs', blogsRoutes);
router.use('/posts', postsRouter);
router.use('/categories', categoriesRoutes);
router.use('/healthcheck', healthCheckRoutes);

export { router as v1Routes };
