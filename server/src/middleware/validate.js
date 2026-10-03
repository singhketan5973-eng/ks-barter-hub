import { ApiError } from '../utils/ApiError.js';

export const validate = (schemas) => (req, res, next) => {
  const validated = {};
  const details = {};

  for (const key of ['params', 'query', 'body']) {
    const schema = schemas[key];
    if (!schema) continue;

    const result = schema.safeParse(req[key]);

    if (result.success) {
      validated[key] = result.data;
    } else {
      for (const issue of result.error.issues) {
        const field = [key, ...issue.path].join('.');
        details[field] ??= issue.message;
      }
    }
  }

  if (Object.keys(details).length > 0) {
    return next(new ApiError(400, 'Validation failed', details));
  }

  req.validated = validated;
  next();
};