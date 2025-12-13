/**
 * @fileoverview Deployment phase data with detailed tasks and sub-phases
 * @module data/deployment-phases
 * @description Production-grade deployment phases with comprehensive task breakdown (Phases 0-10)
 * 
 * This module contains the complete deployment lifecycle broken down into:
 * - 11 major phases
 * - Detailed tasks with acceptance criteria
 * - Dependencies and ownership
 * 
 * @author INT Inc Engineering Team
 * @version 2.0.0
 * @since 2025-12-13
 */

import { DeploymentPhase } from '../types';

/**
 * Phase 0: Planning & Preparation
 */
export const phase0: DeploymentPhase = {
  id: 'phase-0',
  number: 0,
  title: 'Planning & Preparation',
  description: 'Establish project foundation, gather requirements, and set up infrastructure',
  duration: '2 weeks',
  owner: 'Product Owner, Tech Lead',
  stakeholders: ['Engineering', 'Security', 'Compliance'],
  status: 'completed',
  progress: 100,
  startDate: '2025-11-01',
  endDate: '2025-11-15',
  subPhases: [
    {
      id: 'phase-0.1',
      title: 'Requirements Gathering',
      description: 'Collect and document all functional and non-functional requirements',
      duration: '1 week',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: 'task-0.1.1',
          title: 'Conduct stakeholder interviews',
          description: 'Interview representatives from each department to understand their needs',
          category: 'Requirements',
          priority: 'critical',
          estimatedHours: 16,
          actualHours: 18,
          assignee: 'Product Owner',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: ['Interview notes documented', 'Requirements document created'],
          completedDate: '2025-11-05'
        },
        {
          id: 'task-0.1.2',
          title: 'Define technical requirements',
          description: 'Document performance, security, and scalability requirements',
          category: 'Requirements',
          priority: 'critical',
          estimatedHours: 12,
          actualHours: 14,
          assignee: 'Tech Lead',
          status: 'completed',
          dependencies: ['task-0.1.1'],
          acceptanceCriteria: ['Performance targets defined', 'Security requirements documented'],
          completedDate: '2025-11-07'
        }
      ]
    },
    {
      id: 'phase-0.2',
      title: 'Project Setup',
      description: 'Initialize repository, configure tools, and set up development environment',
      duration: '3 days',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: 'task-0.2.1',
          title: 'Initialize Git repository',
          description: 'Create repository with branch strategy and protection rules',
          category: 'Infrastructure',
          priority: 'critical',
          estimatedHours: 4,
          actualHours: 5,
          assignee: 'DevOps Engineer',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: ['Repository created', 'Branch protection configured'],
          completedDate: '2025-11-11'
        },
        {
          id: 'task-0.2.2',
          title: 'Configure CI/CD pipeline',
          description: 'Set up GitHub Actions for automated testing and deployment',
          category: 'Infrastructure',
          priority: 'critical',
          estimatedHours: 8,
          actualHours: 10,
          assignee: 'DevOps Engineer',
          status: 'completed',
          dependencies: ['task-0.2.1'],
          acceptanceCriteria: ['CI/CD workflows active', 'Security scanning integrated'],
          completedDate: '2025-11-13'
        }
      ]
    }
  ]
};

/**
 * Phase 1: Development
 */
export const phase1: DeploymentPhase = {
  id: 'phase-1',
  number: 1,
  title: 'Development',
  description: 'Build core infrastructure, UI components, features, and pages',
  duration: '4 weeks',
  owner: 'Engineering Team',
  stakeholders: ['Tech Lead', 'Product Owner'],
  status: 'completed',
  progress: 100,
  startDate: '2025-11-18',
  endDate: '2025-12-15',
  subPhases: [
    {
      id: 'phase-1.1',
      title: 'Core Infrastructure',
      description: 'Set up application scaffold, configuration layer, and data layer',
      duration: '1 week',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: 'task-1.1.1',
          title: 'Initialize React project',
          description: 'Create new Vite project with React and TypeScript',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 4,
          actualHours: 4,
          assignee: 'Frontend Engineer',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: ['Project running locally', 'Typescript configured'],
          completedDate: '2025-11-18'
        },
        {
          id: 'task-1.1.4',
          title: 'Implement config layer',
          description: 'Create centralized configuration system',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 8,
          actualHours: 10,
          assignee: 'Frontend Engineer',
          status: 'completed',
          dependencies: ['task-1.1.1'],
          acceptanceCriteria: ['Config store created', 'Env variables mapped'],
          completedDate: '2025-11-21'
        }
      ]
    },
    {
      id: 'phase-1.2',
      title: 'Feature Implementation',
      description: 'Build search, bookmarks, and analytics systems',
      duration: '2 weeks',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: 'task-1.3.1',
          title: 'Implement search',
          description: 'Build fuzzy search with relevance scoring',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 12,
          actualHours: 15,
          assignee: 'Frontend Engineer',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: ['Search working <100ms', 'Fuzzy matching active'],
          completedDate: '2025-12-04'
        }
      ]
    }
  ]
};

