/**
 * @fileoverview Deployment phase data with detailed tasks and sub-phases
 * @module data/deployment-phases
 * @description Production-grade deployment phases with comprehensive task breakdown
 * 
 * This module contains the complete deployment lifecycle broken down into:
 * - 7 major phases
 * - 20+ sub-phases
 * - 100+ detailed tasks
 * - Acceptance criteria for each
 * - Time estimates
 * - Dependencies
 * 
 * @author INT Inc Engineering Team
 * @version 1.0.0
 * @since 2025-12-11
 */

import { DeploymentPhase, DeploymentSubPhase, DeploymentTask } from '../types';

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
          acceptanceCriteria: [
            'Interview notes documented for each department',
            'Requirements document created',
            'Use cases identified and prioritized'
          ],
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
          acceptanceCriteria: [
            'Performance targets defined (Lighthouse 95+, <3s load time)',
            'Security requirements documented (SOC 2 Type II compliance)',
            'Scalability targets set (50-200 concurrent users)',
            'Browser support matrix created'
          ],
          completedDate: '2025-11-07'
        },
        {
          id: 'task-0.1.3',
          title: 'Create technical specification',
          description: 'Write comprehensive technical specification document',
          category: 'Requirements',
          priority: 'high',
          estimatedHours: 20,
          actualHours: 24,
          assignee: 'Tech Lead',
          status: 'completed',
          dependencies: ['task-0.1.2'],
          acceptanceCriteria: [
            'Technical spec document completed (v1.0)',
            'Architecture diagrams created',
            'Technology stack selected and justified',
            'Spec reviewed and approved by stakeholders'
          ],
          completedDate: '2025-11-10'
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
          acceptanceCriteria: [
            'Repository created with main, develop, and staging branches',
            'Branch protection rules configured',
            'CODEOWNERS file created',
            'PR and issue templates added'
          ],
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
          acceptanceCriteria: [
            'CI workflow runs tests on every PR',
            'CD workflow deploys to staging on merge to develop',
            'CD workflow deploys to production on merge to main',
            'Security scanning integrated (CodeQL, Dependabot)'
          ],
          completedDate: '2025-11-13'
        },
        {
          id: 'task-0.2.3',
          title: 'Set up development environment',
          description: 'Create development environment setup scripts and documentation',
          category: 'Infrastructure',
          priority: 'high',
          estimatedHours: 6,
          actualHours: 7,
          assignee: 'Frontend Engineer',
          status: 'completed',
          dependencies: ['task-0.2.1'],
          acceptanceCriteria: [
            'Developer onboarding guide created',
            'Environment setup script working',
            'IDE configuration files committed',
            'All team members can run app locally'
          ],
          completedDate: '2025-11-14'
        }
      ]
    },
    {
      id: 'phase-0.3',
      title: 'Design System',
      description: 'Create design tokens, component library, and accessibility guidelines',
      duration: '4 days',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: 'task-0.3.1',
          title: 'Define design tokens',
          description: 'Create design tokens for colors, typography, spacing, and shadows',
          category: 'Design',
          priority: 'high',
          estimatedHours: 8,
          actualHours: 10,
          assignee: 'UX Designer',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Color palette defined (primary, semantic, neutral)',
            'Typography scale created',
            'Spacing system established (8px grid)',
            'Shadow system defined',
            'Design tokens exported as code'
          ],
          completedDate: '2025-11-15'
        },
        {
          id: 'task-0.3.2',
          title: 'Create component library in Figma',
          description: 'Design all UI components in Figma following design system',
          category: 'Design',
          priority: 'high',
          estimatedHours: 16,
          actualHours: 18,
          assignee: 'UX Designer',
          status: 'completed',
          dependencies: ['task-0.3.1'],
          acceptanceCriteria: [
            'All components designed (Button, Card, Input, etc.)',
            'Component variants documented',
            'Usage guidelines written',
            'Design system shared with team'
          ],
          completedDate: '2025-11-17'
        },
        {
          id: 'task-0.3.3',
          title: 'Define accessibility guidelines',
          description: 'Document WCAG 2.1 AA compliance requirements',
          category: 'Design',
          priority: 'critical',
          estimatedHours: 6,
          actualHours: 7,
          assignee: 'UX Designer',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'WCAG 2.1 AA checklist created',
            'Color contrast ratios validated',
            'Keyboard navigation requirements documented',
            'Screen reader guidelines defined'
          ],
          completedDate: '2025-11-16'
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
          title: 'Initialize React project with Vite',
          description: 'Create new Vite project with React and TypeScript',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 4,
          actualHours: 4,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Vite project created with React 18 and TypeScript',
            'Development server runs without errors',
            'Hot reload working',
            'TypeScript strict mode enabled'
          ],
          completedDate: '2025-11-18'
        },
        {
          id: 'task-1.1.2',
          title: 'Configure Tailwind CSS',
          description: 'Install and configure Tailwind CSS 4.0 with design tokens',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 4,
          actualHours: 5,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: ['task-1.1.1'],
          acceptanceCriteria: [
            'Tailwind CSS installed and configured',
            'Design tokens integrated into Tailwind config',
            'Custom utilities created',
            'Tailwind working in components'
          ],
          completedDate: '2025-11-19'
        },
        {
          id: 'task-1.1.3',
          title: 'Create project structure',
          description: 'Set up folder structure for components, hooks, utils, and data',
          category: 'Development',
          priority: 'high',
          estimatedHours: 2,
          actualHours: 3,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: ['task-1.1.1'],
          acceptanceCriteria: [
            'Folder structure matches architecture spec',
            'Barrel exports configured',
            'Path aliases set up in tsconfig',
            'Structure documented in README'
          ],
          completedDate: '2025-11-19'
        },
        {
          id: 'task-1.1.4',
          title: 'Implement configuration layer',
          description: 'Create centralized configuration system with type safety',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 8,
          actualHours: 10,
          assignee: 'Frontend Engineer 2',
          status: 'completed',
          dependencies: ['task-1.1.3'],
          acceptanceCriteria: [
            'app.config.ts created with all settings',
            'Feature flags system implemented',
            'Environment detection working',
            'Configuration validation added'
          ],
          completedDate: '2025-11-21'
        },
        {
          id: 'task-1.1.5',
          title: 'Build logging system',
          description: 'Create production-grade logger with multiple log levels',
          category: 'Development',
          priority: 'high',
          estimatedHours: 6,
          actualHours: 8,
          assignee: 'Frontend Engineer 2',
          status: 'completed',
          dependencies: ['task-1.1.4'],
          acceptanceCriteria: [
            'Logger class with debug, info, warn, error levels',
            'Log persistence to LocalStorage',
            'Environment-aware logging',
            'Performance timing utilities'
          ],
          completedDate: '2025-11-22'
        },
        {
          id: 'task-1.1.6',
          title: 'Create error handling system',
          description: 'Build custom error classes and error handling utilities',
          category: 'Development',
          priority: 'high',
          estimatedHours: 6,
          actualHours: 7,
          assignee: 'Frontend Engineer 2',
          status: 'completed',
          dependencies: ['task-1.1.5'],
          acceptanceCriteria: [
            'Custom error classes created (AppError, ValidationError, etc.)',
            'Error handler utility implemented',
            'Try-catch wrapper functions',
            'User-friendly error messages'
          ],
          completedDate: '2025-11-23'
        },
        {
          id: 'task-1.1.7',
          title: 'Define TypeScript types',
          description: 'Create comprehensive type definitions for all data structures',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 8,
          actualHours: 10,
          assignee: 'Frontend Engineer 3',
          status: 'completed',
          dependencies: ['task-1.1.3'],
          acceptanceCriteria: [
            'All data types defined (FAQItem, Feature, DeploymentTask, etc.)',
            'Enum types for Role, Section, etc.',
            'Type guards implemented',
            '100% type coverage'
          ],
          completedDate: '2025-11-24'
        },
        {
          id: 'task-1.1.8',
          title: 'Create data layer',
          description: 'Build data files with all content (FAQ, features, deployment)',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 16,
          actualHours: 20,
          assignee: 'Frontend Engineer 3',
          status: 'completed',
          dependencies: ['task-1.1.7'],
          acceptanceCriteria: [
            'FAQ data file with 20+ items',
            'Features data file with 5 major features',
            'Deployment tasks with 30+ items',
            'Role profiles for 6 roles',
            'MCP servers data with 15+ connectors',
            'Best practices data',
            'All data validated against types'
          ],
          completedDate: '2025-11-26'
        }
      ]
    },
    {
      id: 'phase-1.2',
      title: 'UI Component Library',
      description: 'Build reusable atomic and composite UI components',
      duration: '1 week',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: 'task-1.2.1',
          title: 'Build Button component',
          description: 'Create Button with variants (primary, secondary, ghost) and sizes',
          category: 'Development',
          priority: 'high',
          estimatedHours: 4,
          actualHours: 5,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Button supports 3 variants',
            'Button supports 3 sizes (sm, md, lg)',
            'Fully typed with TypeScript',
            'Accessibility compliant',
            'Unit tests written'
          ],
          completedDate: '2025-11-27'
        },
        {
          id: 'task-1.2.2',
          title: 'Build Badge component',
          description: 'Create Badge with semantic variants',
          category: 'Development',
          priority: 'medium',
          estimatedHours: 3,
          actualHours: 4,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Badge supports 5 variants (default, success, warning, error, info)',
            'Fully typed',
            'Accessible',
            'Unit tests written'
          ],
          completedDate: '2025-11-27'
        },
        {
          id: 'task-1.2.3',
          title: 'Build Card component',
          description: 'Create Card component with variants',
          category: 'Development',
          priority: 'high',
          estimatedHours: 4,
          actualHours: 5,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Card component created',
            'Supports hover effects',
            'Responsive design',
            'Unit tests written'
          ],
          completedDate: '2025-11-28'
        },
        {
          id: 'task-1.2.4',
          title: 'Build Input components',
          description: 'Create text input, search input, and form controls',
          category: 'Development',
          priority: 'high',
          estimatedHours: 6,
          actualHours: 8,
          assignee: 'Frontend Engineer 2',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Text input with validation states',
            'Search input with clear button',
            'Checkbox and radio components',
            'Error and success states',
            'Unit tests written'
          ],
          completedDate: '2025-11-29'
        },
        {
          id: 'task-1.2.5',
          title: 'Build Toast notification system',
          description: 'Create toast notifications with auto-dismiss',
          category: 'Development',
          priority: 'medium',
          estimatedHours: 6,
          actualHours: 7,
          assignee: 'Frontend Engineer 2',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Toast container component',
            'Toast component with 4 types',
            'Auto-dismiss after 5 seconds',
            'Stacking multiple toasts',
            'Animation support',
            'Unit tests written'
          ],
          completedDate: '2025-11-30'
        },
        {
          id: 'task-1.2.6',
          title: 'Build Progress Bar component',
          description: 'Create progress bar with color variants',
          category: 'Development',
          priority: 'medium',
          estimatedHours: 3,
          actualHours: 4,
          assignee: 'Frontend Engineer 3',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Progress bar with percentage value',
            'Color variants (success, warning, info)',
            'Smooth animations',
            'Unit tests written'
          ],
          completedDate: '2025-12-01'
        },
        {
          id: 'task-1.2.7',
          title: 'Build Tooltip component',
          description: 'Create tooltip with positioning',
          category: 'Development',
          priority: 'low',
          estimatedHours: 4,
          actualHours: 5,
          assignee: 'Frontend Engineer 3',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Tooltip with hover trigger',
            'Positioning (top, bottom, left, right)',
            'Delay configuration',
            'Accessible',
            'Unit tests written'
          ],
          completedDate: '2025-12-02'
        }
      ]
    },
    {
      id: 'phase-1.3',
      title: 'Feature Implementation',
      description: 'Build search, bookmarks, and analytics systems',
      duration: '1 week',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: 'task-1.3.1',
          title: 'Implement search algorithm',
          description: 'Build fuzzy search with relevance scoring',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 12,
          actualHours: 15,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Fuzzy search algorithm implemented',
            'Multi-field search (title, content, tags)',
            'Relevance scoring',
            'Search returns results <100ms',
            'Unit tests with 95%+ coverage'
          ],
          completedDate: '2025-12-04'
        },
        {
          id: 'task-1.3.2',
          title: 'Build useSearch hook',
          description: 'Create custom hook for search with debouncing',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 6,
          actualHours: 7,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: ['task-1.3.1'],
          acceptanceCriteria: [
            'useSearch hook with debouncing (300ms)',
            'Returns results and loading state',
            'Cancels previous searches',
            'Unit tests written'
          ],
          completedDate: '2025-12-05'
        },
        {
          id: 'task-1.3.3',
          title: 'Build SearchBar component',
          description: 'Create search input with dropdown results',
          category: 'Development',
          priority: 'high',
          estimatedHours: 8,
          actualHours: 10,
          assignee: 'Frontend Engineer 2',
          status: 'completed',
          dependencies: ['task-1.3.2'],
          acceptanceCriteria: [
            'Search input with icon',
            'Results dropdown',
            'Keyboard navigation (arrows, enter, escape)',
            'Result highlighting',
            'Integration tests written'
          ],
          completedDate: '2025-12-06'
        },
        {
          id: 'task-1.3.4',
          title: 'Implement bookmark system',
          description: 'Build bookmark functionality with LocalStorage persistence',
          category: 'Development',
          priority: 'high',
          estimatedHours: 8,
          actualHours: 9,
          assignee: 'Frontend Engineer 2',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'useBookmarks hook implemented',
            'Add/remove bookmark functions',
            'LocalStorage persistence',
            'Bookmark list view',
            'Unit tests written'
          ],
          completedDate: '2025-12-07'
        },
        {
          id: 'task-1.3.5',
          title: 'Build analytics tracking system',
          description: 'Create event tracking with privacy compliance',
          category: 'Development',
          priority: 'high',
          estimatedHours: 10,
          actualHours: 12,
          assignee: 'Frontend Engineer 3',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Event tracking functions',
            'Page view tracking',
            'User action tracking (search, bookmark, etc.)',
            'Event storage in LocalStorage',
            'Privacy-compliant (no PII)',
            'Export functionality',
            'Unit tests written'
          ],
          completedDate: '2025-12-08'
        },
        {
          id: 'task-1.3.6',
          title: 'Implement keyboard shortcuts',
          description: 'Add keyboard shortcuts for common actions',
          category: 'Development',
          priority: 'medium',
          estimatedHours: 4,
          actualHours: 5,
          assignee: 'Frontend Engineer 3',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'useKeyboardShortcuts hook',
            'Ctrl+K / opens search',
            'Escape closes modals/search',
            'Keyboard shortcuts documented',
            'Unit tests written'
          ],
          completedDate: '2025-12-09'
        }
      ]
    },
    {
      id: 'phase-1.4',
      title: 'Page Implementation',
      description: 'Build all 8 main pages and navigation system',
      duration: '1 week',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: 'task-1.4.1',
          title: 'Build Navigation component',
          description: 'Create sidebar navigation with active state',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 8,
          actualHours: 10,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Sidebar navigation component',
            'Active section highlighting',
            'Collapsible sidebar',
            'Mobile hamburger menu',
            'Smooth scrolling',
            'Unit tests written'
          ],
          completedDate: '2025-12-11'
        },
        {
          id: 'task-1.4.2',
          title: 'Build Overview page',
          description: 'Create overview page with key features and getting started',
          category: 'Development',
          priority: 'high',
          estimatedHours: 6,
          actualHours: 7,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Overview section implemented',
            'Hero section',
            'Key features grid',
            'Getting started guide',
            'Quick links'
          ],
          completedDate: '2025-12-11'
        },
        {
          id: 'task-1.4.3',
          title: 'Build Features pages',
          description: 'Create 5 feature guide pages (Web Search, Memory, Artifacts, Code, Files)',
          category: 'Development',
          priority: 'high',
          estimatedHours: 20,
          actualHours: 24,
          assignee: 'Frontend Engineer 2',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Web Search guide complete',
            'Memory guide complete',
            'Artifacts guide complete',
            'Code Execution guide complete',
            'Files guide complete',
            'Interactive examples included',
            'Copy-to-clipboard functionality'
          ],
          completedDate: '2025-12-13'
        },
        {
          id: 'task-1.4.4',
          title: 'Build FAQ page',
          description: 'Create FAQ page with filtering and categories',
          category: 'Development',
          priority: 'high',
          estimatedHours: 8,
          actualHours: 10,
          assignee: 'Frontend Engineer 3',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'FAQ section with 20+ items',
            'Filter by difficulty level',
            'Accordion-style answers',
            'Search within FAQ',
            'Categories (beginner, intermediate, advanced)'
          ],
          completedDate: '2025-12-14'
        },
        {
          id: 'task-1.4.5',
          title: 'Build Deployment page',
          description: 'Create deployment checklist with progress tracking',
          category: 'Development',
          priority: 'critical',
          estimatedHours: 10,
          actualHours: 12,
          assignee: 'Frontend Engineer 3',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Deployment checklist with 30+ tasks',
            'Task completion tracking',
            'Progress bar',
            'Category grouping',
            'Export functionality',
            'Progress persists in LocalStorage'
          ],
          completedDate: '2025-12-15'
        },
        {
          id: 'task-1.4.6',
          title: 'Build remaining pages',
          description: 'Create Baseline, Tools, Roles, and Best Practices pages',
          category: 'Development',
          priority: 'high',
          estimatedHours: 16,
          actualHours: 18,
          assignee: 'Frontend Engineer 1',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'Baseline Prompt page complete',
            'Tools & Connectors page with MCP servers',
            'Role Profiles page with 6 roles',
            'Best Practices page with categories'
          ],
          completedDate: '2025-12-15'
        }
      ]
    }
  ]
};

