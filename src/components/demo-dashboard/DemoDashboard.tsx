/**
 * Demo Dashboard Main Component
 * Complete dashboard for monitoring tool status with manual refresh
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolStatusCard } from './ToolStatusCard';
import type { ToolTarget, StatusSnapshot } from '@/types/demo-dashboard';
import {
  checkAllTools,
  loadLastSnapshot,
  markSnapshotAsCached,
} from '@/services/demo-dashboard-service';
import { DEFAULT_TOOL_TARGETS } from '@/config/demo-dashboard-config';
import { cn } from '@/lib/utils';

export function DemoDashboard() {
  const [targets] = useState<ToolTarget[]>(DEFAULT_TOOL_TARGETS);
  const [snapshot, setSnapshot] = useState<StatusSnapshot | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckFailed, setLastCheckFailed] = useState(false);

  // Load cached snapshot on mount
  useEffect(() => {
    const cached = loadLastSnapshot();
    if (cached) {
      setSnapshot(markSnapshotAsCached(cached));
    }
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsChecking(true);
    setLastCheckFailed(false);

    try {
      const newSnapshot = await checkAllTools(targets);
      setSnapshot(newSnapshot);
    } catch (error) {
      console.error('Failed to check tools:', error);
      setLastCheckFailed(true);
      
      // Keep showing cached data if available
      if (snapshot) {
        setSnapshot(markSnapshotAsCached(snapshot));
      }
    } finally {
      setIsChecking(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Group targets by category
  const groupedTargets = targets.reduce((acc, target) => {
    if (!acc[target.category]) {
      acc[target.category] = [];
    }
    acc[target.category].push(target);
    return acc;
  }, {} as Record<string, ToolTarget[]>);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Demo Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor the status of all tools and applications for your demo presentation.
          Click refresh to update status (cached for offline safety).
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <Button
          onClick={handleRefresh}
          disabled={isChecking}
          size="lg"
          className="gap-2"
        >
          <RefreshCw className={cn('h-4 w-4', isChecking && 'animate-spin')} />
          {isChecking ? 'Checking Status...' : 'Refresh Status'}
        </Button>

        {snapshot && (
          <div className="text-sm text-muted-foreground">
            Last checked: {formatTimestamp(snapshot.timestamp)}
            {lastCheckFailed && (
              <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                (Check failed - using cached data)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {snapshot && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            label="Working"
            count={snapshot.summary.finished}
            total={snapshot.summary.total}
            color="green"
          />
          <SummaryCard
            icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
            label="In Progress"
            count={snapshot.summary.inProgress}
            total={snapshot.summary.total}
            color="yellow"
          />
          <SummaryCard
            icon={<XCircle className="h-5 w-5 text-red-600" />}
            label="Broken"
            count={snapshot.summary.broken}
            total={snapshot.summary.total}
            color="red"
          />
          <SummaryCard
            icon={<Lock className="h-5 w-5 text-blue-600" />}
            label="Requires Login"
            count={snapshot.summary.requiresLogin}
            total={snapshot.summary.total}
            color="blue"
          />
        </div>
      )}

      {/* Tool Status Cards by Category */}
      {snapshot ? (
        <div className="space-y-8">
          {Object.entries(groupedTargets).map(([category, categoryTargets]) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-4 capitalize">
                {category.replace('-', ' ')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryTargets.map((target) => {
                  const result = snapshot.results.find(
                    (r) => r.toolId === target.id
                  );
                  if (!result) return null;
                  return (
                    <ToolStatusCard
                      key={target.id}
                      tool={target}
                      result={result}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No status data available. Click "Refresh Status" to check all tools.
          </p>
          <Button onClick={handleRefresh} disabled={isChecking}>
            <RefreshCw className={cn('h-4 w-4 mr-2', isChecking && 'animate-spin')} />
            Start First Check
          </Button>
        </div>
      )}
    </div>
  );
}

// Summary Card Component
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  total: number;
  color: 'green' | 'yellow' | 'red' | 'blue';
}

function SummaryCard({ icon, label, count, total, color }: SummaryCardProps) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  const colorClasses = {
    green: 'border-green-200 dark:border-green-800',
    yellow: 'border-yellow-200 dark:border-yellow-800',
    red: 'border-red-200 dark:border-red-800',
    blue: 'border-blue-200 dark:border-blue-800',
  };

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-4 bg-card',
        colorClasses[color]
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm text-muted-foreground">/ {total}</p>
            <p className="text-xs text-muted-foreground ml-auto">({percentage}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
