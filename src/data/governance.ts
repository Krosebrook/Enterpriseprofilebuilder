import { GovernanceData } from '../types';

export const governanceData: GovernanceData = {
  playbooks: [
    {
      id: 'ir-001',
      name: 'Prompt Injection / Jailbreak Attempt',
      severity: 'High',
      trigger: 'Automated alert from Security Gateway or User Report regarding bypass of safety filters.',
      steps: [
        { id: 's1', step: 'Identification', action: 'Verify the prompt log in Splunk. Confirm if output violated content policy.', owner: 'SecOps' },
        { id: 's2', step: 'Containment', action: 'Revoke user API access immediately via Okta.', owner: 'IT Ops' },
        { id: 's3', step: 'Analysis', action: 'Analyze the prompt pattern. Add to global blocklist regex.', owner: 'AI Ethics Lead' },
        { id: 's4', step: 'Remediation', action: 'Deploy updated system prompt with patch.', owner: 'Engineering' },
        { id: 's5', step: 'Review', action: 'Conduct RCA. Notify Legal if prohibited content was generated.', owner: 'CISO' }
      ]
    },
    {
      id: 'ir-002',
      name: 'Sensitive Data Exfiltration (PII/IP)',
      severity: 'Critical',
      trigger: 'DLP (Data Loss Prevention) scanner flags pattern matching SSN, Credit Card, or Top Secret IP.',
      steps: [
        { id: 's1', step: 'Block', action: 'Active interception by DLP should block request. Verify block success.', owner: 'System' },
        { id: 's2', step: 'Audit', action: 'Pull user session history. Check for previous successful exfiltrations.', owner: 'SecOps' },
        { id: 's3', step: 'Notification', action: 'Notify User Manager and Legal Compliance.', owner: 'HR / Legal' },
        { id: 's4', step: 'Retraining', action: 'Mandatory "Data Handling" refresher course for user.', owner: 'L&D' }
      ]
    },
    {
      id: 'ir-003',
      name: 'Unexpected Cost Spike',
      severity: 'Medium',
      trigger: 'Daily spend exceeds threshold ($500/day) or anomaly detection alert.',
      steps: [
        { id: 's1', step: 'Investigation', action: 'Identify top consuming users or departments in Usage Dashboard.', owner: 'FinOps' },
        { id: 's2', step: 'Throttle', action: 'Apply temporary rate limits to high-volume accounts.', owner: 'Engineering' },
        { id: 's3', step: 'Review', action: 'Check if legitimate business case (e.g., batch processing).', owner: 'Dept Lead' },
        { id: 's4', step: 'Adjustment', action: 'Adjust quotas or optimize prompt token usage.', owner: 'Engineering' }
      ]
    }
  ],
  sla: [
    {
      id: 'sla-001',
      metric: 'Service Availability',
      target: '99.9%',
      window: 'Monthly',
      description: 'Uptime for the Claude Enterprise Web Interface and internal Gateway.'
    },
    {
      id: 'sla-002',
      metric: 'Prompt Latency (P95)',
      target: '< 5 seconds',
      window: 'Real-time',
      description: 'Time from submission to first token generation (excluding model processing time).'
    },
    {
      id: 'sla-003',
      metric: 'Incident Response Time (P1)',
      target: '< 1 hour',
      window: '24/7',
      description: 'Time to acknowledge Critical security incidents.'
    },
    {
      id: 'sla-004',
      metric: 'Support Ticket Resolution',
      target: '< 24 hours',
      window: 'Business Days',
      description: 'Resolution time for standard "How-to" or Access requests.'
    }
  ],
  risks: [
    {
      id: 'r-001',
      category: 'Security',
      risk: 'Model Hallucination leading to incorrect business decisions',
      probability: 'Medium',
      impact: 'High',
      mitigation: 'Mandatory "Human in the Loop" verification for all outputs. Disclaimer banners.'
    },
    {
      id: 'r-002',
      category: 'Security',
      risk: 'Prompt Injection Attacks',
      probability: 'Medium',
      impact: 'High',
      mitigation: 'System Prompt hardening, Input Sanitization layer, User training.'
    },
    {
      id: 'r-003',
      category: 'Legal',
      risk: 'Copyright Infringement in generated code',
      probability: 'Low',
      impact: 'Medium',
      mitigation: 'Github Copilot Enterprise indemnity coverage. Code scanning tools.'
    },
    {
      id: 'r-004',
      category: 'Operational',
      risk: 'Vendor Lock-in (Anthropic)',
      probability: 'High',
      impact: 'Medium',
      mitigation: 'Maintain abstraction layer (Gateway) to swap models if necessary.'
    }
  ],
  stagingChecklist: [
    { id: 'c-001', category: 'Security', item: 'System Prompt includes latest "Data Privacy" directive', critical: true },
    { id: 'c-002', category: 'Security', item: 'PII Redaction Regex updated and tested', critical: true },
    { id: 'c-003', category: 'Performance', item: 'Load tested with 50 concurrent users', critical: false },
    { id: 'c-004', category: 'Compliance', item: 'Acceptable Use Policy banner visible on login', critical: true },
    { id: 'c-005', category: 'Functionality', item: 'MCP Servers (Github, Notion) connected and authenticated', critical: true },
    { id: 'c-006', category: 'Analytics', item: 'Audit logs successfully flowing to Splunk Staging', critical: true },
    { id: 'c-007', category: 'UX', item: 'Mobile view verified on iOS and Android', critical: false },
    { id: 'c-008', category: 'Content', item: 'All "Best Practices" links work and content is current', critical: false }
  ]
};
