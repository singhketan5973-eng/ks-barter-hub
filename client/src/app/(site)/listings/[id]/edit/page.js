import { EditListing } from '@/components/listings/EditListing';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { fetchCategories } from '@/lib/listing-api';

export const metadata = { title: 'Edit listing' };

async function loadCategories() {
  try {
    const { categories } = await fetchCategories({ cache: 'no-store' });
    return categories;
  } catch {
    return [];
  }
}

export default async function EditListingPage({ params }) {
  const { id } = await params;
  const categories = await loadCategories();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Edit listing</h1>
      <RequireAuth>
        <EditListing listingId={id} categories={categories} />
      </RequireAuth>
    </div>
  );
}
