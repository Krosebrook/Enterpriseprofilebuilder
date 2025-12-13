import { DeploymentStep } from '../types';

export const deploymentData: DeploymentStep[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: Foundation & Security',
    week: 1,
    criticalPath: true,
    tasks: [
      { id: 'sso-setup', description: 'Configure Okta SSO integration', owner: 'IT Ops' },
      { id: 'scim-prov', description: 'Enable SCIM provisioning for user sync', owner: 'IT Ops' },
      { id: 'audit-logs', description: 'Set up audit log export to Splunk', owner: 'SecOps' },
      { id: 'policy-doc', description: 'Publish Acceptable Use Policy', owner: 'Legal' }
    ]
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Pilot Group',
    week: 2,
    criticalPath: false,
    dependencies: ['phase-1'],
    tasks: [
      { id: 'pilot-selection', description: 'Select 50 users from diverse depts', owner: 'Program Mgmt' },
      { id: 'training-session', description: 'Conduct initial training workshop', owner: 'L&D' },
      { id: 'feedback-loop', description: 'Establish feedback channel (Slack)', owner: 'Program Mgmt' }
    ]
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Integration',
    week: 3,
    criticalPath: true,
    dependencies: ['phase-2'],
    tasks: [
      { id: 'mcp-github', description: 'Connect GitHub MCP Server', owner: 'Engineering' },
      { id: 'mcp-notion', description: 'Connect Notion MCP Server', owner: 'IT Ops' },
      { id: 'data-connectors', description: 'Verify permissions for data connectors', owner: 'SecOps' }
    ]
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Company-Wide Rollout',
    week: 4,
    criticalPath: true,
    dependencies: ['phase-3'],
    tasks: [
      { id: 'full-provision', description: 'Provision licenses for all 200 employees', owner: 'IT Ops' },
      { id: 'dept-guides', description: 'Distribute department-specific playbooks', owner: 'L&D' },
      { id: 'town-hall', description: 'CEO announcement at Town Hall', owner: 'Exec Comms' }
    ]
  }
];
