import * as authService from '../services/auth.service.js';
import { setAccessCookie } from '../utils/cookies.js';

export async function register(req, res) {
  const user = await authService.registerUser(req.validated.body);
  res.status(201).json({ user });
}

export async function login(req, res) {
  const { user, accessToken } = await authService.loginUser(req.validated.body);
  setAccessCookie(res, accessToken);
  res.json({ user });
}

export async function me(req, res) {
  const user = await authService.getCurrentUser(req.auth.userId);
  res.json({ user });
}
