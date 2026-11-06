import Category, { CATEGORY_KINDS } from '../models/Category.js';
import Listing, { LISTING_STATUSES } from '../models/Listing.js';
import User, { USER_STATUSES } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const MAX_ACTIVE_LISTINGS = 50;

const POPULATE = [
  { path: 'owner', select: 'name city status createdAt' },
  { path: 'category', select: 'name slug kind' },
];

const ITEM_ONLY_FIELDS = ['condition'];
const SERVICE_ONLY_FIELDS = ['serviceMode', 'durationMinutes', 'availability'];
const KIND_LABEL = { [CATEGORY_KINDS.ITEM]: 'things', [CATEGORY_KINDS.SERVICE]: 'services' };

function toListingResponse(listing) {
  const { owner, category } = listing;
  return {
    id: listing.id,
    kind: listing.kind,
    status: listing.status,
    title: listing.title,
    description: listing.description,
    wantedInReturn: listing.wantedInReturn,
    city: listing.city,
    condition: listing.condition,
    serviceMode: listing.serviceMode,
    durationMinutes: listing.durationMinutes,
    availability: listing.availability,
    category: category && {
      id: category.id,
      name: category.name,
      slug: category.slug,
      kind: category.kind,
    },
    owner: owner && {
      id: owner.id,
      name: owner.name,
      city: owner.city,
      memberSince: owner.createdAt,
    },
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
  };
}

async function requireActiveUser(userId) {
  const user = await User.findById(userId).select('status city');
  if (!user || user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError(403, 'This account is not active');
  }
  return user;
}

async function findCategoryForKind(categoryId, kind) {
  const category = await Category.findOne({ _id: categoryId, isActive: true });
  if (!category) {
    throw new ApiError(400, 'Validation failed', { 'body.category': 'Choose a valid category' });
  }
  if (category.kind !== kind) {
    throw new ApiError(400, 'Validation failed', {
      'body.category': `Choose a category for ${KIND_LABEL[kind]}`,
    });
  }
  return category;
}

function pickKindFields(kind, input) {
  const fields = kind === CATEGORY_KINDS.ITEM ? ITEM_ONLY_FIELDS : SERVICE_ONLY_FIELDS;
  return Object.fromEntries(
    fields.filter((field) => input[field] !== undefined).map((field) => [field, input[field]])
  );
}

export async function createListing(userId, input) {
  const owner = await requireActiveUser(userId);
  const category = await findCategoryForKind(input.category, input.kind);

  const activeCount = await Listing.countDocuments({
    owner: owner._id,
    status: LISTING_STATUSES.ACTIVE,
  });
  if (activeCount >= MAX_ACTIVE_LISTINGS) {
    throw new ApiError(409, `You can have at most ${MAX_ACTIVE_LISTINGS} active listings`);
  }

  const listing = await Listing.create({
    owner: owner._id,
    kind: input.kind,
    category: category._id,
    title: input.title,
    description: input.description,
    wantedInReturn: input.wantedInReturn,
    city: input.city ?? owner.city,
    ...pickKindFields(input.kind, input),
  });

  await listing.populate(POPULATE);
  return toListingResponse(listing);
}

export async function getListing(id, viewerId) {
  const listing = await Listing.findById(id).populate(POPULATE);
  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  const isOwner = Boolean(viewerId) && String(listing.owner?._id) === String(viewerId);
  const isPublic =
    listing.status === LISTING_STATUSES.ACTIVE && listing.owner?.status === USER_STATUSES.ACTIVE;

  if (!isOwner && !isPublic) {
    throw new ApiError(404, 'Listing not found');
  }
  return toListingResponse(listing);
}

