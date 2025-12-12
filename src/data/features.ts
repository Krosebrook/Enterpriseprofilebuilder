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
  },
  {
    id: 'vision',
    name: 'Vision',
    description: 'Claude analyzes images, screenshots, diagrams, and handwritten notes.',
    whenToUse: [
      'Converting whiteboard diagrams to code',
      'Analyzing UI/UX screenshots',
      'Extracting text from scanned documents',
      'Describing complex visual data charts'
    ],
    whenNotToUse: [
      'Images containing PII (faces of customers, ID cards)',
      'Medical imaging (diagnostic use)',
      'CAPTCHA solving'
    ],
    bestPractices: [
      {
        id: 'vis-bp-1',
        title: 'High Resolution',
        description: 'Use clear, high-resolution images for best accuracy.',
        examples: {
          bad: 'Blurry phone photo of whiteboard from back of room',
          good: 'Scan or high-quality photo focused on content'
        }
      },
      {
        id: 'vis-bp-2',
        title: 'Direct Questions',
        description: 'Point Claude to specific parts of the image.',
        examples: {
          good: '"Focus on the flowchart in the top right. Convert that logic to Python code."'
        }
      },
      {
        id: 'vis-bp-3',
        title: 'Security Redaction',
        description: 'Blur faces and sensitive data before upload.'
      }
    ],
    examples: [
      {
        id: 'vis-ex-1',
        title: 'Whiteboard to Code',
        description: 'Upload: Photo of system architecture diagram from meeting',
        output: `• Identifies components (Load Balancer, API Gateway, DB)
• Describes data flow arrows
• Generates Terraform code to provision infrastructure`
      }
    ],
    limitations: [
      'No facial recognition (blocked by safety filters)',
      'Cannot edit images (only analyze)',
      'Max 5MB per image file'
    ]
  },
  {
    id: 'voice-mode',
    name: 'Voice Mode (Mobile)',
    description: 'Interact with Claude via natural voice conversation on mobile devices.',
    whenToUse: [
      'Brainstorming while commuting',
      'Dictating complex ideas quickly',
      'Practicing pitches or difficult conversations',
      'Hands-free access'
    ],
    whenNotToUse: [
      'Public spaces (confidentiality risk)',
      'Discussing passwords or secrets aloud',
      'Code generation (better on desktop)'
    ],
    bestPractices: [
      {
        id: 'voice-bp-1',
        title: 'Speak Naturally',
        description: 'Talk as you would to a colleague. Pause for Claude to respond.',
      },
      {
        id: 'voice-bp-2',
        title: 'Review Transcripts',
        description: 'Check the text transcript later for accuracy, especially for technical terms.'
      },
      {
        id: 'voice-bp-3',
        title: 'Use for Synthesis',
        description: 'Great for "I have these 3 disjointed thoughts, help me connect them."'
      }
    ],
    examples: [
      {
        id: 'voice-ex-1',
        title: 'Pitch Practice',
        description: 'Scenario: Sales rep practicing negotiation',
        output: `User: "I'm going to play the customer objecting to price. You be the sales rep."
Claude: "Understood. I'll focus on value selling. Go ahead."
(Conversation proceeds via voice)`
      }
    ],
    limitations: [
      'Mobile app only',
      'Requires microphone permission',
      'Audio data processed briefly for transcription (ZDR applies)'
    ]
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Organize related chats and artifacts into a shared context window.',
    whenToUse: [
      'Long-running initiatives (e.g., "Q4 Website Redesign")',
      'Maintaining a shared knowledge base for a specific topic',
      'Keeping multiple related artifacts together'
    ],
    whenNotToUse: [
      'One-off quick questions',
      'Highly sensitive compartmentalized projects (check access settings)'
    ],
    bestPractices: [
      {
        id: 'proj-bp-1',
        title: 'Seed with Context',
        description: 'Upload key documents (specs, brand guides) to the Project Knowledge Base first.',
        examples: {
          good: 'Upload "Brand_Voice_Guide.pdf" and "Product_Specs.docx" to Project files'
        }
      },
      {
        id: 'proj-bp-2',
        title: 'Custom Instructions',
        description: 'Set project-specific instructions (e.g., "Always use Python 3.11").'
      },
      {
        id: 'proj-bp-3',
        title: 'Curate Artifacts',
        description: 'Star/Pin important artifacts so they don\'t get lost in chat history.'
      }
    ],
    examples: [
      {
        id: 'proj-ex-1',
        title: 'Software Migration Project',
        description: 'Project: "Legacy Auth to OAuth2 Migration"',
        output: `• Knowledge: Old API docs, New OAuth specs
• Chats: "Planning Phase", "Implementation - User Service", "Testing Strategy"
• Artifacts: Migration script, Rollback plan, Test cases`
      }
    ],
    limitations: [
      'Max 200MB knowledge base per project',
      'Shared visibility (be careful with permissions)',
      'Context window limits still apply (though larger)'
    ]
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Share chats, artifacts, and projects with teammates for joint work.',
    whenToUse: [
      'Pair programming asynchronously',
      'Reviewing output with a manager',
      'Sharing a successful prompt template',
      'Handing off work'
    ],
    whenNotToUse: [
      'Sharing chats containing PII/secrets',
      'Performance reviews or sensitive HR topics'
    ],
    bestPractices: [
      {
        id: 'collab-bp-1',
        title: 'Curate Before Sharing',
        description: 'Clean up a messy conversation before sharing it as a "gold standard" example.'
      },
      {
        id: 'collab-bp-2',
        title: 'Contextualize Shares',
        description: 'Add a note when sharing: "Check out how Claude handled the edge cases in the second Artifact."'
      },
      {
        id: 'collab-bp-3',
        title: 'Use Shared Projects',
        description: 'For team initiatives, invite members to a Project rather than sharing individual links.'
      }
    ],
    examples: [
      {
        id: 'collab-ex-1',
        title: 'Incident Post-Mortem',
        description: 'Scenario: SRE team collaborative analysis',
        output: `• Engineer A starts chat, uploads logs, gets initial analysis
• Shares chat link in Slack #incidents channel
• Engineer B picks up, asks specifically about database latency
• Engineer C uses the artifacts to draft the final report`
      }
    ],
    limitations: [
      'Access control relies on link sharing (unlisted URL model)',
      'Enterprise admin can view all shared content',
      'Cannot revoke access easily once link is distributed (unless project-based)'
    ]
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Access Claude programmatically via the Anthropic API for internal tools.',
    whenToUse: [
      'Automating high-volume tasks',
      'Building internal chatbots/tools',
      'Integrating AI into CI/CD pipelines',
      'Batch processing data'
    ],
    whenNotToUse: [
      'Customer-facing chatbots (requires special approval)',
      'Real-time low-latency applications (<500ms)',
      'Cost-prohibitive high-volume loops'
    ],
    bestPractices: [
      {
        id: 'api-bp-1',
        title: 'Handle Rate Limits',
        description: 'Implement exponential backoff and retry logic.'
      },
      {
        id: 'api-bp-2',
        title: 'Secure API Keys',
        description: 'Never commit keys to code. Use secret managers (AWS Secrets Manager, Vault).'
      },
      {
        id: 'api-bp-3',
        title: 'System Prompts',
        description: 'Use the "system" parameter to enforce guardrails at the API level.'
      },
      {
        id: 'api-bp-4',
        title: 'Monitor Costs',
        description: 'Set budget alerts. API usage bills differently than seat licenses.'
      }
    ],
    examples: [
      {
        id: 'api-ex-1',
        title: 'Automated PR Reviewer',
        description: 'Internal Tool: "GitClaude"',
        output: `• GitHub Webhook triggers Lambda function
• Function calls Claude API with diff
• Claude analyzes for style and bugs
• Function posts comments back to PR`
      }
    ],
    limitations: [
      'Separate billing (usage-based)',
      'No UI provided (you build the interface)',
      'Requires engineering effort to maintain'
    ]
  }
];
