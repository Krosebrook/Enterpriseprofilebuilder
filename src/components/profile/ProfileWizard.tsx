import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Sliders,
  Link2,
  Shield,
  MessageSquare,
  Download,
} from 'lucide-react';
import { useProfileStore } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { RoleSelector } from './RoleSelector';
import { FeatureMatrix } from './FeatureMatrix';
import { ToolIntegrationSetup } from './ToolIntegrationSetup';
import { EscalationRulesEditor } from './EscalationRulesEditor';
import { BaselinePromptBuilder } from './BaselinePromptBuilder';
import { ProfileExport } from './ProfileExport';
import { ProfileCompletenessIndicator } from './ProfileCompletenessIndicator';

const STEPS = [
  { id: 0, label: 'Role', icon: User, description: 'Select your role' },
  { id: 1, label: 'Features', icon: Sliders, description: 'Enable capabilities' },
  { id: 2, label: 'Tools', icon: Link2, description: 'Connect integrations' },
  { id: 3, label: 'Governance', icon: Shield, description: 'Set escalation rules' },
  { id: 4, label: 'Prompt', icon: MessageSquare, description: 'Configure baseline' },
  { id: 5, label: 'Export', icon: Download, description: 'Save your profile' },
];

export function ProfileWizard() {
  const { currentStep, setCurrentStep, nextStep, prevStep, currentProfile } = useProfileStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      nextStep();
      setIsTransitioning(false);
    }, 150);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      prevStep();
      setIsTransitioning(false);
    }, 150);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <RoleSelector />;
      case 1:
        return <FeatureMatrix />;
      case 2:
        return <ToolIntegrationSetup />;
      case 3:
        return <EscalationRulesEditor />;
      case 4:
        return <BaselinePromptBuilder />;
      case 5:
        return <ProfileExport />;
      default:
        return <RoleSelector />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return currentProfile.role !== null;
      case 1:
        return currentProfile.enabledFeatures.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Profile Builder</h1>
              <p className="text-slate-600 mt-1">
                Build your personalized Claude enterprise profile step-by-step
              </p>
            </div>
            <Badge variant="default" className="w-fit">
              Step {currentStep + 1} of {STEPS.length}
            </Badge>
          </div>
        </div>

        {/* Profile Completeness Sidebar */}
        <div className="lg:w-80">
          <ProfileCompletenessIndicator profile={currentProfile} />
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-500'
                      : isCompleted
                        ? 'bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-400 cursor-pointer hover:bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-amber-500 text-white'
                        : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-300 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-medium hidden md:block">{step.label}</span>
                </button>

                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-1 mx-2 rounded ${
                      currentStep > index ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step Content */}
      <div
        className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="text-sm text-slate-500">{STEPS[currentStep].description}</div>

        {currentStep < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 bg-amber-500 hover:bg-amber-600"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <div className="w-24" /> // Spacer for final step
        )}
      </div>
    </div>
  );
}
