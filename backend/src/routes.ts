import { Router } from 'express';
import { blogsRoutes } from './api/blogs/blogs.routes';
import { healthCheckRoutes } from './api/healthcheck/healthcheck.routes';
import { postsRouter } from './api/posts/posts.routes';
import { tagsRouter } from './api/tags/tags.routes';
import { usersRoutes } from './api/users/users.routes';

const router = Router();

router.use('/users', usersRoutes);
router.use('/blogs', blogsRoutes);
router.use('/posts', postsRouter);
router.use('/tags', tagsRouter);
router.use('/healthcheck', healthCheckRoutes);

export { router as v1Routes };