export async function updateListing(userId, id, changes) {
  await requireActiveUser(userId);

  const listing = await Listing.findOne({ _id: id, owner: userId });
  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }
  if (listing.status !== LISTING_STATUSES.ACTIVE) {
    throw new ApiError(409, 'Only active listings can be edited');
  }

  const notAllowed = listing.kind === CATEGORY_KINDS.ITEM ? SERVICE_ONLY_FIELDS : ITEM_ONLY_FIELDS;
  const wrongFields = notAllowed.filter((field) => changes[field] !== undefined);
  if (wrongFields.length > 0) {
    throw new ApiError(
      400,
      'Validation failed',
      Object.fromEntries(
        wrongFields.map((field) => [
          `body.${field}`,
          `Not available for ${KIND_LABEL[listing.kind]}`,
        ])
      )
    );
  }

  const updates = Object.fromEntries(
    Object.entries(changes).filter(([, value]) => value !== undefined)
  );

  if (updates.category) {
    const category = await findCategoryForKind(updates.category, listing.kind);
    updates.category = category._id;
    updates.categorySource = 'user';
    listing.categoryConfidence = undefined;
  }

  listing.set(updates);
  await listing.save();
  await listing.populate(POPULATE);
  return toListingResponse(listing);
}

export async function archiveListing(userId, id) {
  const listing = await Listing.findOne({ _id: id, owner: userId });
  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }
  if (listing.status === LISTING_STATUSES.ARCHIVED) {
    return;
  }
  if (listing.status !== LISTING_STATUSES.ACTIVE) {
    throw new ApiError(409, 'This listing is part of a trade and cannot be removed');
  }

  listing.status = LISTING_STATUSES.ARCHIVED;
  await listing.save();
}

const SUMMARY_LENGTH = 160;

function toListingSummary(listing) {
  const { owner, category } = listing;
  const text = listing.description ?? '';
  return {
    id: listing.id,
    kind: listing.kind,
    status: listing.status,
    title: listing.title,
    summary: text.length > SUMMARY_LENGTH ? `${text.slice(0, SUMMARY_LENGTH).trimEnd()}…` : text,
    wantedInReturn: listing.wantedInReturn,
    city: listing.city,
    condition: listing.condition,
    serviceMode: listing.serviceMode,
    durationMinutes: listing.durationMinutes,
    category: category && {
      id: category.id,
      name: category.name,
      slug: category.slug,
      kind: category.kind,
    },
    owner: owner && { id: owner.id, name: owner.name, city: owner.city },
    createdAt: listing.createdAt,
  };
}

function buildPagination(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
  };
}

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function browseListings(query) {
  const { q, kind, category, city, page, limit } = query;
  const sort = query.sort ?? (q ? 'relevance' : 'newest');

  const suspendedOwners = await User.find({ status: USER_STATUSES.SUSPENDED }).distinct('_id');
  const filter = { status: LISTING_STATUSES.ACTIVE, owner: { $nin: suspendedOwners } };

  if (kind) filter.kind = kind;
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i');
  if (q) filter.$text = { $search: q };

  if (category) {
    const found = await Category.findOne({ slug: category, isActive: true }).select('_id');
    if (!found) {
      throw new ApiError(400, 'Validation failed', { 'query.category': 'Unknown category' });
    }
    filter.category = found._id;
  }

  const projection = q ? { score: { $meta: 'textScore' } } : undefined;
  const sortSpec =
    sort === 'relevance'
      ? { score: { $meta: 'textScore' }, createdAt: -1 }
      : { createdAt: sort === 'oldest' ? 1 : -1, _id: sort === 'oldest' ? 1 : -1 };

  const [total, docs] = await Promise.all([
    Listing.countDocuments(filter),
    Listing.find(filter, projection)
      .sort(sortSpec)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(POPULATE),
  ]);

  return { listings: docs.map(toListingSummary), pagination: buildPagination(page, limit, total) };
}

export async function getMyListings(userId, { status, page, limit }) {
  const filter = { owner: userId };
  if (status !== 'all') filter.status = status;

  const [total, docs] = await Promise.all([
    Listing.countDocuments(filter),
    Listing.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(POPULATE),
  ]);

  return { listings: docs.map(toListingSummary), pagination: buildPagination(page, limit, total) };
}
