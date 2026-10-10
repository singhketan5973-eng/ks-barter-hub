import User, { USER_STATUSES } from '../models/User.js';
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

export const authorize =
  (...allowedRoles) =>
  async (req, res, next) => {
    const user = await User.findById(req.auth.userId).select('role status');

    if (!user || user.status !== USER_STATUSES.ACTIVE || !allowedRoles.includes(user.role)) {
      throw new ApiError(403, 'You do not have permission to do this');
    }

    req.auth.role = user.role;
    next();
  };
