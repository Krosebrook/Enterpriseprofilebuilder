import { DocumentResource, ComplianceChecklist, ComplianceCheckItem } from '../../types';

export const complianceDocs: DocumentResource[] = [
  {
    id: 'enterprise-compliance-checklist',
    title: 'Claude Enterprise Compliance Checklist',
    description: 'Comprehensive compliance checklist for enterprise Claude deployment covering security, data privacy, and audit requirements.',
    category: 'compliance',
    fileName: 'CLAUDE_ENTERPRISE_COMPLIANCE_CHECKLIST.md',
    downloadPath: '/docs/compliance/CLAUDE_ENTERPRISE_COMPLIANCE_CHECKLIST.md',
    section: 'governance',
    tags: ['compliance', 'enterprise', 'security', 'audit', 'data-privacy'],
    lastUpdated: '2025-01-11',
    order: 1,
    featured: true,
  },
];

export const complianceChecklistData: ComplianceChecklist = {
  id: 'claude-enterprise-checklist',
  name: 'Claude Enterprise Compliance Checklist',
  description: 'Essential compliance items for enterprise Claude deployment',
  lastUpdated: '2025-01-11',
  version: '1.0',
  items: [
    // Security
    {
      id: 'sec-1',
      category: 'security',
      title: 'Enable SSO/SAML Integration',
      description: 'Configure Single Sign-On with your identity provider (Okta, Azure AD, etc.)',
      required: true,
    },
    {
      id: 'sec-2',
      category: 'security',
      title: 'Configure IP Allowlisting',
      description: 'Restrict access to approved IP ranges only',
      required: false,
    },
    {
      id: 'sec-3',
      category: 'security',
      title: 'Enable Audit Logging',
      description: 'Ensure all user interactions are logged for compliance review',
      required: true,
    },
    {
      id: 'sec-4',
      category: 'security',
      title: 'Review API Key Management',
      description: 'Implement secure API key rotation and storage practices',
      required: true,
    },
    {
      id: 'sec-5',
      category: 'security',
      title: 'Configure Rate Limiting',
      description: 'Set appropriate rate limits to prevent abuse',
      required: false,
    },
    // Data Privacy
    {
      id: 'dp-1',
      category: 'data-privacy',
      title: 'Data Retention Policy',
      description: 'Define and configure data retention periods',
      required: true,
    },
    {
      id: 'dp-2',
      category: 'data-privacy',
      title: 'PII Handling Guidelines',
      description: 'Establish guidelines for handling personally identifiable information',
      required: true,
    },
    {
      id: 'dp-3',
      category: 'data-privacy',
      title: 'Data Residency Compliance',
      description: 'Verify data storage locations meet regional requirements',
      required: true,
    },
    {
      id: 'dp-4',
      category: 'data-privacy',
      title: 'Opt-out Configuration',
      description: 'Configure model training opt-out settings',
      required: false,
    },
    // Access Control
    {
      id: 'ac-1',
      category: 'access-control',
      title: 'Role-Based Access Control',
      description: 'Implement RBAC for different user types and permissions',
      required: true,
    },
    {
      id: 'ac-2',
      category: 'access-control',
      title: 'Admin Access Review',
      description: 'Regular review of admin-level access permissions',
      required: true,
    },
    {
      id: 'ac-3',
      category: 'access-control',
      title: 'User Provisioning Process',
      description: 'Establish formal user provisioning and deprovisioning procedures',
      required: true,
    },
    // Audit
    {
      id: 'aud-1',
      category: 'audit',
      title: 'Conversation Logging',
      description: 'Enable logging of all Claude conversations for audit purposes',
      required: true,
    },
    {
      id: 'aud-2',
      category: 'audit',
      title: 'Usage Analytics Dashboard',
      description: 'Set up dashboards for monitoring usage patterns',
      required: false,
    },
    {
      id: 'aud-3',
      category: 'audit',
      title: 'Compliance Reporting',
      description: 'Configure automated compliance reports',
      required: false,
    },
    // Training
    {
      id: 'tr-1',
      category: 'training',
      title: 'User Training Program',
      description: 'Develop and deliver user training on Claude best practices',
      required: true,
    },
    {
      id: 'tr-2',
      category: 'training',
      title: 'Security Awareness Training',
      description: 'Include AI-specific security training in awareness program',
      required: true,
    },
    {
      id: 'tr-3',
      category: 'training',
      title: 'Prompt Engineering Guidelines',
      description: 'Document and distribute prompt engineering best practices',
      required: false,
    },
    // Technical
    {
      id: 'tech-1',
      category: 'technical',
      title: 'API Integration Security',
      description: 'Review and secure all API integrations',
      required: true,
    },
    {
      id: 'tech-2',
      category: 'technical',
      title: 'Error Handling',
      description: 'Implement proper error handling that doesn\'t expose sensitive info',
      required: true,
    },
    {
      id: 'tech-3',
      category: 'technical',
      title: 'Backup and Recovery',
      description: 'Establish backup and disaster recovery procedures',
      required: true,
    },
  ],
};
