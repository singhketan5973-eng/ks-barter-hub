import { z } from 'zod';
import { CATEGORY_KINDS } from '../models/Category.js';

export const suggestCategorySchemas = {
  body: z.object({
    kind: z.enum(Object.values(CATEGORY_KINDS), 'Choose item or service'),
    title: z
      .string('Enter a title')
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(120, 'Title must be at most 120 characters'),
    description: z
      .string()
      .trim()
      .max(3000, 'Description must be at most 3000 characters')
      .optional(),
  }),
};
