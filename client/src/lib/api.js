const API_URL = process.env.NEXT_PUBLIC_API_URL;

const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function send(path, { method = 'GET', body, headers, ...options } = {}) {
  if (!API_URL) {
    throw new ApiError(0, 'NEXT_PUBLIC_API_URL is not set');
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? 'Something went wrong', data?.details);
  }

  return data;
}

let refreshPromise = null;

function refreshSession() {
  const run = () => send('/auth/refresh', { method: 'POST' });

  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request('barter-hub-refresh', run);
  }
  return run();
}

function refreshOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function api(path, options = {}) {
  try {
    return await send(path, options);
  } catch (err) {
    const canRefresh = err.status === 401 && !NO_REFRESH_PATHS.includes(path);
    if (!canRefresh) {
      throw err;
    }

    try {
      await refreshOnce();
    } catch {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:expired'));
      }
      throw err;
    }

    return send(path, options);
  }
}
