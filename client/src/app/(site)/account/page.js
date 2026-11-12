import Link from 'next/link';
import { ProfileForm } from '@/components/account/ProfileForm';
import { SessionsCard } from '@/components/account/SessionsCard';
import { RequireAuth } from '@/components/auth/RequireAuth';

export const metadata = { title: 'Your account' };

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Your account</h1>
      <p className="mt-2">
        <Link
          href="/account/listings"
          className="text-primary font-medium underline underline-offset-2"
        >
          Your listings
        </Link>
      </p>
      <RequireAuth>
        <ProfileForm />
        <SessionsCard />
      </RequireAuth>
    </div>
  );
}
