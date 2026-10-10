import * as userService from '../services/user.service.js';

export async function getProfile(req, res) {
  const profile = await userService.getPublicProfile(req.validated.params.id);
  res.json({ user: profile });
}

export async function updateMe(req, res) {
  const user = await userService.updateProfile(req.auth.userId, req.validated.body);
  res.json({ user });
}
