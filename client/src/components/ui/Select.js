import { cn } from '@/lib/cn';

export function Select({ invalid = false, className, children, ...props }) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(
        'rounded-control bg-surface text-foreground block min-h-11 w-full border px-3 py-2',
        'disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-70',
        invalid ? 'border-danger' : 'border-line-strong',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
