import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const ACCESS_COOKIE = 'accessToken';

const baseOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export function setAccessCookie(res, token) {
  const { exp } = jwt.decode(token);
  res.cookie(ACCESS_COOKIE, token, {
    ...baseOptions,
    maxAge: exp * 1000 - Date.now(),
  });
}