/**
 * Phase 2: Security & Compliance Hardening
 */
export const phase2: DeploymentPhase = {
  id: 'phase-2',
  number: 2,
  title: 'Security & Compliance Hardening',
  description: 'Implement enterprise security controls, DLP, and compliance guardrails',
  duration: '2 weeks',
  owner: 'CISO, DevOps',
  stakeholders: ['Legal', 'Engineering'],
  status: 'in-progress',
  progress: 65,
  startDate: '2025-12-16',
  endDate: '2025-12-30',
  subPhases: [
    {
      id: 'phase-2.1',
      title: 'Data Loss Prevention (DLP)',
      description: 'Configure PII redaction and sensitive data filters',
      duration: '1 week',
      status: 'in-progress',
      progress: 80,
      tasks: [
        {
          id: 'task-2.1.1',
          title: 'Configure PII Scrubbing Middleware',
          description: 'Implement regex-based redaction for SSN, Credit Cards, and Email',
          category: 'Security',
          priority: 'critical',
          estimatedHours: 16,
          assignee: 'Security Engineer',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: ['PII replaced with [REDACTED]', 'Unit tests for regex patterns'],
          completedDate: '2025-12-18'
        },
        {
          id: 'task-2.1.2',
          title: 'Setup Presidio Integration',
          description: 'Integrate Microsoft Presidio for advanced entity recognition',
          category: 'Security',
          priority: 'high',
          estimatedHours: 24,
          assignee: 'Backend Engineer',
          status: 'in-progress',
          dependencies: ['task-2.1.1'],
          acceptanceCriteria: ['Context-aware redaction working', 'Latency <200ms']
        }
      ]
    },
    {
      id: 'phase-2.2',
      title: 'Access Control (RBAC)',
      description: 'Implement role-based access control for all features',
      duration: '1 week',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-2.2.1',
          title: 'Define Role Permissions Matrix',
          description: 'Map roles (Finance, Eng, etc.) to feature flags',
          category: 'Governance',
          priority: 'critical',
          estimatedHours: 8,
          assignee: 'Product Manager',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Matrix approved by CISO', 'JSON config created']
        },
        {
          id: 'task-2.2.2',
          title: 'Implement Gatekeeper Service',
          description: 'Middleware to enforce RBAC on API routes',
          category: 'Security',
          priority: 'critical',
          estimatedHours: 16,
          assignee: 'Backend Engineer',
          status: 'pending',
          dependencies: ['task-2.2.1'],
          acceptanceCriteria: ['Unauthorized requests blocked', 'Audit logs capture denials']
        }
      ]
    }
  ]
};

/**
 * Phase 3: Beta / Pilot Program
 */
export const phase3: DeploymentPhase = {
  id: 'phase-3',
  number: 3,
  title: 'Pilot Program',
  description: 'Controlled rollout to select high-impact teams (Engineering & Marketing)',
  duration: '3 weeks',
  owner: 'Product Manager',
  stakeholders: ['Engineering', 'Marketing'],
  status: 'pending',
  progress: 0,
  startDate: '2026-01-02',
  endDate: '2026-01-23',
  subPhases: [
    {
      id: 'phase-3.1',
      title: 'User Selection & Onboarding',
      description: 'Identify and onboard 50 power users',
      duration: '1 week',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-3.1.1',
          title: 'Select Pilot Cohort',
          description: 'Identify 25 Engineers and 25 Marketers',
          category: 'Operations',
          priority: 'high',
          estimatedHours: 8,
          assignee: 'Dept Heads',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['List finalized', 'Users notified']
        },
        {
          id: 'task-3.1.2',
          title: 'Conduct Kickoff Workshops',
          description: 'Live training sessions for pilot users',
          category: 'Training',
          priority: 'high',
          estimatedHours: 12,
          assignee: 'Product Owner',
          status: 'pending',
          dependencies: ['task-3.1.1'],
          acceptanceCriteria: ['90% attendance', 'Access verified']
        }
      ]
    },
    {
      id: 'phase-3.2',
      title: 'Feedback Loop Setup',
      description: 'Establish channels for rapid bug reporting and feature requests',
      duration: '2 days',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-3.2.1',
          title: 'Configure Feedback Widget',
          description: 'In-app floating widget for screenshots/text',
          category: 'Development',
          priority: 'medium',
          estimatedHours: 6,
          assignee: 'Frontend Engineer',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Widget deployed', 'Feedback routing to Linear']
        }
      ]
    }
  ]
};

