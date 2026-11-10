import { cache, Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OwnerActions } from '@/components/listings/OwnerActions';
import { Alert } from '@/components/ui/Alert';
import { fetchListing } from '@/lib/listing-api';

const KIND_LABEL = { item: 'Thing', service: 'Service' };
const CONDITION_LABEL = { new: 'New', 'like-new': 'Like new', good: 'Good', fair: 'Fair' };
const SERVICE_MODE_LABEL = {
  remote: 'Online',
  'in-person': 'In person',
  either: 'Online or in person',
};

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const monthFormat = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' });

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hoursText = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  return rest ? `${hoursText} ${rest} minutes` : hoursText;
}

const getListing = cache(async (id) => {
  try {
    const { listing } = await fetchListing(id, { cache: 'no-store' });
    return listing;
  } catch (err) {
    if (err.status === 404 || err.status === 400) {
      return null;
    }
    throw err;
  }
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) {
    return { title: 'Listing not found' };
  }

  const description = listing.description.slice(0, 160);
  return {
    title: listing.title,
    description,
    openGraph: { title: listing.title, description, type: 'website' },
  };
}

export default async function ListingPage({ params }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) {
    notFound();
  }

  const { kind, title, description, wantedInReturn, city, category, owner } = listing;

  const details = [
    kind === 'item' && listing.condition && ['Condition', CONDITION_LABEL[listing.condition]],
    kind === 'service' &&
      listing.serviceMode && ['How it works', SERVICE_MODE_LABEL[listing.serviceMode]],
    kind === 'service' &&
      listing.durationMinutes && ['Time needed', formatDuration(listing.durationMinutes)],
    kind === 'service' && listing.availability && ['Availability', listing.availability],
    city && ['Location', city],
  ].filter(Boolean);

  return (
    <div className="max-w-page mx-auto w-full px-6 py-10">
      <Link
        href="/browse"
        className="text-primary text-sm font-medium underline underline-offset-2"
      >
        &larr; Back to listings
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article>
          <p className="text-foreground-muted flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-control bg-primary-soft text-primary px-2 py-0.5 font-medium">
              {KIND_LABEL[kind] ?? kind}
            </span>
            {category && (
              <Link
                href={`/browse?category=${category.slug}`}
                className="hover:text-primary underline underline-offset-2"
              >
                {category.name}
              </Link>
            )}
          </p>

          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="text-foreground-muted mt-2 text-sm">
            {[city, `Posted ${dateFormat.format(new Date(listing.createdAt))}`]
              .filter(Boolean)
              .join(' \u00B7 ')}
          </p>

          <section aria-labelledby="about-heading" className="mt-8">
            <h2 id="about-heading" className="text-xl font-semibold">
              About this {kind === 'item' ? 'thing' : 'service'}
            </h2>
            <p className="mt-3 max-w-prose whitespace-pre-line">{description}</p>
          </section>

          {details.length > 0 && (
            <section aria-labelledby="details-heading" className="mt-8">
              <h2 id="details-heading" className="text-xl font-semibold">
                Details
              </h2>
              <dl className="mt-3 grid max-w-prose gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
                {details.map(([label, value]) => (
                  <Fragment key={label}>
                    <dt className="font-medium">{label}</dt>
                    <dd className="text-foreground-muted">{value}</dd>
                  </Fragment>
                ))}
              </dl>
            </section>
          )}
        </article>

        <aside className="space-y-4">
          <section
            aria-labelledby="return-heading"
            className="rounded-card border-line bg-surface border p-5"
          >
            <h2 id="return-heading" className="text-lg font-semibold">
              In return, I&apos;d like
            </h2>
            <p className="mt-2">{wantedInReturn || 'Open to offers.'}</p>
          </section>

          {owner && (
            <section
              aria-labelledby="owner-heading"
              className="rounded-card border-line bg-surface border p-5"
            >
              <h2 id="owner-heading" className="text-lg font-semibold">
                Offered by
              </h2>
              <p className="mt-2 font-medium">{owner.name}</p>
              <p className="text-foreground-muted text-sm">
                {[owner.city, `Member since ${monthFormat.format(new Date(owner.memberSince))}`]
                  .filter(Boolean)
                  .join(' \u00B7 ')}
              </p>
            </section>
          )}

          <Alert variant="info" title="Offers are coming soon">
            You will be able to propose a swap right here.
          </Alert>

          <OwnerActions listingId={listing.id} ownerId={owner?.id} />
        </aside>
      </div>
    </div>
  );
}
