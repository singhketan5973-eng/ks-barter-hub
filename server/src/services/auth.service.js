import User, { USER_STATUSES } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/tokens.js';

const DUMMY_HASH = await hashPassword('timing-equalizer-password');

export async function registerUser({ name, email, password }) {
  const existing = await User.exists({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  return User.create({ name, email, passwordHash });
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');

  const passwordOk = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !passwordOk) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError(403, 'This account is not active');
  }

  user.lastLoginAt = new Date();
  await user.save();

  return { user, accessToken: signAccessToken(user) };
}

export async function getCurrentUser(id) {
  const user = await User.findById(id);
  if (!user || user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError(401, 'Authentication required');
  }
  return user;
}
