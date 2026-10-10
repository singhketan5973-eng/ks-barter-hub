import User, { USER_STATUSES } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export async function getPublicProfile(id) {
  const user = await User.findOne({ _id: id, status: USER_STATUSES.ACTIVE });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return {
    id: user.id,
    name: user.name,
    bio: user.bio,
    city: user.city,
    memberSince: user.createdAt,
  };
}

export async function updateProfile(userId, changes) {
  const user = await User.findOneAndUpdate(
    { _id: userId, status: USER_STATUSES.ACTIVE },
    { $set: changes },
    { returnDocument: 'after', runValidators: true }
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
}
