import { api } from '@/lib/api';

export const updateProfile = (data) => api('/users/me', { method: 'PATCH', body: data });
