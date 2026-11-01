import { cn } from '@/lib/cn';

const styles = {
  info: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
};

export function Alert({ variant = 'info', title, children, className }) {
  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      className={cn('rounded-control px-4 py-3 text-sm', styles[variant], className)}
    >
      {title && <p className="font-medium">{title}</p>}
      {children && <div className={title ? 'mt-1' : undefined}>{children}</div>}
    </div>
  );
}