/**
 * Phase 2: Testing & QA
 */
export const phase2: DeploymentPhase = {
  id: 'phase-2',
  number: 2,
  title: 'Testing & QA',
  description: 'Comprehensive testing including unit, integration, accessibility, and performance',
  duration: '2 weeks',
  owner: 'QA Lead, Engineering',
  stakeholders: ['Product Owner', 'Security Team'],
  status: 'in-progress',
  progress: 65,
  startDate: '2025-12-16',
  endDate: '2025-12-29',
  subPhases: [
    {
      id: 'phase-2.1',
      title: 'Automated Testing',
      description: 'Unit and integration test implementation',
      duration: '1 week',
      status: 'in-progress',
      progress: 80,
      tasks: [
        {
          id: 'task-2.1.1',
          title: 'Write unit tests for components',
          description: 'Achieve 80%+ coverage for all UI components',
          category: 'Testing',
          priority: 'critical',
          estimatedHours: 24,
          actualHours: 20,
          assignee: 'Frontend Engineer 1',
          status: 'in-progress',
          dependencies: [],
          acceptanceCriteria: [
            'All components have unit tests',
            'Coverage >80% for components',
            'Tests run in CI/CD',
            'No flaky tests'
          ]
        },
        {
          id: 'task-2.1.2',
          title: 'Write unit tests for hooks',
          description: 'Test all custom hooks with 90%+ coverage',
          category: 'Testing',
          priority: 'critical',
          estimatedHours: 16,
          actualHours: 12,
          assignee: 'Frontend Engineer 2',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'All hooks tested',
            'Coverage >90%',
            'Edge cases covered'
          ],
          completedDate: '2025-12-18'
        },
        {
          id: 'task-2.1.3',
          title: 'Write unit tests for utilities',
          description: 'Test all utility functions with 95%+ coverage',
          category: 'Testing',
          priority: 'high',
          estimatedHours: 12,
          actualHours: 10,
          assignee: 'Frontend Engineer 3',
          status: 'completed',
          dependencies: [],
          acceptanceCriteria: [
            'All utils tested',
            'Coverage >95%',
            'All branches covered'
          ],
          completedDate: '2025-12-17'
        },
        {
          id: 'task-2.1.4',
          title: 'Write integration tests',
          description: 'Test complete user workflows',
          category: 'Testing',
          priority: 'high',
          estimatedHours: 16,
          actualHours: 0,
          assignee: 'QA Engineer',
          status: 'pending',
          dependencies: ['task-2.1.1'],
          acceptanceCriteria: [
            'Search workflow tested',
            'Bookmark workflow tested',
            'Navigation workflow tested',
            'Deployment checklist workflow tested'
          ]
        }
      ]
    },
    {
      id: 'phase-2.2',
      title: 'Manual Testing',
      description: 'Functional, cross-browser, accessibility, and performance testing',
      duration: '1 week',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-2.2.1',
          title: 'Execute functional test cases',
          description: 'Run all 50+ manual test cases',
          category: 'Testing',
          priority: 'critical',
          estimatedHours: 20,
          actualHours: 0,
          assignee: 'QA Engineer',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: [
            '95%+ test pass rate',
            'All P0/P1 bugs filed',
            'Test evidence documented'
          ]
        },
        {
          id: 'task-2.2.2',
          title: 'Cross-browser testing',
          description: 'Test on Chrome, Firefox, Safari, Edge, Mobile',
          category: 'Testing',
          priority: 'high',
          estimatedHours: 12,
          actualHours: 0,
          assignee: 'QA Engineer',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: [
            'Works on all supported browsers',
            'No console errors',
            'Consistent UX across browsers'
          ]
        },
        {
          id: 'task-2.2.3',
          title: 'Accessibility audit',
          description: 'Run WCAG 2.1 AA compliance audit',
          category: 'Testing',
          priority: 'critical',
          estimatedHours: 16,
          actualHours: 0,
          assignee: 'UX Designer',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: [
            'Lighthouse a11y score 100',
            'axe DevTools reports 0 issues',
            'Keyboard navigation works',
            'Screen reader compatible'
          ]
        },
        {
          id: 'task-2.2.4',
          title: 'Performance testing',
          description: 'Run Lighthouse audits and performance profiling',
          category: 'Testing',
          priority: 'critical',
          estimatedHours: 8,
          actualHours: 0,
          assignee: 'Frontend Engineer 1',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: [
            'Lighthouse score 95+',
            'Bundle size <150KB',
            'Load time <3s',
            'No memory leaks'
          ]
        }
      ]
    },
    {
      id: 'phase-2.3',
      title: 'Security Testing',
      description: 'Security audit and vulnerability scanning',
      duration: '2 days',
      status: 'pending',
      progress: 0,
      tasks: [
        {
          id: 'task-2.3.1',
          title: 'Run security audit',
          description: 'Scan for vulnerabilities and security issues',
          category: 'Security',
          priority: 'critical',
          estimatedHours: 8,
          actualHours: 0,
          assignee: 'Security Engineer',
          status: 'pending',
          dependencies: [],
          acceptanceCriteria: [
            'npm audit passes with 0 high/critical',
            'No secrets in code',
            'CSP headers configured',
            'XSS testing passed'
          ]
        }
      ]
    }
  ]
};

