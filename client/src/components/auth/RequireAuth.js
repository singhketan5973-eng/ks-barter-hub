'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export function RequireAuth({ children }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  if (status !== 'authenticated') {
    return (
      <div aria-busy="true" className="mt-8 space-y-4">
        <div className="rounded-control bg-surface-sunken h-10 animate-pulse" />
        <div className="rounded-control bg-surface-sunken h-10 animate-pulse" />
        <span className="sr-only">Loading your account</span>
      </div>
    );
  }

  return children;
}
