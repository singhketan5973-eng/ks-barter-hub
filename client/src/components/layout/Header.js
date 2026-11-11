'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, status, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="border-line bg-surface border-b">
      <div className="max-w-page mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-heading text-primary text-xl font-semibold">
            Barter Hub
          </Link>
          <Link href="/browse" className="text-foreground hover:text-primary font-medium">
            Browse
          </Link>
        </div>

        <nav aria-label="Account" className="flex items-center gap-2">
          {status === 'loading' && (
            <div
              aria-hidden="true"
              className="rounded-control bg-surface-sunken h-11 w-40 animate-pulse"
            />
          )}

          {status === 'anonymous' && (
            <>
              <Link
                href="/login"
                className="rounded-control text-foreground hover:bg-surface-sunken inline-flex min-h-11 items-center px-4 font-medium"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-control bg-primary text-on-solid hover:bg-primary-hover inline-flex min-h-11 items-center px-4 font-medium"
              >
                Create account
              </Link>
            </>
          )}

          {status === 'authenticated' && (
            <>
              <Link
                href="/listings/new"
                className="rounded-control bg-primary text-on-solid hover:bg-primary-hover inline-flex min-h-11 items-center px-4 font-medium"
              >
                Post a listing
              </Link>
              <Link
                href="/account"
                className="rounded-control hover:bg-surface-sunken inline-flex min-h-11 items-center px-3 font-medium"
              >
                {user.name}
              </Link>
              <Button variant="secondary" onClick={handleSignOut}>
                Log out
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
