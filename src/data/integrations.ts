import { LucideIcon, Slack, Github, Trello, Mail, Calendar, Database, Cloud, MessageSquare, Code, FileText } from 'lucide-react';

export interface Integration {
  id: string;
  name: string;
  slug: string;
  category: 'productivity' | 'communication' | 'dev' | 'data' | 'crm';
  description: string;
  longDescription: string;
  icon: any; // LucideIcon
  status: 'active' | 'beta' | 'coming_soon';
  popularity: number; // 0-100
  installed?: boolean;
  features: string[];
  permissions: string[];
}

export const integrationCategories = [
  { id: 'all', label: 'All Apps' },
  { id: 'communication', label: 'Communication' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'dev', label: 'Developer Tools' },
  { id: 'data', label: 'Data & Storage' },
  { id: 'crm', label: 'CRM & Sales' },
];

export const integrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    slug: 'slack',
    category: 'communication',
    description: 'Connect Claude to your team channels for real-time collaboration.',
    longDescription: 'The official Slack integration allows Claude to participate in channels, answer questions via @mentions, and summarize thread discussions. It supports enterprise grid and granular channel permissions.',
    icon: Slack,
    status: 'active',
    popularity: 98,
    features: ['Channel @mentions', 'Thread summarization', 'Daily digests', 'Slash commands'],
    permissions: ['channels:read', 'chat:write', 'users:read']
  },
  {
    id: 'github',
    name: 'GitHub',
    slug: 'github',
    category: 'dev',
    description: 'Review PRs, generate documentation, and analyze codebases.',
    longDescription: 'Connect repositories to let Claude analyze code, suggest improvements, and auto-generate pull request descriptions. Securely respects .gitignore and branch protection rules.',
    icon: Github,
    status: 'active',
    popularity: 95,
    features: ['PR Analysis', 'Code Review', 'Issue Generation', 'Readme Automation'],
    permissions: ['repo:read', 'pull_requests:write', 'issues:write']
  },
  {
    id: 'notion',
    name: 'Notion',
    slug: 'notion',
    category: 'productivity',
    description: 'Sync wikis and generate content directly in your workspace.',
    longDescription: 'Access your Notion knowledge base for RAG (Retrieval Augmented Generation). Claude can read pages to answer questions and write new content directly to databases.',
    icon: FileText,
    status: 'active',
    popularity: 92,
    features: ['Page Reading', 'Database Sync', 'Content Generation', 'Q&A on Wiki'],
    permissions: ['pages:read', 'pages:write', 'databases:read']
  },
  {
    id: 'jira',
    name: 'Jira',
    slug: 'jira',
    category: 'productivity',
    description: 'Turn conversations into tickets and update project statuses.',
    longDescription: 'Streamline project management by allowing Claude to create, update, and query Jira issues. Perfect for scrum masters and product owners.',
    icon: Trello,
    status: 'active',
    popularity: 88,
    features: ['Ticket Creation', 'Status Updates', 'Sprint Summary', 'Backlog Grooming'],
    permissions: ['browse_projects', 'create_issues', 'edit_issues']
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    slug: 'salesforce',
    category: 'crm',
    description: 'AI-powered CRM insights and automated data entry.',
    longDescription: 'Analyze customer data, draft emails, and update opportunity records without leaving the chat interface.',
    icon: Cloud,
    status: 'beta',
    popularity: 75,
    features: ['Opportunity Analysis', 'Email Drafting', 'Record Updates', 'Pipeline Forecasting'],
    permissions: ['api', 'refresh_token', 'offline_access']
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    slug: 'postgres',
    category: 'data',
    description: 'Read-only SQL analyst for your production data.',
    longDescription: 'Securely connect to your database to run natural language queries. Includes readonly-safety rails and PII masking.',
    icon: Database,
    status: 'beta',
    popularity: 82,
    features: ['Text-to-SQL', 'Data Visualization', 'Schema Analysis', 'Report Generation'],
    permissions: ['SELECT', 'CONNECT']
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    slug: 'google',
    category: 'productivity',
    description: 'Draft Docs, manage Calendar, and analyze Sheets.',
    longDescription: 'A comprehensive integration for Drive, Docs, Sheets, and Calendar. Claude acts as an executive assistant for your Google ecosystem.',
    icon: Mail,
    status: 'coming_soon',
    popularity: 90,
    features: ['Email Drafting', 'Calendar Scheduling', 'Doc Writing', 'Sheet Formulas'],
    permissions: ['https://www.googleapis.com/auth/drive.readonly']
  }
];
