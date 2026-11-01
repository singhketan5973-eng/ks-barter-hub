'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { registerUser } from '@/lib/auth-api';
import { applyApiErrors } from '@/lib/form-errors';
import { registerSchema } from '@/lib/validation';

const FIELDS = ['name', 'email', 'password'];

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onSubmit(values) {
    setFormError('');
    try {
      await registerUser(values);
      router.push('/login?registered=1');
    } catch (err) {
      if (err.status === 409) {
        setError('email', { type: 'server', message: err.message });
      } else if (!applyApiErrors(err, setError, FIELDS)) {
        setFormError(err.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {formError && <Alert variant="danger">{formError}</Alert>}

      <FormField
        label="Name"
        required
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <FormField
        label="Email"
        type="email"
        required
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <FormField
        label="Password"
        type="password"
        required
        autoComplete="new-password"
        hint="At least 8 characters, with a letter and a number."
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        Create account
      </Button>
    </form>
  );
}
