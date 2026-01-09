import { cn } from './utils';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'secondary';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/**
 * Badge component for displaying status and labels
 * @param variant - Visual style variant
 * @param className - Additional CSS classes
 * @param children - Badge content
 */
export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-slate-100 text-slate-900',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outline: 'border border-slate-300 text-slate-700 bg-transparent',
    secondary: 'bg-slate-200 text-slate-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
