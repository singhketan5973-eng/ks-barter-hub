import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { createListingLimiter } from '../middleware/rateLimiters.js';
import { idParamSchemas } from '../validators/common.js';
import {
  browseListingsSchemas,
  createListingSchemas,
  myListingsSchemas,
  updateListingSchemas,
} from '../validators/listing.validators.js';
import * as listingController from '../controllers/listing.controller.js';

const router = Router();

router.get('/', validate(browseListingsSchemas), listingController.browse);
router.get('/mine', authenticate, validate(myListingsSchemas), listingController.mine);
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
