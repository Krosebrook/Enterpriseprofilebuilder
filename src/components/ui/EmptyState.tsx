/**
 * @fileoverview Empty state component for null/empty data
 * @module components/ui/EmptyState
 */

import React from 'react';
import { Inbox, Search, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from './utils';

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'alert';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const icons = {
  inbox: Inbox,
  search: Search,
  alert: AlertCircle
};

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-slate-600">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
