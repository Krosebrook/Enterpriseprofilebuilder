import { DollarSign, TrendingUp, Code, Megaphone, Settings as SettingsIcon, Users as UsersIcon, Shield } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { Role } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../ui/Card';

export function RoleProfiles() {
  const { selectedRole } = useNavigation();

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Role Profiles" 
        description={selectedRole === 'All' 
          ? "Role-specific capabilities, permissions, and workflow templates. Select your role in the top bar to filter."
          : `Detailed operational profile for the ${selectedRole} role, including permissions, tools, and specific workflows.`}
        icon={UsersIcon}
      />

      <div className="grid grid-cols-1 gap-12">
        {filteredProfiles.map((profile) => {
          const Icon = profile.icon;
          // Clean dynamic class generation for better stability
          const themeColor = {
             green: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-600' },
             blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
             purple: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-600' },
             orange: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' }
          }[profile.color as string] || { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', icon: 'text-slate-600' };

          return (
            <div key={profile.role} className="space-y-6">
              {/* Header Card */}
              <div className={`${themeColor.bg} ${themeColor.border} border rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start shadow-sm`}>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <Icon className={`w-10 h-10 ${themeColor.icon}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{profile.role} Role Profile</h3>
                  <p className="text-slate-700 text-lg leading-relaxed">{profile.responsibilities}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Capabilities */}
                 <Card>
                   <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5 text-slate-400" />
                      Key Capabilities
                   </h4>
                   <ul className="space-y-3">
                     {profile.capabilities.map((capability, index) => (
                       <li key={index} className="flex items-start gap-3 text-slate-700 text-sm">
                         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                         {capability}
                       </li>
                     ))}
                   </ul>
                 </Card>

                 {/* Permissions */}
                 <Card>
                   <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-slate-400" />
                      Permissions & Access
                   </h4>
                   <div className="space-y-4">
                     <div>
                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Enabled Features</div>
                        <div className="flex flex-wrap gap-2">
                           {profile.features.enabled.map((f, i) => (
                              <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-100 font-medium">
                                 {f}
                              </span>
                           ))}
                        </div>
                     </div>
                     {profile.features.disabled.length > 0 && (
                        <div>
                           <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Restricted</div>
                           <div className="flex flex-wrap gap-2">
                              {profile.features.disabled.map((f, i) => (
                                 <span key={i} className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs border border-rose-100 font-medium">
                                    {f}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}
                   </div>
                 </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-1">
                    <Card className="h-full bg-slate-50 border-slate-200">
                       <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Standard Tools</h4>
                       <ul className="space-y-2">
                          {profile.tools.map((tool, i) => (
                             <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                <Code className="w-3 h-3 text-slate-400" />
                                {tool}
                             </li>
                          ))}
                       </ul>
                    </Card>
                 </div>
                 
                 <div className="md:col-span-2">
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 h-full">
                       <h4 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-200 text-rose-700 text-xs">!</span>
                          Mandatory Escalation Triggers
                       </h4>
                       <ul className="grid grid-cols-1 gap-2">
                          {profile.escalationRules.map((rule, i) => (
                             <li key={i} className="text-sm text-rose-800 flex items-start gap-2 bg-white/50 p-2 rounded">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                                {rule}
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>

              {/* Workflows */}
              <div>
                 <h4 className="text-lg font-bold text-slate-900 mb-4">Standard Operating Procedures</h4>
                 <div className="grid grid-cols-1 gap-4">
                    {profile.commonRequests.map((req, i) => (
                       <Card key={i} className="bg-slate-50 border-slate-200">
                          <div className="mb-4">
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trigger Request</span>
                             <p className="font-medium text-slate-900 mt-1">"{req.request}"</p>
                          </div>
                          <div>
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Execution Steps</span>
                             <div className="mt-2 flex flex-col md:flex-row gap-4 text-sm text-slate-600 overflow-x-auto">
                                {req.process.map((step, j) => (
                                   <div key={j} className="flex-1 min-w-[150px] relative">
                                      <div className="flex items-center gap-2 mb-1">
                                         <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">{j+1}</span>
                                         {j < req.process.length - 1 && <div className="h-0.5 flex-1 bg-slate-200 md:block hidden" />}
                                      </div>
                                      <p>{step}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </Card>
                    ))}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
