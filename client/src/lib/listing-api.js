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

export const fetchCategories = (options = {}) => api('/categories', options);

export const fetchListing = (id, options = {}) => api(`/listings/${id}`, options);

export const archiveListing = (id) => api(`/listings/${id}`, { method: 'DELETE' });

export const createListing = (data) => api('/listings', { method: 'POST', body: data });

export const updateListing = (id, data) => api(`/listings/${id}`, { method: 'PATCH', body: data });

export const fetchMyListings = (params = {}) => api(`/listings/mine${buildQuery(params)}`);
