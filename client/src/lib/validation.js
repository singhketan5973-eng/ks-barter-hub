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
