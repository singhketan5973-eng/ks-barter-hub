import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { updateProfileSchemas, userIdSchemas } from '../validators/user.validators.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.patch('/me', authenticate, validate(updateProfileSchemas), userController.updateMe);
router.get('/:id', validate(userIdSchemas), userController.getProfile);

export default router;
