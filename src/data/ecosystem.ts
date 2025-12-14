import { LucideIcon, Globe, Monitor, Smartphone, Terminal, Cloud, Cpu, Grid, Layers, Shield, Code, Users, Zap, Briefcase, Database } from 'lucide-react';

export type PlatformType = 'Web' | 'Desktop' | 'Mobile' | 'CLI' | 'API' | 'Cloud';
export type ModelTier = 'Premium' | 'Balanced' | 'Fast';
export type PlanType = 'Free' | 'Pro' | 'Team' | 'Enterprise';

export interface Platform {
  id: string;
  name: string;
  category: string; // Consumer, Professional, Developer, Enterprise
  type: PlatformType;
  description: string;
  bestFor: string;
  features: string[];
  audience: string[];
  deployment: string;
  security: string[];
  pricing: string[];
  roi: string;
  capabilities: string[];
  color: string;
  iconChar: string;
}

export interface Model {
  id: string;
  name: string;
  tier: ModelTier;
  version: string;
  context: string;
  speed: 'Fast' | 'Medium' | 'Slow';
  cost: 'Low' | 'Medium' | 'High' | '$$$' | '$$' | '$';
  bestFor: string;
  capabilities: string[];
  pricing: { input: number; output: number };
  useCase: string;
  benchmarks?: Record<string, string>;
  description: string;
  color: string;
  iconChar: string;
}

export interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  platforms: string[]; // availability
  audience: string[];
  valueProps: string[];
  iconChar: string;
}

export interface Extension {
  id: string;
  name: string;
  type?: 'Official' | 'Community' | 'Custom' | 'Skill';
  category: string;
  description?: string;
  official?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  audience: string[];
  features: string[];
  limits: Record<string, string | number>;
  bestFor: string;
  capabilities: string[];
}

export interface UseCase {
  id: string;
  name: string;
  iconChar: string;
  examples: string[];
  bestPlatform: string;
  bestModel: string;
  features: string[];
  roi: string;
  audience: string[];
}

export interface Department {
  id: string;
  name: string;
  primaryUse: string[];
  recommendedPlatform: string;
  recommendedModel: string;
  features: string[];
  plan: string;
  roi: string;
}

