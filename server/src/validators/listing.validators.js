import { z } from 'zod';
import { CATEGORY_KINDS } from '../models/Category.js';
import { CONDITIONS, SERVICE_MODES } from '../models/Listing.js';
import { objectId } from './common.js';

const kind = z.enum(Object.values(CATEGORY_KINDS), 'Choose thing or service');

const title = z
  .string('Enter a title')
  .trim()
  .min(3, 'Title must be at least 3 characters')
  .max(120, 'Title must be at most 120 characters');

const description = z
  .string('Enter a description')
  .trim()
  .min(10, 'Description must be at least 10 characters')
  .max(3000, 'Description must be at most 3000 characters');

const wantedInReturn = z
  .string()
  .trim()
  .max(500, 'Wanted in return must be at most 500 characters');

const city = z.string().trim().max(80, 'City must be at most 80 characters');

const condition = z.enum(CONDITIONS, 'Choose a condition');
const serviceMode = z.enum(SERVICE_MODES, 'Choose how the service is provided');

const durationMinutes = z
  .number('Duration must be a number')
  .int('Duration must be a whole number of minutes')
  .min(15, 'Duration must be at least 15 minutes')
  .max(1440, 'Duration must be at most 24 hours');

const availability = z.string().trim().max(300, 'Availability must be at most 300 characters');

export const createListingSchemas = {
  body: z
    .object({
      kind,
      category: objectId,
      title,
      description,
      wantedInReturn: wantedInReturn.optional(),
      city: city.optional(),
      condition: condition.optional(),
      serviceMode: serviceMode.optional(),
      durationMinutes: durationMinutes.optional(),
      availability: availability.optional(),
    })
    .superRefine((data, ctx) => {
      if (data.kind === CATEGORY_KINDS.ITEM && !data.condition) {
        ctx.addIssue({ code: 'custom', path: ['condition'], message: 'Choose a condition' });
      }
      if (data.kind === CATEGORY_KINDS.SERVICE && !data.serviceMode) {
        ctx.addIssue({
          code: 'custom',
          path: ['serviceMode'],
          message: 'Choose how the service is provided',
        });
      }
    }),
};

export const updateListingSchemas = {
  params: z.object({ id: objectId }),
  body: z
    .object({
      category: objectId.optional(),
      title: title.optional(),
      description: description.optional(),
      wantedInReturn: wantedInReturn.optional(),
      city: city.optional(),
      condition: condition.optional(),
      serviceMode: serviceMode.optional(),
      durationMinutes: durationMinutes.optional(),
      availability: availability.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, 'Provide at least one field to update'),
};
