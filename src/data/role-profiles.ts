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
  }
];
