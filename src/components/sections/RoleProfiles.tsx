import { Role } from '../App';
import { DollarSign, TrendingUp, Code, Megaphone, Settings as SettingsIcon, Users as UsersIcon } from 'lucide-react';

interface RoleProfilesProps {
  selectedRole: Role;
}

export function RoleProfiles({ selectedRole }: RoleProfilesProps) {
  const profiles = [
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

  const filteredProfiles = selectedRole === 'All' 
    ? profiles 
    : profiles.filter(p => p.role === selectedRole);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-slate-900 mb-4">Role-Specific Profiles</h2>
        <p className="text-slate-700">
          {selectedRole === 'All' 
            ? 'Tailored guidance for each department at INT Inc.'
            : `Detailed profile for the ${selectedRole} role.`}
        </p>
      </div>

      {filteredProfiles.map((profile) => {
        const Icon = profile.icon;
        const colorClasses = {
          green: 'from-green-50 to-emerald-50 border-green-200',
          blue: 'from-blue-50 to-cyan-50 border-blue-200',
          purple: 'from-purple-50 to-indigo-50 border-purple-200',
          orange: 'from-orange-50 to-amber-50 border-orange-200'
        };

        return (
          <div key={profile.role} className="space-y-6">
            <div className={`bg-gradient-to-r ${colorClasses[profile.color as keyof typeof colorClasses]} border rounded-lg p-6`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Icon className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-slate-900">{profile.role} Role Profile</h3>
                  <p className="text-slate-700">{profile.responsibilities}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h4 className="text-slate-900 mb-3">Key Capabilities</h4>
              <ul className="space-y-2">
                {profile.capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h4 className="text-slate-900 mb-3">Feature Access</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-700 mb-2">Enabled:</p>
                    <ul className="space-y-1">
                      {profile.features.enabled.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-600">
                          <span className="text-green-600">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {profile.features.disabled.length > 0 && (
                    <div>
                      <p className="text-slate-700 mb-2">Disabled:</p>
                      <ul className="space-y-1">
                        {profile.features.disabled.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-600">
                            <span className="text-red-600">✗</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h4 className="text-slate-900 mb-3">Tools You Can Access</h4>
                <ul className="space-y-2">
                  {profile.tools.map((tool, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="text-slate-900 mb-3">Escalation Rules</h4>
              <ul className="space-y-2">
                {profile.escalationRules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <span className="text-red-600 mt-1">⚠</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 mb-4">Common Request Examples</h4>
              <div className="space-y-4">
                {profile.commonRequests.map((example, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                    <p className="text-slate-900 mb-3">
                      <strong>Request:</strong> "{example.request}"
                    </p>
                    <p className="text-slate-900 mb-2"><strong>Process:</strong></p>
                    <ol className="space-y-1 ml-4 list-decimal">
                      {example.process.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-slate-700">{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {selectedRole === 'All' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-slate-900 mb-3">Role Selection Tip</h3>
          <p className="text-slate-700">
            Use the role selector above to view detailed information for a specific role. Each profile 
            includes tailored capabilities, feature access, tools, escalation rules, and example workflows.
          </p>
        </div>
      )}
    </div>
  );
}
