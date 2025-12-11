import { FeatureGuide } from '../types';

export const featuresData: FeatureGuide[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Claude searches the internet in real-time and cites sources for current information.',
    whenToUse: [
      'Market research & competitor analysis',
      'Current events & breaking news',
      'Real-time data (stock prices, weather)',
      'Fact-checking recent claims'
    ],
    whenNotToUse: [
      'Confidential company strategy',
      'Proprietary information',
      'Personal/sensitive data',
      'Internal documentation (use memory)'
    ],
    bestPractices: [
      {
        id: 'ws-bp-1',
        title: 'Be Specific (Not Vague)',
        description: 'Provide detailed search parameters with date ranges and specific topics.',
        examples: {
          bad: '"Search for sales trends"',
          good: '"Search for SaaS sales trends Q4 2025 US market"'
        }
      },
      {
        id: 'ws-bp-2',
        title: 'Evaluate Sources',
        description: 'Check source credibility before trusting results.',
        examples: {
          good: 'Reliable: Reuters, Bloomberg, CNBC, official company sites\nVerify: Reddit, forums, social media\nIgnore: SEO spam, unreliable sources'
        }
      },
      {
        id: 'ws-bp-3',
        title: 'Combine with Knowledge',
        description: 'Use web search for current data, then combine with your domain expertise to interpret results.'
      }
    ],
    examples: [
      {
        id: 'ws-ex-1',
        title: 'Competitor Pricing Research',
        description: 'Request: "Search for Salesforce CRM pricing 2025, including new tiers"',
        output: `• Fetches official Salesforce.com pricing page
• Finds latest blog post about new pricing model
• Cites sources with links
• Provides summary comparison`
      }
    ]
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Claude remembers facts about you and your preferences across conversations.',
    whenToUse: [
      'Store role & responsibilities',
      'Save communication preferences',
      'Remember work context & processes',
      'Track learning goals'
    ],
    whenNotToUse: [
      'Customer names or data',
      'API keys or passwords',
      'Confidential strategy',
      'Personal health/financial data'
    ],
    bestPractices: [
      {
        id: 'mem-bp-1',
        title: 'Start Small',
        description: 'Don\'t dump 50 facts on Day 1. Build memory gradually.',
        examples: {
          good: `Conversation 1: "Remember I'm in Sales"
Conversation 2: "Remember I prefer concise answers"
Conversation 3: "Remember my team uses MEDDIC framework"`
        }
      },
      {
        id: 'mem-bp-2',
        title: 'Update Regularly',
        description: 'Keep memory current as your role and preferences change.'
      },
      {
        id: 'mem-bp-3',
        title: 'Use Memory for Workflows',
        description: 'Store repeatable processes and output formats.',
        examples: {
          good: '"Remember: When I ask for RFP analysis, provide: [Client Name], [Deal Size], [Risks], [Next Steps]"'
        }
      }
    ],
    examples: [
      {
        id: 'mem-ex-1',
        title: 'Finance Analyst Memory',
        description: 'Example memories to create',
        code: `• "I analyze budgets using variance analysis (Actual vs Budget vs Forecast)"
• "I present to CFO monthly; need concise 1-page summaries"
• "I use Excel for calculations; please provide formulas in Excel format"
• "I need citations for all external data (compliance requirement)"`
      }
    ],
    limitations: [
      'Opt-In: You decide what Claude remembers',
      '30-Day Expiry: Memories auto-delete after 30 days',
      'Role-Isolated: Finance memory ≠ Sales memory',
      'Audited: Memory access is logged'
    ]
  },
  {
    id: 'artifacts',
    name: 'Artifacts',
    description: 'Claude creates standalone documents (code, designs, documentation) that you can view, edit, and download.',
    whenToUse: [
      'Code >20 lines',
      'Documents >500 words',
      'Outputs you want to edit/download',
      'Designs to render/test'
    ],
    whenNotToUse: [
      'Quick snippets (<20 lines)',
      'Confidential customer data',
      'API keys or passwords',
      'Contracts or agreements'
    ],
    bestPractices: [
      {
        id: 'art-bp-1',
        title: 'Name Your Artifact Clearly',
        description: 'Use descriptive names for easy organization.',
        examples: {
          bad: '"document_1"',
          good: '"sales-proposal-acme.md"'
        }
      },
      {
        id: 'art-bp-2',
        title: 'Version Your Work',
        description: 'Keep versions: v1 (initial), v2 (customer feedback), v3 (final)'
      },
      {
        id: 'art-bp-3',
        title: 'Document as You Go',
        description: 'Add comments, usage instructions, dependencies, and examples.'
      },
      {
        id: 'art-bp-4',
        title: 'Never Include Secrets',
        description: 'Use environment variables, not hardcoded credentials.',
        examples: {
          bad: 'connectionString: "postgresql://user:REAL_PASSWORD@prod.internal"',
          good: 'connectionString: process.env.DATABASE_URL'
        }
      }
    ],
    examples: [
      {
        id: 'art-ex-1',
        title: 'Sales Proposal Template',
        description: 'Artifact Type: Markdown',
        code: `Contents:
- [Company Logo]
- Executive Summary (1 paragraph)
- Problem Statement (from customer conversations)
- Proposed Solution (how INT Inc solves it)
- Timeline & Milestones
- Pricing & Terms
- Next Steps`
      }
    ]
  },
  {
    id: 'code-execution',
    name: 'Code Execution',
    description: 'Claude runs Python code in a sandboxed environment (no access to prod systems, network isolation).',
    whenToUse: [
      'Data analysis',
      'Algorithm testing',
      'Regex pattern validation',
      'Math calculations'
    ],
    whenNotToUse: [
      'Production customer data',
      'Sensitive file operations',
      'Network-dependent code'
    ],
    bestPractices: [
      {
        id: 'code-bp-1',
        title: 'Test Locally First',
        description: 'Run on your laptop before asking Claude to execute (more efficient iteration).'
      },
      {
        id: 'code-bp-2',
        title: 'Provide Sample Data',
        description: 'Include test data with your code request.'
      },
      {
        id: 'code-bp-3',
        title: 'Check Output Carefully',
        description: 'Review execution results before sharing (may contain system info).'
      },
      {
        id: 'code-bp-4',
        title: 'Use for Learning',
        description: 'Great for understanding algorithms, testing regex, verifying calculations.'
      }
    ],
    examples: [
      {
        id: 'code-ex-1',
        title: 'Data Analysis',
        description: 'Request: "Analyze this sales data for trends: [CSV data]"',
        output: `Process:
1. Reads CSV into pandas
2. Groups by month
3. Calculates growth rate
4. Creates visualization
5. Displays summary statistics`
      }
    ],
    limitations: [
      'Timeout: 10 minutes max per execution',
      'Memory: 512MB available',
      'Network: No internet access',
      'Filesystem: Temporary storage only',
      'Access: Engineering roles only (RBAC enforced)'
    ]
  },
  {
    id: 'files',
    name: 'Files',
    description: 'Upload documents (PDF, DOCX, CSV, images, code files) for Claude to analyze.',
    whenToUse: [
      'Document analysis',
      'Contract review',
      'Data processing',
      'Code review'
    ],
    whenNotToUse: [
      'Files with unredacted PII',
      'Files containing credentials',
      'Extremely large files (>20MB)'
    ],
    bestPractices: [
      {
        id: 'file-bp-1',
        title: 'Sanitize Files Before Uploading',
        description: 'Redact sensitive data before upload.',
        examples: {
          bad: 'Upload contract with customer SSN visible',
          good: 'Redact sensitive data before upload'
        }
      },
      {
        id: 'file-bp-2',
        title: 'Ask Clear Questions',
        description: 'Be specific about what you want Claude to analyze.',
        examples: {
          bad: '"Analyze this" [50-page PDF]',
          good: '"Summarize key risks in this contract, focus on liability and payment terms"'
        }
      },
      {
        id: 'file-bp-3',
        title: 'Use for Multiple Analyses',
        description: 'Upload once, ask multiple questions about the same file.'
      },
      {
        id: 'file-bp-4',
        title: 'Combine with Other Features',
        description: 'Upload file → Claude analyzes → Creates artifact as output'
      }
    ],
    examples: [
      {
        id: 'file-ex-1',
        title: 'Contract Analysis (Sales)',
        description: 'Upload: NDA, MSA, SOW from prospect',
        code: `Ask:
• "Compare this to our standard terms"
• "Flag any unusual clauses"
• "Highlight liability caps and indemnification"

Result: Risk assessment; requested changes for legal review`
      }
    ],
    limitations: [
      'Files are temporary (not stored permanently)',
      'With ZDR: Anthropic doesn\'t retain files after conversation',
      'Audit trail: File access logged to Sentry',
      'Maximum file size: 20MB per file; 100MB per conversation'
    ]
  }
];
