/**
 * Demo Dashboard Types
 * Data schema for the Demo Readiness Auditor and Status Dashboard
 */

/**
 * Status of a tool/app
 */
export type ToolStatus = 
  | 'finished'      // Working correctly (HTTP 200-299)
  | 'in-progress'   // Partially working or loading
  | 'broken'        // Error, timeout, or HTTP 4xx/5xx
  | 'requires-login'; // Authentication required

/**
 * Category for organizing tools
 */
export type ToolCategory = 
  | 'ai-features'
  | 'core-platform'
  | 'integrations'
  | 'documentation'
  | 'infrastructure'
  | 'other';

/**
 * Tool/App Target Definition
 * Represents a single tool or application to monitor
 */
export interface ToolTarget {
  id: string;
  name: string;
  url: string;
  category: ToolCategory;
  requiresAuth: boolean;
  healthCheckEndpoint?: string; // Optional dedicated health check URL
  description?: string;
  timeout?: number; // Custom timeout in milliseconds (default: 10000)
}

/**
 * Status Check Result
 * Result of checking a single tool
 */
export interface StatusCheckResult {
  toolId: string;
  status: ToolStatus;
  statusCode?: number;
  responseTime?: number; // milliseconds
  errorMessage?: string;
  checkedAt: string; // ISO timestamp
  isFromCache: boolean;
}

/**
 * Status Snapshot
 * Complete snapshot of all tool statuses at a point in time
 */
export interface StatusSnapshot {
  id: string;
  timestamp: string; // ISO timestamp
  results: StatusCheckResult[];
  summary: {
    total: number;
    finished: number;
    inProgress: number;
    broken: number;
    requiresLogin: number;
  };
}

/**
 * Dashboard Configuration
 */
export interface DashboardConfig {
  targets: ToolTarget[];
  lastSnapshot?: StatusSnapshot;
  refreshInterval?: number; // For manual refresh only
  defaultTimeout: number;
}
