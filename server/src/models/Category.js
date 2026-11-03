import mongoose from 'mongoose';

export const CATEGORY_KINDS = Object.freeze({ ITEM: 'item', SERVICE: 'service' });

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name must be at most 60 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug is not valid'],
    },
    kind: {
      type: String,
      enum: Object.values(CATEGORY_KINDS),
      required: [true, 'Kind is required'],
    },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.index({ parent: 1, sortOrder: 1 });

categorySchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export default mongoose.model('Category', categorySchema);
