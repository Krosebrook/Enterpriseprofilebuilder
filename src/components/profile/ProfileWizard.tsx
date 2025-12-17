import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, User, Sliders, Link2, Shield, MessageSquare, Download } from 'lucide-react';
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

const steps = [
  { id: 0, name: 'Role & Responsibilities', icon: User, description: 'Select your role and define responsibilities' },
  { id: 1, name: 'Features', icon: Sliders, description: 'Configure enabled/disabled features' },
  { id: 2, name: 'Tools & MCP', icon: Link2, description: 'Connect tools and MCP servers' },
  { id: 3, name: 'Governance', icon: Shield, description: 'Set escalation rules and security' },
  { id: 4, name: 'Persona', icon: MessageSquare, description: 'Configure baseline prompt and instructions' },
  { id: 5, name: 'Export', icon: Download, description: 'Review and export your profile' },
];

export function ProfileWizard() {
  const { wizard, nextStep, prevStep, setWizardStep } = useProfileStore();
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

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= wizard.currentStep + 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setWizardStep(stepIndex);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const currentStepConfig = steps[wizard.currentStep];
  const progress = ((wizard.currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-intNeutral-900">Build Your Claude Profile</h2>
          <span className="text-sm text-intNeutral-500">
            Step {wizard.currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-intNeutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-intPrimary-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => {
            const isComplete = index < wizard.currentStep;
            const isCurrent = index === wizard.currentStep;
            const isAccessible = index <= wizard.currentStep + 1;
            const StepIcon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                disabled={!isAccessible}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isComplete
                      ? 'bg-intSuccess-500 text-white'
                      : isCurrent
                      ? 'bg-intPrimary-500 text-white ring-4 ring-intPrimary-100'
                      : 'bg-intNeutral-200 text-intNeutral-500'
                  }`}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isCurrent ? 'text-intPrimary-600' : 'text-intNeutral-500'
                  }`}
                >
                  {step.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <currentStepConfig.icon className="w-6 h-6 text-intPrimary-500" />
            <h3 className="text-lg font-semibold text-intNeutral-900">{currentStepConfig.name}</h3>
          </div>
          <p className="text-intNeutral-600">{currentStepConfig.description}</p>
        </div>

        <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {wizard.currentStep === 0 && <RoleSelector />}
          {wizard.currentStep === 1 && <FeatureMatrix />}
          {wizard.currentStep === 2 && <ToolIntegrationSetup />}
          {wizard.currentStep === 3 && <EscalationRulesEditor />}
          {wizard.currentStep === 4 && <BaselinePromptBuilder />}
          {wizard.currentStep === 5 && <ProfileExport />}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={wizard.currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {wizard.currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="flex items-center gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Badge variant="success" className="px-4 py-2">
            <Check className="w-4 h-4 mr-2" />
            Profile Complete
          </Badge>
        )}
      </div>
    </div>
  );
}
