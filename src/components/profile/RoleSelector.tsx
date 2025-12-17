import { useState } from 'react';
import { DollarSign, TrendingUp, Code, Megaphone, Settings, Users, Shield, Headphones, BarChart3, Crown, Cpu, TestTube2 } from 'lucide-react';
import { useProfileStore } from '../../stores/profileStore';
import { Role } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { roleProfiles } from '../../data/role-profiles';

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Finance': DollarSign,
  'Sales': TrendingUp,
  'Engineering': Code,
  'Marketing': Megaphone,
  'Operations': Settings,
  'HR': Users,
  'Legal': Shield,
  'Customer Support': Headphones,
  'Data Science': BarChart3,
  'Executive / Leadership': Crown,
  'Product Management': Cpu,
  'QA / Testing': TestTube2,
};

const roleColors: Record<string, string> = {
  'Finance': 'green',
  'Sales': 'blue',
  'Engineering': 'purple',
  'Marketing': 'orange',
  'Operations': 'slate',
  'HR': 'rose',
  'Legal': 'red',
  'Customer Support': 'cyan',
  'Data Science': 'indigo',
  'Executive / Leadership': 'emerald',
  'Product Management': 'teal',
  'QA / Testing': 'pink',
};

export function RoleSelector() {
  const { currentProfile, updateProfile } = useProfileStore();
  const [customResponsibilities, setCustomResponsibilities] = useState(currentProfile.responsibilities || '');

  const roles: Role[] = [
    'Finance', 'Sales', 'Engineering', 'Marketing', 'Operations', 'HR',
    'Legal', 'Customer Support', 'Data Science', 'Executive / Leadership',
    'Product Management', 'QA / Testing'
  ];

  const handleRoleSelect = (role: Role) => {
    const profile = roleProfiles.find(p => p.role === role);
    updateProfile({
      role,
      responsibilities: profile?.responsibilities || '',
      capabilities: profile?.capabilities || [],
      enabledFeatures: profile?.features.enabled.map(f => f.toLowerCase().replace(/\s+/g, '-')) as any[] || [],
    });
    setCustomResponsibilities(profile?.responsibilities || '');
  };

  const handleResponsibilitiesChange = (value: string) => {
    setCustomResponsibilities(value);
    updateProfile({ responsibilities: value });
  };

  return (
    <div className="space-y-6">
      {/* Role Grid */}
      <div>
        <h4 className="text-sm font-medium text-intNeutral-700 mb-3">Select Your Role</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {roles.map((role) => {
            const Icon = roleIcons[role] || Users;
            const isSelected = currentProfile.role === role;
            const color = roleColors[role] || 'slate';

            return (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? `border-int${color.charAt(0).toUpperCase() + color.slice(1)}-500 bg-int${color.charAt(0).toUpperCase() + color.slice(1)}-50`
                    : 'border-intNeutral-200 hover:border-intNeutral-300 bg-white'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? `text-int${color.charAt(0).toUpperCase() + color.slice(1)}-500` : 'text-intNeutral-400'}`} />
                <span className={`text-sm font-medium ${isSelected ? 'text-intNeutral-900' : 'text-intNeutral-600'}`}>
                  {role}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsibilities */}
      <div>
        <h4 className="text-sm font-medium text-intNeutral-700 mb-3">Your Responsibilities</h4>
        <textarea
          value={customResponsibilities}
          onChange={(e) => handleResponsibilitiesChange(e.target.value)}
          placeholder="Describe your key responsibilities and focus areas..."
          className="w-full h-24 px-4 py-3 rounded-lg border border-intNeutral-300 focus:border-intPrimary-500 focus:ring-2 focus:ring-intPrimary-100 outline-none resize-none"
        />
      </div>

      {/* Capabilities Preview */}
      {currentProfile.capabilities && currentProfile.capabilities.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-intNeutral-700 mb-3">Suggested Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {currentProfile.capabilities.map((cap, index) => (
              <Badge key={index} variant="neutral">
                {cap}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Quick Profile Info */}
      {currentProfile.role && currentProfile.role !== 'All' && (
        <Card className="p-4 bg-intPrimary-50 border-intPrimary-200">
          <h4 className="font-medium text-intPrimary-900 mb-2">
            {currentProfile.role} Profile Selected
          </h4>
          <p className="text-sm text-intPrimary-700">
            Your profile will be pre-configured with recommended features, tools, and escalation rules for the {currentProfile.role} role.
            You can customize these in the following steps.
          </p>
        </Card>
      )}
    </div>
  );
}
