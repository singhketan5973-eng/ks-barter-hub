import Link from 'next/link';
import { buildQuery } from '@/lib/listing-api';

const linkClass =
  'inline-flex min-h-11 items-center rounded-control border border-line-strong bg-surface px-4 font-medium hover:bg-surface-sunken';

export function Pagination({ pagination, params }) {
  const { page, totalPages, hasNext } = pagination;
  if (totalPages <= 1) {
    return null;
  }

  const href = (target) => `/browse${buildQuery({ ...params, page: target > 1 ? target : '' })}`;

  return (
    <nav aria-label="Pages" className="mt-8 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={linkClass}>
          Previous
        </Link>
      ) : (
        <span />
      )}
      <p className="text-foreground-muted text-sm">
        Page {page} of {totalPages}
      </p>
      {hasNext ? (
        <Link href={href(page + 1)} rel="next" className={linkClass}>
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
