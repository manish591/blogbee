import { Router } from 'express';
import {
  createUser,
  getUserDetails,
  loginUser,
  logoutUser,
  updateUserProfile,
  uploadProfilePhoto,
} from './users.controllers';
import { validateRequestBody } from './users.middleware';
import { createUserSchema, loginUserSchema } from './users.schema';

const router = Router();

router.post('/', validateRequestBody(createUserSchema), createUser);
router.post('/login', validateRequestBody(loginUserSchema), loginUser);
router.post('/logout', logoutUser);
router.patch('/me', updateUserProfile);
router.post('/picture', uploadProfilePhoto);
router.get('/me', getUserDetails);

export { router as usersRoutes };
