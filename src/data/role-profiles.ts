import { RoleProfile } from '../types';

export const roleProfilesData: RoleProfile[] = [
  {
    role: 'Finance',
    color: 'green',
    responsibilities: 'Budget analysis, forecasting, financial reporting, cost optimization',
    capabilities: [
      'Budget variance analysis (Actual vs Budget vs Forecast)',
      'Cash flow projections',
      'Cost-benefit analysis for new initiatives',
      'Financial trend analysis',
      'Report automation (P&L, balance sheet summaries)'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Code execution', 'Files'],
      disabled: ['Code execution on customer data (compliance restriction)']
    },
    tools: ['Stripe (revenue verification)', 'Notion (finance policies)', 'Excel/CSV'],
    escalationRules: [
      'Any budget change >$50K → CFO approval required',
      'Any forecast assumption change → Document in artifact',
      'Any data discrepancy → Flag immediately, don\'t guess'
    ],
    commonRequests: [
      {
        id: 'fin-req-1',
        request: 'Analyze our Q4 spending vs budget',
        process: [
          'Ask for Q4 P&L and budget file',
          'User uploads Excel',
          'Calculate variances, identify >10% deviations',
          'Create artifact with variance analysis + CFO summary',
          'Flag any variances >$100K for CFO review'
        ],
        estimatedTime: '15-20 minutes',
        complexity: 'moderate'
      },
      {
        id: 'fin-req-2',
        request: 'Project next year\'s burn rate',
        process: [
          'Ask for assumptions (headcount, pricing, growth)',
          'Store assumptions in memory for future updates',
          'Create financial model in Excel/artifact',
          'Show 3 scenarios (conservative, base, optimistic)',
          'Present to CFO; don\'t commit to projection'
        ],
        estimatedTime: '30-45 minutes',
        complexity: 'complex'
      }
    ],
    quickWins: [
      'Automate monthly variance reports',
      'Create reusable budget templates',
      'Set up forecast assumption tracking in memory'
    ]
  },
  {
    role: 'Sales',
    color: 'blue',
    responsibilities: 'Deal analysis, proposal generation, competitive research, pipeline management',
    capabilities: [
      'RFP analysis and response generation',
      'Proposal templates and customization',
      'Competitive intelligence (battle cards)',
      'Deal stage prediction and risk assessment',
      'Sales playbook documentation'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Files'],
      disabled: ['Code execution (not needed for sales)']
    },
    tools: ['Stripe (customer subscription, MRR)', 'HubSpot (deal pipeline)', 'Notion (playbooks)', 'Figma (templates)'],
    escalationRules: [
      'No customer pricing in prompts (use "customer X" instead)',
      'Contracts need legal review before sending',
      'Competitive analysis is for internal strategy only'
    ],
    commonRequests: [
      {
        id: 'sales-req-1',
        request: 'Generate a proposal for customer X',
        process: [
          'Ask for scope and customer pain points',
          'Input customer context, solution overview',
          'Generate proposal artifact (exec summary, pricing, timeline)',
          'Customize with customer-specific language',
          'Require legal + manager sign-off before send'
        ],
        estimatedTime: '20-30 minutes',
        complexity: 'moderate'
      },
      {
        id: 'sales-req-2',
        request: 'Create a battle card for Competitor Y',
        process: [
          'Web search for competitor pricing, features, positioning',
          'Analyze strengths vs INT Inc offering',
          'Output 1-page battle card',
          'Use for internal training only (confidential)'
        ],
        estimatedTime: '10-15 minutes',
        complexity: 'simple'
      }
    ],
    quickWins: [
      'Build library of proposal templates',
      'Automate competitive research updates',
      'Create MEDDIC qualification checklists'
    ]
  },
  {
    role: 'Engineering',
    color: 'purple',
    responsibilities: 'Architecture design, code review, security analysis, documentation, deployment',
    capabilities: [
      'Code generation (Python, JavaScript, TypeScript, SQL, bash)',
      'Architecture design (system design, scaling, security)',
      'Security review (OWASP, injection, auth, encryption)',
      'Performance optimization (profiling, caching, database)',
      'Test design and coverage analysis',
      'Infrastructure as code (Terraform, CloudFormation)'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Code execution', 'Files'],
      disabled: []
    },
    tools: ['GitHub (PRs, code review)', 'Vercel (deployment)', 'Linear (issues)', 'Slack (incidents)'],
    escalationRules: [
      'Security findings >medium severity → CSO review required',
      'Deployments >prod env → CTO approval required',
      'Architecture decisions → Document in design doc; peer review',
      'Performance impact >10% latency increase → Load test before deploy'
    ],
    commonRequests: [
      {
        id: 'eng-req-1',
        request: 'Review this code for security issues',
        process: [
          'Upload code file or paste code',
          'Check OWASP Top 10, auth, validation, injection, secrets',
          'Report severity-tagged findings (critical, high, medium, low)',
          'Suggest minimal diffs with proposed fixes',
          'Escalate critical issues → CSO review before merge'
        ],
        estimatedTime: '10-20 minutes',
        complexity: 'moderate'
      },
      {
        id: 'eng-req-2',
        request: 'Design the architecture for a new feature',
        process: [
          'Ask for requirements, scale, dependencies',
          'Draw architecture diagram (ASCII or HTML artifact)',
          'Analyze trade-offs (scalability, security, cost)',
          'Document design doc (artifact) with rationale',
          'Peer review with senior engineers'
        ],
        estimatedTime: '45-90 minutes',
        complexity: 'complex'
      }
    ],
    quickWins: [
      'Automate security vulnerability scanning',
      'Create code review checklists',
      'Build architecture decision record (ADR) templates'
    ]
  },
  {
    role: 'Marketing',
    color: 'orange',
    responsibilities: 'Content creation, campaign strategy, competitive analysis, reporting',
    capabilities: [
      'Content generation (blog posts, case studies, whitepapers, email)',
      'Campaign planning (strategy, messaging, targeting)',
      'Competitive analysis (market positioning, messaging gaps)',
      'Analytics interpretation (traffic, engagement, conversion)',
      'Design brief creation'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Files'],
      disabled: ['Code execution (not needed)']
    },
    tools: ['Figma (design files)', 'Notion (brand guidelines)', 'Cloudinary (images)', 'Web search'],
    escalationRules: [
      'No customer names in marketing analysis (anonymize)',
      'Competitive content is for internal strategy only',
      'Brand claims need substantiation (cite sources)',
      'Large campaigns need approval chain'
    ],
    commonRequests: [
      {
        id: 'mkt-req-1',
        request: 'Create an email campaign for Q1 product launch',
        process: [
          'Ask for product features, target audience, tone',
          'Retrieve past email performance and brand voice from memory',
          'Create email copy (3-5 variants), subject lines, CTA',
          'Format as artifact (HTML/plain text)',
          'Manager feedback; iterate'
        ],
        estimatedTime: '25-35 minutes',
        complexity: 'moderate'
      },
      {
        id: 'mkt-req-2',
        request: 'Analyze our Q4 campaign performance',
        process: [
          'Upload analytics report, email metrics, landing page stats',
          'Analyze traffic, engagement, conversion vs targets',
          'Compare to past campaigns and benchmarks',
          'Recommend improvements',
          'Output executive summary + detailed metrics (artifact)'
        ],
        estimatedTime: '15-25 minutes',
        complexity: 'moderate'
      }
    ],
    quickWins: [
      'Build content calendar templates',
      'Automate campaign performance reports',
      'Create brand voice guidelines in memory'
    ]
  },
  {
    role: 'Product Management',
    color: 'emerald',
    responsibilities: 'Roadmapping, user story definition, feature prioritization, stakeholder alignment',
    capabilities: [
      'PRD generation (Problem, Solution, Requirements)',
      'User story mapping',
      'Feature prioritization (RICE, MoSCoW)',
      'User feedback analysis',
      'Release planning'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Files'],
      disabled: ['Code execution (limited use)']
    },
    tools: ['Linear (tickets)', 'Notion (PRDs)', 'Figma (prototypes)', 'Intercom (user feedback)'],
    escalationRules: [
      'Significant scope creep → Engineering manager approval',
      'Strategic pivots → CPO/Leadership review',
      'Feature deprecation → Customer comms plan required'
    ],
    commonRequests: [
      {
        id: 'pm-req-1',
        request: 'Draft a PRD for the new dashboard feature',
        process: [
          'Input problem statement, target persona, key goals',
          'Generate PRD structure (Background, User Stories, Functional Req, Non-Functional Req)',
          'Refine acceptance criteria with engineering input',
          'Output as Markdown artifact for Notion import'
        ],
        estimatedTime: '30-45 minutes',
        complexity: 'complex'
      },
      {
        id: 'pm-req-2',
        request: 'Summarize user feedback from Intercom',
        process: [
          'Export Intercom conversation tags/summaries to CSV',
          'Upload CSV to Claude',
          'Analyze top recurring feature requests and pain points',
          'Group by theme and potential impact',
          'Create summary report for roadmap planning'
        ],
        estimatedTime: '15-20 minutes',
        complexity: 'moderate'
      }
    ],
    quickWins: [
      'Create standardized PRD templates',
      'Automate release note drafting',
      'Build user persona library in memory'
    ]
  },
  {
    role: 'HR / People Ops',
    color: 'rose',
    responsibilities: 'Recruiting, onboarding, employee engagement, policy documentation, compliance',
    capabilities: [
      'Job description writing',
      'Interview question generation',
      'Policy handbook drafting',
      'Survey analysis (eNPS)',
      'Onboarding checklist creation'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Files'],
      disabled: ['Code execution (not needed)']
    },
    tools: ['Notion (handbook)', 'Trello (onboarding)', 'Slack (comms)'],
    escalationRules: [
      'NO PII/PHI in prompts (names, salaries, health info)',
      'Legal review required for all policy changes',
      'Sensitive employee relations issues → Handle offline'
    ],
    commonRequests: [
      {
        id: 'hr-req-1',
        request: 'Write a JD for a Senior React Engineer',
        process: [
          'Input key requirements, team culture, perks',
          'Research market standard skills for Senior React roles',
          'Draft engaging job description with clear responsibilities',
          'Check for inclusive language (bias checker)',
          'Format for posting'
        ],
        estimatedTime: '15-20 minutes',
        complexity: 'moderate'
      },
      {
        id: 'hr-req-2',
        request: 'Analyze engagement survey comments',
        process: [
          'Sanitize data (remove names/identifiers)',
          'Upload anonymized comments',
          'Identify key themes (e.g., "Career Growth", "Work-Life Balance")',
          'Calculate sentiment per theme',
          'Draft executive summary with action items'
        ],
        estimatedTime: '20-30 minutes',
        complexity: 'moderate'
      }
    ],
    quickWins: [
      'Standardize interview scorecards',
      'Create onboarding email sequences',
      'Build policy FAQ bot for Slack'
    ]
  },
  {
    role: 'Legal',
    color: 'slate',
    responsibilities: 'Contract review, compliance, risk management, privacy policy',
    capabilities: [
      'Contract clause analysis',
      'Risk flagging (indemnification, liability)',
      'Policy drafting (Privacy, TOS)',
      'Compliance checking (GDPR, CCPA)',
      'Legal research (case law summaries)'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Files'],
      disabled: ['Code execution (not needed)']
    },
    tools: ['Word/PDF (contracts)', 'Notion (internal policies)'],
    escalationRules: [
      'Claude is NOT a lawyer; outputs are for review only',
      'Final sign-off must come from human counsel',
      'Attorney-client privilege: Treat inputs carefully'
    ],
    commonRequests: [
      {
        id: 'legal-req-1',
        request: 'Review this NDA for unusual terms',
        process: [
          'Upload NDA PDF',
          'Compare against standard playbook terms',
          'Flag deviations (e.g., 5-year term vs 2-year standard)',
          'Draft redline comments for attorney review',
          'Summarize risks for business stakeholder'
        ],
        estimatedTime: '10-15 minutes',
        complexity: 'moderate'
      },
      {
        id: 'legal-req-2',
        request: 'Draft a Data Processing Addendum (DPA)',
        process: [
          'Input customer details and data types',
          'Retrieve standard DPA template from memory',
          'Fill in specific sub-processor details',
          'Output doc ready for final polish'
        ],
        estimatedTime: '15-20 minutes',
        complexity: 'moderate'
      }
    ],
    quickWins: [
      'Build "Red flag" checklist for contracts',
      'Automate common policy FAQs',
      'Create standard clause library'
    ]
  },
  {
    role: 'Customer Support',
    color: 'cyan',
    responsibilities: 'Ticket resolution, troubleshooting, knowledge base maintenance, customer education',
    capabilities: [
      'Ticket summarization',
      'Response drafting (empathetic, technical)',
      'Troubleshooting guide creation',
      'Sentiment analysis',
      'Translation'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Files'],
      disabled: ['Code execution (limited)']
    },
    tools: ['Zendesk (tickets)', 'Intercom (chat)', 'Jira (bugs)', 'Notion (KB)'],
    escalationRules: [
      'Angry customer → Escalate to manager',
      'Technical bug → Link to Jira for engineering',
      'Refund request > limit → Finance approval'
    ],
    commonRequests: [
      {
        id: 'cs-req-1',
        request: 'Draft a response to this technical issue',
        process: [
          'Paste ticket content (error logs, user description)',
          'Identify probable cause (search internal KB)',
          'Draft step-by-step troubleshooting instructions',
          'Ensure tone is helpful and apologetic for the issue',
          'Review and send'
        ],
        estimatedTime: '5-10 minutes',
        complexity: 'simple'
      },
      {
        id: 'cs-req-2',
        request: 'Turn this resolved ticket into a KB article',
        process: [
          'Input ticket history (problem + solution)',
          'Generalize the specific user details',
          'Format as "How-to" article (Title, Symptoms, Resolution)',
          'Add tags for searchability',
          'Output Markdown for Notion'
        ],
        estimatedTime: '10-15 minutes',
        complexity: 'moderate'
      }
    ],
    quickWins: [
      'Create macro library for common issues',
      'Automate KB article drafting',
      'Build sentiment analysis for ticket prioritization'
    ]
  },
  {
    role: 'Data Science',
    color: 'indigo',
    responsibilities: 'Data analysis, model building, metric tracking, experimentation',
    capabilities: [
      'Data cleaning and preprocessing',
      'Statistical analysis',
      'Visualization code generation (Python/R)',
      'Model explanation',
      'SQL query writing'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Code execution', 'Files'],
      disabled: []
    },
    tools: ['Postgres (DB)', 'Datadog (metrics)', 'Jupyter (notebooks)', 'AWS (S3/SageMaker)'],
    escalationRules: [
      'PII in datasets → Redact before analysis',
      'Model bias → Check for fairness before deployment',
      'Production DB access → Read-only replicas only'
    ],
    commonRequests: [
      {
        id: 'ds-req-1',
        request: 'Exploratory Data Analysis (EDA) on this CSV',
        process: [
          'Upload CSV (sales data, user logs)',
          'Write Python code to check missing values, distributions',
          'Generate histograms and correlation matrices',
          'Summarize key insights in text',
          'Propose next steps for modeling'
        ],
        estimatedTime: '20-30 minutes',
        complexity: 'moderate'
      },
      {
        id: 'ds-req-2',
        request: 'Optimize this complex SQL query',
        process: [
          'Paste slow SQL query and schema context',
          'Analyze execution plan (theoretical)',
          'Suggest indexing strategies or rewrite joins',
          'Explain why the new query is faster',
          'Provide the optimized SQL code'
        ],
        estimatedTime: '15-20 minutes',
        complexity: 'moderate'
      }
    ],
    quickWins: [
      'Build library of standard visualization snippets',
      'Automate data cleaning pipelines',
      'Create SQL style guide in memory'
    ]
  },
  {
    role: 'Executive / Leadership',
    color: 'zinc',
    responsibilities: 'Strategic planning, decision making, communication, organizational alignment',
    capabilities: [
      'Strategic narrative drafting',
      'Decision memo analysis',
      'Meeting preparation (briefs)',
      'Communication refinement',
      'Market trend synthesis'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Voice Mode'],
      disabled: ['Code execution (rarely used)']
    },
    tools: ['Email (Outlook/Gmail)', 'Slack (announcements)', 'Notion (strategy docs)'],
    escalationRules: [
      'Highly confidential M&A/Personnel info → Do NOT put in Claude',
      'Public statements → PR/Legal review required',
      'Financial disclosures → CFO/Legal review required'
    ],
    commonRequests: [
      {
        id: 'exec-req-1',
        request: 'Draft an All-Hands announcement',
        process: [
          'Input key points (Q4 results, new vision, kudos)',
          'Select tone (inspiring, serious, celebratory)',
          'Draft email/speech text',
          'Refine for clarity and impact',
          'Create slide outline to match'
        ],
        estimatedTime: '20-30 minutes',
        complexity: 'moderate'
      },
      {
        id: 'exec-req-2',
        request: 'Summarize these 5 reports for the board meeting',
        process: [
          'Upload Department reports (Sales, Eng, Mktg)',
          'Synthesize into "State of the Union" summary',
          'Highlight top 3 risks and opportunities',
          'Create formatted briefing document'
        ],
        estimatedTime: '15-25 minutes',
        complexity: 'moderate'
      }
    ],
    quickWins: [
      'Create "Brief me" templates',
      'Build strategic framework library (SWOT, 7 Powers)',
      'Automate meeting agenda generation'
    ]
  },
  {
    role: 'Operations / IT',
    color: 'teal',
    responsibilities: 'Process optimization, tool management, hardware/software provisioning, facilities',
    capabilities: [
      'Process mapping and documentation',
      'Vendor comparison',
      'Inventory management logic',
      'Scripting (bash/PowerShell)',
      'Incident response coordination'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Code execution', 'Files'],
      disabled: []
    },
    tools: ['Jira (tickets)', 'PagerDuty (alerts)', 'Notion (processes)', 'AWS (infrastructure)'],
    escalationRules: [
      'System access changes → Approval required',
      'Budget spend >$5K → Manager approval',
      'Security config changes → CSO review'
    ],
    commonRequests: [
      {
        id: 'ops-req-1',
        request: 'Create a process for new laptop provisioning',
        process: [
          'Outline current ad-hoc steps',
          'Structure into a checklist (Order, Setup, Security, Handover)',
          'Draft email templates for the new hire',
          'Create Jira ticket template',
          'Output as Notion page'
        ],
        estimatedTime: '20-30 minutes',
        complexity: 'moderate'
      },
      {
        id: 'ops-req-2',
        request: 'Compare vendors for new office Wi-Fi',
        process: [
          'Web search for top enterprise Wi-Fi providers',
          'Compare specs, pricing, and reviews',
          'Create comparison matrix artifact',
          'Draft recommendation for CFO'
        ],
        estimatedTime: '30-45 minutes',
        complexity: 'moderate'
      }
    ],
    quickWins: [
      'Build "How-to" library for internal tools',
      'Automate weekly status reporting',
      'Create vendor management templates'
    ]
  },
  {
    role: 'QA / Testing',
    color: 'pink',
    responsibilities: 'Test planning, bug reporting, automation, release validation',
    capabilities: [
      'Test case generation',
      'Bug report refinement',
      'Automated test script writing (Playwright/Selenium)',
      'Regression testing planning',
      'Log analysis'
    ],
    features: {
      enabled: ['Web search', 'Memory', 'Artifacts', 'Code execution', 'Files'],
      disabled: []
    },
    tools: ['Jira (bugs)', 'TestRail (cases)', 'GitHub (automation)', 'CircleCI (runs)'],
    escalationRules: [
      'Critical bug in prod → Stop the line / Page Engineering',
      'Blocked testing → Escalate to Project Manager',
      'Ambiguous requirements → Flag to Product Manager'
    ],
    commonRequests: [
      {
        id: 'qa-req-1',
        request: 'Generate test cases for the new login flow',
        process: [
          'Read PRD or requirement doc',
          'Identify happy paths and edge cases (wrong password, lockout, etc.)',
          'Output table of test cases with steps and expected results',
          'Format for import into TestRail/Jira'
        ],
        estimatedTime: '20-30 minutes',
        complexity: 'moderate'
      },
      {
        id: 'qa-req-2',
        request: 'Write a Playwright script for this test case',
        process: [
          'Input test steps: "Go to /login, fill form, submit"',
          'Claude generates TypeScript Playwright code',
          'Includes assertions and error handling',
          'Review code and add to repo'
        ],
        estimatedTime: '10-15 minutes',
        complexity: 'moderate'
      }
    ],
    quickWins: [
      'Automate test case generation from requirements',
      'Build bug report templates',
      'Create regression test suites'
    ]
  }
];
