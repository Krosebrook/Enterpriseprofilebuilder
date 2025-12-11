import { Role } from '../types';

export const APP_VERSION = 'v1.0.0';
export const APP_DATE = 'December 11, 2025';
export const ORGANIZATION = 'INT Inc';
export const LOCATION = 'Buffalo Grove, IL';

export const ROLES: { id: Role; label: string; description: string }[] = [
  { id: 'All', label: 'All Roles', description: 'View content for all departments' },
  { id: 'Finance', label: 'Finance', description: 'Budget analysis, forecasting, financial reporting' },
  { id: 'Sales', label: 'Sales', description: 'Deal analysis, proposals, competitive research' },
  { id: 'Engineering', label: 'Engineering', description: 'Code review, architecture, security' },
  { id: 'Marketing', label: 'Marketing', description: 'Content creation, campaigns, analytics' },
  { id: 'Operations', label: 'Operations', description: 'Process optimization, workflow automation' },
  { id: 'HR', label: 'Human Resources', description: 'Talent management, policies, training' }
];

export const SECURITY_FEATURES = [
  'Zero Data Retention (ZDR) enabled',
  'Role-based access controls (RBAC)',
  'Comprehensive audit logging',
  'Prompt injection defense',
  'SOC 2 Type II compliant',
  'GDPR/HIPAA-ready'
];

export const KEY_CAPABILITIES = [
  'Real-time web search with citations',
  'Role-isolated memory (30-day expiry)',
  'Code execution sandbox',
  'Artifacts for documents & code',
  'File upload and analysis',
  'MCP server integrations'
];

export const ESCALATION_THRESHOLDS = {
  financial: 10000,
  security: 'medium',
  performance: 0.1,
  budget: 50000
} as const;

export const RATE_LIMITS = {
  requestsPerMinute: 20,
  tokensPerConversation: 50000,
  maxFileSize: 20 * 1024 * 1024, // 20MB
  maxFilesPerConversation: 10
} as const;

export const KNOWLEDGE_CUTOFF = 'January 31, 2025';
export const CONTEXT_WINDOW = 200000; // tokens
