'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    api('/auth/me')
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
          setStatus('authenticated');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setStatus('anonymous');
        }
      });

    const onExpired = () => {
      setUser(null);
      setStatus('anonymous');
    };
    window.addEventListener('auth:expired', onExpired);

    return () => {
      cancelled = true;
      window.removeEventListener('auth:expired', onExpired);
    };
  }, []);

  const signIn = useCallback((nextUser) => {
    setUser(nextUser);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      // The screen is cleared below whether or not the server could be reached.
    }
    setUser(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo(() => ({ user, status, signIn, signOut }), [user, status, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
