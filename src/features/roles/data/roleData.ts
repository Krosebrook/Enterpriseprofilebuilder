import { Role } from '../../../types';
import { DollarSign, TrendingUp, Code, Megaphone } from 'lucide-react';

export const ROLE_PROFILES = [
    {
      role: 'Finance' as Role,
      icon: DollarSign,
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
          id: 'fin-001',
          request: 'Analyze our Q4 spending vs budget',
          process: [
            'Ask for Q4 P&L and budget file',
            'User uploads Excel',
            'Calculate variances, identify >10% deviations',
            'Create artifact with variance analysis + CFO summary',
            'Flag any variances >$100K for CFO review'
          ]
        },
        {
          id: 'fin-002',
          request: 'Project next year\'s burn rate',
          process: [
            'Ask for assumptions (headcount, pricing, growth)',
            'Store assumptions in memory for future updates',
            'Create financial model in Excel/artifact',
            'Show 3 scenarios (conservative, base, optimistic)',
            'Present to CFO; don\'t commit to projection'
          ]
        }
      ]
    },
    {
      role: 'Sales' as Role,
      icon: TrendingUp,
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
          id: 'sales-001',
          request: 'Generate a proposal for customer X',
          process: [
            'Ask for scope and customer pain points',
            'Input customer context, solution overview',
            'Generate proposal artifact (exec summary, pricing, timeline)',
            'Customize with customer-specific language',
            'Require legal + manager sign-off before send'
          ]
        },
        {
          id: 'sales-002',
          request: 'Create a battle card for Competitor Y',
          process: [
            'Web search for competitor pricing, features, positioning',
            'Analyze strengths vs INT Inc offering',
            'Output 1-page battle card',
            'Use for internal training only (confidential)'
          ]
        }
      ]
    },
    {
      role: 'Engineering' as Role,
      icon: Code,
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
          id: 'eng-001',
          request: 'Review this code for security issues',
          process: [
            'Upload code file or paste code',
            'Check OWASP Top 10, auth, validation, injection, secrets',
            'Report severity-tagged findings (critical, high, medium, low)',
            'Suggest minimal diffs with proposed fixes',
            'Escalate critical issues → CSO review before merge'
          ]
        },
        {
          id: 'eng-002',
          request: 'Design the architecture for a new feature',
          process: [
            'Ask for requirements, scale, dependencies',
            'Draw architecture diagram (ASCII or HTML artifact)',
            'Analyze trade-offs (scalability, security, cost)',
            'Document design doc (artifact) with rationale',
            'Peer review with senior engineers'
          ]
        }
      ]
    },
    {
      role: 'Marketing' as Role,
      icon: Megaphone,
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
          id: 'mkt-001',
          request: 'Create an email campaign for Q1 product launch',
          process: [
            'Ask for product features, target audience, tone',
            'Retrieve past email performance and brand voice from memory',
            'Create email copy (3-5 variants), subject lines, CTA',
            'Format as artifact (HTML/plain text)',
            'Manager feedback; iterate'
          ]
        },
        {
          id: 'mkt-002',
          request: 'Analyze our Q4 campaign performance',
          process: [
            'Upload analytics report, email metrics, landing page stats',
            'Analyze traffic, engagement, conversion vs targets',
            'Compare to past campaigns and benchmarks',
            'Recommend improvements',
            'Output executive summary + detailed metrics (artifact)'
          ]
        }
      ]
    }
  ];
