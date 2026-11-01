import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10 sm:py-16">
      <Link href="/" className="font-heading text-primary text-2xl font-semibold">
        Barter Hub
      </Link>
      <main className="mt-10">{children}</main>
    </div>
  );
}
