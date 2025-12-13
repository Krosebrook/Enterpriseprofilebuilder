import { McpServer } from '../types';

export const mcpServersData: McpServer[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: "Connect repositories for code search, issue tracking, and PR management.",
    category: 'development',
    roles: ['Engineering', 'Product', 'QA'],
    useCases: [
      "Search for code snippets across repos",
      "Create issues from bug reports",
      "Summarize recent PR activity"
    ]
  },
  {
    id: 'notion',
    name: 'Notion',
    description: "Access and manage knowledge base, project trackers, and docs.",
    category: 'communication',
    roles: ['All Roles'],
    useCases: [
      "Retrieve company policies",
      "Update project status cards",
      "Read meeting notes"
    ]
  },
  {
    id: 'linear',
    name: 'Linear',
    description: "Manage software projects, issues, and cycles.",
    category: 'development',
    roles: ['Engineering', 'Product'],
    useCases: [
      "Create tickets from spec artifacts",
      "Query sprint velocity",
      "Find blocking issues"
    ]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: "Access financial data, subscriptions, and customer payments.",
    category: 'data',
    roles: ['Finance', 'Sales', 'Support'],
    useCases: [
      "Check customer MRR",
      "Verify recent payouts",
      "Analyze refund rates"
    ]
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: "CRM data access for contacts, companies, and deals.",
    category: 'data',
    roles: ['Sales', 'Marketing'],
    useCases: [
      "Find contact details",
      "Update deal stages",
      "Log meeting notes"
    ]
  }
];
