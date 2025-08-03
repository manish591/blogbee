import { Router } from 'express';
import { blogsRoutes } from './api/blogs/blogs.routes';
import { healthCheckRoutes } from './api/healthcheck/healthcheck.routes';
import { usersRoutes } from './api/users/users.routes';

const router = Router();

router.use('/users', usersRoutes);
router.use('/blogs', blogsRoutes);
router.use('/healthcheck', healthCheckRoutes);

export { router as v1Routes };
