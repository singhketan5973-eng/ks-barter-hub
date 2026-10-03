import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function normalizeError(err) {
  if (err instanceof ApiError) return err;

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message])
    );
    return new ApiError(400, 'Validation failed', details);
  }

  if (err instanceof mongoose.Error.CastError) {
    return new ApiError(400, `Invalid value for ${err.path}`);
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern ?? {}).join(', ');
    return new ApiError(409, `Already exists: ${fields}`);
  }

  if (err.type === 'entity.parse.failed') {
    return new ApiError(400, 'Request body is not valid JSON');
  }

  if (err.type === 'entity.too.large') {
    return new ApiError(413, 'Request body is too large');
  }

  return err;
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const error = normalizeError(err);
  const isKnown = error instanceof ApiError;
  const status = isKnown ? error.status : 500;

  if (!isKnown) console.error(err);

  res.status(status).json({
    message: isKnown ? error.message : 'Internal server error',
    ...(error.details && { details: error.details }),
    ...(!isKnown && env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
