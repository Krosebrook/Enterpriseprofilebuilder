import { useMemo, memo } from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { ClaudeProfile } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ProfileCompletenessIndicatorProps {
  profile: ClaudeProfile;
  showDetails?: boolean;
}

interface CompletionItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

/**
 * Calculate profile completeness and return completion items
 * @param profile - The Claude profile to analyze
 * @returns Array of completion items with completion status
 */
function calculateCompleteness(profile: ClaudeProfile): CompletionItem[] {
  return [
    {
      id: 'role',
      label: 'Role selected',
      completed: profile.role !== null,
      required: true,
    },
    {
      id: 'responsibilities',
      label: 'Responsibilities defined',
      completed: profile.responsibilities.length > 0,
      required: true,
    },
    {
      id: 'features',
      label: 'Features enabled',
      completed: profile.enabledFeatures.length > 0,
      required: true,
    },
    {
      id: 'security',
      label: 'Security settings configured',
      completed:
        profile.securitySettings.approvedDataSources.length > 0 ||
        profile.securitySettings.restrictedOperations.length > 0,
      required: false,
    },
    {
      id: 'tools',
      label: 'Tools connected',
      completed: profile.connectedTools.some((t) => t.connected),
      required: false,
    },
    {
      id: 'escalation',
      label: 'Escalation rules defined',
      completed: profile.escalationRules.length > 0,
      required: false,
    },
    {
      id: 'prompt',
      label: 'Baseline prompt configured',
      completed: profile.baselinePrompt.length > 0,
      required: false,
    },
    {
      id: 'name',
      label: 'Profile named',
      completed: profile.name !== 'New Profile' && profile.name.length > 0,
      required: true,
    },
  ];
}

// Completion scoring weights
const REQUIRED_FIELD_WEIGHT = 70; // Required fields worth 70% of total score
const OPTIONAL_FIELD_WEIGHT = 30; // Optional fields worth 30% of total score

export function ProfileCompletenessIndicator({
  profile,
  showDetails = true,
}: ProfileCompletenessIndicatorProps) {
  const completionItems = useMemo(() => calculateCompleteness(profile), [profile]);

  // Calculate completion percentage
  const completedRequired = completionItems.filter(
    (item) => item.required && item.completed
  ).length;
  const totalRequired = completionItems.filter((item) => item.required).length;
  const completedOptional = completionItems.filter(
    (item) => !item.required && item.completed
  ).length;
  const totalOptional = completionItems.filter((item) => !item.required).length;

  // Weight required items more heavily
  const requiredScore =
    totalRequired > 0
      ? (completedRequired / totalRequired) * REQUIRED_FIELD_WEIGHT
      : REQUIRED_FIELD_WEIGHT;
  const optionalScore =
    totalOptional > 0 ? (completedOptional / totalOptional) * OPTIONAL_FIELD_WEIGHT : 0;
  const completionPercentage = Math.round(requiredScore + optionalScore);

  const isComplete = completedRequired === totalRequired;

  const getStatusColor = () => {
    if (completionPercentage >= 90) return 'text-green-600';
    if (completionPercentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (completionPercentage >= 90) return CheckCircle2;
    if (completionPercentage >= 60) return AlertCircle;
    return Circle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-5 w-5 ${getStatusColor()}`} />
          <h3 className="font-semibold text-slate-900">Profile Completeness</h3>
        </div>
        <Badge variant={isComplete ? 'success' : 'default'}>{completionPercentage}%</Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              completionPercentage >= 90
                ? 'bg-green-500'
                : completionPercentage >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700 mb-2">
            Required ({completedRequired}/{totalRequired})
          </div>
          {completionItems
            .filter((item) => item.required)
            .map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-400 shrink-0" />
                )}
                <span className={item.completed ? 'text-slate-700' : 'text-slate-500'}>
                  {item.label}
                </span>
              </div>
            ))}

          {totalOptional > 0 && (
            <>
              <div className="text-sm font-medium text-slate-700 mb-2 mt-3">
                Optional ({completedOptional}/{totalOptional})
              </div>
              {completionItems
                .filter((item) => !item.required)
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className={item.completed ? 'text-slate-700' : 'text-slate-500'}>
                      {item.label}
                    </span>
                  </div>
                ))}
            </>
          )}
        </div>
      )}

      {!isComplete && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-600">
            Complete all required items to finalize your profile
          </p>
        </div>
      )}
    </Card>
  );
}

// Memoize component to prevent unnecessary re-renders
export const MemoizedProfileCompletenessIndicator = memo(ProfileCompletenessIndicator);
