import { cn } from '@/lib/cn';

export function Input({ invalid = false, className, ...props }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'rounded-control bg-surface text-foreground block min-h-11 w-full border px-3 py-2',
        'placeholder:text-foreground-muted',
        'disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-70',
        invalid ? 'border-danger' : 'border-line-strong',
        className
      )}
      {...props}
    />
  );
}
