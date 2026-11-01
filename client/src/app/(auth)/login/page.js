import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { safeRedirectPath } from '@/lib/redirect';

export const metadata = { title: 'Log in' };

export default async function LoginPage({ searchParams }) {
  const { registered, next } = await searchParams;

  return (
    <>
      <h1 className="text-3xl font-semibold">Log in</h1>
      <p className="text-foreground-muted mt-2">Welcome back.</p>

      <div className="mt-8">
        <LoginForm justRegistered={registered === '1'} next={safeRedirectPath(next)} />
      </div>

      <p className="text-foreground-muted mt-6 text-sm">
        New to Barter Hub?{' '}
        <Link href="/register" className="text-primary font-medium underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </>
  );
}
