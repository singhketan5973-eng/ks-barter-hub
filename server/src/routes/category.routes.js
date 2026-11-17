import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { suggestLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.js';
import { suggestCategorySchemas } from '../validators/category.validators.js';
import * as categoryController from '../controllers/category.controller.js';

const router = Router();

router.get('/', categoryController.list);
router.post(
  '/suggest',
  authenticate,
  suggestLimiter,
  validate(suggestCategorySchemas),
  categoryController.suggest
);

export default router;
