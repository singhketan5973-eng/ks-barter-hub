import Link from 'next/link';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { Alert } from '@/components/ui/Alert';
import { fetchListings } from '@/lib/listing-api';
import { HeroActions } from '@/components/home/HeroActions';

async function getLatestListings() {
  try {
    const { listings } = await fetchListings({ limit: 8 }, { cache: 'no-store' });
    return listings;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const listings = await getLatestListings();

  return (
    <>
      <section className="max-w-page mx-auto w-full px-6 py-16">
        <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">
          Swap what you have for what you need
        </h1>
        <p className="text-foreground-muted mt-4 max-w-prose text-lg">
          Trade things and skills with people near you. No money needed.
        </p>
        <HeroActions />
      </section>

      <section aria-labelledby="newest-heading" className="max-w-page mx-auto w-full px-6 pb-8">
        <div className="flex items-end justify-between gap-4">
          <h2 id="newest-heading" className="text-2xl font-semibold">
            Newest listings
          </h2>
          <Link href="/browse" className="text-primary font-medium underline underline-offset-2">
            Browse all
          </Link>
        </div>

        <div className="mt-6">
          {listings === null && (
            <Alert variant="warning">
              We could not load listings right now. Please try again in a moment.
            </Alert>
          )}
          {listings?.length === 0 && (
            <p className="text-foreground-muted">No listings yet. Be the first to post one.</p>
          )}
          {listings?.length > 0 && <ListingGrid listings={listings} />}
        </div>
      </section>
    </>
  );
}
