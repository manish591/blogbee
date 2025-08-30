import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validate-request';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  editCategoryHandler,
  getCategoriesHandler,
} from './categories.controllers';
import {
  createCategorySchema,
  deleteCategorySchema,
  editCategorySchema,
  getCategoriesSchema,
} from './categories.schema';

const router = Router();

router.post(
  '/',
  authenticate,
  validateRequest(createCategorySchema),
  createCategoryHandler,
);
router.get(
  '/',
  authenticate,
  validateRequest(getCategoriesSchema),
  getCategoriesHandler,
);
router.patch(
  '/:categoryId',
  authenticate,
  validateRequest(editCategorySchema),
  editCategoryHandler,
);
router.delete(
  '/:categoryId',
  authenticate,
  validateRequest(deleteCategorySchema),
  deleteCategoryHandler,
);

export { router as categoriesRoutes };
