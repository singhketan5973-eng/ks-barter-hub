import { api } from '@/lib/api';

export const registerUser = (data) => api('/auth/register', { method: 'POST', body: data });

export const loginUser = (data) => api('/auth/login', { method: 'POST', body: data });
