import Link from 'next/link';

const KIND_LABEL = { item: 'Thing', service: 'Service' };

export function ListingCard({ listing }) {
  const { id, kind, title, summary, wantedInReturn, city, category, owner } = listing;
  const meta = [city, owner?.name].filter(Boolean).join(' · ');

  return (
    <article className="rounded-card border-line bg-surface hover:shadow-hover has-[:focus-visible]:outline-primary relative flex h-full flex-col border p-5 transition-shadow has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2">
      <p className="text-foreground-muted flex items-center gap-2 text-sm">
        <span className="rounded-control bg-primary-soft text-primary px-2 py-0.5 font-medium">
          {KIND_LABEL[kind] ?? kind}
        </span>
        {category?.name && <span>{category.name}</span>}
      </p>

      <h3 className="mt-3 text-lg font-semibold">
        <Link
          href={`/listings/${id}`}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {title}
        </Link>
      </h3>

      <p className="text-foreground-muted mt-2 line-clamp-3">{summary}</p>

      {wantedInReturn && (
        <p className="mt-3 text-sm">
          <span className="font-medium">Wants:</span> {wantedInReturn}
        </p>
      )}

      {meta && <p className="text-foreground-muted mt-auto pt-4 text-sm">{meta}</p>}
    </article>
  );
}
