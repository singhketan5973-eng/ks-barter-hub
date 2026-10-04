import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';

const ISSUER = 'barter-hub';
const ALGORITHM = 'HS256';

export function signAccessToken(user) {
  return jwt.sign({ role: user.role }, env.JWT_ACCESS_SECRET, {
    subject: String(user.id),
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    issuer: ISSUER,
    algorithm: ALGORITHM,
  });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: ISSUER,
      algorithms: [ALGORITHM],
    });
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
}
