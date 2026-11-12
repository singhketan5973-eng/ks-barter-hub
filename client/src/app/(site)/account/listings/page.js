import Link from 'next/link';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { MyListings } from '@/components/listings/MyListings';

export const metadata = { title: 'Your listings' };

export default function MyListingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Your listings</h1>
        <Link
          href="/listings/new"
          className="rounded-control bg-primary text-on-solid hover:bg-primary-hover inline-flex min-h-11 items-center px-4 font-medium"
        >
          Post a listing
        </Link>
      </div>
      <RequireAuth>
        <MyListings />
      </RequireAuth>
    </div>
  );
}
