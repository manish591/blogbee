import { Router } from 'express';
import { blogsRoutes } from './blogs';
import { userRoutes } from './users';

const router = Router();

router.use('/users', userRoutes);
router.use('/blogs', blogsRoutes);

export { router as v1Routes };
