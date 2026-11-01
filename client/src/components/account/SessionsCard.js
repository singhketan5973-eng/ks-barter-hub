'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { logoutAllSessions } from '@/lib/auth-api';

export function SessionsCard() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');
    try {
      await logoutAllSessions();
      await signOut();
      router.push('/login');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="sessions-heading" className="border-line mt-12 border-t pt-8">
      <h2 id="sessions-heading" className="text-xl font-semibold">
        Sessions
      </h2>
      <p className="text-foreground-muted mt-1 text-sm">
        Log out on every device where you&apos;re signed in. Use this if you lose a phone or used a
        shared computer.
      </p>

      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}

      <Button variant="secondary" loading={loading} onClick={handleClick} className="mt-4">
        Sign out everywhere
      </Button>
    </section>
  );
}
