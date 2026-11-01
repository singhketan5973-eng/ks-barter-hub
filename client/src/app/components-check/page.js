import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';

export const metadata = { title: 'Components check' };

export default function ComponentsCheck() {
  return (
    <main className="max-w-page mx-auto w-full px-6 py-12">
      <h1 className="text-3xl font-semibold">Components check</h1>

      <section className="mt-8 flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="accent">Make an offer</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Delete</Button>
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
      </section>

      <section className="mt-10 grid max-w-sm gap-5">
        <FormField label="Name" required placeholder="Your full name" />
        <FormField
          label="Email"
          type="email"
          required
          hint="We never show this publicly."
          placeholder="you@example.com"
        />
        <FormField
          label="Password"
          type="password"
          required
          error="Use at least 8 characters, with a letter and a number."
        />
        <FormField label="City" disabled placeholder="Disabled field" />
      </section>

      <section className="mt-10 grid max-w-xl gap-3">
        <Alert variant="info">Your profile is visible to other members.</Alert>
        <Alert variant="success" title="Offer sent">
          They will be notified.
        </Alert>
        <Alert variant="warning">This listing expires in 2 days.</Alert>
        <Alert variant="danger" title="Could not log in">
          Invalid email or password.
        </Alert>
      </section>
    </main>
  );
}
