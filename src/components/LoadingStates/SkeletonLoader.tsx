import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
};

export function Skeleton({ className = '', width, height, rounded = 'md' }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div 
      className={`animate-pulse bg-slate-200 ${roundedClasses[rounded]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 border border-slate-200 rounded-lg space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <Skeleton width="60%" height="20px" />
        <Skeleton width="60px" height="24px" rounded="full" />
      </div>
      <Skeleton width="100%" height="16px" />
      <Skeleton width="80%" height="16px" />
      <div className="flex gap-2 pt-2">
        <Skeleton width="80px" height="32px" />
        <Skeleton width="80px" height="32px" />
      </div>
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="p-6 border border-slate-200 rounded-lg space-y-4 bg-white">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton width="70%" height="24px" />
          <Skeleton width="50%" height="16px" />
        </div>
        <Skeleton width="40px" height="40px" rounded="full" />
      </div>
      <Skeleton width="100%" height="48px" />
      <div className="flex gap-2">
        <Skeleton width="60px" height="20px" rounded="full" />
        <Skeleton width="60px" height="20px" rounded="full" />
        <Skeleton width="60px" height="20px" rounded="full" />
      </div>
      <div className="flex gap-2 pt-4">
        <Skeleton width="100px" height="36px" />
        <Skeleton width="80px" height="36px" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-slate-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} width="100px" height="16px" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} width="100px" height="16px" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={`list-item-${i}`} className="flex items-center gap-3">
          <Skeleton width="40px" height="40px" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height="16px" />
            <Skeleton width="40%" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );
}
