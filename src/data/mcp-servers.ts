import { MCPServer } from '../types';

export const mcpServersData: MCPServer[] = [
  // Original 9
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and customer subscription management',
    roles: ['Finance', 'Sales'],
    category: 'data',
    useCases: [
      'Look up customer payment history',
      'Verify subscription status',
      'Check billing issues',
      'Calculate MRR/ARR',
      'Generate invoice details'
    ]
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Deployment platform analytics and monitoring',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Check deployment status',
      'View analytics (traffic, latency)',
      'Trigger redeployments',
      'View environment variables',
      'Compare performance across versions'
    ]
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Issue tracking and project management',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Create issues',
      'Update issue status',
      'Link issues to PRs',
      'Generate release notes',
      'Track sprint progress'
    ]
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repository and version control',
    roles: ['Engineering'],
    category: 'development',
    useCases: [
      'View open PRs',
      'Check CI/CD status',
      'Search code history',
      'Generate release notes',
      'Suggest code improvements'
    ]
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and collaboration',
    roles: ['All'],
    category: 'communication',
    useCases: [
      'Search team messages',
      'Find conversations',
      'Access channel history',
      'Look up shared files',
      'Coordinate incidents'
    ]
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Design collaboration and prototyping',
    roles: ['Engineering', 'Marketing', 'Operations'],
    category: 'design',
    useCases: [
      'View design files',
      'Check component status',
      'Access design specs',
      'Suggest improvements',
      'Generate documentation'
    ]
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Knowledge base and documentation',
    roles: ['All'],
    category: 'data',
    useCases: [
      'Search company wiki',
      'Look up processes/policies',
      'Find templates',
      'Update documentation',
      'Create meeting notes'
    ]
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM and customer relationship management',
    roles: ['Sales', 'Marketing'],
    category: 'data',
    useCases: [
      'Access deal pipeline',
      'Look up contact history',
      'Track customer interactions',
      'View campaign performance',
      'Manage leads'
    ]
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    description: 'Image and media management',
    roles: ['Marketing', 'Engineering'],
    category: 'other',
    useCases: [
      'Optimize images',
      'Transform media assets',
      'Manage CDN delivery',
      'Generate responsive images',
      'Process uploads'
    ]
  },
  // New 21
  {
    id: 'jira',
    name: 'Jira',
    description: 'Enterprise issue and project tracking',
    roles: ['Engineering', 'Product', 'Operations'],
    category: 'development',
    useCases: [
      'Query ticket status',
      'Create bug reports',
      'Analyze sprint velocity',
      'Link requirements to tickets',
      'Generate changelogs'
    ]
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Kanban-style project management',
    roles: ['Marketing', 'HR', 'Operations'],
    category: 'other',
    useCases: [
      'Manage content calendars',
      'Track recruitment pipeline',
      'Organize office tasks',
      'Move cards between lists',
      'Add comments to cards'
    ]
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Work management platform',
    roles: ['Marketing', 'Product', 'Operations'],
    category: 'other',
    useCases: [
      'Track task dependencies',
      'Update project timelines',
      'Assign tasks to team members',
      'Check project progress',
      'Create project templates'
    ]
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'DevSecOps platform',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Manage merge requests',
      'Check pipeline status',
      'Review security scans',
      'Access container registry',
      'Update wiki pages'
    ]
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    description: 'Git code management',
    roles: ['Engineering'],
    category: 'development',
    useCases: [
      'Review pull requests',
      'Check build status',
      'Search repositories',
      'Manage branch permissions',
      'View commit history'
    ]
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Cloud file storage and synchronization',
    roles: ['All'],
    category: 'data',
    useCases: [
      'Search document contents',
      'List folder contents',
      'Retrieve file metadata',
      'Organize shared drives',
      'Check file permissions'
    ]
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    description: 'Microsoft cloud storage',
    roles: ['All'],
    category: 'data',
    useCases: [
      'Access SharePoint files',
      'Search across Office 365',
      'Manage file sharing',
      'Sync status checks',
      'Archive old documents'
    ]
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Enterprise CRM platform',
    roles: ['Sales', 'Operations', 'Leadership'],
    category: 'data',
    useCases: [
      'Query complex account data',
      'Update opportunity stages',
      'Generate forecast reports',
      'Check lead scoring',
      'Log customer activities'
    ]
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Customer service software',
    roles: ['Support', 'Product', 'Sales'],
    category: 'communication',
    useCases: [
      'Search support tickets',
      'Analyze ticket trends',
      'Draft responses',
      'Check customer satisfaction scores',
      'Update ticket priority'
    ]
  },
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Customer messaging platform',
    roles: ['Support', 'Marketing', 'Product'],
    category: 'communication',
    useCases: [
      'Search user conversations',
      'Segment user base',
      'Send in-app messages',
      'Analyze help center views',
      'Manage support inbox'
    ]
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    description: 'Incident response platform',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Check on-call schedules',
      'Acknowledge incidents',
      'Trigger incidents',
      'View incident history',
      'Analyze MTTR metrics'
    ]
  },
  {
    id: 'datadog',
    name: 'Datadog',
    description: 'Observability and security monitoring',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Query metrics and logs',
      'Check dashboard status',
      'View APM traces',
      'Manage alerts',
      'Analyze infrastructure health'
    ]
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Application performance monitoring',
    roles: ['Engineering'],
    category: 'development',
    useCases: [
      'Search error events',
      'Analyze release health',
      'Assign issues to developers',
      'Check regression status',
      'View stack traces'
    ]
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Amazon Web Services cloud infrastructure',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Check EC2 instance status',
      'List S3 buckets',
      'Query CloudWatch logs',
      'Manage Lambda functions',
      'View billing costs'
    ]
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    description: 'Google Cloud Platform infrastructure',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Check Compute Engine status',
      'Manage Cloud Storage',
      'Query BigQuery datasets',
      'View Kubernetes clusters',
      'Monitor billing'
    ]
  },
  {
    id: 'azure',
    name: 'Azure',
    description: 'Microsoft Azure cloud computing',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Manage Resource Groups',
      'Check VM status',
      'Query Azure Monitor',
      'Manage Active Directory',
      'View cost analysis'
    ]
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Container platform',
    roles: ['Engineering'],
    category: 'development',
    useCases: [
      'List running containers',
      'Check image vulnerabilities',
      'Manage Docker Hub repos',
      'Inspect container logs',
      'Prune unused resources'
    ]
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Container orchestration',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Check pod status',
      'View cluster health',
      'Manage deployments',
      'Inspect service logs',
      'Scale replicas'
    ]
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    description: 'Open source automation server',
    roles: ['Engineering', 'Operations'],
    category: 'development',
    useCases: [
      'Trigger builds',
      'Check build history',
      'View console output',
      'Manage plugins',
      'Monitor build nodes'
    ]
  },
  {
    id: 'circleci',
    name: 'CircleCI',
    description: 'Continuous integration and delivery',
    roles: ['Engineering'],
    category: 'development',
    useCases: [
      'View pipeline workflows',
      'Rerun failed jobs',
      'Analyze build insights',
      'Manage context variables',
      'Check artifact retention'
    ]
  },
  {
    id: 'postgres',
    name: 'Postgres',
    description: 'Relational database access (read-only safe mode)',
    roles: ['Engineering', 'Data Science'],
    category: 'data',
    useCases: [
      'Run read-only SQL queries',
      'Check table schemas',
      'Analyze query performance',
      'View database size',
      'List active connections'
    ]
  }
];
