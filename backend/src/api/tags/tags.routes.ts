import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validate-request';
import {
  createTagHandler,
  deleteTagHandler,
  editTagHandler,
  getBlogTagsHandler,
} from './tags.controllers';
import {
  createTagSchema,
  deleteTagSchema,
  editTagSchema,
  getBlogTagsSchema,
} from './tags.schema';

const router = Router();

router.post(
  '/',
  authenticate,
  validateRequest(createTagSchema),
  createTagHandler,
);
router.get(
  '/',
  authenticate,
  validateRequest(getBlogTagsSchema),
  getBlogTagsHandler,
);
router.patch('/', authenticate, validateRequest(editTagSchema), editTagHandler);
router.delete(
  '/',
  authenticate,
  validateRequest(deleteTagSchema),
  deleteTagHandler,
);

export { router as tagsRouter };
