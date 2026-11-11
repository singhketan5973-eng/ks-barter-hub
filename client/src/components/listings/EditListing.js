'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { ListingForm } from '@/components/listings/ListingForm';
import { Alert } from '@/components/ui/Alert';
import { fetchListing } from '@/lib/listing-api';

export function EditListing({ listingId, categories }) {
  const { user } = useAuth();
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetchListing(listingId)
      .then(({ listing }) => {
        if (!cancelled) setState({ status: 'ready', listing });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ status: 'error', notFound: err.status === 404 || err.status === 400 });
      });

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  if (state.status === 'loading') {
    return (
      <div aria-busy="true" className="mt-8 space-y-4">
        <div className="rounded-control bg-surface-sunken h-10 animate-pulse" />
        <div className="rounded-control bg-surface-sunken h-10 animate-pulse" />
        <span className="sr-only">Loading the listing</span>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <Alert variant="warning" className="mt-8">
        {state.notFound
          ? 'We could not find that listing.'
          : 'We could not load the listing. Please try again in a moment.'}
      </Alert>
    );
  }

  const { listing } = state;

  if (listing.owner?.id !== user.id) {
    return (
      <Alert variant="warning" className="mt-8">
        You can only edit your own listings.{' '}
        <Link href={`/listings/${listing.id}`} className="font-medium underline">
          Back to the listing
        </Link>
      </Alert>
    );
  }

  if (listing.status !== 'active') {
    return (
      <Alert variant="warning" className="mt-8">
        Only active listings can be edited.{' '}
        <Link href={`/listings/${listing.id}`} className="font-medium underline">
          Back to the listing
        </Link>
      </Alert>
    );
  }

  return <ListingForm mode="edit" categories={categories} listing={listing} />;
}
