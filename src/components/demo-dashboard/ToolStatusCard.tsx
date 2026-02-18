/**
 * Tool Status Card Component
 * Displays detailed status for a single tool
 */

import React from 'react';
import { ExternalLink, Clock, AlertCircle } from 'lucide-react';
import type { ToolTarget, StatusCheckResult } from '@/types/demo-dashboard';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface ToolStatusCardProps {
  tool: ToolTarget;
  result: StatusCheckResult;
}

export function ToolStatusCard({ tool, result }: ToolStatusCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatResponseTime = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-colors',
        'bg-card text-card-foreground',
        'hover:bg-accent/50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{tool.name}</h3>
          {tool.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {tool.description}
            </p>
          )}
        </div>
        <StatusBadge status={result.status} />
      </div>

      {/* URL */}
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <ExternalLink className="h-4 w-4 flex-shrink-0" />
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate hover:text-primary underline"
        >
          {tool.url}
        </a>
      </div>

      {/* Details */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Category:</span>
          <span className="ml-2 font-medium capitalize">
            {tool.category.replace('-', ' ')}
          </span>
        </div>
        {result.responseTime && (
          <div>
            <span className="text-muted-foreground">Response:</span>
            <span className="ml-2 font-medium">
              {formatResponseTime(result.responseTime)}
            </span>
          </div>
        )}
        {result.statusCode && (
          <div>
            <span className="text-muted-foreground">Status Code:</span>
            <span className="ml-2 font-medium">{result.statusCode}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">
            {formatTimestamp(result.checkedAt)}
          </span>
        </div>
      </div>

      {/* Error message */}
      {result.errorMessage && (
        <div className="mt-3 flex items-start gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{result.errorMessage}</span>
        </div>
      )}

      {/* Cache indicator */}
      {result.isFromCache && (
        <div className="mt-2 text-xs text-muted-foreground italic">
          ⚡ Using cached status
        </div>
      )}
    </div>
  );
}
