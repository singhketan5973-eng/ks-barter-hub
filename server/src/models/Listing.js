import mongoose from 'mongoose';
import { CATEGORY_KINDS } from './Category.js';

export const LISTING_STATUSES = Object.freeze({
  ACTIVE: 'active',
  PENDING: 'pending',
  TRADED: 'traded',
  ARCHIVED: 'archived',
});
export const CONDITIONS = Object.freeze(['new', 'like-new', 'good', 'fair']);
export const SERVICE_MODES = Object.freeze(['remote', 'in-person', 'either']);

const isItem = function () {
  return this.kind === CATEGORY_KINDS.ITEM;
};
const isService = function () {
  return this.kind === CATEGORY_KINDS.SERVICE;
};

const listingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kind: {
      type: String,
      enum: Object.values(CATEGORY_KINDS),
      required: [true, 'Kind is required'],
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    categorySource: { type: String, enum: ['user', 'ai'], default: 'user' },
    categoryConfidence: { type: Number, min: 0, max: 1 },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title must be at most 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [3000, 'Description must be at most 3000 characters'],
    },
    wantedInReturn: {
      type: String,
      trim: true,
      maxlength: [500, 'Wanted in return must be at most 500 characters'],
      default: '',
    },
    city: {
      type: String,
      trim: true,
      maxlength: [80, 'City must be at most 80 characters'],
      default: '',
    },
    condition: {
      type: String,
      enum: [...CONDITIONS],
      required: [isItem, 'Condition is required for things'],
    },
    serviceMode: {
      type: String,
      enum: [...SERVICE_MODES],
      required: [isService, 'Service mode is required for services'],
    },
    durationMinutes: { type: Number, min: 15, max: 1440 },
    availability: { type: String, trim: true, maxlength: 300 },
    status: {
      type: String,
      enum: Object.values(LISTING_STATUSES),
      default: LISTING_STATUSES.ACTIVE,
    },
  },
  { timestamps: true }
);

listingSchema.index({ owner: 1, status: 1, createdAt: -1 });
listingSchema.index({ category: 1, status: 1, createdAt: -1 });

listingSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export default mongoose.model('Listing', listingSchema);
