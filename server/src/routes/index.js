import { Router } from 'express';
import { z } from 'zod';
import healthRoutes from './health.routes.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use('/health', healthRoutes);

// TEMPORARY: delete after testing
router.post(
  '/validation-test',
  validate({
    body: z.object({
      email: z.email(),
      age: z.coerce.number().int().min(18),
    }),
  }),
  (req, res) => res.json(req.validated.body)
);

export default router;