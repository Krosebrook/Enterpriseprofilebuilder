import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/common/SectionHeader';
import {
  LayoutDashboard,
  Target,
  Zap,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  User,
  FileText,
  ChevronRight,
  Lightbulb,
  Clock,
  Users as UsersIcon
} from 'lucide-react';
import { getROIAnalytics } from '../../utils/analytics';
import { allDeploymentPhases } from '../../data/deployment-phases';
import { kyleNarrativeContent, kyleDocs, kyleGuideDocs } from '../../data/documents/kyle-materials';
import { DocumentViewer } from '../../components/documents/DocumentViewer';
import { DocumentResource } from '../../types';
import { Badge } from '../../components/ui/Badge';

export function Dashboard() {
  const { selectedRole, setActiveSection } = useNavigation();
  const roiStats = getROIAnalytics();
  const [selectedDocument, setSelectedDocument] = useState<DocumentResource | null>(null);
  const [showKyleStory, setShowKyleStory] = useState(false);

  // Calculate deployment progress
  const totalPhases = allDeploymentPhases.length;
  const completedPhases = allDeploymentPhases.filter(p => p.status === 'completed').length;
  const inProgressPhases = allDeploymentPhases.filter(p => p.status === 'in-progress').length;
  const progressPercent = Math.round((completedPhases / totalPhases) * 100);

  // If viewing a document, show the viewer
  if (selectedDocument) {
    return (
      <div className="animate-in fade-in duration-300">
        <DocumentViewer
          document={selectedDocument}
          onBack={() => setSelectedDocument(null)}
          showTableOfContents={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Executive Dashboard" 
        description={`Welcome back. Viewing platform status for: ${selectedRole}`}
        icon={LayoutDashboard}
      />

      {/* High Level Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Active Users" 
          value={roiStats.activeUsers.toString()} 
          trend="+12% vs last week" 
          trendColor="text-emerald-500"
          icon={Target}
        />
        <StatsCard 
          title="Avg Time Saved" 
          value={`${roiStats.timeSaved} hr/wk`} 
          trend="Per user" 
          trendColor="text-blue-500"
          icon={Zap}
        />
        <StatsCard 
          title="Deployment" 
          value={`${progressPercent}%`} 
          trend={`Phase ${completedPhases + 1} active`} 
          trendColor="text-amber-500"
          icon={RocketIcon}
          onClick={() => setActiveSection('deployment')}
        />
        <StatsCard 
          title="Projected ROI" 
          value={`${roiStats.roi}x`} 
          trend="Year 1" 
          trendColor="text-emerald-500"
          icon={TrendingUp}
          onClick={() => setActiveSection('operations')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions based on Role */}
          <Card className="border-t-4 border-t-indigo-500">
            <h3 className="font-bold text-lg mb-4 text-slate-900">Recommended Actions for {selectedRole}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {getRoleActions(selectedRole, setActiveSection).map((action, idx) => (
                 <button 
                   key={idx}
                   onClick={action.onClick}
                   className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all group text-left"
                 >
                   <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-md ${action.color}`}>
                       <action.icon className="w-5 h-5 text-white" />
                     </div>
                     <div>
                       <div className="font-semibold text-slate-800">{action.title}</div>
                       <div className="text-xs text-slate-500">{action.desc}</div>
                     </div>
                   </div>
                   <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                 </button>
               ))}
            </div>
          </Card>

          {/* Kyle's Story / Learn from Kyle Section */}
          <Card variant="int" padding="int" className="border-l-4 border-l-[var(--int-primary)] bg-gradient-to-br from-[var(--int-bg-card)] to-[var(--int-primary-light)]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[var(--int-primary)] rounded-full">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[var(--int-gray-900)]">{kyleNarrativeContent.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-[var(--int-gray-500)]">
                      <Clock className="w-3 h-3" />
                      {kyleNarrativeContent.deliveryTime}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--int-gray-500)]">
                      <UsersIcon className="w-3 h-3" />
                      {kyleNarrativeContent.audience}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="intPrimary" size="sm">Featured</Badge>
            </div>

            <p className="text-[var(--int-gray-600)] text-sm mb-4">
              {kyleNarrativeContent.description}
            </p>

            {/* Expandable Content Preview */}
            {!showKyleStory ? (
              <button
                onClick={() => setShowKyleStory(true)}
                className="w-full text-left p-4 bg-white/70 rounded-lg border border-[var(--int-gray-200)] hover:bg-white transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--int-gray-900)]">Read Kyle's Story</p>
                    <p className="text-xs text-[var(--int-gray-500)] mt-1">Learn from his journey introducing AI to the organization</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--int-gray-400)] group-hover:text-[var(--int-primary)] transition-colors" />
                </div>
              </button>
            ) : (
              <div className="bg-white rounded-lg border border-[var(--int-gray-200)] p-4">
                <div className="prose prose-sm max-w-none text-[var(--int-gray-700)]">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-[var(--int-gray-900)] mb-2">The Beginning</h4>
                      <p className="text-sm">When I first started exploring AI tools for our organization, I wasn't sure where to begin. Like many of you, I had questions about security, adoption, and real-world applications.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--int-gray-900)] mb-2">Key Lessons</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-[var(--int-primary)] mt-0.5 flex-shrink-0" />
                          <span><strong>Start Small, Think Big</strong> - Begin with a specific use case that solves a real problem.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-[var(--int-primary)] mt-0.5 flex-shrink-0" />
                          <span><strong>Involve Your Team Early</strong> - The best implementations come from collaborative discovery.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-[var(--int-primary)] mt-0.5 flex-shrink-0" />
                          <span><strong>Document Everything</strong> - Keep track of what works and what doesn't.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-[var(--int-primary)] mt-0.5 flex-shrink-0" />
                          <span><strong>Security First</strong> - Never compromise on security. The right enterprise tools make this easier.</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-sm italic text-[var(--int-gray-600)] border-l-2 border-[var(--int-primary)] pl-3">
                      "Remember: every expert was once a beginner. Start where you are, use what you have, do what you can."
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowKyleStory(false)}
                  className="mt-4 text-sm text-[var(--int-primary)] font-medium hover:underline"
                >
                  Collapse
                </button>
              </div>
            )}

            {/* Quick Links to Kyle's Materials */}
            <div className="mt-4 pt-4 border-t border-[var(--int-gray-200)]">
              <p className="text-xs font-bold text-[var(--int-gray-500)] uppercase tracking-wider mb-3">Kyle's Quick References</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[...kyleDocs.slice(0, 2), ...kyleGuideDocs.slice(0, 2)].map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc)}
                    className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-[var(--int-gray-200)] hover:border-[var(--int-primary)] hover:bg-[var(--int-primary-light)]/50 transition-colors text-left group"
                  >
                    <FileText className="w-4 h-4 text-[var(--int-gray-400)] group-hover:text-[var(--int-primary)]" />
                    <span className="text-xs font-medium text-[var(--int-gray-700)] truncate">{doc.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Activity / System Status */}
          <Card>
            <h3 className="font-bold text-lg mb-4 text-slate-900">System Baseline Status</h3>
            <div className="space-y-4">
              <StatusItem 
                label="SOC 2 Compliance" 
                status="healthy" 
                desc="All controls passing audit checks"
              />
              <StatusItem 
                label="PII Redaction (DLP)" 
                status="healthy" 
                desc="Regex patterns active, 0 incidents (24h)"
              />
              <StatusItem 
                label="Model Latency (Opus)" 
                status="warning" 
                desc="Avg 1.2s (Threshold: 1.0s)"
              />
            </div>
            <button 
              onClick={() => setActiveSection('baseline')}
              className="mt-4 text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
            >
              View full baseline <ArrowRight className="w-3 h-3" />
            </button>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-amber-50">Reference Library</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Access official Claude executive assessments and technical roadmaps.
                </p>
                <button 
                  onClick={() => setActiveSection('reference')}
                  className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium text-sm transition-colors"
                >
                  Browse Library
                </button>
              </div>
            </div>
          </Card>

          <Card className="bg-emerald-50 border-emerald-100">
             <div className="flex items-start gap-3">
               <ShieldCheck className="w-5 h-5 text-emerald-600 mt-1" />
               <div>
                 <h4 className="font-bold text-emerald-900 text-sm">Security Tip</h4>
                 <p className="text-xs text-emerald-800 mt-1">
                   Never input customer passwords or secrets into prompts. The DLP filter catches most, but vigilance is key.
                 </p>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, trend, trendColor, icon: Icon, onClick }: any) {
  return (
    <Card className={`hover:shadow-md transition-all cursor-pointer`} onClick={onClick}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="w-5 h-5 text-slate-400" />
        </div>
      </div>
      <div className={`text-xs font-medium mt-3 flex items-center gap-1 ${trendColor}`}>
        <TrendingUp className="w-3 h-3" />
        {trend}
      </div>
    </Card>
  );
}

function RocketIcon(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function StatusItem({ label, status, desc }: any) {
  const color = status === 'healthy' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="font-medium text-slate-700 text-sm">{label}</span>
      </div>
      <span className="text-xs text-slate-500">{desc}</span>
    </div>
  );
}

function getRoleActions(role: string, setSection: any) {
  const common = [
    { title: 'Explore Tools', desc: 'Browse available MCP tools', icon: Zap, color: 'bg-blue-500', onClick: () => setSection('tools') },
    { title: 'Feature Guides', desc: 'Learn capabilities', icon: BookOpen, color: 'bg-indigo-500', onClick: () => setSection('features') }
  ];

  if (role.includes('Executive') || role.includes('Finance')) {
    return [
      { title: 'View ROI', desc: 'Analyze investment return', icon: TrendingUp, color: 'bg-emerald-500', onClick: () => setSection('operations') },
      { title: 'Deployment Status', desc: 'Track rollout progress', icon: RocketIcon, color: 'bg-amber-500', onClick: () => setSection('deployment') }
    ];
  }

  if (role.includes('Engineering') || role.includes('IT')) {
    return [
      { title: 'System Baseline', desc: 'Review security controls', icon: ShieldCheck, color: 'bg-rose-500', onClick: () => setSection('baseline') },
      { title: 'Deployment Tasks', desc: 'View technical roadmap', icon: RocketIcon, color: 'bg-amber-500', onClick: () => setSection('deployment') }
    ];
  }

  return common;
}
