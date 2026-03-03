/**
 * Demo Dashboard Configuration Template
 * 
 * INSTRUCTIONS:
 * 1. Copy this template to create your own config
 * 2. Replace ALL the example URLs with your actual tool URLs
 * 3. Set requiresAuth to true for tools that need login
 * 4. Adjust timeouts if needed (default: 10000ms = 10 seconds)
 * 5. Organize by categories for better dashboard layout
 */

import type { ToolTarget } from '@/types/demo-dashboard';

/**
 * STEP 1: List all your tools/apps to monitor
 * Replace these examples with YOUR actual tools
 */
export const MY_TOOL_TARGETS: ToolTarget[] = [
  
  // ═══════════════════════════════════════════════════════════
  // AI-POWERED FEATURES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'ai-agent-builder',
    name: 'AI Agent Builder',
    url: 'REPLACE_WITH_YOUR_URL', // ← CHANGE THIS
    category: 'ai-features',
    requiresAuth: false, // Does it need login?
    description: 'Build and manage AI agent workflows',
    timeout: 10000, // 10 seconds
  },
  
  {
    id: 'prd-generator',
    name: 'PRD Generator',
    url: 'REPLACE_WITH_YOUR_URL', // ← CHANGE THIS
    category: 'ai-features',
    requiresAuth: false,
    description: 'Generate Product Requirements Documents',
  },
  
  // ═══════════════════════════════════════════════════════════
  // CORE PLATFORM
  // ═══════════════════════════════════════════════════════════
  {
    id: 'main-dashboard',
    name: 'Main Dashboard',
    url: 'REPLACE_WITH_YOUR_URL', // ← CHANGE THIS
    category: 'core-platform',
    requiresAuth: false,
    description: 'Main application interface',
  },
  
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    url: 'REPLACE_WITH_YOUR_URL', // ← CHANGE THIS
    category: 'core-platform',
    requiresAuth: true, // ← Requires login, won't be checked
    description: 'Administrative controls',
  },
  
  // ═══════════════════════════════════════════════════════════
  // INTEGRATIONS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'integration-marketplace',
    name: 'Integration Marketplace',
    url: 'REPLACE_WITH_YOUR_URL', // ← CHANGE THIS
    category: 'integrations',
    requiresAuth: false,
    description: 'Browse and connect integrations',
  },
  
  // ═══════════════════════════════════════════════════════════
  // DOCUMENTATION
  // ═══════════════════════════════════════════════════════════
  {
    id: 'api-docs',
    name: 'API Documentation',
    url: 'REPLACE_WITH_YOUR_URL', // ← CHANGE THIS
    category: 'documentation',
    requiresAuth: false,
    description: 'Complete API reference',
  },
  
  // ═══════════════════════════════════════════════════════════
  // INFRASTRUCTURE (Backend Services)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'api-backend',
    name: 'API Backend',
    url: 'REPLACE_WITH_YOUR_URL', // ← CHANGE THIS
    category: 'infrastructure',
    requiresAuth: false,
    healthCheckEndpoint: 'REPLACE_WITH_YOUR_URL/health', // Optional health check
    description: 'Main API server',
    timeout: 5000, // Faster timeout for API (5 seconds)
  },
  
  {
    id: 'database',
    name: 'Database',
    url: 'REPLACE_WITH_YOUR_URL', // ← CHANGE THIS
    category: 'infrastructure',
    requiresAuth: true, // Usually requires auth
    description: 'Primary database connection',
  },
  
  // ═══════════════════════════════════════════════════════════
  // ADD MORE TOOLS BELOW
  // ═══════════════════════════════════════════════════════════
  
  // Example: External service
  // {
  //   id: 'stripe-billing',
  //   name: 'Stripe Billing',
  //   url: 'https://dashboard.stripe.com',
  //   category: 'integrations',
  //   requiresAuth: true,
  //   description: 'Payment processing',
  // },
  
];

/**
 * STEP 2: Configure global settings
 */
export const MY_DASHBOARD_CONFIG = {
  targets: MY_TOOL_TARGETS,
  defaultTimeout: 10000, // Default timeout for all tools (10 seconds)
};

/**
 * CATEGORIES AVAILABLE:
 * 
 * - 'ai-features'     → AI-powered tools
 * - 'core-platform'   → Main application features
 * - 'integrations'    → Third-party connections
 * - 'documentation'   → Docs and guides
 * - 'infrastructure'  → Backend services (APIs, databases)
 * - 'other'           → Miscellaneous
 * 
 * Tools are grouped by category on the dashboard.
 */

/**
 * TIMEOUT RECOMMENDATIONS:
 * 
 * - Fast APIs:           5000ms  (5 seconds)
 * - Normal web apps:     10000ms (10 seconds) ← DEFAULT
 * - Slow external APIs:  30000ms (30 seconds)
 * 
 * Timeouts prevent dashboard from hanging on dead services.
 */

/**
 * HEALTH CHECK ENDPOINTS:
 * 
 * If your tool has a dedicated /health or /status endpoint,
 * add it to healthCheckEndpoint for faster, more reliable checks:
 * 
 * healthCheckEndpoint: 'https://api.example.com/health'
 */

/**
 * REQUIRES AUTH:
 * 
 * Set requiresAuth: true for tools that need login.
 * Dashboard will skip checking these and mark them as "Requires Login"
 * (avoids triggering security alerts or rate limits)
 */

/**
 * AFTER CONFIGURATION:
 * 
 * 1. Save this file
 * 2. Import in demo-dashboard-config.ts:
 *    import { MY_TOOL_TARGETS } from './demo-dashboard-config.template';
 * 3. Or copy/paste MY_TOOL_TARGETS into demo-dashboard-config.ts
 * 4. Rebuild app if needed: npm run build
 * 5. Navigate to Demo Dashboard and click "Refresh Status"
 */
