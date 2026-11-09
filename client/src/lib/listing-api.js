import { api } from '@/lib/api';

export function buildQuery(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      search.set(key, String(value).trim());
    }
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}

export const fetchListings = (params = {}, options = {}) =>
  api(`/listings${buildQuery(params)}`, options);