/**
 * Phase 4: Training & Change Management
 */
export const phase4: DeploymentPhase = {
  id: 'phase-4',
  number: 4,
  title: 'Training & Change Management',
  description: 'Company-wide upskilling and certification program',
  duration: '4 weeks',
  owner: 'HR / L&D',
  stakeholders: ['All Dept Heads'],
  status: 'pending',
  progress: 0,
  startDate: '2026-01-26',
  endDate: '2026-02-20',
  subPhases: [
    {
      id: 'phase-4.1',
      title: 'Curriculum Development',
      description: 'Create role-specific learning paths',
      duration: '2 weeks',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-4.1.1',
          title: 'Develop "AI Fundamentals" Course',
          description: 'Mandatory baseline training for all employees',
          category: 'Content',
          priority: 'critical',
          estimatedHours: 40,
          assignee: 'Instructional Designer',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Video modules created', 'Quiz drafted']
        },
        {
          id: 'task-4.1.2',
          title: 'Create Advanced Role Tracks',
          description: 'Specialized modules for Devs, Finance, Legal',
          category: 'Content',
          priority: 'high',
          estimatedHours: 60,
          assignee: 'Subject Matter Experts',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Code examples for devs', 'Excel guides for Finance']
        }
      ]
    }
  ]
};

/**
 * Phase 5: Production Launch (GA)
 */
export const phase5: DeploymentPhase = {
  id: 'phase-5',
  number: 5,
  title: 'General Availability (GA)',
  description: 'Full rollout to all 200+ employees',
  duration: '1 week',
  owner: 'CTO',
  stakeholders: ['All'],
  status: 'pending',
  progress: 0,
  startDate: '2026-02-23',
  endDate: '2026-02-27',
  subPhases: [
    {
      id: 'phase-5.1',
      title: 'Launch Logistics',
      description: 'Account provisioning and communication',
      duration: '3 days',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-5.1.1',
          title: 'Bulk Provision Accounts',
          description: 'Enable SSO for all staff via Okta',
          category: 'IT',
          priority: 'critical',
          estimatedHours: 4,
          assignee: 'IT Admin',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['All users synced', 'Groups mapped']
        },
        {
          id: 'task-5.1.2',
          title: 'Town Hall Announcement',
          description: 'CEO presentation and demo',
          category: 'Comms',
          priority: 'high',
          estimatedHours: 2,
          assignee: 'CEO / Comms',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Deck prepared', 'Invites sent']
        }
      ]
    }
  ]
};

/**
 * Phase 6: Advanced Integrations
 */
export const phase6: DeploymentPhase = {
  id: 'phase-6',
  number: 6,
  title: 'Advanced Integrations (MCP)',
  description: 'Connect internal data sources via Model Context Protocol',
  duration: '6 weeks',
  owner: 'Engineering Lead',
  stakeholders: ['Data Team', 'Ops'],
  status: 'pending',
  progress: 0,
  startDate: '2026-03-02',
  endDate: '2026-04-10',
  subPhases: [
    {
      id: 'phase-6.1',
      title: 'Core Data Connectors',
      description: 'Connect Database and CRM',
      duration: '3 weeks',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-6.1.1',
          title: 'Deploy PostgreSQL MCP Server',
          description: 'ReadOnly access to analytics DB',
          category: 'Development',
          priority: 'high',
          estimatedHours: 20,
          assignee: 'Data Engineer',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Server active', 'Schema filtering configured']
        },
        {
          id: 'task-6.1.2',
          title: 'Salesforce MCP Integration',
          description: 'Connect CRM for Sales team queries',
          category: 'Development',
          priority: 'high',
          estimatedHours: 24,
          assignee: 'Integration Specialist',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['OAuth flow working', 'Object permissions set']
        }
      ]
    }
  ]
};

/**
 * Phase 7: Optimization & Cost Control
 */
