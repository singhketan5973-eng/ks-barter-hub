'use client';

import { Button } from '@/components/ui/Button';

export default function SiteError({ reset }) {
  return (
    <div className="max-w-page mx-auto w-full px-6 py-16">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="text-foreground-muted mt-3 max-w-prose">
        We could not load this page. Please try again.
      </p>
      <div className="mt-6">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
