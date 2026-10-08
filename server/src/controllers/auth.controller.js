import * as authService from '../services/auth.service.js';
import {
  REFRESH_COOKIE,
  clearAuthCookies,
  setAccessCookie,
  setRefreshCookie,
} from '../utils/cookies.js';

const requestMeta = (req) => ({ userAgent: req.get('user-agent'), ip: req.ip });

function startSession(res, session) {
  setAccessCookie(res, session.accessToken);
  setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
}

export async function register(req, res) {
  const user = await authService.registerUser(req.validated.body);
  res.status(201).json({ user });
}

export async function login(req, res) {
  const session = await authService.loginUser(req.validated.body, requestMeta(req));
  startSession(res, session);
  res.json({ user: session.user });
}

export async function refresh(req, res) {
  try {
    const session = await authService.refreshSession(
      req.cookies?.[REFRESH_COOKIE],
      requestMeta(req)
    );
    startSession(res, session);
    res.json({ user: session.user });
  } catch (err) {
    clearAuthCookies(res);
    throw err;
  }
}

export async function logout(req, res) {
  await authService.logoutSession(req.cookies?.[REFRESH_COOKIE]);
  clearAuthCookies(res);
  res.status(204).end();
}

export async function logoutAll(req, res) {
  await authService.logoutAllSessions(req.auth.userId);
  clearAuthCookies(res);
  res.status(204).end();
}

export async function me(req, res) {
  const user = await authService.getCurrentUser(req.auth.userId);
  res.json({ user });
}
