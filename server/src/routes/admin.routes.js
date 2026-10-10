import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { setStatusSchemas } from '../validators/user.validators.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.patch('/users/:id/status', validate(setStatusSchemas), adminController.updateUserStatus);

export default router;
