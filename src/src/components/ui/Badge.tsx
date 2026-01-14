import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    error: "bg-red-100 text-red-700 border-red-200", // mapped danger->error for consistency with usage
    danger: "bg-red-100 text-red-700 border-red-200", // keep danger for back-compat
    info: "bg-blue-100 text-blue-700 border-blue-200",
    outline: "bg-transparent border-slate-300 text-slate-600",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <span className={`inline-flex items-center font-medium rounded border ${variantClass} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
