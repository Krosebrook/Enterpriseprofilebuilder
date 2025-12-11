import { MCPServer } from '../types';

export const mcpServersData: MCPServer[] = [
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
  }
];
