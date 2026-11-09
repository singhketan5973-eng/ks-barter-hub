'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

const primaryClass =
  'inline-flex min-h-12 items-center rounded-control bg-accent px-6 text-lg font-medium text-on-solid hover:bg-accent-hover';
const secondaryClass =
  'inline-flex min-h-12 items-center rounded-control border border-line-strong bg-surface px-6 text-lg font-medium hover:bg-surface-sunken';

export function HeroActions() {
  const { status } = useAuth();

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {status === 'loading' && (
        <div aria-hidden="true" className="h-12 w-44 animate-pulse rounded-control bg-surface-sunken" />
      )}

      {status === 'anonymous' && (
        <>
          <Link href="/register" className={primaryClass}>
            Start swapping
          </Link>
          <Link href="/browse" className={secondaryClass}>
            Browse listings
          </Link>
        </>
      )}

      {status === 'authenticated' && (
        <Link href="/browse" className={primaryClass}>
          Browse listings
        </Link>
      )}
    </div>
  );
}