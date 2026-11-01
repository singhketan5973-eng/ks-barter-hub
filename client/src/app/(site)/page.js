import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-page mx-auto w-full px-6 py-16">
      <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">
        Swap what you have for what you need
      </h1>
      <p className="text-foreground-muted mt-4 max-w-prose text-lg">
        Trade things and skills with people near you. No money needed.
      </p>
      <div className="mt-8">
        <Link
          href="/register"
          className="rounded-control bg-accent text-on-solid hover:bg-accent-hover inline-flex min-h-12 items-center px-6 text-lg font-medium"
        >
          Start swapping
        </Link>
      </div>
    </div>
  );
}
