import React, { useState } from 'react';
import { BookOpen, DollarSign, Target, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { Card } from '../../ui/Card';
import { SectionHeader } from '../../common/SectionHeader';
import { Badge } from '../../ui/Badge';

export function OperationsManual() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'roi' | 'metrics' | 'troubleshooting'>('tiers');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Service Operations Manual" 
        description="Operational frameworks, service tiers, ROI methodologies, and troubleshooting guides for Claude Enterprise delivery."
        icon={BookOpen}
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'tiers', label: 'Service Tiers', icon: Target },
          { id: 'roi', label: 'ROI Framework', icon: DollarSign },
          { id: 'metrics', label: 'Success Metrics', icon: CheckCircle },
          { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-700 bg-amber-50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'tiers' && <ServiceTiers />}
        {activeTab === 'roi' && <ROIFramework />}
        {activeTab === 'metrics' && <SuccessMetrics />}
        {activeTab === 'troubleshooting' && <TroubleshootingGuide />}
      </div>
    </div>
  );
}

function ServiceTiers() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Foundation Tier */}
        <Card className="border-t-4 border-t-slate-400 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Foundation Tier</h3>
            <div className="text-2xl font-bold text-slate-700 mt-2">$15k - $50k</div>
            <p className="text-sm text-slate-500 mt-1">Small teams (10-50 users)</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="bg-slate-50 p-3 rounded text-sm">
              <span className="font-bold block mb-2">Includes:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>1-week discovery</li>
                <li>Basic roadmap (1 use case)</li>
                <li>Out-of-box setup</li>
                <li>2-day training workshop</li>
                <li>30-day support</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-sm block mb-2">Target Outcomes:</span>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 1-2 use cases live</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 70% adoption rate</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 20% productivity gain</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Strategy Tier */}
        <Card className="border-t-4 border-t-amber-500 flex flex-col h-full ring-1 ring-amber-100 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Strategy Tier</h3>
            <div className="text-2xl font-bold text-amber-600 mt-2">$50k - $150k</div>
            <p className="text-sm text-slate-500 mt-1">Mid-size teams (50-200 users)</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="bg-amber-50 p-3 rounded text-sm">
              <span className="font-bold block mb-2">Includes:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>2-week discovery</li>
                <li>Comprehensive roadmap</li>
                <li>Advanced setup (MCPs)</li>
                <li>Role-based training (3 days)</li>
                <li>90-day support + optimization</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-sm block mb-2">Target Outcomes:</span>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 3-5 use cases live</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 80% adoption rate</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 6-month ROI payback</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Advanced Tier */}
        <Card className="border-t-4 border-t-indigo-600 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Advanced Tier</h3>
            <div className="text-2xl font-bold text-indigo-600 mt-2">$150k - $250k+</div>
            <p className="text-sm text-slate-500 mt-1">Large Enterprise (200+ users)</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="bg-indigo-50 p-3 rounded text-sm">
              <span className="font-bold block mb-2">Includes:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>4-week discovery (multi-dept)</li>
                <li>Enterprise roadmap (12-18 mo)</li>
                <li>Custom Dev (Forked Explorer)</li>
                <li>Executive training (5 days)</li>
                <li>6-month support + CSM</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-sm block mb-2">Target Outcomes:</span>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 10+ use cases live</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> Strategic advantage</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 3-4x ROI (12-mo payback)</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h4 className="font-bold text-slate-900 mb-4">Training Delivery Model</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Delivery Methods</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Interactive Workshops</li>
              <li>• Hands-on Labs</li>
              <li>• Weekly Office Hours</li>
              <li>• Asynchronous Video Guides</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Measurement</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• NPS (Net Promoter Score)</li>
              <li>• Activation Rates</li>
              <li>• Feature Usage Metrics</li>
              <li>• Certification Pass Rates</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Key Deliverables</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Production Environment</li>
              <li>• Trained User Base</li>
              <li>• Operations Manual (Customized)</li>
              <li>• Success Metrics Dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ROIFramework() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Calculation Methodology</h3>
          <p className="text-slate-600 mb-4">
            Based on Larridin framework and LSE/Protiviti research. 
            <br />
            <code className="bg-slate-100 px-2 py-1 rounded text-sm block mt-2">ROI = (Total Benefits - Total Costs) / Total Costs</code>
          </p>
          
          <div className="space-y-4">
            <Card className="bg-emerald-50 border-emerald-100">
              <h4 className="font-bold text-emerald-800 mb-2">Total Benefits</h4>
              <p className="text-sm text-emerald-700 font-mono">
                (Time Saved × Hourly Rate × Team Size × Adoption Rate)
              </p>
            </Card>
            <Card className="bg-rose-50 border-rose-100">
              <h4 className="font-bold text-rose-800 mb-2">Total Costs</h4>
              <p className="text-sm text-rose-700 font-mono">
                (Licensing + Implementation + Training + Support)
              </p>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Example: Strategy Tier ($100K)</h3>
          <Card className="bg-slate-900 text-slate-300">
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Assumptions</div>
                <div className="grid grid-cols-2 gap-2">
                  <span>Team Size: 100</span>
                  <span>Rate: $75/hr</span>
                  <span>Savings: 5hr/week</span>
                  <span>Adoption: 80%</span>
                </div>
              </div>
              
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between items-center mb-1">
                  <span>Annual Savings</span>
                  <span className="text-emerald-400 font-bold">$1,560,000</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span>Total Year 1 Costs</span>
                  <span className="text-rose-400 font-bold">$134,000</span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                <span className="font-bold text-white">ROI</span>
                <span className="text-amber-400 font-bold text-xl">10.6x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Payback Period</span>
                <span className="text-amber-400 font-bold text-xl">1.03 Months</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h4 className="font-bold text-slate-900 mb-4">Handling Common Objections</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h5 className="font-bold text-slate-800 mb-1">"Too expensive"</h5>
            <p className="text-sm text-slate-600">Show ROI calculation (payback in 1-3 months). Compare to cost of manual work ($19,500/year per user).</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h5 className="font-bold text-slate-800 mb-1">"Security concerns"</h5>
            <p className="text-sm text-slate-600">Show Platform Explorer security features (OWASP, RLS). Offer InfoSec consultation and SOC 2 guides.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h5 className="font-bold text-slate-800 mb-1">"We can do this ourselves"</h5>
            <p className="text-sm text-slate-600">Compare time-to-value (DIY: 6-12mo vs INT: 8-12wks). Highlight risk of failed rollout.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h5 className="font-bold text-slate-800 mb-1">"Team won't adopt it"</h5>
            <p className="text-sm text-slate-600">Show 80%+ adoption data. Offer role-specific training rather than generic sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessMetrics() {
  const metrics = [
    {
      category: "Activation",
      items: [
        { label: "Users Logged In (30d)", target: "90%+" },
        { label: "Onboarding Complete", target: "80%+" },
        { label: "Time to First Value", target: "< 7 days" }
      ]
    },
    {
      category: "Adoption",
      items: [
        { label: "Weekly Active Users", target: "70%+" },
        { label: "Daily Active Users", target: "40%+" },
        { label: "Feature Usage", target: "3+ per week" }
      ]
    },
    {
      category: "Business Value",
      items: [
        { label: "Time Saved / User", target: "5+ hrs/week" },
        { label: "Error Reduction", target: "30%+" },
        { label: "Cost ROI (12mo)", target: "5x" }
      ]
    },
    {
      category: "Satisfaction",
      items: [
        { label: "Net Promoter Score", target: "50+" },
        { label: "User Satisfaction", target: "4.5/5 stars" },
        { label: "Support Volume", target: "< 5% users/mo" }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((section) => (
        <Card key={section.category} className="hover:shadow-md transition-shadow">
          <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">{section.category} Metrics</h4>
          <div className="space-y-4">
            {section.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">{item.label}</span>
                <Badge variant="success" className="font-mono">{item.target}</Badge>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function TroubleshootingGuide() {
  const issues = [
    {
      category: "Web Platform",
      items: [
        { issue: "Artifacts not rendering", cause: "Browser compatibility", fix: "Use Chrome/Edge/Firefox latest" },
        { issue: "File upload fails", cause: "Size >10MB or format", fix: "Compress file or convert format" },
        { issue: "Conversation load fail", cause: "Network/Timeout", fix: "Clear cache, check connection" }
      ]
    },
    {
      category: "Desktop & MCP",
      items: [
        { issue: "MCP server connect fail", cause: "Invalid JSON/Config", fix: "Validate JSON, check credentials" },
        { issue: "Computer use timeout", cause: "Permissions/Path", fix: "Check chmod +x, use absolute paths" },
        { issue: "Slow responses", cause: "Context >100K tokens", fix: "Start new chat, summarize context" }
      ]
    },
    {
      category: "Mobile",
      items: [
        { issue: "Camera upload fail", cause: "Permissions denied", fix: "Enable Camera in OS Settings" },
        { issue: "No push notifications", cause: "Background refresh off", fix: "Enable Background App Refresh" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
        <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Quick Support Channels</h4>
          <ul className="text-sm text-amber-800 mt-1 space-y-1">
            <li>• Status Page: <a href="https://status.anthropic.com" target="_blank" rel="noreferrer" className="underline hover:text-amber-900">status.anthropic.com</a></li>
            <li>• Internal Slack: #claude-support</li>
            <li>• Urgent Issues: Contact Incident Response Team via PagerDuty</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {issues.map((section) => (
          <Card key={section.category}>
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-400" />
              {section.category}
            </h4>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-800 text-sm mb-1">{item.issue}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="text-slate-500"><span className="font-bold">Cause:</span> {item.cause}</div>
                    <div className="text-emerald-600"><span className="font-bold">Fix:</span> {item.fix}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
