/**
 * @fileoverview Executive Dashboard for Production Readiness
 * @module components/ExecutiveDashboard
 * @description Real-time dashboard showing implementation status, risks, and KPIs
 * 
 * Features:
 * - Overall production readiness score
 * - Critical path tracking
 * - Risk heatmap
 * - Budget tracking
 * - Team readiness
 * - Launch countdown
 * 
 * @author INT Inc Engineering Team
 * @version 1.0.0
 * @since 2025-12-11
 */

import { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Shield,
  Calendar
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ProgressBar } from './ui/ProgressBar';

/**
 * Production readiness status
 */
interface ProductionStatus {
  overall: number;
  phases: PhaseStatus[];
  criticalItems: CriticalItem[];
  risks: Risk[];
  budget: BudgetStatus;
  teamReadiness: TeamReadiness;
  launchDate: Date;
}

interface PhaseStatus {
  id: string;
  name: string;
  progress: number;
  status: 'complete' | 'in-progress' | 'blocked' | 'not-started';
  blockers: string[];
}

interface CriticalItem {
  id: string;
  title: string;
  owner: string;
  deadline: Date;
  status: 'done' | 'in-progress' | 'at-risk' | 'blocked';
  risk: 'low' | 'medium' | 'high';
}

interface Risk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  owner: string;
}

interface BudgetStatus {
  total: number;
  spent: number;
  committed: number;
  available: number;
  variance: number;
  categories: BudgetCategory[];
}

interface BudgetCategory {
  name: string;
  budgeted: number;
  actual: number;
  variance: number;
}

interface TeamReadiness {
  total: number;
  ready: number;
  partial: number;
  notReady: number;
  roles: TeamRole[];
}

interface TeamRole {
  role: string;
  status: 'ready' | 'partial' | 'not-ready';
  gaps: string[];
}

/**
 * Executive Dashboard Component
 */
