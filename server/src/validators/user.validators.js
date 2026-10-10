import { z } from 'zod';
import { USER_STATUSES } from '../models/User.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const userIdSchemas = {
  params: z.object({ id: objectId }),
};

export const updateProfileSchemas = {
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(80, 'Name must be at most 80 characters')
        .optional(),
      bio: z.string().trim().max(500, 'Bio must be at most 500 characters').optional(),
      city: z.string().trim().max(80, 'City must be at most 80 characters').optional(),
    })
    .refine((data) => Object.keys(data).length > 0, 'Provide at least one field to update'),
};

export const setStatusSchemas = {
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(Object.values(USER_STATUSES), 'Status must be active or suspended'),
  }),
};
