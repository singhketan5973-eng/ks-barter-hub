import mongoose from 'mongoose';

export const USER_ROLES = Object.freeze({ USER: 'user', ADMIN: 'admin' });
export const USER_STATUSES = Object.freeze({ ACTIVE: 'active', SUSPENDED: 'suspended' });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name must be at most 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUSES),
      default: USER_STATUSES.ACTIVE,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

export default User;
