import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validate-request';
import {
  createTagHandler,
  deleteTagHandler,
  editTagHandler,
  getAllTagsHandler,
} from './tags.controllers';
import {
  createTagSchema,
  deleteTagSchema,
  editTagSchema,
  getAllTagsSchema,
} from './tags.schema';

const router = Router();

router.post(
  '/',
  authenticate,
  validateRequest(createTagSchema),
  createTagHandler,
);
router.patch('/', authenticate, validateRequest(editTagSchema), editTagHandler);
router.delete(
  '/',
  authenticate,
  validateRequest(deleteTagSchema),
  deleteTagHandler,
);
router.get(
  '/',
  authenticate,
  validateRequest(getAllTagsSchema),
  getAllTagsHandler,
);

export { router as tagsRouter };
