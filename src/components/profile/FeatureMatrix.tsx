import { Globe, Brain, FileBox, Code2, FileText, Eye, Mic, FolderKanban, Users, Plug, AlertTriangle } from 'lucide-react';
import { useProfileStore } from '../../stores/profileStore';
import { FeatureType } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Switch } from '../ui/switch';

interface FeatureInfo {
  id: FeatureType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  riskLevel: 'low' | 'medium' | 'high';
  requiresApproval?: boolean;
  warning?: string;
}

const FEATURES: FeatureInfo[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the internet for up-to-date information',
    icon: Globe,
    riskLevel: 'low',
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Remember context across conversations',
    icon: Brain,
    riskLevel: 'medium',
    warning: 'Stores conversation data for continuity',
  },
  {
    id: 'artifacts',
    name: 'Artifacts',
    description: 'Create documents, code, and visual content',
    icon: FileBox,
    riskLevel: 'low',
  },
  {
    id: 'code-execution',
    name: 'Code Execution',
    description: 'Run code in a sandboxed environment',
    icon: Code2,
    riskLevel: 'high',
    requiresApproval: true,
    warning: 'Executes code - requires security approval',
  },
  {
    id: 'files',
    name: 'File Processing',
    description: 'Upload and analyze files',
    icon: FileText,
    riskLevel: 'medium',
  },
  {
    id: 'vision',
    name: 'Vision',
    description: 'Analyze images and visual content',
    icon: Eye,
    riskLevel: 'low',
  },
  {
    id: 'voice-mode',
    name: 'Voice Mode',
    description: 'Voice input and output capabilities',
    icon: Mic,
    riskLevel: 'low',
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Organize work into project spaces',
    icon: FolderKanban,
    riskLevel: 'low',
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Share and collaborate with team members',
    icon: Users,
    riskLevel: 'medium',
    warning: 'Shares data with team members',
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Connect to external APIs and services',
    icon: Plug,
    riskLevel: 'high',
    requiresApproval: true,
    warning: 'External data access - requires approval',
  },
];

const riskColors = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700',
};

export function FeatureMatrix() {
  const { currentProfile, toggleFeature } = useProfileStore();
  const enabledFeatures = currentProfile.enabledFeatures;

  const enabledCount = enabledFeatures.length;
  const highRiskEnabled = FEATURES.filter(
    f => f.riskLevel === 'high' && enabledFeatures.includes(f.id)
  ).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Configure Features</h2>
        <p className="text-slate-600 mt-2">
          Enable the Claude capabilities your role needs. Some features require additional approval.
        </p>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl">
        <div className="flex items-center gap-4">
          <Badge variant="default">
            {enabledCount} of {FEATURES.length} enabled
          </Badge>
          {highRiskEnabled > 0 && (
            <Badge variant="destructive" className="bg-rose-500">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {highRiskEnabled} high-risk
            </Badge>
          )}
        </div>
        <div className="text-sm text-slate-500">
          Role: <span className="font-medium text-slate-700">{currentProfile.role || 'Not selected'}</span>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          const isEnabled = enabledFeatures.includes(feature.id);

          return (
            <Card
              key={feature.id}
              className={`p-5 transition-all duration-200 ${
                isEnabled ? 'bg-amber-50 border-amber-200' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg ${
                    isEnabled ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{feature.name}</h3>
                      <Badge className={`text-[10px] ${riskColors[feature.riskLevel]}`}>
                        {feature.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{feature.description}</p>

                    {feature.warning && isEnabled && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-amber-700 bg-amber-100 p-2 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        {feature.warning}
                      </div>
                    )}

                    {feature.requiresApproval && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Requires Approval
                      </Badge>
                    )}
                  </div>
                </div>

                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => toggleFeature(feature.id)}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Risk Summary */}
      {highRiskEnabled > 0 && (
        <Card className="p-4 bg-rose-50 border-rose-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-rose-900">High-Risk Features Enabled</h4>
              <p className="text-sm text-rose-700 mt-1">
                You have enabled {highRiskEnabled} high-risk feature(s). These require additional security
                review and approval before deployment. Make sure to configure escalation rules in the next step.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
