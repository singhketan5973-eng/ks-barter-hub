import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword } from '../utils/password.js';

export async function registerUser({ name, email, password }) {
  const existing = await User.exists({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  return User.create({ name, email, passwordHash });
}
