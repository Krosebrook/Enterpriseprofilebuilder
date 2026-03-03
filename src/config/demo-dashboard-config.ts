/**
 * Demo Dashboard Default Configuration
 * Default tools/apps to monitor
 */

import type { ToolTarget, DashboardConfig } from '@/types/demo-dashboard';

/**
 * Default tool targets based on Enterprise Profile Builder features
 * CUSTOMIZE THIS: Replace with your actual tool URLs
 */
export const DEFAULT_TOOL_TARGETS: ToolTarget[] = [
  // AI Features
  {
    id: 'ai-agent-builder',
    name: 'AI Agent Builder',
    url: 'http://localhost:3000/#/agents',
    category: 'ai-features',
    requiresAuth: false,
    description: 'Build and manage AI agent workflows',
  },
  {
    id: 'prd-generator',
    name: 'PRD Generator',
    url: 'http://localhost:3000/#/prd',
    category: 'ai-features',
    requiresAuth: false,
    description: 'Generate Product Requirements Documents',
  },
  
  // Core Platform
  {
    id: 'main-dashboard',
    name: 'Main Dashboard',
    url: 'http://localhost:3000/',
    category: 'core-platform',
    requiresAuth: false,
    description: 'Enterprise Profile Builder main interface',
  },
  
  // Integrations
  {
    id: 'integration-marketplace',
    name: 'Integration Marketplace',
    url: 'http://localhost:3000/#/integrations',
    category: 'integrations',
    requiresAuth: false,
    description: 'Browse and connect integrations',
  },
  
  // Documentation
  {
    id: 'api-docs',
    name: 'API Documentation',
    url: 'http://localhost:3000/docs',
    category: 'documentation',
    requiresAuth: false,
    description: 'Complete API reference',
  },
  
  // Infrastructure (Examples - replace with actual endpoints)
  {
    id: 'supabase-backend',
    name: 'Supabase Backend',
    url: 'https://your-project.supabase.co/rest/v1/',
    category: 'infrastructure',
    requiresAuth: true,
    description: 'Backend database and authentication',
  },
];

/**
 * Default dashboard configuration
 */
export const DEFAULT_DASHBOARD_CONFIG: Omit<DashboardConfig, 'lastSnapshot'> = {
  targets: DEFAULT_TOOL_TARGETS,
  defaultTimeout: 10000, // 10 seconds
};

/**
 * Local storage key for persisting status snapshots
 */
export const STORAGE_KEY_SNAPSHOT = 'demo-dashboard-snapshot';
export const STORAGE_KEY_TARGETS = 'demo-dashboard-targets';
