import { randomUUID } from 'node:crypto';
import User, { USER_STATUSES } from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/tokens.js';
import { generateRefreshToken, hashToken, refreshExpiryDate } from '../utils/refreshToken.js';

const DUMMY_HASH = await hashPassword('timing-equalizer-password');

async function createRefreshToken(userId, family, meta) {
  const { token, tokenHash } = generateRefreshToken();
  const expiresAt = refreshExpiryDate();

  await RefreshToken.create({
    user: userId,
    tokenHash,
    family,
    expiresAt,
    userAgent: meta?.userAgent?.slice(0, 300),
    ip: meta?.ip?.slice(0, 64),
  });

  return { refreshToken: token, refreshExpiresAt: expiresAt };
}

const revokeFamily = (family) =>
  RefreshToken.updateMany({ family, revokedAt: null }, { revokedAt: new Date() });

export async function registerUser({ name, email, password }) {
  const existing = await User.exists({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  return User.create({ name, email, passwordHash });
}

export async function loginUser({ email, password }, meta) {
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

  const refresh = await createRefreshToken(user._id, randomUUID(), meta);
  return { user, accessToken: signAccessToken(user), ...refresh };
}

export async function refreshSession(rawToken, meta) {
  if (!rawToken) {
    throw new ApiError(401, 'Authentication required');
  }

  const record = await RefreshToken.findOne({ tokenHash: hashToken(rawToken) });
  if (!record) {
    throw new ApiError(401, 'Invalid or expired session');
  }

  if (record.revokedAt) {
    await revokeFamily(record.family);
    throw new ApiError(401, 'Session no longer valid, please log in again');
  }

  if (record.expiresAt <= new Date()) {
    throw new ApiError(401, 'Invalid or expired session');
  }

  const user = await User.findById(record.user);
  if (!user || user.status !== USER_STATUSES.ACTIVE) {
    await revokeFamily(record.family);
    throw new ApiError(401, 'Invalid or expired session');
  }

  const claimed = await RefreshToken.findOneAndUpdate(
    { _id: record._id, revokedAt: null },
    { revokedAt: new Date() }
  );
  if (!claimed) {
    await revokeFamily(record.family);
    throw new ApiError(401, 'Session no longer valid, please log in again');
  }

  const next = await createRefreshToken(user._id, record.family, meta);
  return { user, accessToken: signAccessToken(user), ...next };
}

export async function logoutSession(rawToken) {
  if (!rawToken) return;

  const record = await RefreshToken.findOne({ tokenHash: hashToken(rawToken) });
  if (record) {
    await revokeFamily(record.family);
  }
}

export async function logoutAllSessions(userId) {
  await RefreshToken.updateMany({ user: userId, revokedAt: null }, { revokedAt: new Date() });
}

export async function getCurrentUser(id) {
  const user = await User.findById(id);
  if (!user || user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError(401, 'Authentication required');
  }
  return user;
}