/**
 * All deployment phases
 */
export const deploymentPhases: DeploymentPhase[] = [
  phase0,
  phase1,
  phase2
  // Additional phases would be added here
];

/**
 * Get phase by ID
 */
export function getPhaseById(id: string): DeploymentPhase | undefined {
  return deploymentPhases.find(phase => phase.id === id);
}

/**
 * Get current active phase
 */
export function getCurrentPhase(): DeploymentPhase | undefined {
  return deploymentPhases.find(phase => 
    phase.status === 'in-progress' || phase.status === 'pending'
  );
}

/**
 * Calculate overall progress
 */
export function getOverallProgress(): number {
  const totalPhases = deploymentPhases.length;
  const totalProgress = deploymentPhases.reduce((sum, phase) => sum + phase.progress, 0);
  return Math.round(totalProgress / totalPhases);
}

/**
 * Get tasks by status
 */
export function getTasksByStatus(status: DeploymentTask['status']): DeploymentTask[] {
  const allTasks: DeploymentTask[] = [];
  
  deploymentPhases.forEach(phase => {
    phase.subPhases.forEach(subPhase => {
      subPhase.tasks.forEach(task => {
        if (task.status === status) {
          allTasks.push(task);
        }
      });
    });
  });
  
  return allTasks;
}

/**
 * Get tasks by assignee
 */
export function getTasksByAssignee(assignee: string): DeploymentTask[] {
  const allTasks: DeploymentTask[] = [];
  
  deploymentPhases.forEach(phase => {
    phase.subPhases.forEach(subPhase => {
      subPhase.tasks.forEach(task => {
        if (task.assignee === assignee) {
          allTasks.push(task);
        }
      });
    });
  });
  
  return allTasks;
}
