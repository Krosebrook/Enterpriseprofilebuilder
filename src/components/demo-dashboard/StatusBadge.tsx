/**
 * Status Badge Component
 * Visual indicator for tool status
 */

import React from 'react';
import type { ToolStatus } from '@/types/demo-dashboard';
import { getStatusColor, getStatusLabel } from '@/services/demo-dashboard-service';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ToolStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  const colorClasses = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClasses[color as keyof typeof colorClasses],
        className
      )}
    >
      <span
        className={cn(
          'mr-1.5 h-2 w-2 rounded-full',
          {
            'bg-green-500': color === 'green',
            'bg-yellow-500': color === 'yellow',
            'bg-red-500': color === 'red',
            'bg-blue-500': color === 'blue',
            'bg-gray-500': color === 'gray',
          }
        )}
      />
      {label}
    </span>
  );
}
