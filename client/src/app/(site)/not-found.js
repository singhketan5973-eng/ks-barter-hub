import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-page mx-auto w-full px-6 py-16">
      <h1 className="text-3xl font-semibold">We could not find that page</h1>
      <p className="text-foreground-muted mt-3 max-w-prose">
        The listing may have been removed, or the address may be wrong.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/browse"
          className="rounded-control bg-primary text-on-solid hover:bg-primary-hover inline-flex min-h-11 items-center px-4 font-medium"
        >
          Browse listings
        </Link>
        <Link
          href="/"
          className="rounded-control border-line-strong bg-surface hover:bg-surface-sunken inline-flex min-h-11 items-center border px-4 font-medium"
        >
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
