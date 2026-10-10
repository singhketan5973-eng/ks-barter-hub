import User, { USER_STATUSES } from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { ApiError } from '../utils/ApiError.js';

export async function setUserStatus(actorId, targetId, status) {
  if (String(actorId) === String(targetId)) {
    throw new ApiError(400, 'You cannot change your own status');
  }

  const user = await User.findByIdAndUpdate(
    targetId,
    { status },
    { returnDocument: 'after', runValidators: true }
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (status === USER_STATUSES.SUSPENDED) {
    await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });
  }

  return user;
}