export const platforms: Platform[] = [
  {
    id: 'web',
    name: 'Claude.ai Web',
    category: 'Consumer',
    type: 'Web',
    iconChar: '🌐',
    color: '#FF6B00',
    audience: ['executives', 'end-users', 'developers'],
    features: ['projects', 'artifacts', 'team-collaboration', 'memory'],
    deployment: 'cloud',
    security: ['sso', 'audit-logs'],
    pricing: ['free', 'pro', 'team', 'enterprise'],
    useCase: 'Research, strategy, multi-turn conversations',
    description: 'Full-featured web interface with Projects, Artifacts, and team collaboration. Best for research and strategic work.',
    roi: '35% time savings',
    bestFor: 'Research, strategy, multi-turn conversations',
    capabilities: [
        'Projects for persistent context',
        'Artifacts for interactive outputs',
        'Team workspaces',
        'Memory across conversations'
    ]
  },
  {
    id: 'desktop',
    name: 'Claude Desktop',
    category: 'Professional',
    type: 'Desktop',
    iconChar: '💻',
    color: '#0066FF',
    audience: ['developers', 'it-security', 'end-users'],
    features: ['mcp-servers', 'local-files', 'version-control', 'memory'],
    deployment: 'local',
    security: ['network-isolation', 'admin-controls'],
    pricing: ['pro', 'team', 'enterprise'],
    useCase: 'Focused work with local files and MCP integrations',
    description: 'Desktop application with MCP server support, local file access, and admin controls.',
    roi: '40% productivity boost',
    bestFor: 'Focused work, local file access, fast iteration.',
    capabilities: [
        'MCP server integrations',
        'Local file access',
        'Version control',
        'Offline capabilities'
    ]
  },
  {
    id: 'mobile',
    name: 'Claude Mobile',
    category: 'Consumer',
    type: 'Mobile',
    iconChar: '📱',
    color: '#00CC66',
    audience: ['executives', 'end-users'],
    features: ['voice-mode', 'camera', 'async', 'memory'],
    deployment: 'cloud',
    security: ['device-encryption'],
    pricing: ['free', 'pro', 'team'],
    useCase: 'On-the-go queries with voice and camera input',
    description: 'iOS and Android apps with voice mode, camera, and async thinking.',
    roi: '25% time savings',
    bestFor: 'On-the-go access, voice input, camera analysis.',
    capabilities: [
        'Voice conversations',
        'Camera input',
        'Async thinking',
        'Mobile-optimized'
    ]
  },
  {
    id: 'cli',
    name: 'Claude CLI',
    category: 'Developer',
    type: 'CLI',
    iconChar: '⚡',
    color: '#9933FF',
    audience: ['developers'],
    features: ['scripting', 'automation', 'ci-cd'],
    deployment: 'local',
    security: ['api-key-management'],
    pricing: ['pro', 'team', 'enterprise'],
    useCase: 'Automation, pipelines, bulk operations',
    description: 'Command-line interface for scripting and CI/CD integration.',
    roi: '50% automation efficiency',
    bestFor: 'Automation, pipelines, bulk operations.',
    capabilities: [
        'Scripting support',
        'CI/CD integration',
        'Bulk operations',
        'Automation workflows'
    ]
  },
  {
    id: 'api',
    name: 'Claude API',
    category: 'Developer',
    type: 'API',
    iconChar: '🔌',
    color: '#FF0066',
    audience: ['developers', 'it-security'],
    features: ['programmatic', 'custom-apps', 'webhooks', 'batch'],
    deployment: 'cloud',
    security: ['rate-limits', 'api-keys', 'ip-whitelist'],
    pricing: ['pay-per-use'],
    useCase: 'Custom integration, enterprise applications',
    description: 'Direct API access for programmatic integration and custom applications.',
    roi: '60% integration efficiency',
    bestFor: 'Custom apps, enterprise integration.',
    capabilities: [
        'Full programmatic access',
        'Webhook support',
        'Batch processing',
        'Streaming responses'
    ]
  },
  {
    id: 'code-web',
    name: 'Claude Code Web',
    category: 'Developer',
    type: 'Web',
    iconChar: '🌐',
    color: '#FFAA00',
    audience: ['developers'],
    features: ['parallel-tasks', 'cloud-env', 'checkpoints'],
    deployment: 'cloud',
    security: ['sandbox'],
    pricing: ['pro', 'team', 'enterprise'],
    useCase: 'Multi-task coding in cloud environment',
    description: 'Web-based coding with parallel task execution and checkpoints.',
    roi: '55% faster development',
    bestFor: 'Multi-task coding',
    capabilities: [
        'Parallel task execution',
        'Cloud-based development',
        'Checkpoint rollback',
        'Multi-file editing'
    ]
  },
  {
    id: 'code-desktop',
    name: 'Claude Code Desktop',
    category: 'Developer',
    type: 'Desktop',
    iconChar: '💼',
    color: '#00AAFF',
    audience: ['developers'],
    features: ['local-repos', 'github', 'vs-code', 'mcp-servers'],
    deployment: 'local',
    security: ['local-only'],
    pricing: ['pro', 'team', 'enterprise'],
    useCase: 'Focused coding with local repositories',
    description: 'Desktop coding interface with GitHub integration and VS Code extension.',
    roi: '55% productivity gain',
    bestFor: 'Focused coding',
    capabilities: [
        'Local repository access',
        'GitHub integration',
        'VS Code extension',
        'MCP server support'
    ]
  },
  {
    id: 'code-cli',
    name: 'Claude Code CLI',
    category: 'Developer',
    type: 'CLI',
    iconChar: '⚡',
    color: '#CC00FF',
    audience: ['developers'],
    features: ['terminal', 'automation', 'scripts'],
    deployment: 'local',
    security: ['local-only'],
    pricing: ['pro', 'team', 'enterprise'],
    useCase: 'Terminal-based development workflows',
    description: 'Command-line coding tool for terminal workflows and automation.',
    roi: '45% workflow efficiency',
    bestFor: 'Terminal workflows',
    capabilities: [
        'Terminal integration',
        'Script automation',
        'Background tasks',
        'Headless mode'
    ]
  },
  {
    id: 'bedrock',
    name: 'AWS Bedrock',
    category: 'Enterprise',
    type: 'Cloud',
    iconChar: '🛡️',
    color: '#FF9900',
    audience: ['it-security', 'executives'],
    features: ['zdr', 'hipaa', 'vpc', 'customer-keys'],
    deployment: 'aws',
    security: ['zero-data-retention', 'network-isolation', 'encryption'],
    pricing: ['enterprise'],
    useCase: 'Regulated industries, maximum security',
    description: 'Enterprise deployment on AWS with zero data retention and HIPAA compliance.',
    roi: 'Compliance automation',
    bestFor: 'Regulated industries (HIPAA), Zero Data Retention.',
    capabilities: [
        'Zero data retention',
        'HIPAA/ISO 27001',
        'VPC deployment',
        'Customer-managed keys'
    ]
  },
  {
    id: 'vertex',
    name: 'Google Vertex AI',
    category: 'Enterprise',
    type: 'Cloud',
    iconChar: '☁️',
    color: '#4285F4',
    audience: ['it-security', 'developers'],
    features: ['psc', 'vpc-native', 'data-residency'],
    deployment: 'gcp',
    security: ['private-service-connect', 'vpc'],
    pricing: ['enterprise'],
    useCase: 'Google Cloud customers, VPC requirements',
    description: 'Google Cloud deployment with Private Service Connect and data residency.',
    roi: 'Infrastructure optimization',
    bestFor: 'Google ecosystem users, Private Service Connect.',
    capabilities: [
        'Private Service Connect',
        'VPC-native deployment',
        'Data residency control',
        'Google Cloud integration'
    ]
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    category: 'Enterprise',
    type: 'Cloud',
    iconChar: '🔷',
    color: '#00A4EF',
    audience: ['it-security', 'executives'],
    features: ['entra-id', 'datazone', 'foundry'],
    deployment: 'azure',
    security: ['sso', 'compliance'],
    pricing: ['enterprise'],
    useCase: 'Microsoft ecosystem, Entra ID integration',
    description: 'Azure deployment with Entra ID SSO and Microsoft Foundry.',
    roi: 'Microsoft stack integration',
    bestFor: 'Microsoft ecosystem, Entra ID auth.',
    capabilities: [
        'Entra ID authentication',
        'Microsoft Foundry',
        'US DataZone',
        'Microsoft 365 integration'
    ]
  }
];

