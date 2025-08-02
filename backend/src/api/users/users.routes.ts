import { Router } from 'express';
import {
  createUserHandler,
  getUserDetailsHandler,
  loginUserHandler,
  logoutUserHandler,
  updateProfileHandler,
  uploadProfileImageHandler,
} from './users.controllers';
import { validateRequestBody } from './users.middleware';
import { createUserSchema, loginUserSchema } from './users.schema';
import { upload } from '../../utils/upload-files';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.post('/', validateRequestBody(createUserSchema), createUserHandler);
router.post('/login', validateRequestBody(loginUserSchema), loginUserHandler);
router.post('/logout', authenticate, logoutUserHandler);
router.post('/picture', authenticate, upload.single("profileImg"), uploadProfileImageHandler);
router.patch('/me', authenticate, updateProfileHandler);
router.get('/me', authenticate, getUserDetailsHandler);

export { router as usersRoutes };
