import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { createListingLimiter } from '../middleware/rateLimiters.js';
import { idParamSchemas } from '../validators/common.js';
import { createListingSchemas, updateListingSchemas } from '../validators/listing.validators.js';
import * as listingController from '../controllers/listing.controller.js';

const router = Router();

router.post(
  '/',
  authenticate,
  createListingLimiter,
  validate(createListingSchemas),
  listingController.create
);
router.get('/:id', optionalAuthenticate, validate(idParamSchemas), listingController.getOne);
router.patch('/:id', authenticate, validate(updateListingSchemas), listingController.update);
router.delete('/:id', authenticate, validate(idParamSchemas), listingController.archive);

export default router;
