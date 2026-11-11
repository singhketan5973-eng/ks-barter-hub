'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import { Select } from './Select';

export function SelectField({
  label,
  error,
  hint,
  required = false,
  className,
  children,
  ...selectProps
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger">
            {' '}
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-foreground-muted text-sm">
          {hint}
        </p>
      )}
      <Select
        id={id}
        invalid={Boolean(error)}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        {...selectProps}
      >
        {children}
      </Select>
      {error && (
        <p id={errorId} role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
