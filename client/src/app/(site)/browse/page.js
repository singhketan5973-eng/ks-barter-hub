import Link from 'next/link';
import { BrowseFilters } from '@/components/listings/BrowseFilters';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { Pagination } from '@/components/listings/Pagination';
import { Alert } from '@/components/ui/Alert';
import { buildQuery, fetchCategories, fetchListings } from '@/lib/listing-api';

export const metadata = { title: 'Browse listings' };

const PAGE_SIZE = 12;
const FILTER_KEYS = ['q', 'kind', 'category', 'city', 'sort'];

const first = (value) => (Array.isArray(value) ? value[0] : value);

async function loadCategories() {
  try {
    const { categories } = await fetchCategories({ cache: 'no-store' });
    return categories;
  } catch {
    return [];
  }
}

async function loadListings(params) {
  try {
    return { data: await fetchListings(params, { cache: 'no-store' }) };
  } catch (err) {
    const detail = err.details ? Object.values(err.details)[0] : null;
    return {
      error:
        err.status === 400 && detail
          ? detail
          : 'We could not load listings right now. Please try again in a moment.',
    };
  }
}

export default async function BrowsePage({ searchParams }) {
  const raw = await searchParams;
  const filters = Object.fromEntries(FILTER_KEYS.map((key) => [key, first(raw[key]) ?? '']));
  const page = Math.max(1, Number.parseInt(first(raw.page) ?? '1', 10) || 1);

  const [categories, result] = await Promise.all([
    loadCategories(),
    loadListings({ ...filters, page, limit: PAGE_SIZE }),
  ]);

  const hasFilters = FILTER_KEYS.some((key) => filters[key]);
  const listings = result.data?.listings ?? [];
  const pagination = result.data?.pagination;

  return (
    <div className="max-w-page mx-auto w-full px-6 py-10">
      <h1 className="text-3xl font-semibold">Browse listings</h1>
      <p className="text-foreground-muted mt-2">
        Find things and skills that people near you want to swap.
      </p>

      <div className="mt-6">
        <BrowseFilters
          key={Object.values(filters).join('|')}
          values={filters}
          categories={categories}
        />
      </div>

      <section aria-label="Results" className="mt-8">
        {result.error && <Alert variant="warning">{result.error}</Alert>}

        {pagination && (
          <>
            <p className="text-foreground-muted text-sm">
              {pagination.total} {pagination.total === 1 ? 'listing' : 'listings'}
              {filters.q ? ` for \u201C${filters.q}\u201D` : ''}
            </p>

            {listings.length > 0 && (
              <div className="mt-4">
                <ListingGrid listings={listings} />
              </div>
            )}

            {listings.length === 0 && (
              <div className="rounded-card border-line bg-surface mt-4 border p-6">
                {page > 1 ? (
                  <p>
                    There are no more results.{' '}
                    <Link
                      href={`/browse${buildQuery(filters)}`}
                      className="text-primary font-medium underline underline-offset-2"
                    >
                      Go back to the first page
                    </Link>
                    .
                  </p>
                ) : hasFilters ? (
                  <>
                    <p className="font-medium">No listings match your search.</p>
                    <p className="text-foreground-muted mt-1 text-sm">
                      Try fewer filters or different words. Search matches whole words, so
                      &ldquo;guitar&rdquo; works but &ldquo;guit&rdquo; does not.
                    </p>
                  </>
                ) : (
                  <p>No listings yet. Be the first to post one.</p>
                )}
              </div>
            )}

            <Pagination pagination={pagination} params={filters} />
          </>
        )}
      </section>
    </div>
  );
}