export const models: Model[] = [
  {
    id: 'opus-4-5',
    name: 'Claude Opus',
    tier: 'Premium',
    version: '4.5',
    context: '200K tokens',
    speed: 'Slow',
    cost: '$$$',
    capabilities: ['extended-thinking', 'complex-reasoning', 'computer-use'],
    pricing: { input: 5, output: 25 },
    useCase: 'Complex architecture, deep analysis, extended thinking',
    benchmarks: { swebench: '80.9%', osworld: '66.3%' },
    color: '#FF0066',
    description: 'Most capable model with extended thinking and effort parameter control.',
    iconChar: '🧠',
    bestFor: 'Complex architecture, deep analysis, extended thinking'
  },
  {
    id: 'opus-4-0',
    name: 'Claude Opus',
    tier: 'Premium',
    version: '4.0',
    context: '200K tokens',
    speed: 'Slow',
    cost: '$$$',
    capabilities: ['deep-review', 'security-audit'],
    pricing: { input: 15, output: 75 },
    useCase: 'Deep code review, security audits',
    color: '#CC0055',
    description: 'Previous flagship for thorough analysis and reviews.',
    iconChar: '🔬',
    bestFor: 'Deep code review, security audits'
  },
  {
    id: 'sonnet-4-5',
    name: 'Claude Sonnet',
    tier: 'Balanced',
    version: '4.5',
    context: '200K (1M beta)',
    speed: 'Medium',
    cost: '$$',
    capabilities: ['coding', 'agents', 'long-context'],
    pricing: { input: 3, output: 15 },
    useCase: 'Best balance, coding, agentic workflows',
    benchmarks: { swebench: '77%', coding: 'best' },
    color: '#0066FF',
    description: 'Best balance of speed, quality, and cost. Most popular choice.',
    iconChar: '⚖️',
    bestFor: 'Best balance, coding, agentic workflows'
  },
  {
    id: 'sonnet-4-0',
    name: 'Claude Sonnet',
    tier: 'Balanced',
    version: '4.0',
    context: '200K tokens',
    speed: 'Medium',
    cost: '$$',
    capabilities: ['general-purpose'],
    pricing: { input: 3, output: 15 },
    useCase: 'General-purpose tasks',
    color: '#0055CC',
    description: 'Previous balanced model for general tasks.',
    iconChar: '⚡',
    bestFor: 'General-purpose tasks'
  },
  {
    id: 'haiku-4-5',
    name: 'Claude Haiku',
    tier: 'Fast',
    version: '4.5',
    context: '200K tokens',
    speed: 'Fast',
    cost: '$',
    capabilities: ['real-time', 'high-volume', 'chat'],
    pricing: { input: 1, output: 5 },
    useCase: 'Real-time chat, high volume, fast iteration',
    benchmarks: { swebench: '73.3%' },
    color: '#00CC66',
    description: 'Fastest model with near-frontier performance.',
    iconChar: '🚀',
    bestFor: 'Real-time chat, high volume'
  },
  {
    id: 'haiku-4-0',
    name: 'Claude Haiku',
    tier: 'Fast',
    version: '4.0',
    context: '200K tokens',
    speed: 'Fast',
    cost: '$',
    capabilities: ['simple-tasks'],
    pricing: { input: 1, output: 5 },
    useCase: 'Simple tasks, rapid prototyping',
    color: '#00AA55',
    description: 'Previous fast model for simple tasks.',
    iconChar: '💨',
    bestFor: 'Simple tasks, rapid prototyping'
  }
];

