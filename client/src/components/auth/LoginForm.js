'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { loginUser } from '@/lib/auth-api';
import { applyApiErrors } from '@/lib/form-errors';
import { loginSchema } from '@/lib/validation';
import { useAuth } from '@/components/auth/AuthProvider';

const FIELDS = ['email', 'password'];

export function LoginForm({ justRegistered = false, next = '/' }) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values) {
    setFormError('');
    try {
      const { user } = await loginUser(values);
      signIn(user);
      router.push(next);
      router.refresh();
    } catch (err) {
      if (!applyApiErrors(err, setError, FIELDS)) {
        setFormError(err.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {justRegistered && !formError && (
        <Alert variant="success">Account created. Log in to continue.</Alert>
      )}
      {formError && <Alert variant="danger">{formError}</Alert>}

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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        Log in
      </Button>
    </form>
  );
}
