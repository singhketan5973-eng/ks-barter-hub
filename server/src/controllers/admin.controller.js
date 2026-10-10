import * as adminService from '../services/admin.service.js';

export async function updateUserStatus(req, res) {
  const user = await adminService.setUserStatus(
    req.auth.userId,
    req.validated.params.id,
    req.validated.body.status
  );
  res.json({ user });
}
