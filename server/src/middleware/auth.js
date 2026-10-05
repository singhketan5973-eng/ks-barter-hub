import { ApiError } from '../utils/ApiError.js';
import { ACCESS_COOKIE } from '../utils/cookies.js';
import { verifyAccessToken } from '../utils/tokens.js';

export function authenticate(req, res, next) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  const payload = verifyAccessToken(token);
  req.auth = { userId: payload.sub, role: payload.role };
  next();
}
