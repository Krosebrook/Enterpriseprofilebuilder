import { useState } from 'react';
import { FileText, Shield, Zap, AlertTriangle, Eye, Plus, Trash2 } from 'lucide-react';
import { useProfileStore, CustomWorkflow, WorkflowStep } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const baselines = [
  {
    id: 'balanced-v2',
    name: 'Balanced Baseline',
    description: 'Standard configuration suitable for most enterprise use cases',
    securityLevel: 'balanced' as const,
    features: ['Memory enabled', 'Web search allowed', 'Standard escalation rules'],
  },
  {
    id: 'strict-v2',
    name: 'High-Security Baseline',
    description: 'Strict configuration for sensitive data handling',
    securityLevel: 'strict' as const,
    features: ['PII detection required', 'No external data access', 'Mandatory escalations'],
  },
  {
    id: 'permissive-v2',
    name: 'Permissive Baseline',
    description: 'Relaxed configuration for power users and development',
    securityLevel: 'permissive' as const,
    features: ['All features enabled', 'Minimal restrictions', 'Self-managed escalations'],
  },
];

export function BaselinePromptBuilder() {
  const { currentProfile, updateProfile, addWorkflow, removeWorkflow } = useProfileStore();
  const [showWorkflowCreator, setShowWorkflowCreator] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<Omit<CustomWorkflow, 'id'>>({
    name: '',
    description: '',
    steps: [],
    estimatedTime: '',
    complexity: 'simple',
  });
  const [newStep, setNewStep] = useState({ title: '', description: '' });

  const selectedBaseline = baselines.find(b => b.id === currentProfile.baselineId) || baselines[0];
  const customWorkflows = currentProfile.customWorkflows || [];

  const handleBaselineSelect = (baselineId: string) => {
    const baseline = baselines.find(b => b.id === baselineId);
    updateProfile({
      baselineId,
      securityLevel: baseline?.securityLevel || 'balanced',
    });
  };

  const handleAddStep = () => {
    if (newStep.title) {
      setNewWorkflow({
        ...newWorkflow,
        steps: [...newWorkflow.steps, {
          id: crypto.randomUUID(),
          title: newStep.title,
          description: newStep.description,
          order: newWorkflow.steps.length + 1,
        }],
      });
      setNewStep({ title: '', description: '' });
    }
  };

  const handleRemoveStep = (stepId: string) => {
    setNewWorkflow({
      ...newWorkflow,
      steps: newWorkflow.steps.filter(s => s.id !== stepId).map((s, i) => ({ ...s, order: i + 1 })),
    });
  };

  const handleSaveWorkflow = () => {
    if (newWorkflow.name && newWorkflow.steps.length > 0) {
      addWorkflow(newWorkflow);
      setNewWorkflow({
        name: '',
        description: '',
        steps: [],
        estimatedTime: '',
        complexity: 'simple',
      });
      setShowWorkflowCreator(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Baseline Selection */}
      <div>
        <h4 className="text-sm font-medium text-intNeutral-700 mb-3">Select Baseline Configuration</h4>
        <div className="grid gap-4">
          {baselines.map((baseline) => {
            const isSelected = currentProfile.baselineId === baseline.id;
            const Icon = baseline.securityLevel === 'strict' ? Shield :
                         baseline.securityLevel === 'permissive' ? Zap : FileText;

            return (
              <Card
                key={baseline.id}
                onClick={() => handleBaselineSelect(baseline.id)}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-intPrimary-300 bg-intPrimary-50/50 ring-2 ring-intPrimary-200'
                    : 'border-intNeutral-200 hover:border-intNeutral-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-intPrimary-100' : 'bg-intNeutral-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isSelected ? 'text-intPrimary-600' : 'text-intNeutral-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-intNeutral-900">{baseline.name}</h5>
                      <Badge
                        variant={
                          baseline.securityLevel === 'strict' ? 'error' :
                          baseline.securityLevel === 'permissive' ? 'warning' : 'success'
                        }
                      >
                        {baseline.securityLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-intNeutral-600 mt-1">{baseline.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {baseline.features.map((feature, i) => (
                        <Badge key={i} variant="neutral" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom Instructions */}
      <div>
        <h4 className="text-sm font-medium text-intNeutral-700 mb-3">Custom Instructions</h4>
        <textarea
          value={currentProfile.customInstructions || ''}
          onChange={(e) => updateProfile({ customInstructions: e.target.value })}
          placeholder="Add any custom instructions for Claude's behavior. These will be appended to the baseline system prompt..."
          className="w-full h-32 px-4 py-3 rounded-lg border border-intNeutral-300 focus:border-intPrimary-500 focus:ring-2 focus:ring-intPrimary-100 outline-none resize-none font-mono text-sm"
        />
        <p className="text-xs text-intNeutral-500 mt-2">
          Tip: Be specific about behaviors you want Claude to follow or avoid.
        </p>
      </div>

      {/* Custom Workflows */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-intNeutral-700">Custom Workflows</h4>
          <Button variant="outline" size="sm" onClick={() => setShowWorkflowCreator(!showWorkflowCreator)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Workflow
          </Button>
        </div>

        {/* Existing Workflows */}
        {customWorkflows.length > 0 && (
          <div className="space-y-3 mb-4">
            {customWorkflows.map((workflow) => (
              <Card key={workflow.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-intNeutral-900">{workflow.name}</h5>
                      <Badge variant="neutral">{workflow.complexity}</Badge>
                      {workflow.estimatedTime && (
                        <Badge variant="info">{workflow.estimatedTime}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-intNeutral-600 mt-1">{workflow.description}</p>
                    <div className="mt-2">
                      <span className="text-xs text-intNeutral-500">Steps: </span>
                      <span className="text-xs text-intNeutral-700">
                        {workflow.steps.map(s => s.title).join(' → ')}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWorkflow(workflow.id)}
                    className="text-intError-500 hover:text-intError-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Workflow Creator */}
        {showWorkflowCreator && (
          <Card className="p-4 bg-intNeutral-50">
            <h5 className="text-sm font-medium text-intNeutral-700 mb-3">Create New Workflow</h5>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Workflow name"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                />
                <Input
                  placeholder="Estimated time (e.g., 15-20 min)"
                  value={newWorkflow.estimatedTime}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, estimatedTime: e.target.value })}
                />
              </div>
              <Input
                placeholder="Description"
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
              />

              {/* Complexity */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-intNeutral-600">Complexity:</span>
                {(['simple', 'moderate', 'complex'] as const).map((c) => (
                  <Button
                    key={c}
                    variant={newWorkflow.complexity === c ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewWorkflow({ ...newWorkflow, complexity: c })}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Steps */}
              <div>
                <span className="text-sm text-intNeutral-600 block mb-2">Steps:</span>
                {newWorkflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2 mb-2">
                    <Badge variant="neutral">{index + 1}</Badge>
                    <span className="text-sm flex-1">{step.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStep(step.id)}
                      className="text-intError-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Step title"
                    value={newStep.title}
                    onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddStep}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowWorkflowCreator(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveWorkflow}
                  disabled={!newWorkflow.name || newWorkflow.steps.length === 0}
                >
                  Save Workflow
                </Button>
              </div>
            </div>
          </Card>
        )}

        {customWorkflows.length === 0 && !showWorkflowCreator && (
          <Card className="p-6 text-center text-intNeutral-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-intNeutral-400" />
            <p className="text-sm">No custom workflows defined.</p>
            <p className="text-xs mt-1">Create workflows for repeatable tasks.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
