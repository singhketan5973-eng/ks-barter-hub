import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const ACCESS_COOKIE = 'accessToken';
export const REFRESH_COOKIE = 'refreshToken';

const REFRESH_PATH = '/api/auth';

const baseOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
};

export function setAccessCookie(res, token) {
  const { exp } = jwt.decode(token);
  res.cookie(ACCESS_COOKIE, token, {
    ...baseOptions,
    path: '/',
    maxAge: exp * 1000 - Date.now(),
  });
}

export function setRefreshCookie(res, token, expiresAt) {
  res.cookie(REFRESH_COOKIE, token, {
    ...baseOptions,
    path: REFRESH_PATH,
    expires: expiresAt,
  });
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE, { ...baseOptions, path: '/' });
  res.clearCookie(REFRESH_COOKIE, { ...baseOptions, path: REFRESH_PATH });
}
