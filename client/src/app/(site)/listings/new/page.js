import { RequireAuth } from '@/components/auth/RequireAuth';
import { ListingForm } from '@/components/listings/ListingForm';
import { fetchCategories } from '@/lib/listing-api';

export const metadata = { title: 'Post a listing' };

async function loadCategories() {
  try {
    const { categories } = await fetchCategories({ cache: 'no-store' });
    return categories;
  } catch {
    return [];
  }
}

export default async function NewListingPage() {
  const categories = await loadCategories();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Post a listing</h1>
      <p className="text-foreground-muted mt-2">Tell people what you would like to swap.</p>
      <RequireAuth>
        <ListingForm mode="create" categories={categories} />
      </RequireAuth>
    </div>
  );
}