export const features: Feature[] = [
  {
    id: 'projects',
    name: 'Projects',
    category: 'Collaboration',
    platforms: ['web', 'desktop', 'mobile'],
    description: 'Team/personal workspaces with shared context and uploaded docs',
    audience: ['executives', 'end-users', 'developers'],
    valueProps: ['Persistent context', 'Team collaboration', 'Document uploads'],
    iconChar: '📁'
  },
  {
    id: 'artifacts',
    name: 'Artifacts',
    category: 'Creation',
    platforms: ['web', 'desktop'],
    description: 'Generate React, HTML, Markdown, Mermaid, SVG, documents',
    audience: ['developers', 'end-users'],
    valueProps: ['Interactive UI', 'Editable outputs', 'Export-ready'],
    iconChar: '🎨'
  },
  {
    id: 'memory',
    name: 'Memory',
    category: 'Context',
    platforms: ['web', 'desktop', 'mobile', 'api'],
    description: 'Cross-conversation persistence, user edits, project-scoped',
    audience: ['all'],
    valueProps: ['Remembers preferences', 'Learns over time', 'Contextual awareness'],
    iconChar: '💭'
  },
  {
    id: 'voice',
    name: 'Voice Mode',
    category: 'Input',
    platforms: ['mobile', 'desktop'],
    description: 'Real-time conversation, async voice input',
    audience: ['executives', 'end-users'],
    valueProps: ['Hands-free', 'Natural interaction', 'Async thinking'],
    iconChar: '🎤'
  },
  {
    id: 'analysis',
    name: 'Analysis Tool',
    category: 'Execution',
    platforms: ['web', 'desktop', 'api'],
    description: 'Python sandbox, code execution, data visualization',
    audience: ['developers', 'end-users'],
    valueProps: ['Run code', 'Data viz', 'Interactive analysis'],
    iconChar: '📊'
  },
  {
    id: 'mcp',
    name: 'MCP Servers',
    category: 'Integration',
    platforms: ['desktop', 'code-desktop', 'api'],
    description: '23 official + 300+ community connectors',
    audience: ['developers', 'it-security'],
    valueProps: ['Universal protocol', 'Extensive ecosystem', 'Custom servers'],
    iconChar: '🔌'
  },
  {
    id: 'skills',
    name: 'Skills',
    category: 'Specialization',
    platforms: ['web', 'desktop', 'api'],
    description: 'Domain knowledge injection (12+ public + unlimited custom)',
    audience: ['developers', 'it-security'],
    valueProps: ['Repeatable workflows', 'SOPs', 'Custom expertise'],
    iconChar: '⚡'
  },
  {
    id: 'agent-sdk',
    name: 'Agent SDK',
    category: 'Development',
    platforms: ['cli', 'api'],
    description: 'Build custom agents with subagents, hooks, orchestration',
    audience: ['developers'],
    valueProps: ['Multi-agent systems', 'Workflow automation', 'Custom tools'],
    iconChar: '🤖'
  },
  {
    id: 'extended-thinking',
    name: 'Extended Thinking',
    category: 'Reasoning',
    platforms: ['opus-4-5'],
    description: 'Shows reasoning process, deep problem-solving',
    audience: ['executives', 'developers'],
    valueProps: ['Transparency', 'Complex reasoning', 'Auditable decisions'],
    iconChar: '🧠'
  }
];

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0/mo',
    audience: ['end-users'],
    features: ['Basic access', 'Rate limited', 'Web only'],
    limits: { messages: 'Limited', users: 1 },
    bestFor: 'Testing, personal use',
    capabilities: [
        'Web interface access',
        'Basic features',
        'Rate-limited messages',
        'No team collaboration'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$20/mo',
    audience: ['end-users', 'developers'],
    features: ['Priority access', 'More messages', 'Claude Code Web', 'All platforms'],
    limits: { messages: 'High', users: 1 },
    bestFor: 'Individual professionals, developers',
    capabilities: [
        'All platform access',
        'Higher message limits',
        'Priority processing',
        'Claude Code Web'
    ]
  },
  {
    id: 'team',
    name: 'Team',
    price: '$25/user/mo',
    audience: ['executives', 'it-security'],
    features: ['Shared Projects', 'User management', 'Usage analytics', 'Admin controls'],
    limits: { messages: 'Very high', users: 'Unlimited' },
    bestFor: 'Teams 5-50, collaborative work',
    capabilities: [
        'Team workspaces',
        'User management',
        'Usage analytics',
        'Basic admin controls'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    audience: ['executives', 'it-security'],
    features: ['SSO', 'Audit logs', 'Admin controls', 'SLA', 'Dedicated support', 'ZDR'],
    limits: { messages: 'Unlimited', users: 'Unlimited' },
    bestFor: 'Organizations 50+, regulated industries',
    capabilities: [
        'SSO integration',
        'Complete audit trails',
        'Advanced admin controls',
        'SLA guarantees',
        'Dedicated support',
        'Zero data retention'
    ]
  }
];

