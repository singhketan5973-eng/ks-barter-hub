'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/auth/AuthProvider';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { applyApiErrors } from '@/lib/form-errors';
import { updateProfile } from '@/lib/user-api';
import { profileSchema } from '@/lib/validation';

const FIELDS = ['name', 'city', 'bio'];

const toFormValues = (user) => ({
  name: user.name,
  city: user.city ?? '',
  bio: user.bio ?? '',
});

export function ProfileForm() {
  const { user, signIn } = useAuth();
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(user),
  });

  async function onSubmit(values) {
    setFormError('');
    setSaved(false);
    try {
      const { user: updated } = await updateProfile(values);
      signIn(updated);
      reset(toFormValues(updated));
      setSaved(true);
    } catch (err) {
      if (!applyApiErrors(err, setError, FIELDS)) {
        setFormError(err.message);
      }
    }
  }

  return (
    <section aria-labelledby="profile-heading" className="mt-8">
      <h2 id="profile-heading" className="text-xl font-semibold">
        Profile
      </h2>
      <p className="text-foreground-muted mt-1 text-sm">
        Your name, city and bio are visible to other members. Your email never is.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        {formError && <Alert variant="danger">{formError}</Alert>}
        {saved && !isDirty && <Alert variant="success">Profile saved.</Alert>}

        <FormField
          label="Email"
          type="email"
          defaultValue={user.email}
          disabled
          hint="Changing your email isn't available yet."
        />
        <FormField
          label="Name"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <FormField
          label="City"
          autoComplete="address-level2"
          hint="A town or city is enough. Never share a full address."
          error={errors.city?.message}
          {...register('city')}
        />
        <FormField
          label="About you"
          multiline
          rows={5}
          hint="What do you like to swap? Up to 500 characters."
          error={errors.bio?.message}
          {...register('bio')}
        />

        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Save changes
        </Button>
      </form>
    </section>
  );
}