export function ExecutiveDashboard() {
  const [status] = useState<ProductionStatus>(getProductionStatus());
  const [selectedView, setSelectedView] = useState<'overview' | 'risks' | 'budget' | 'team'>('overview');

  // Calculate days until launch
  const daysUntilLaunch = Math.ceil(
    (status.launchDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const _getStatusColor = (progress: number): 'success' | 'warning' | 'danger' => {
    if (progress >= 90) return 'success';
    if (progress >= 70) return 'warning';
    return 'danger';
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl text-slate-900 mb-2">Production Readiness Dashboard</h1>
            <p className="text-slate-600">INT Inc Enterprise Claude Profile Builder</p>
          </div>
          <div className="text-right">
            <div className="text-6xl text-amber-600 mb-2">{status.overall}%</div>
            <p className="text-slate-600">Production Ready</p>
          </div>
        </div>

        {/* Launch Countdown */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-amber-600" />
              <div>
                <div className="text-sm text-slate-600">Target Launch Date</div>
                <div className="text-2xl text-slate-900">
                  {status.launchDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl text-amber-600">{daysUntilLaunch}</div>
              <div className="text-sm text-slate-600">days remaining</div>
            </div>
          </div>
        </Card>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {(['overview', 'risks', 'budget', 'team'] as const).map(view => (
          <button
            key={view}
            className={`px-6 py-3 border-b-2 transition-colors ${
              selectedView === view
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setSelectedView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Phase Status Grid */}
          <div>
            <h2 className="text-2xl text-slate-900 mb-4">Phase Completion</h2>
            <div className="grid grid-cols-3 gap-4">
              {status.phases.map(phase => (
                <PhaseCard key={phase.id} phase={phase} />
              ))}
            </div>
          </div>

          {/* Critical Path Items */}
          <div>
            <h2 className="text-2xl text-slate-900 mb-4">
              Critical Path Items ({status.criticalItems.filter(item => item.status !== 'done').length} Active)
            </h2>
            <div className="space-y-3">
              {status.criticalItems.map(item => (
                <CriticalItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <KPICard
              title="Security Score"
              value="100%"
              trend="stable"
              icon={Shield}
              color="success"
            />
            <KPICard
              title="Code Coverage"
              value="88%"
              trend="up"
              icon={CheckCircle2}
              color="success"
            />
            <KPICard
              title="Quality Gates"
              value="2/6"
              trend="down"
              icon={Target}
              color="warning"
            />
            <KPICard
              title="Team Readiness"
              value="57%"
              trend="up"
              icon={Users}
              color="warning"
            />
          </div>
        </div>
      )}

      {/* Risks View */}
      {selectedView === 'risks' && (
        <div>
          <h2 className="text-2xl text-slate-900 mb-4">Risk Register</h2>
          <div className="grid grid-cols-1 gap-4">
            {status.risks.map(risk => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>

          {/* Risk Heatmap */}
          <div className="mt-8">
            <h3 className="text-xl text-slate-900 mb-4">Risk Heatmap</h3>
            <RiskHeatmap risks={status.risks} />
          </div>
        </div>
      )}

      {/* Budget View */}
      {selectedView === 'budget' && (
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="grid grid-cols-4 gap-4">
            <BudgetCard
              title="Total Budget"
              amount={status.budget.total}
              subtitle="Allocated"
              color="slate"
            />
            <BudgetCard
              title="Spent"
              amount={status.budget.spent}
              subtitle={`${Math.round((status.budget.spent / status.budget.total) * 100)}% of total`}
              color="blue"
            />
            <BudgetCard
              title="Available"
              amount={status.budget.available}
              subtitle="Remaining"
              color="green"
            />
            <BudgetCard
              title="Variance"
              amount={status.budget.variance}
              subtitle={status.budget.variance < 0 ? 'Under budget' : 'Over budget'}
              color={status.budget.variance < 0 ? 'green' : 'red'}
            />
          </div>

          {/* Budget Breakdown */}
          <div>
            <h3 className="text-xl text-slate-900 mb-4">Budget by Category</h3>
            <div className="space-y-3">
              {status.budget.categories.map(category => (
                <BudgetCategoryCard key={category.name} category={category} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team View */}
      {selectedView === 'team' && (
        <div className="space-y-6">
          {/* Team Overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="text-4xl text-green-600 mb-2">{status.teamReadiness.ready}</div>
              <div className="text-slate-600">Ready</div>
            </Card>
            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="text-4xl text-amber-600 mb-2">{status.teamReadiness.partial}</div>
              <div className="text-slate-600">Partial</div>
            </Card>
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="text-4xl text-red-600 mb-2">{status.teamReadiness.notReady}</div>
              <div className="text-slate-600">Not Ready</div>
            </Card>
          </div>

          {/* Team Roles */}
          <div>
            <h3 className="text-xl text-slate-900 mb-4">Team Readiness by Role</h3>
            <div className="space-y-3">
              {status.teamReadiness.roles.map(role => (
                <TeamRoleCard key={role.role} role={role} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Phase Card Component
 */
function PhaseCard({ phase }: { phase: PhaseStatus }) {
  const statusIcons = {
    complete: CheckCircle2,
    'in-progress': Clock,
    blocked: AlertCircle,
    'not-started': Clock
  };

  const statusColors = {
    complete: 'success',
    'in-progress': 'warning',
    blocked: 'danger',
    'not-started': 'default'
  } as const;

  const Icon = statusIcons[phase.status];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-slate-900 mb-1">{phase.name}</h3>
          <Badge variant={statusColors[phase.status]}>
            {phase.status.replace('-', ' ')}
          </Badge>
        </div>
        <Icon className={`w-6 h-6 ${
          phase.status === 'complete' ? 'text-green-600' :
          phase.status === 'in-progress' ? 'text-amber-600' :
          phase.status === 'blocked' ? 'text-red-600' :
          'text-slate-400'
        }`} />
      </div>
      <ProgressBar value={phase.progress} color={statusColors[phase.status]} />
      {phase.blockers.length > 0 && (
        <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
          <div className="mb-1">Blockers:</div>
          <ul className="list-disc list-inside">
            {phase.blockers.map((blocker, i) => (
              <li key={i}>{blocker}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

/**
 * Critical Item Card Component
 */
function CriticalItemCard({ item }: { item: CriticalItem }) {
  const statusColors = {
    done: 'success',
    'in-progress': 'warning',
    'at-risk': 'warning',
    blocked: 'danger'
  } as const;

  const riskColors = {
    low: 'info',
    medium: 'warning',
    high: 'danger'
  } as const;

  const daysUntilDeadline = Math.ceil(
    (item.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-slate-900">{item.title}</h4>
            <Badge variant={statusColors[item.status]}>
              {item.status}
            </Badge>
            <Badge variant={riskColors[item.risk]}>
              {item.risk} risk
            </Badge>
          </div>
          <div className="text-sm text-slate-600">
            Owner: {item.owner} • Deadline: {item.deadline.toLocaleDateString()}
            {daysUntilDeadline > 0 && ` (${daysUntilDeadline} days)`}
          </div>
        </div>
        {item.status === 'done' ? (
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        ) : daysUntilDeadline < 3 ? (
          <AlertCircle className="w-6 h-6 text-red-600" />
        ) : (
          <Clock className="w-6 h-6 text-amber-600" />
        )}
      </div>
    </Card>
  );
}

/**
 * Risk Card Component
 */
function RiskCard({ risk }: { risk: Risk }) {
  const getRiskScore = (prob: string, impact: string): number => {
    const scores = { low: 1, medium: 2, high: 3 };
    return scores[prob as keyof typeof scores] * scores[impact as keyof typeof scores];
  };

  const score = getRiskScore(risk.probability, risk.impact);
  const severity = score >= 6 ? 'Critical' : score >= 4 ? 'High' : score >= 2 ? 'Medium' : 'Low';
  const severityColor = score >= 6 ? 'danger' : score >= 4 ? 'warning' : 'info';

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-slate-900">{risk.description}</h4>
            <Badge variant={severityColor as any}>
              {severity}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div>
              <span className="text-slate-600">Probability:</span>{' '}
              <span className="text-slate-900">{risk.probability}</span>
            </div>
            <div>
              <span className="text-slate-600">Impact:</span>{' '}
              <span className="text-slate-900">{risk.impact}</span>
            </div>
          </div>
          <div className="text-sm">
            <div className="text-slate-600 mb-1">Mitigation:</div>
            <div className="text-slate-900">{risk.mitigation}</div>
          </div>
        </div>
      </div>
      <div className="text-sm text-slate-600">
        Owner: {risk.owner}
      </div>
    </Card>
  );
}

/**
 * Risk Heatmap Component
 */
function RiskHeatmap({ risks }: { risks: Risk[] }) {
  const matrix = {
    low: { low: 0, medium: 0, high: 0 },
    medium: { low: 0, medium: 0, high: 0 },
    high: { low: 0, medium: 0, high: 0 }
  };

  risks.forEach(risk => {
    matrix[risk.probability][risk.impact]++;
  });

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Headers */}
      <div className="p-4"></div>
      <div className="p-4 text-center text-sm text-slate-600">Low Impact</div>
      <div className="p-4 text-center text-sm text-slate-600">Medium Impact</div>
      <div className="p-4 text-center text-sm text-slate-600">High Impact</div>

      {/* High Probability */}
      <div className="p-4 text-right text-sm text-slate-600">High Probability</div>
      <div className={`p-4 text-center rounded ${matrix.high.low > 0 ? 'bg-amber-200' : 'bg-slate-100'}`}>
        {matrix.high.low || '-'}
      </div>
      <div className={`p-4 text-center rounded ${matrix.high.medium > 0 ? 'bg-orange-300' : 'bg-slate-100'}`}>
        {matrix.high.medium || '-'}
      </div>
      <div className={`p-4 text-center rounded ${matrix.high.high > 0 ? 'bg-red-400 text-white' : 'bg-slate-100'}`}>
        {matrix.high.high || '-'}
      </div>

      {/* Medium Probability */}
      <div className="p-4 text-right text-sm text-slate-600">Medium Probability</div>
      <div className={`p-4 text-center rounded ${matrix.medium.low > 0 ? 'bg-green-200' : 'bg-slate-100'}`}>
        {matrix.medium.low || '-'}
      </div>
      <div className={`p-4 text-center rounded ${matrix.medium.medium > 0 ? 'bg-amber-200' : 'bg-slate-100'}`}>
        {matrix.medium.medium || '-'}
      </div>
      <div className={`p-4 text-center rounded ${matrix.medium.high > 0 ? 'bg-orange-300' : 'bg-slate-100'}`}>
        {matrix.medium.high || '-'}
      </div>

      {/* Low Probability */}
      <div className="p-4 text-right text-sm text-slate-600">Low Probability</div>
      <div className={`p-4 text-center rounded ${matrix.low.low > 0 ? 'bg-green-100' : 'bg-slate-100'}`}>
        {matrix.low.low || '-'}
      </div>
      <div className={`p-4 text-center rounded ${matrix.low.medium > 0 ? 'bg-green-200' : 'bg-slate-100'}`}>
        {matrix.low.medium || '-'}
      </div>
      <div className={`p-4 text-center rounded ${matrix.low.high > 0 ? 'bg-amber-200' : 'bg-slate-100'}`}>
        {matrix.low.high || '-'}
      </div>
    </div>
  );
}

/**
 * KPI Card Component
 */
function KPICard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  color 
}: { 
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: 'success' | 'warning' | 'danger';
}) {
  const colors = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200'
  };

  const iconColors = {
    success: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-red-600'
  };

  return (
    <Card className={`p-6 ${colors[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <Icon className={`w-6 h-6 ${iconColors[color]}`} />
        {trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
        {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600" />}
      </div>
      <div className="text-3xl text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-600">{title}</div>
    </Card>
  );
}

/**
 * Budget Card Component
 */
function BudgetCard({
  title,
  amount,
  subtitle,
  color: _color
}: {
  title: string;
  amount: number;
  subtitle: string;
  color: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <DollarSign className="w-6 h-6 text-slate-400" />
      </div>
      <div className="text-3xl text-slate-900 mb-1">
        ${(amount / 1000).toFixed(0)}K
      </div>
      <div className="text-sm text-slate-600 mb-1">{title}</div>
      <div className="text-xs text-slate-500">{subtitle}</div>
    </Card>
  );
}

/**
 * Budget Category Card Component
 */
function BudgetCategoryCard({ category }: { category: BudgetCategory }) {
  const percentage = (category.actual / category.budgeted) * 100;
  const status = category.variance < 0 ? 'success' : category.variance <= category.budgeted * 0.1 ? 'warning' : 'danger';

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-slate-900">{category.name}</h4>
        <Badge variant={status}>
          {category.variance < 0 ? 'Under' : 'Over'} by ${Math.abs(category.variance / 1000).toFixed(0)}K
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm mb-2">
        <div>
          <div className="text-slate-600">Budgeted</div>
          <div className="text-slate-900">${(category.budgeted / 1000).toFixed(0)}K</div>
        </div>
        <div>
          <div className="text-slate-600">Actual</div>
          <div className="text-slate-900">${(category.actual / 1000).toFixed(0)}K</div>
        </div>
        <div>
          <div className="text-slate-600">Usage</div>
          <div className="text-slate-900">{percentage.toFixed(0)}%</div>
        </div>
      </div>
      <ProgressBar value={percentage} color={status} />
    </Card>
  );
}

/**
 * Team Role Card Component
 */
function TeamRoleCard({ role }: { role: TeamRole }) {
  const statusColors = {
    ready: 'success',
    partial: 'warning',
    'not-ready': 'danger'
  } as const;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-slate-900">{role.role}</h4>
            <Badge variant={statusColors[role.status]}>
              {role.status.replace('-', ' ')}
            </Badge>
          </div>
          {role.gaps.length > 0 && (
            <div className="text-sm text-slate-600">
              Gaps: {role.gaps.join(', ')}
            </div>
          )}
        </div>
        {role.status === 'ready' ? (
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        ) : role.status === 'partial' ? (
          <Clock className="w-6 h-6 text-amber-600" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-600" />
        )}
      </div>
    </Card>
  );
}

/**
 * Mock data for development
 */
function getProductionStatus(): ProductionStatus {
  return {
    overall: 85,
    phases: [
      { 
        id: 'phase-0', 
        name: 'Planning', 
        progress: 100, 
        status: 'complete', 
        blockers: [] 
      },
      { 
        id: 'phase-1', 
        name: 'Development', 
        progress: 100, 
        status: 'complete', 
        blockers: [] 
      },
      { 
        id: 'phase-2', 
        name: 'Testing', 
        progress: 90, 
        status: 'in-progress', 
        blockers: ['Security testing incomplete'] 
      },
      { 
        id: 'phase-3', 
        name: 'Staging', 
        progress: 75, 
        status: 'in-progress', 
        blockers: ['UAT scheduling'] 
      },
      { 
        id: 'phase-4', 
        name: 'Deployment', 
        progress: 60, 
        status: 'in-progress', 
        blockers: ['Monitoring setup'] 
      },
      { 
        id: 'phase-5', 
        name: 'Post-Deploy', 
        progress: 20, 
        status: 'not-started', 
        blockers: ['Phase 4 dependency'] 
      }
    ],
    criticalItems: [
      {
        id: 'ns-001',
        title: 'Prompt Injection Defense',
        owner: 'CSO + Engineering',
        deadline: new Date('2025-12-15'),
        status: 'done',
        risk: 'low'
      },
      {
        id: 'ns-002',
        title: 'Zero Data Retention Setup',
        owner: 'CSO + Legal',
        deadline: new Date('2025-12-13'),
        status: 'in-progress',
        risk: 'medium'
      },
      {
        id: 'ns-003',
        title: 'SOC 2 AI Controls',
        owner: 'Compliance',
        deadline: new Date('2025-12-20'),
        status: 'at-risk',
        risk: 'high'
      }
    ],
    risks: [
      {
        id: 'r-001',
        description: 'SOC 2 audit not complete by Dec 20',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Engage auditor immediately',
        owner: 'Compliance'
      },
      {
        id: 'r-002',
        description: 'ZDR not approved before launch',
        probability: 'low',
        impact: 'medium',
        mitigation: 'Alternative: 7-day retention',
        owner: 'CSO'
      }
    ],
    budget: {
      total: 375000,
      spent: 320000,
      committed: 340000,
      available: 35000,
      variance: -55000,
      categories: [
        { name: 'Claude License', budgeted: 75000, actual: 70000, variance: -5000 },
        { name: 'SOC 2 Audit', budgeted: 40000, actual: 42000, variance: 2000 },
        { name: 'CoE Staffing', budgeted: 175000, actual: 160000, variance: -15000 },
        { name: 'Training', budgeted: 25000, actual: 18000, variance: -7000 }
      ]
    },
    teamReadiness: {
      total: 7,
      ready: 3,
      partial: 2,
      notReady: 2,
      roles: [
        { role: 'CSO', status: 'ready', gaps: [] },
        { role: 'CTO', status: 'ready', gaps: [] },
        { role: 'IT Lead', status: 'partial', gaps: ['Incident training'] },
        { role: 'Engineering Lead', status: 'ready', gaps: [] },
        { role: 'HR Director', status: 'not-ready', gaps: ['Training', 'Access'] }
      ]
    },
    launchDate: new Date('2026-01-15')
  };
}

export default ExecutiveDashboard;
