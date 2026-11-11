import { z } from 'zod';

const name = z
  .string('Enter your name')
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(80, 'Name must be at most 80 characters');

const email = z
  .string('Enter your email')
  .trim()
  .toLowerCase()
  .pipe(z.email('Enter a valid email address'));

const newPassword = z
  .string('Enter a password')
  .min(8, 'Password must be at least 8 characters')
  .refine((value) => new TextEncoder().encode(value).length <= 72, 'Password is too long')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one number');

export const registerSchema = z.object({ name, email, password: newPassword });

export const loginSchema = z.object({
  email,
  password: z.string('Enter your password').min(1, 'Enter your password').max(200),
});

export const profileSchema = z.object({
  name,
  city: z.string().trim().max(80, 'City must be at most 80 characters'),
  bio: z.string().trim().max(500, 'Bio must be at most 500 characters'),
});

export const listingSchema = z
  .object({
    kind: z.enum(['item', 'service'], 'Choose what you are offering'),
    category: z.string('Choose a category').min(1, 'Choose a category'),
    title: z
      .string('Enter a title')
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(120, 'Title must be at most 120 characters'),
    description: z
      .string('Enter a description')
      .trim()
      .min(10, 'Description must be at least 10 characters')
      .max(3000, 'Description must be at most 3000 characters'),
    wantedInReturn: z.string().trim().max(500, 'This must be at most 500 characters'),
    city: z.string().trim().max(80, 'City must be at most 80 characters'),
    condition: z.string().optional(),
    serviceMode: z.string().optional(),
    durationMinutes: z
      .number('Time needed must be a number')
      .int('Time needed must be a whole number of minutes')
      .min(15, 'Time needed must be at least 15 minutes')
      .max(1440, 'Time needed must be at most 24 hours')
      .optional(),
    availability: z.string().trim().max(300, 'Availability must be at most 300 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.kind === 'item' && !data.condition) {
      ctx.addIssue({ code: 'custom', path: ['condition'], message: 'Choose a condition' });
    }
    if (data.kind === 'service' && !data.serviceMode) {
      ctx.addIssue({
        code: 'custom',
        path: ['serviceMode'],
        message: 'Choose how the service is provided',
      });
    }
  });
