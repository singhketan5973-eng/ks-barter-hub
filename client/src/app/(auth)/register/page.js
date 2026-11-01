import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = { title: 'Create your account' };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Create your account</h1>
      <p className="text-foreground-muted mt-2">Swap things and skills with people near you.</p>

      <div className="mt-8">
        <RegisterForm />
      </div>

      <p className="text-foreground-muted mt-6 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-medium underline underline-offset-2">
          Log in
        </Link>
      </p>
    </>
  );
}
