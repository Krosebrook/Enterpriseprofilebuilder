import { DeploymentStep } from '../types';

export const deploymentData: DeploymentStep[] = [
  {
    id: 'deploy-step-1',
    week: 'Week 1',
    title: 'Admin Setup',
    criticalPath: true,
    tasks: [
      {
        id: 'task-1-1',
        description: 'Enable Claude Enterprise workspace',
        completed: false,
        owner: 'CTO'
      },
      {
        id: 'task-1-2',
        description: 'Configure SAML/OIDC (Okta or Azure AD)',
        completed: false,
        owner: 'IT Security'
      },
      {
        id: 'task-1-3',
        description: 'Set up RBAC (map INT Inc roles to Claude permission levels)',
        completed: false,
        owner: 'CTO'
      },
      {
        id: 'task-1-4',
        description: 'Enable ZDR in settings (no data retention)',
        completed: false,
        owner: 'CSO'
      },
      {
        id: 'task-1-5',
        description: 'Configure audit logging (Sentry integration)',
        completed: false,
        owner: 'DevOps'
      },
      {
        id: 'task-1-6',
        description: 'Test: Can 5 test users login successfully?',
        completed: false,
        owner: 'QA'
      }
    ]
  },
  {
    id: 'deploy-step-2',
    week: 'Week 1-2',
    title: 'Feature Configuration',
    criticalPath: true,
    dependencies: ['deploy-step-1'],
    tasks: [
      {
        id: 'task-2-1',
        description: 'Enable web search (all roles)',
        completed: false,
        owner: 'CTO'
      },
      {
        id: 'task-2-2',
        description: 'Enable memory (all roles)',
        completed: false,
        owner: 'CTO'
      },
      {
        id: 'task-2-3',
        description: 'Enable artifacts (all roles)',
        completed: false,
        owner: 'CTO'
      },
      {
        id: 'task-2-4',
        description: 'Enable code execution (Engineering only)',
        completed: false,
        owner: 'CTO'
      },
      {
        id: 'task-2-5',
        description: 'Enable files (all roles, with restrictions)',
        completed: false,
        owner: 'CTO'
      },
      {
        id: 'task-2-6',
        description: 'Configure rate limits (20 req/min per role)',
        completed: false,
        owner: 'DevOps'
      },
      {
        id: 'task-2-7',
        description: 'Test: Can users access enabled features?',
        completed: false,
        owner: 'QA'
      }
    ]
  },
  {
    id: 'deploy-step-3',
    week: 'Week 2',
    title: 'Connector Setup',
    criticalPath: false,
    dependencies: ['deploy-step-2'],
    tasks: [
      {
        id: 'task-3-1',
        description: 'Authorize Stripe connector (Finance)',
        completed: false,
        owner: 'Finance Lead'
      },
      {
        id: 'task-3-2',
        description: 'Authorize Vercel connector (Engineering)',
        completed: false,
        owner: 'DevOps Lead'
      },
      {
        id: 'task-3-3',
        description: 'Authorize HubSpot connector (Sales)',
        completed: false,
        owner: 'Sales Ops'
      },
      {
        id: 'task-3-4',
        description: 'Authorize GitHub connector (Engineering)',
        completed: false,
        owner: 'DevOps Lead'
      },
      {
        id: 'task-3-5',
        description: 'Authorize Notion connector (all)',
        completed: false,
        owner: 'Ops Manager'
      },
      {
        id: 'task-3-6',
        description: 'Test: Can each role access their connectors?',
        completed: false,
        owner: 'QA'
      }
    ]
  },
  {
    id: 'deploy-step-4',
    week: 'Week 2-3',
    title: 'Training',
    criticalPath: true,
    dependencies: ['deploy-step-2'],
    tasks: [
      {
        id: 'task-4-1',
        description: 'Create role-specific guides (Sales, Finance, Engineering, Marketing, Ops)',
        completed: false,
        owner: 'Training Team'
      },
      {
        id: 'task-4-2',
        description: 'Conduct 1-hour all-hands demo',
        completed: false,
        owner: 'CTO'
      },
      {
        id: 'task-4-3',
        description: 'Hold 30-min breakout sessions by role',
        completed: false,
        owner: 'Department Leads'
      },
      {
        id: 'task-4-4',
        description: 'Publish FAQ + troubleshooting guide',
        completed: false,
        owner: 'Training Team'
      },
      {
        id: 'task-4-5',
        description: 'Assign "Claude champions" per department',
        completed: false,
        owner: 'HR'
      },
      {
        id: 'task-4-6',
        description: 'Track: Are >80% of staff trained?',
        completed: false,
        owner: 'HR'
      }
    ]
  },
  {
    id: 'deploy-step-5',
    week: 'Week 3+',
    title: 'Monitoring',
    criticalPath: false,
    dependencies: ['deploy-step-4'],
    tasks: [
      {
        id: 'task-5-1',
        description: 'Set up cost dashboard (weekly review)',
        completed: false,
        owner: 'Finance'
      },
      {
        id: 'task-5-2',
        description: 'Configure Sentry alerts (security incidents)',
        completed: false,
        owner: 'DevOps'
      },
      {
        id: 'task-5-3',
        description: 'Track adoption metrics (Daily Active Users, feature usage)',
        completed: false,
        owner: 'Product Analytics'
      },
      {
        id: 'task-5-4',
        description: 'Schedule weekly check-ins (first month)',
        completed: false,
        owner: 'CTO'
      },
      {
        id: 'task-5-5',
        description: 'Collect feedback (surveys, interviews)',
        completed: false,
        owner: 'HR'
      },
      {
        id: 'task-5-6',
        description: 'Adjust prompts/features based on feedback',
        completed: false,
        owner: 'CTO'
      }
    ]
  }
];
