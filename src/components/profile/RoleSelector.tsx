import {
  DollarSign,
  TrendingUp,
  Code,
  Megaphone,
  Settings,
  Users,
  Shield,
  Headphones,
  BarChart3,
  Crown,
  Cpu,
  TestTube2,
} from 'lucide-react';
import { useProfileStore } from '../../stores/profileStore';
import { Role } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProfileIconSelector } from './ProfileIconSelector';
import { roleProfilesData as roleProfiles } from '../../data/role-profiles';

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Finance: DollarSign,
  Sales: TrendingUp,
  Engineering: Code,
  Marketing: Megaphone,
  Operations: Settings,
  HR: Users,
  Legal: Shield,
  'Customer Support': Headphones,
  'Data Science': BarChart3,
  'Executive / Leadership': Crown,
  'Product Management': Cpu,
  'QA / Testing': TestTube2,
};

const roleDescriptions: Record<string, string> = {
  Finance: 'Budget analysis, financial reporting, forecasting',
  Sales: 'Pipeline management, proposals, customer communication',
  Engineering: 'Code review, documentation, technical planning',
  Marketing: 'Campaign creation, content strategy, analytics',
  Operations: 'Process optimization, workflow automation',
  HR: 'Recruiting, onboarding, policy documentation',
  Legal: 'Contract review, compliance, risk assessment',
  'Customer Support': 'Ticket handling, knowledge base, escalation',
  'Data Science': 'Analysis, modeling, visualization',
  'Executive / Leadership': 'Strategy, reporting, decision support',
  'Product Management': 'Roadmap planning, requirements, prioritization',
  'QA / Testing': 'Test planning, bug tracking, quality assurance',
};

const ROLES: Role[] = [
  'Finance',
  'Sales',
  'Engineering',
  'Marketing',
  'Operations',
  'HR',
  'Legal',
  'Customer Support',
  'Data Science',
  'Executive / Leadership',
  'Product Management',
  'QA / Testing',
];

export function RoleSelector() {
  const { currentProfile, setRole, setIcon } = useProfileStore();
  const selectedRole = currentProfile.role;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">Select Your Role</h2>
          <p className="text-slate-600 mt-2">
            Choose the role that best describes your primary function. This will customize your
            Claude experience.
          </p>
        </div>

        {/* Profile Icon Selector in sidebar */}
        <div className="lg:w-80">
          <ProfileIconSelector currentIcon={currentProfile.icon} onIconChange={setIcon} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((role) => {
          const Icon = roleIcons[role] || Users;
          const isSelected = selectedRole === role;
          const profile = roleProfiles.find((p) => p.role === role);

          return (
            <Card
              key={role}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? 'ring-2 ring-amber-500 bg-amber-50 border-amber-200'
                  : 'hover:border-slate-300'
              }`}
              onClick={() => setRole(role)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold ${isSelected ? 'text-amber-900' : 'text-slate-900'}`}
                    >
                      {role}
                    </h3>
                    {isSelected && (
                      <Badge variant="default" className="bg-amber-500">
                        Selected
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 mt-1">{roleDescriptions[role]}</p>

                  {profile && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {profile.capabilities.slice(0, 3).map((cap, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                      {profile.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.capabilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedRole && (
        <Card className="p-6 bg-slate-50 border-slate-200 mt-8">
          <h3 className="font-semibold text-slate-900 mb-3">Role Preview: {selectedRole}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Common Requests</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                {roleProfiles
                  .find((p) => p.role === selectedRole)
                  ?.commonRequests.slice(0, 4)
                  .map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {req.request}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Enabled Features</h4>
              <div className="flex flex-wrap gap-2">
                {roleProfiles
                  .find((p) => p.role === selectedRole)
                  ?.features.enabled.map((f, i) => (
                    <Badge key={i} variant="secondary">
                      {f}
                    </Badge>
                  )) || <span className="text-sm text-slate-500">All features available</span>}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
