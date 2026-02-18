/**
 * Demo Dashboard Service
 * Handles status checking with timeout support and caching
 */

import type {
  ToolTarget,
  StatusCheckResult,
  StatusSnapshot,
  ToolStatus,
} from '@/types/demo-dashboard';
import { STORAGE_KEY_SNAPSHOT } from '@/config/demo-dashboard-config';

/**
 * Check the status of a single tool with timeout
 */
export async function checkToolStatus(
  target: ToolTarget
): Promise<StatusCheckResult> {
  const startTime = Date.now();
  const timeout = target.timeout || 10000;
  const checkUrl = target.healthCheckEndpoint || target.url;

  // If tool requires auth, mark it specially without checking
  if (target.requiresAuth) {
    return {
      toolId: target.id,
      status: 'requires-login',
      checkedAt: new Date().toISOString(),
      isFromCache: false,
    };
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(checkUrl, {
      method: 'HEAD', // Use HEAD to avoid downloading content
      signal: controller.signal,
      mode: 'no-cors', // Handle CORS issues for external URLs
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    // Determine status based on HTTP response
    let status: ToolStatus;
    if (response.ok || response.type === 'opaque') {
      // opaque response from no-cors mode - assume success
      status = 'finished';
    } else if (response.status >= 400 && response.status < 500) {
      status = 'broken';
    } else {
      status = 'broken';
    }

    return {
      toolId: target.id,
      status,
      statusCode: response.status,
      responseTime,
      checkedAt: new Date().toISOString(),
      isFromCache: false,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = `Timeout after ${timeout}ms`;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      toolId: target.id,
      status: 'broken',
      errorMessage,
      responseTime,
      checkedAt: new Date().toISOString(),
      isFromCache: false,
    };
  }
}

/**
 * Check all tools and create a snapshot
 */
export async function checkAllTools(
  targets: ToolTarget[]
): Promise<StatusSnapshot> {
  const results = await Promise.all(
    targets.map((target) => checkToolStatus(target))
  );

  const summary = {
    total: results.length,
    finished: results.filter((r) => r.status === 'finished').length,
    inProgress: results.filter((r) => r.status === 'in-progress').length,
    broken: results.filter((r) => r.status === 'broken').length,
    requiresLogin: results.filter((r) => r.status === 'requires-login').length,
  };

  const snapshot: StatusSnapshot = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    results,
    summary,
  };

  // Save to localStorage for persistence
  saveSnapshot(snapshot);

  return snapshot;
}

/**
 * Save snapshot to localStorage
 */
export function saveSnapshot(snapshot: StatusSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY_SNAPSHOT, JSON.stringify(snapshot));
  } catch (error) {
    console.error('Failed to save snapshot to localStorage:', error);
  }
}

/**
 * Load last snapshot from localStorage
 */
export function loadLastSnapshot(): StatusSnapshot | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SNAPSHOT);
    if (stored) {
      return JSON.parse(stored) as StatusSnapshot;
    }
  } catch (error) {
    console.error('Failed to load snapshot from localStorage:', error);
  }
  return null;
}

/**
 * Mark all results as from cache
 */
export function markSnapshotAsCached(snapshot: StatusSnapshot): StatusSnapshot {
  return {
    ...snapshot,
    results: snapshot.results.map((result) => ({
      ...result,
      isFromCache: true,
    })),
  };
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: ToolStatus): string {
  switch (status) {
    case 'finished':
      return 'green';
    case 'in-progress':
      return 'yellow';
    case 'broken':
      return 'red';
    case 'requires-login':
      return 'blue';
    default:
      return 'gray';
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: ToolStatus): string {
  switch (status) {
    case 'finished':
      return 'Working';
    case 'in-progress':
      return 'In Progress';
    case 'broken':
      return 'Broken';
    case 'requires-login':
      return 'Requires Login';
    default:
      return 'Unknown';
  }
}
