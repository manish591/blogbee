import { Router } from 'express';
import { blogsRoutes } from './api/blogs/blogs.routes';
import { usersRoutes } from './api/users/users.routes';

const router = Router();

router.use('/users', usersRoutes);
router.use('/blogs', blogsRoutes);

export { router as v1Routes };
