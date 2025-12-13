import { LucideIcon, Globe, Monitor, Smartphone, Terminal, Cloud, Cpu, Grid, Layers, Shield, Code, Users } from 'lucide-react';

export type PlatformType = 'Web' | 'Desktop' | 'Mobile' | 'CLI' | 'API' | 'Cloud';
export type ModelTier = 'Opus' | 'Sonnet' | 'Haiku';
export type PlanType = 'Free' | 'Pro' | 'Team' | 'Enterprise';

export interface Platform {
  id: string;
  name: string;
  type: PlatformType;
  description: string;
  bestFor: string;
  features: string[];
}

export interface Model {
  id: string;
  name: string;
  version: string;
  context: string;
  speed: 'Fast' | 'Medium' | 'Slow';
  cost: 'Low' | 'Medium' | 'High';
  bestFor: string;
  capabilities: string[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  platforms: string[]; // IDs of platforms
}

export interface Extension {
  id: string;
  name: string;
  type: 'Official' | 'Community' | 'Custom' | 'Skill';
  category: string;
  description: string;
}

export const platforms: Platform[] = [
  {
    id: 'web',
    name: 'Claude Web',
    type: 'Web',
    description: 'The primary web interface for Claude with Projects and Artifacts.',
    bestFor: 'Research, strategy, multi-turn conversations, team collaboration.',
    features: ['Projects', 'Artifacts', 'Team Collaboration']
  },
  {
    id: 'desktop',
    name: 'Claude Desktop',
    type: 'Desktop',
    description: 'Native desktop application with MCP support.',
    bestFor: 'Focused work, local file access, fast iteration.',
    features: ['MCP Servers', 'Local Files', 'Shortcuts']
  },
  {
    id: 'mobile',
    name: 'Claude Mobile',
    type: 'Mobile',
    description: 'iOS and Android applications.',
    bestFor: 'On-the-go access, voice input, camera analysis.',
    features: ['Voice Mode', 'Camera', 'Async Thinking']
  },
  {
    id: 'cli',
    name: 'Claude CLI',
    type: 'CLI',
    description: 'Command line interface for scripting and automation.',
    bestFor: 'Automation, pipelines, bulk operations.',
    features: ['Scripting', 'CI/CD Integration']
  },
  {
    id: 'api',
    name: 'Direct API',
    type: 'API',
    description: 'Programmatic access via api.anthropic.com.',
    bestFor: 'Custom apps, enterprise integration.',
    features: ['Streaming', 'Tool Use', 'Vision']
  },
  {
    id: 'bedrock',
    name: 'AWS Bedrock',
    type: 'Cloud',
    description: 'Claude models hosted on AWS infrastructure.',
    bestFor: 'Regulated industries (HIPAA), Zero Data Retention.',
    features: ['VPC', 'HIPAA Compliance', 'IAM']
  },
  {
    id: 'vertex',
    name: 'Google Vertex AI',
    type: 'Cloud',
    description: 'Claude models hosted on Google Cloud.',
    bestFor: 'Google ecosystem users, Private Service Connect.',
    features: ['VPC-native', 'Data Residency']
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    type: 'Cloud',
    description: 'Claude models hosted on Azure.',
    bestFor: 'Microsoft ecosystem, Entra ID auth.',
    features: ['Entra ID', 'Microsoft Foundry']
  }
];

export const models: Model[] = [
  {
    id: 'opus-4.5',
    name: 'Opus',
    version: '4.5',
    context: '200K',
    speed: 'Slow',
    cost: 'High',
    bestFor: 'Complex reasoning, extended thinking tasks.',
    capabilities: ['Extended Thinking', 'Complex Analysis', 'Strategy']
  },
  {
    id: 'sonnet-4.5',
    name: 'Sonnet',
    version: '4.5',
    context: '200K',
    speed: 'Medium',
    cost: 'Medium',
    bestFor: 'Best balance of speed and intelligence. Most popular.',
    capabilities: ['Coding', 'Writing', 'Data Extraction']
  },
  {
    id: 'haiku-4.5',
    name: 'Haiku',
    version: '4.5',
    context: '200K',
    speed: 'Fast',
    cost: 'Low',
    bestFor: 'High volume, simple tasks, customer support.',
    capabilities: ['Speed', 'Cost Efficiency', 'Simple Logic']
  }
];

export const features: Feature[] = [
  { id: 'projects', name: 'Projects', description: 'Shared workspaces with context.', platforms: ['web'] },
  { id: 'artifacts', name: 'Artifacts', description: 'React/HTML/Markdown preview.', platforms: ['web', 'desktop'] },
  { id: 'mcp', name: 'MCP Servers', description: 'Connect to external tools/data.', platforms: ['desktop', 'cli'] },
  { id: 'voice', name: 'Voice Mode', description: 'Real-time conversational audio.', platforms: ['mobile'] },
  { id: 'analysis', name: 'Analysis Tool', description: 'Python sandbox for data viz.', platforms: ['web', 'desktop'] },
  { id: 'extended-thinking', name: 'Extended Thinking', description: 'Show reasoning steps.', platforms: ['web', 'api'] },
  { id: 'computer-use', name: 'Computer Use', description: 'Agentic control of UI.', platforms: ['api', 'desktop'] }
];

export const mcpServers: Extension[] = [
  { id: 'google', name: 'Google Workspace', type: 'Official', category: 'Productivity', description: 'Drive, Gmail, Calendar, Docs.' },
  { id: 'github', name: 'GitHub', type: 'Official', category: 'Development', description: 'Repository management, issues, PRs.' },
  { id: 'linear', name: 'Linear', type: 'Official', category: 'Development', description: 'Issue tracking and project management.' },
  { id: 'slack', name: 'Slack', type: 'Official', category: 'Communication', description: 'Channel messages and DMs.' },
  { id: 'notion', name: 'Notion', type: 'Official', category: 'Communication', description: 'Wiki and docs access.' },
  { id: 'figma', name: 'Figma', type: 'Official', category: 'Design', description: 'Design file access.' },
  { id: 'postgres', name: 'PostgreSQL', type: 'Community', category: 'Data', description: 'Database access and querying.' },
  { id: 'filesystem', name: 'FileSystem', type: 'Official', category: 'Productivity', description: 'Local file manipulation.' }
];

export const skills: Extension[] = [
  { id: 'frontend-design', name: 'Frontend Design', type: 'Skill', category: 'Design', description: 'Web UI design patterns.' },
  { id: 'accessibility', name: 'Accessibility Core', type: 'Skill', category: 'Design', description: 'WCAG compliance checks.' },
  { id: 'staff-engineer', name: 'Staff Engineer', type: 'Skill', category: 'Engineering', description: 'Architecture and system design.' },
  { id: 'data-viz', name: 'Data Visualization', type: 'Skill', category: 'Data', description: 'Best practices for charts.' }
];

export const plans = [
  { id: 'free', name: 'Free', price: '$0/mo', features: ['Basic Access', 'Rate Limited'] },
  { id: 'pro', name: 'Pro', price: '$20/mo', features: ['Priority Access', 'Claude Code Web', '5x Usage'] },
  { id: 'team', name: 'Team', price: '$25/user', features: ['Shared Projects', 'User Mgmt', 'Usage Analytics'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', features: ['SSO', 'Audit Logs', 'SLA', 'HIPAA (via Bedrock)'] }
];
