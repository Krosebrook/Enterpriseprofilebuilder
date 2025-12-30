import { useState } from 'react';
import { FileText, Shield, Zap, AlertTriangle, Eye, Plus, Trash2, GripVertical } from 'lucide-react';
import { useProfileStore, CustomWorkflow, WorkflowStep } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const BASELINE_TEMPLATES = [
  {
    id: 'enterprise-standard',
    name: 'Enterprise Standard',
    description: 'Balanced security with productivity focus',
    icon: Shield,
    prompt: `You are an AI assistant for INT Inc, operating within enterprise guidelines.

Core Principles:
- Maintain data confidentiality at all times
- Escalate sensitive decisions to appropriate approvers
- Follow company policies and compliance requirements
- Provide accurate, helpful responses while respecting boundaries

You should:
- Be professional and concise
- Cite sources when possible
- Ask clarifying questions when needed
- Refuse requests that violate company policy`,
    securityLevel: 'balanced' as const,
  },
  {
    id: 'strict-compliance',
    name: 'Strict Compliance',
    description: 'Maximum security for regulated environments',
    icon: AlertTriangle,
    prompt: `You are an AI assistant operating under strict compliance protocols.

Security Requirements:
- Never share PII or confidential data
- All external communications require approval
- Log all significant actions for audit
- Escalate any uncertainty to human reviewers

Restrictions:
- No access to external APIs without approval
- No code execution in production environments
- All outputs subject to review`,
    securityLevel: 'strict' as const,
  },
  {
    id: 'developer-mode',
    name: 'Developer Focus',
    description: 'Optimized for engineering workflows',
    icon: Zap,
    prompt: `You are a technical AI assistant for software development.

Capabilities:
- Code review and suggestions
- Documentation generation
- Debugging assistance
- Architecture discussions

Guidelines:
- Prefer tested, production-ready code
- Follow team coding standards
- Document complex logic
- Suggest improvements proactively`,
    securityLevel: 'permissive' as const,
  },
];

export function BaselinePromptBuilder() {
  const {
    currentProfile,
    setBaselinePrompt,
    setCustomInstructions,
    setSecurityLevel,
    addCustomWorkflow,
    removeCustomWorkflow,
  } = useProfileStore();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isAddingWorkflow, setIsAddingWorkflow] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<Omit<CustomWorkflow, 'id'>>({
    name: '',
    description: '',
    steps: [],
    complexity: 'simple',
    estimatedTotalMinutes: 0,
  });
  const [newStep, setNewStep] = useState<Omit<WorkflowStep, 'id'>>({
    title: '',
    description: '',
    estimatedMinutes: 5,
  });

  const handleSelectTemplate = (template: typeof BASELINE_TEMPLATES[0]) => {
    setSelectedTemplate(template.id);
    setBaselinePrompt(template.prompt);
    setSecurityLevel(template.securityLevel);
  };

  const handleAddStep = () => {
    if (newStep.title) {
      setNewWorkflow({
        ...newWorkflow,
        steps: [...newWorkflow.steps, { ...newStep, id: crypto.randomUUID() }],
        estimatedTotalMinutes: newWorkflow.estimatedTotalMinutes + newStep.estimatedMinutes,
      });
      setNewStep({ title: '', description: '', estimatedMinutes: 5 });
    }
  };

  const handleSaveWorkflow = () => {
    if (newWorkflow.name && newWorkflow.steps.length > 0) {
      addCustomWorkflow({
        ...newWorkflow,
        id: crypto.randomUUID(),
      });
      setNewWorkflow({
        name: '',
        description: '',
        steps: [],
        complexity: 'simple',
        estimatedTotalMinutes: 0,
      });
      setIsAddingWorkflow(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Configure Baseline Prompt</h2>
        <p className="text-slate-600 mt-2">
          Define how Claude should behave and what workflows to support
        </p>
      </div>

      {/* Template Selection */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Select Baseline Template
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BASELINE_TEMPLATES.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;

            return (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-amber-500 bg-amber-50 border-amber-200'
                    : 'hover:border-slate-300'
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{template.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {template.securityLevel}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Custom Instructions */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Baseline Prompt Preview
        </h3>

        <Textarea
          value={currentProfile.baselinePrompt}
          onChange={(e) => setBaselinePrompt(e.target.value)}
          placeholder="Your baseline prompt will appear here..."
          className="min-h-[200px] font-mono text-sm"
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Additional Custom Instructions
          </label>
          <Textarea
            value={currentProfile.customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Add any role-specific instructions here..."
            className="min-h-[100px]"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Security Level
            </label>
            <div className="flex gap-2">
              {(['strict', 'balanced', 'permissive'] as const).map((level) => (
                <Button
                  key={level}
                  variant={currentProfile.securityLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSecurityLevel(level)}
                  className={currentProfile.securityLevel === level ? 'bg-amber-500' : ''}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Badge variant="outline" className="text-slate-600">
            {currentProfile.baselinePrompt.length} characters
          </Badge>
        </div>
      </Card>

      {/* Custom Workflows */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Custom Workflows
          </h3>
          <Button
            size="sm"
            onClick={() => setIsAddingWorkflow(true)}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Workflow
          </Button>
        </div>

        {/* Existing Workflows */}
        <div className="space-y-3 mb-4">
          {currentProfile.customWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">{workflow.name}</h4>
                  <p className="text-sm text-slate-500">{workflow.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{workflow.steps.length} steps</Badge>
                    <Badge variant="outline">{workflow.estimatedTotalMinutes} min</Badge>
                    <Badge variant="secondary">{workflow.complexity}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomWorkflow(workflow.id)}
                  className="text-rose-500 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {currentProfile.customWorkflows.length === 0 && !isAddingWorkflow && (
            <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <Zap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">No custom workflows defined</p>
              <p className="text-sm text-slate-400">Create workflows for repeated tasks</p>
            </div>
          )}
        </div>

        {/* Add Workflow Form */}
        {isAddingWorkflow && (
          <div className="p-4 border-2 border-amber-200 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-4">New Workflow</h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <Input
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    placeholder="e.g., Weekly Report"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Complexity</label>
                  <div className="flex gap-2 mt-1">
                    {(['simple', 'moderate', 'complex'] as const).map((c) => (
                      <Button
                        key={c}
                        variant={newWorkflow.complexity === c ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewWorkflow({ ...newWorkflow, complexity: c })}
                      >
                        {c}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <Input
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  placeholder="Brief description of the workflow"
                />
              </div>

              {/* Steps */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Steps</label>
                <div className="space-y-2">
                  {newWorkflow.steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{idx + 1}.</span>
                      <span className="text-sm text-slate-600 flex-1">{step.title}</span>
                      <Badge variant="outline" className="text-xs">{step.estimatedMinutes}m</Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <Input
                    value={newStep.title}
                    onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                    placeholder="Step title"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={newStep.estimatedMinutes}
                    onChange={(e) => setNewStep({ ...newStep, estimatedMinutes: parseInt(e.target.value) || 5 })}
                    className="w-20"
                    min={1}
                  />
                  <Button size="sm" variant="outline" onClick={handleAddStep}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingWorkflow(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveWorkflow}
                  disabled={!newWorkflow.name || newWorkflow.steps.length === 0}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Save Workflow
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