export const phase7: DeploymentPhase = {
  id: 'phase-7',
  number: 7,
  title: 'Optimization & Cost Control',
  description: 'Implement caching, rate limiting, and model routing',
  duration: '3 weeks',
  owner: 'FinOps',
  stakeholders: ['Finance', 'Engineering'],
  status: 'pending',
  progress: 0,
  startDate: '2026-04-13',
  endDate: '2026-05-01',
  subPhases: [
    {
      id: 'phase-7.1',
      title: 'Cost Engineering',
      description: 'Reduce token spend without impacting quality',
      duration: '2 weeks',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-7.1.1',
          title: 'Implement Prompt Caching',
          description: 'Cache system prompts and large context',
          category: 'Engineering',
          priority: 'high',
          estimatedHours: 12,
          assignee: 'Backend Engineer',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Cache hit rate >50%', 'Spend reduced 20%']
        },
        {
          id: 'task-7.1.2',
          title: 'Smart Model Routing',
          description: 'Route simple queries to Haiku, complex to Opus',
          category: 'Engineering',
          priority: 'medium',
          estimatedHours: 16,
          assignee: 'AI Engineer',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Router logic active', 'Latency reduced']
        }
      ]
    }
  ]
};

/**
 * Phase 8: Governance & Audit
 */
export const phase8: DeploymentPhase = {
  id: 'phase-8',
  number: 8,
  title: 'Governance & Continuous Audit',
  description: 'Automated compliance monitoring and policy enforcement',
  duration: '3 weeks',
  owner: 'CISO',
  stakeholders: ['Legal', 'Risk'],
  status: 'pending',
  progress: 0,
  startDate: '2026-05-04',
  endDate: '2026-05-22',
  subPhases: [
    {
      id: 'phase-8.1',
      title: 'Automated Auditing',
      description: 'Real-time monitoring of AI interactions',
      duration: '1 week',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-8.1.1',
          title: 'Deploy Sentinel Agent',
          description: 'Background agent scanning logs for policy violations',
          category: 'Security',
          priority: 'critical',
          estimatedHours: 24,
          assignee: 'Security Architect',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Alerts configured', 'False positive rate <1%']
        }
      ]
    }
  ]
};

/**
 * Phase 9: Global Expansion
 */
export const phase9: DeploymentPhase = {
  id: 'phase-9',
  number: 9,
  title: 'Global Expansion & Localization',
  description: 'Rollout to international offices (EMEA, APAC)',
  duration: '4 weeks',
  owner: 'VP Operations',
  stakeholders: ['Regional Leads'],
  status: 'pending',
  progress: 0,
  startDate: '2026-05-25',
  endDate: '2026-06-19',
  subPhases: [
    {
      id: 'phase-9.1',
      title: 'Regional Compliance',
      description: 'GDPR and local data residency setup',
      duration: '2 weeks',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-9.1.1',
          title: 'EU Data Residency Config',
          description: 'Ensure EMEA data stays in Frankfurt region',
          category: 'Compliance',
          priority: 'critical',
          estimatedHours: 16,
          assignee: 'Cloud Architect',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Bedrock/Vertex regions pinned', 'Legal signoff']
        }
      ]
    }
  ]
};

/**
 * Phase 10: Innovation (Agentic AI)
 */
export const phase10: DeploymentPhase = {
  id: 'phase-10',
  number: 10,
  title: 'Innovation & Agentic Workflows',
  description: 'Deploy autonomous agents for complex multi-step tasks',
  duration: 'Ongoing',
  owner: 'Head of AI',
  stakeholders: ['Executive Team'],
  status: 'pending',
  progress: 0,
  startDate: '2026-06-22',
  endDate: '2026-12-31',
  subPhases: [
    {
      id: 'phase-10.1',
      title: 'Autonomous Agents',
      description: 'Deploy "Code Reviewer" and "Data Analyst" autonomous agents',
      duration: '4 weeks',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-10.1.1',
          title: 'Deploy Claude Code Autopilot',
          description: 'Enable autonomous bug fixing in non-prod repos',
          category: 'Innovation',
          priority: 'high',
          estimatedHours: 40,
          assignee: 'AI Research Lead',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: ['Success rate >80%', 'Human oversight dashboard active']
        }
      ]
    }
  ]
};

export const allDeploymentPhases = [
  phase0, 
  phase1, 
  phase2, 
  phase3, 
  phase4, 
  phase5, 
  phase6, 
  phase7, 
  phase8, 
  phase9, 
  phase10
];

export const deploymentData = allDeploymentPhases;
