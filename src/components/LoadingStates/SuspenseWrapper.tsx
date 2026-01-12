import React, { Suspense, ReactNode } from 'react';
import { FeatureErrorBoundary } from '../ErrorBoundary/FeatureErrorBoundary';
import { InlineLoader } from './LoadingSpinner';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  featureName?: string;
}

/**
 * Combines Suspense and ErrorBoundary for safe lazy loading
 */
export function SuspenseWrapper({ 
  children, 
  fallback, 
  featureName = 'Feature' 
}: SuspenseWrapperProps) {
  return (
    <FeatureErrorBoundary featureName={featureName}>
      <Suspense fallback={fallback || <InlineLoader text={`Loading ${featureName}...`} />}>
        {children}
      </Suspense>
    </FeatureErrorBoundary>
  );
}
