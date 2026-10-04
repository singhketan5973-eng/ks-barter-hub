import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { registerSchemas } from '../validators/auth.validators.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', validate(registerSchemas), authController.register);

export default router;
