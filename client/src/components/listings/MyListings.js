'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { archiveListing, fetchMyListings } from '@/lib/listing-api';

const PAGE_SIZE = 10;

const TABS = [
  ['all', 'All'],
  ['active', 'Active'],
  ['archived', 'Archived'],
];

const STATUS_LABEL = {
  active: 'Active',
  pending: 'In a trade',
  traded: 'Traded',
  archived: 'Archived',
};

const STATUS_STYLE = {
  active: 'bg-success-soft text-success',
  pending: 'bg-warning-soft text-warning',
  traded: 'bg-primary-soft text-primary',
  archived: 'bg-surface-sunken text-foreground-muted',
};

const KIND_LABEL = { item: 'Thing', service: 'Service' };

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const linkButtonClass =
  'inline-flex min-h-11 items-center justify-center rounded-control border border-line-strong bg-surface px-4 font-medium hover:bg-surface-sunken';

function ListingRow({ listing, confirming, busy, onAsk, onCancel, onConfirm }) {
  const meta = [`Posted ${dateFormat.format(new Date(listing.createdAt))}`, listing.city].filter(
    Boolean
  );

  return (
    <li className="rounded-card border-line bg-surface border p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <span
              className={cn(
                'rounded-control px-2 py-0.5 font-medium',
                STATUS_STYLE[listing.status]
              )}
            >
              {STATUS_LABEL[listing.status] ?? listing.status}
            </span>
            <span className="text-foreground-muted">
              {[KIND_LABEL[listing.kind], listing.category?.name].filter(Boolean).join(' \u00B7 ')}
            </span>
          </p>
          <h2 className="mt-2 text-lg font-semibold break-words">
            <Link href={`/listings/${listing.id}`} className="hover:underline">
              {listing.title}
            </Link>
          </h2>
          <p className="text-foreground-muted mt-1 text-sm">{meta.join(' \u00B7 ')}</p>
        </div>

        {listing.status === 'active' && !confirming && (
          <div className="flex flex-wrap gap-2">
            <Link href={`/listings/${listing.id}/edit`} className={linkButtonClass}>
              Edit
            </Link>
            <Button variant="secondary" onClick={onAsk}>
              Archive
            </Button>
          </div>
        )}

        {listing.status === 'active' && confirming && (
          <div className="w-full sm:w-auto">
            <p className="text-foreground-muted text-sm">
              Archive this listing? It will be hidden from everyone.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="danger" loading={busy} onClick={onConfirm}>
                Yes, archive it
              </Button>
              <Button variant="ghost" disabled={busy} onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {listing.status === 'archived' && (
          <p className="text-foreground-muted text-sm">Only you can see this listing.</p>
        )}
      </div>
    </li>
  );
}

function EmptyState({ tab, page, onFirstPage }) {
  if (page > 1) {
    return (
      <p className="mt-4">
        There are no more listings.{' '}
        <button
          type="button"
          onClick={onFirstPage}
          className="text-primary font-medium underline underline-offset-2"
        >
          Go to the first page
        </button>
      </p>
    );
  }

  if (tab === 'all') {
    return (
      <div className="rounded-card border-line bg-surface mt-4 border p-6">
        <p className="font-medium">You have not posted anything yet.</p>
        <p className="text-foreground-muted mt-1 text-sm">
          Post a thing or a skill to start swapping.
        </p>
        <Link
          href="/listings/new"
          className="rounded-control bg-primary text-on-solid hover:bg-primary-hover mt-4 inline-flex min-h-11 items-center px-4 font-medium"
        >
          Post a listing
        </Link>
      </div>
    );
  }

  return <p className="text-foreground-muted mt-4">You have no {tab} listings.</p>;
}

export function MyListings() {
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState('');

  const requestKey = `${tab}:${page}:${reloadKey}`;
  const loading = result?.key !== requestKey;

  useEffect(() => {
    let cancelled = false;

    fetchMyListings({ status: tab, page, limit: PAGE_SIZE })
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, ...data });
      })
      .catch((err) => {
        if (!cancelled) setResult({ key: requestKey, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [tab, page, requestKey]);

  function changeTab(next) {
    setTab(next);
    setPage(1);
    setConfirmingId(null);
    setActionError('');
  }

  function goToPage(next) {
    setPage(next);
    setConfirmingId(null);
    setActionError('');
  }

  async function handleArchive(id) {
    setBusyId(id);
    setActionError('');
    try {
      await archiveListing(id);
      setConfirmingId(null);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-6">
      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={tab === value}
            onClick={() => changeTab(value)}
            className={cn(
              'rounded-control min-h-11 border px-4 font-medium',
              tab === value
                ? 'border-primary bg-primary text-on-solid'
                : 'border-line-strong bg-surface hover:bg-surface-sunken'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {actionError && (
        <Alert variant="danger" className="mt-4">
          {actionError}
        </Alert>
      )}

      {loading && (
        <div aria-busy="true" className="mt-6 space-y-3">
          <div className="rounded-card bg-surface-sunken h-24 animate-pulse" />
          <div className="rounded-card bg-surface-sunken h-24 animate-pulse" />
          <div className="rounded-card bg-surface-sunken h-24 animate-pulse" />
          <span className="sr-only">Loading your listings</span>
        </div>
      )}

      {!loading && result.error && (
        <div className="mt-6">
          <Alert variant="danger">{result.error}</Alert>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Try again
          </Button>
        </div>
      )}

      {!loading && !result.error && (
        <>
          <p className="text-foreground-muted mt-6 text-sm">
            {result.pagination.total} {result.pagination.total === 1 ? 'listing' : 'listings'}
          </p>

          {result.listings.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {result.listings.map((listing) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  confirming={confirmingId === listing.id}
                  busy={busyId === listing.id}
                  onAsk={() => setConfirmingId(listing.id)}
                  onCancel={() => setConfirmingId(null)}
                  onConfirm={() => handleArchive(listing.id)}
                />
              ))}
            </ul>
          ) : (
            <EmptyState tab={tab} page={page} onFirstPage={() => goToPage(1)} />
          )}

          {result.pagination.totalPages > 1 && (
            <nav aria-label="Pages" className="mt-6 flex items-center justify-between gap-4">
              <Button variant="secondary" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                Previous
              </Button>
              <p className="text-foreground-muted text-sm">
                Page {result.pagination.page} of {result.pagination.totalPages}
              </p>
              <Button
                variant="secondary"
                disabled={!result.pagination.hasNext}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
