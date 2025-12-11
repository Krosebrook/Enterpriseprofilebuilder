import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export function Card({ children, className = '', padding = 'md', hoverable = false }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverStyles = hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : '';

  return (
    <div className={`bg-white border border-slate-200 rounded-lg ${paddingStyles[padding]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}
