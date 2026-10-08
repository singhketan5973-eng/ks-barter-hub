import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter, refreshLimiter } from '../middleware/rateLimiters.js';
import { registerSchemas, loginSchemas } from '../validators/auth.validators.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchemas), authController.register);
router.post('/login', authLimiter, validate(loginSchemas), authController.login);
router.post('/refresh', refreshLimiter, authController.refresh);
router.post('/logout', authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.me);

export default router;
