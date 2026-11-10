'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { archiveListing } from '@/lib/listing-api';

export function OwnerActions({ listingId, ownerId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.id !== ownerId) {
    return null;
  }

  async function handleArchive() {
    setLoading(true);
    setError('');
    try {
      await archiveListing(listingId);
      router.push('/browse');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="owner-actions-heading"
      className="rounded-card border-line bg-surface border p-5"
    >
      <h2 id="owner-actions-heading" className="text-lg font-semibold">
        This is your listing
      </h2>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {confirming ? (
        <div className="mt-3">
          <p className="text-foreground-muted text-sm">
            Archive this listing? It will be hidden from everyone.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="danger" loading={loading} onClick={handleArchive}>
              Yes, archive it
            </Button>
            <Button variant="ghost" disabled={loading} onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" className="mt-3" onClick={() => setConfirming(true)}>
          Archive listing
        </Button>
      )}
    </section>
  );
}