export const useCases: UseCase[] = [
  {
    id: 'research',
    name: 'Research & Synthesis',
    iconChar: '📚',
    examples: ['Competitive analysis', 'Market research', 'Literature review'],
    bestPlatform: 'web',
    bestModel: 'opus-4-5',
    features: ['projects', 'memory', 'extended-thinking'],
    roi: '35% time savings',
    audience: ['executives', 'end-users']
  },
  {
    id: 'coding',
    name: 'Code Generation',
    iconChar: '👨‍💻',
    examples: ['Full-stack apps', 'Debugging', 'Code review', 'Testing'],
    bestPlatform: 'code-desktop',
    bestModel: 'sonnet-4-5',
    features: ['mcp', 'skills', 'agent-sdk'],
    roi: '55% productivity gain',
    audience: ['developers']
  },
  {
    id: 'documents',
    name: 'Document Creation',
    iconChar: '📄',
    examples: ['Reports', 'Presentations', 'Spreadsheets', 'PDFs'],
    bestPlatform: 'web',
    bestModel: 'sonnet-4-5',
    features: ['artifacts', 'skills'],
    roi: '40% faster creation',
    audience: ['executives', 'end-users']
  },
  {
    id: 'analysis',
    name: 'Data Analysis',
    iconChar: '📊',
    examples: ['Data cleaning', 'Visualization', 'SQL generation', 'Insights'],
    bestPlatform: 'web',
    bestModel: 'sonnet-4-5',
    features: ['analysis', 'artifacts'],
    roi: '45% faster insights',
    audience: ['developers', 'end-users']
  },
  {
    id: 'automation',
    name: 'Workflow Automation',
    iconChar: '⚙️',
    examples: ['Task routing', 'Email triage', 'CRM updates', 'Meeting notes'],
    bestPlatform: 'api',
    bestModel: 'haiku-4-5',
    features: ['mcp', 'agent-sdk'],
    roi: '60% time savings',
    audience: ['it-security', 'developers']
  },
  {
    id: 'architecture',
    name: 'Architecture & Design',
    iconChar: '🏗️',
    examples: ['System design', 'Security review', 'Diagrams', 'Tech specs'],
    bestPlatform: 'code-desktop',
    bestModel: 'opus-4-5',
    features: ['extended-thinking', 'artifacts', 'mcp'],
    roi: '50% faster design',
    audience: ['developers', 'it-security']
  }
];

