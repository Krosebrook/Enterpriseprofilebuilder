import { DocumentResource, PromptingFramework } from '../../types';

export const referenceDocs: DocumentResource[] = [
  {
    id: 'figma-guidelines',
    title: 'INT Platform Explorer Figma Design Guidelines',
    description: 'Complete design system including typography, color palette, spacing, and component guidelines.',
    category: 'reference',
    fileName: 'INT_PLATFORM_EXPLORER_FIGMA_GUIDELINES.md',
    downloadPath: '/docs/reference/INT_PLATFORM_EXPLORER_FIGMA_GUIDELINES.md',
    section: 'reference',
    tags: ['design', 'figma', 'design-system', 'components', 'guidelines'],
    lastUpdated: '2025-01-11',
    order: 1,
    featured: true,
  },
  {
    id: 'claude-feature-roadmap',
    title: 'Claude Feature Roadmap 2025-2026',
    description: 'Upcoming features and capabilities planned for Claude through 2026.',
    category: 'reference',
    fileName: 'claude_feature_roadmap_2025_2026.md',
    downloadPath: '/docs/reference/claude_feature_roadmap_2025_2026.md',
    section: 'features',
    tags: ['roadmap', 'features', '2025', '2026', 'upcoming'],
    lastUpdated: '2025-01-11',
    order: 2,
    featured: true,
  },
  {
    id: 'production-apps-index',
    title: 'Production Apps Master Index',
    description: 'Navigation hub for all production documents with quick-start guides by role.',
    category: 'reference',
    fileName: '00_PRODUCTION_APPS_MASTER_INDEX.md',
    downloadPath: '/docs/reference/00_PRODUCTION_APPS_MASTER_INDEX.md',
    section: 'reference',
    tags: ['index', 'navigation', 'master', 'overview'],
    lastUpdated: '2025-01-11',
    order: 3,
  },
];

// Prompting Frameworks (R-I-S-E and F-L-O-W)
export const promptingFrameworks: PromptingFramework[] = [
  {
    id: 'rise',
    name: 'R-I-S-E Framework',
    acronym: 'RISE',
    description: 'A structured approach for crafting effective prompts that get clear, actionable responses.',
    steps: [
      {
        letter: 'R',
        name: 'Role',
        description: 'Define who Claude should be - what expertise, perspective, or persona should it adopt?',
        examples: [
          'You are a senior data analyst with expertise in financial modeling.',
          'Act as a technical writer who specializes in API documentation.',
          'You are a marketing strategist with 10 years of B2B experience.',
        ],
      },
      {
        letter: 'I',
        name: 'Instructions',
        description: 'Provide clear, specific instructions about what you want Claude to do.',
        examples: [
          'Analyze this data and identify the top 3 trends.',
          'Write a product description that highlights key benefits.',
          'Review this code and suggest improvements for performance.',
        ],
      },
      {
        letter: 'S',
        name: 'Specifics',
        description: 'Include relevant context, constraints, and details that shape the output.',
        examples: [
          'Keep the response under 200 words.',
          'Use bullet points for easy scanning.',
          'Focus on enterprise use cases, not consumer.',
          'Include code examples in Python.',
        ],
      },
      {
        letter: 'E',
        name: 'Examples',
        description: 'Provide examples of what good output looks like to guide the response.',
        examples: [
          'Here\'s an example of the format I want: [example]',
          'Similar to how you might explain to a beginner...',
          'The tone should be like this: [sample text]',
        ],
      },
    ],
    useCases: [
      'Writing technical documentation',
      'Analyzing complex data',
      'Creating marketing content',
      'Code review and improvement',
      'Strategic analysis and recommendations',
    ],
  },
  {
    id: 'flow',
    name: 'F-L-O-W Framework',
    acronym: 'FLOW',
    description: 'An iterative approach for complex tasks that require refinement and follow-up.',
    steps: [
      {
        letter: 'F',
        name: 'Focus',
        description: 'Start with a clear, focused initial request. Don\'t try to do everything at once.',
        examples: [
          'Let\'s start by outlining the main sections of this report.',
          'First, help me understand the key requirements.',
          'Begin with an overview of the problem space.',
        ],
      },
      {
        letter: 'L',
        name: 'Layer',
        description: 'Build on the initial response by adding layers of detail or refinement.',
        examples: [
          'Now let\'s expand on section 2 in more detail.',
          'Add specific examples to each point.',
          'Include technical specifications for the engineering team.',
        ],
      },
      {
        letter: 'O',
        name: 'Optimize',
        description: 'Refine and improve the output based on specific criteria or feedback.',
        examples: [
          'Make this more concise - aim for 50% fewer words.',
          'Adjust the tone to be more professional.',
          'Reorganize to put the most important points first.',
        ],
      },
      {
        letter: 'W',
        name: 'Wrap',
        description: 'Finalize the output with final checks, formatting, and polish.',
        examples: [
          'Add a summary at the beginning.',
          'Format as a numbered list for easy reference.',
          'Review for any inconsistencies or gaps.',
        ],
      },
    ],
    useCases: [
      'Writing long-form content',
      'Developing complex analyses',
      'Creating presentations',
      'Building documentation',
      'Iterative problem-solving',
    ],
  },
];

// Best practices content structure
export const bestPracticesContent = {
  prompting: {
    title: 'Effective Prompting',
    tips: [
      'Be specific about what you want - vague requests get vague results',
      'Provide context - Claude doesn\'t know your situation unless you tell it',
      'Use examples to show what good output looks like',
      'Break complex tasks into smaller steps',
      'Iterate and refine - your first prompt doesn\'t have to be perfect',
    ],
  },
  security: {
    title: 'Security Best Practices',
    tips: [
      'Never share passwords, API keys, or sensitive credentials',
      'Be cautious with PII - only include what\'s necessary',
      'Review outputs before sharing externally',
      'Use your organization\'s approved Claude deployment',
      'Report any concerning behavior to IT/Security',
    ],
  },
  workflow: {
    title: 'Workflow Integration',
    tips: [
      'Start with quick wins to build confidence',
      'Document successful prompts for reuse',
      'Share learnings with your team',
      'Combine Claude with existing tools, don\'t replace everything',
      'Set realistic expectations - Claude is a tool, not magic',
    ],
  },
  quality: {
    title: 'Quality Assurance',
    tips: [
      'Always review AI-generated content before using',
      'Verify facts and data independently',
      'Check for appropriate tone and messaging',
      'Ensure compliance with policies and guidelines',
      'Keep a human in the loop for important decisions',
    ],
  },
};
