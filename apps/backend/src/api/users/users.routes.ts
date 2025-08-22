import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validate-request';
import { upload } from '../../utils/upload';
import {
  createUserHandler,
  editProfileHandler,
  getUserDetailsHandler,
  loginUserHandler,
  logoutUserHandler,
  uploadProfileImageHandler,
} from './users.controllers';
import {
  createUserSchema,
  editUserProfileSchema,
  loginUserSchema,
} from './users.schema';

const router = Router();

export const UPLOADED_PROFILE_IMG_IDENTIFIER = 'profile-img';

router.post('/', validateRequest(createUserSchema), createUserHandler);
router.post('/login', validateRequest(loginUserSchema), loginUserHandler);
router.post('/logout', authenticate, logoutUserHandler);
router.post(
  '/picture',
  authenticate,
  upload.single(UPLOADED_PROFILE_IMG_IDENTIFIER),
  uploadProfileImageHandler,
);
router.patch(
  '/me',
  authenticate,
  validateRequest(editUserProfileSchema),
  editProfileHandler,
);
router.get('/me', authenticate, getUserDetailsHandler);

export { router as usersRoutes };