export const departments: Department[] = [
  {
    id: 'executive',
    name: 'Executive Leadership',
    primaryUse: ['research', 'documents'],
    recommendedPlatform: 'web',
    recommendedModel: 'opus-4-5',
    features: ['projects', 'memory', 'extended-thinking'],
    plan: 'enterprise',
    roi: '25% time savings on strategic work'
  },
  {
    id: 'sales',
    name: 'Sales',
    primaryUse: ['documents', 'research'],
    recommendedPlatform: 'web',
    recommendedModel: 'sonnet-4-5',
    features: ['projects', 'artifacts', 'mcp'],
    plan: 'team',
    roi: '30% faster proposal creation'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    primaryUse: ['documents', 'research'],
    recommendedPlatform: 'web',
    recommendedModel: 'sonnet-4-5',
    features: ['artifacts', 'skills'],
    plan: 'team',
    roi: '40% more content output'
  },
  {
    id: 'engineering',
    name: 'Engineering/IT',
    primaryUse: ['coding', 'architecture', 'automation'],
    recommendedPlatform: 'code-desktop',
    recommendedModel: 'sonnet-4-5',
    features: ['mcp', 'skills', 'agent-sdk'],
    plan: 'enterprise',
    roi: '55% productivity gain'
  },
  {
    id: 'security',
    name: 'Information Security',
    primaryUse: ['architecture', 'automation'],
    recommendedPlatform: 'bedrock',
    recommendedModel: 'opus-4-5',
    features: ['extended-thinking', 'mcp'],
    plan: 'enterprise',
    roi: 'Compliance automation, risk reduction'
  },
  {
    id: 'operations',
    name: 'Operations',
    primaryUse: ['automation', 'analysis', 'documents'],
    recommendedPlatform: 'web',
    recommendedModel: 'sonnet-4-5',
    features: ['analysis', 'mcp', 'artifacts'],
    plan: 'team',
    roi: '35% process efficiency'
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    primaryUse: ['automation'],
    recommendedPlatform: 'api',
    recommendedModel: 'haiku-4-5',
    features: ['mcp', 'agent-sdk'],
    plan: 'team',
    roi: '50% faster response times'
  }
];

export const mcpServers: Extension[] = [
  { id: 'github', name: 'GitHub', category: 'Development', official: true, description: 'Repository management, issues, PRs.' },
  { id: 'google-drive', name: 'Google Drive', category: 'Productivity', official: true, description: 'Access Google Drive files.' },
  { id: 'gmail', name: 'Gmail', category: 'Communication', official: true, description: 'Read and send emails.' },
  { id: 'notion', name: 'Notion', category: 'Productivity', official: true, description: 'Wiki and docs access.' },
  { id: 'slack', name: 'Slack', category: 'Communication', official: true, description: 'Channel messages and DMs.' },
  { id: 'linear', name: 'Linear', category: 'Project Management', official: true, description: 'Issue tracking.' },
  { id: 'figma', name: 'Figma', category: 'Design', official: true, description: 'Design file access.' },
  { id: 'canva', name: 'Canva', category: 'Design', official: true, description: 'Create and edit designs.' },
  { id: 'stripe', name: 'Stripe', category: 'Business', official: true, description: 'Payments and subscriptions.' },
  { id: 'vercel', name: 'Vercel', category: 'Infrastructure', official: true, description: 'Deployments and logs.' },
  { id: 'cloudflare', name: 'Cloudflare', category: 'Infrastructure', official: true, description: 'DNS and worker management.' },
  { id: 'sentry', name: 'Sentry', category: 'Monitoring', official: true, description: 'Error tracking.' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', official: true, description: 'Customer management.' },
  { id: 'zapier', name: 'Zapier', category: 'Automation', official: true, description: 'Connect to 5000+ apps.' },
  { id: 'n8n', name: 'n8n', category: 'Automation', official: true, description: 'Workflow automation.' }
];

export const skills: Extension[] = [
  { id: 'frontend-design', name: 'Frontend Design', type: 'Skill', category: 'Design', description: 'Web UI design patterns.' },
  { id: 'accessibility', name: 'Accessibility Core', type: 'Skill', category: 'Design', description: 'WCAG compliance checks.' },
  { id: 'staff-engineer', name: 'Staff Engineer', type: 'Skill', category: 'Engineering', description: 'Architecture and system design.' },
  { id: 'data-viz', name: 'Data Visualization', type: 'Skill', category: 'Data', description: 'Best practices for charts.' }
];
