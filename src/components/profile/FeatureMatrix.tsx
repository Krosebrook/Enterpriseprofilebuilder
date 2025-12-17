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
  risks?: string[];
  recommended?: boolean;
}

const features: FeatureInfo[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Allow Claude to search the web for current information',
    icon: Globe,
    recommended: true,
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Enable Claude to remember context across conversations',
    icon: Brain,
    recommended: true,
  },
  {
    id: 'artifacts',
    name: 'Artifacts',
    description: 'Create rich, interactive outputs like documents and code',
    icon: FileBox,
    recommended: true,
  },
  {
    id: 'code-execution',
    name: 'Code Execution',
    description: 'Execute code in a sandboxed environment',
    icon: Code2,
    risks: ['Can execute arbitrary code', 'May access file system in sandbox'],
  },
  {
    id: 'files',
    name: 'Files',
    description: 'Upload and analyze files and documents',
    icon: FileText,
    recommended: true,
  },
  {
    id: 'vision',
    name: 'Vision',
    description: 'Analyze and understand images',
    icon: Eye,
    recommended: true,
  },
  {
    id: 'voice-mode',
    name: 'Voice Mode',
    description: 'Interact using voice input and output',
    icon: Mic,
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Organize work into separate project contexts',
    icon: FolderKanban,
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Share conversations and artifacts with team members',
    icon: Users,
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Connect to external APIs and services',
    icon: Plug,
    risks: ['External data access', 'API credential management required'],
  },
];

export function FeatureMatrix() {
  const { currentProfile, toggleFeature } = useProfileStore();
  const enabledFeatures = currentProfile.enabledFeatures || [];

  const isEnabled = (featureId: FeatureType) => enabledFeatures.includes(featureId);

  const handleToggle = (featureId: FeatureType) => {
    toggleFeature(featureId);
  };

  const enabledCount = enabledFeatures.length;
  const riskyFeaturesEnabled = features
    .filter(f => f.risks && isEnabled(f.id))
    .map(f => f.name);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-intNeutral-600">
            {enabledCount} of {features.length} features enabled
          </span>
        </div>
        {riskyFeaturesEnabled.length > 0 && (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {riskyFeaturesEnabled.length} feature{riskyFeaturesEnabled.length > 1 ? 's' : ''} with risks enabled
          </Badge>
        )}
      </div>

      {/* Feature Grid */}
      <div className="grid gap-4">
        {features.map((feature) => {
          const enabled = isEnabled(feature.id);
          const Icon = feature.icon;

          return (
            <Card
              key={feature.id}
              className={`p-4 transition-all ${
                enabled
                  ? 'border-intPrimary-300 bg-intPrimary-50/50'
                  : 'border-intNeutral-200 hover:border-intNeutral-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${enabled ? 'bg-intPrimary-100' : 'bg-intNeutral-100'}`}>
                    <Icon className={`w-5 h-5 ${enabled ? 'text-intPrimary-600' : 'text-intNeutral-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-intNeutral-900">{feature.name}</h4>
                      {feature.recommended && (
                        <Badge variant="success" className="text-xs">Recommended</Badge>
                      )}
                    </div>
                    <p className="text-sm text-intNeutral-600 mt-1">{feature.description}</p>

                    {/* Risk Warnings */}
                    {feature.risks && enabled && (
                      <div className="mt-2 p-2 bg-intWarning-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-intWarning-500 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-intWarning-700">
                            <strong>Risks:</strong>
                            <ul className="mt-1 list-disc list-inside">
                              {feature.risks.map((risk, index) => (
                                <li key={index}>{risk}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Switch
                  checked={enabled}
                  onCheckedChange={() => handleToggle(feature.id)}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Role-based Recommendations */}
      {currentProfile.role && currentProfile.role !== 'All' && (
        <Card className="p-4 bg-intInfo-50 border-intInfo-200">
          <h4 className="font-medium text-intInfo-900 mb-2">Role-Based Recommendations</h4>
          <p className="text-sm text-intInfo-700">
            Based on your role as <strong>{currentProfile.role}</strong>, we recommend enabling:
            Web Search, Memory, Artifacts, Files, and Vision. Code Execution should only be enabled
            if your role requires running code analysis or data processing.
          </p>
        </Card>
      )}
    </div>
  );
}
