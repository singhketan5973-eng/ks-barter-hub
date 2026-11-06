import * as listingService from '../services/listing.service.js';

export async function create(req, res) {
  const listing = await listingService.createListing(req.auth.userId, req.validated.body);
  res.status(201).json({ listing });
}

export async function getOne(req, res) {
  const listing = await listingService.getListing(req.validated.params.id, req.auth?.userId);
  res.json({ listing });
}

export async function update(req, res) {
  const listing = await listingService.updateListing(
    req.auth.userId,
    req.validated.params.id,
    req.validated.body
  );
  res.json({ listing });
}

export async function archive(req, res) {
  await listingService.archiveListing(req.auth.userId, req.validated.params.id);
  res.status(204).end();
}

export async function browse(req, res) {
  const result = await listingService.browseListings(req.validated.query);
  res.json(result);
}

export async function mine(req, res) {
  const result = await listingService.getMyListings(req.auth.userId, req.validated.query);
  res.json(result);
}
