import { createHash, randomBytes } from 'node:crypto';
import { env } from '../config/env.js';

export const hashToken = (token) => createHash('sha256').update(token).digest('hex');

export function generateRefreshToken() {
  const token = randomBytes(48).toString('base64url');
  return { token, tokenHash: hashToken(token) };
}

export const refreshExpiryDate = () =>
  new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
