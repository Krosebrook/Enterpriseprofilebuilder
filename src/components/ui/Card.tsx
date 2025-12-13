import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white border border-slate-200 rounded-lg p-6 shadow-sm
        ${hoverable || onClick ? 'hover:shadow-md hover:border-slate-300 transition-all cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
