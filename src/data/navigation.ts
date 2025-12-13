import { NavigationItem } from '../types';

export const navigationData: NavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Introduction and quick start guide',
    icon: 'BookOpen'
  },
  {
    id: 'baseline',
    label: 'Baseline Prompt',
    description: 'Universal system prompt for all users',
    icon: 'Settings'
  },
  {
    id: 'features',
    label: 'Feature Guides',
    description: 'Web Search, Memory, Artifacts, Code, Files',
    icon: 'Zap',
    badge: '5'
  },
  {
    id: 'tools',
    label: 'Tools & Connectors',
    description: 'MCP servers and integrations',
    icon: 'Wrench',
    badge: '9'
  },
  {
    id: 'roles',
    label: 'Role Profiles',
    description: 'Department-specific guidance',
    icon: 'Users'
  },
  {
    id: 'best-practices',
    label: 'Best Practices',
    description: 'Prompting, security, workflow tips',
    icon: 'Lightbulb'
  },
  {
    id: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions',
    icon: 'HelpCircle',
    badge: '20+'
  },
  {
    id: 'deployment',
    label: 'Deployment',
    description: 'Implementation checklist',
    icon: 'CheckSquare'
  },
  {
    id: 'governance',
    label: 'Governance',
    description: 'SLA, Risk, Playbooks',
    icon: 'ShieldAlert'
  }
];
