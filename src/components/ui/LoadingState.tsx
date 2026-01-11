/**
 * @fileoverview Loading state component with skeleton support
 * @module components/ui/LoadingState
 */

import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Skeleton } from './skeleton';
import { cn } from './utils';

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  type?: 'spinner' | 'skeleton';
  skeletonCount?: number;
  skeletonHeight?: string;
  label?: string;
  className?: string;
}

export function LoadingState({
  isLoading,
  children,
  type = 'spinner',
  skeletonCount = 3,
  skeletonHeight = 'h-20',
  label,
  className
}: LoadingStateProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  if (type === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className={cn('w-full', skeletonHeight)} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <LoadingSpinner label={label} />
    </div>
  );
}
