import { Router } from 'express';
import { usersControllers } from '../../controllers/v1/users.controllers';
import { usersValidator } from '../../middlewares/validators/user-validator';

const router = Router();

router.post('/', usersValidator.create, usersControllers.createUser);
router.post('/login', usersControllers.loginUser);
router.post('/logout', usersControllers.logoutUser);
router.patch('/me', usersControllers.updateUserProfile);
router.post('/picture', usersControllers.uploadProfilePhoto);
router.get('/me', usersControllers.getUserDetails);

export { router as userRoutes };
