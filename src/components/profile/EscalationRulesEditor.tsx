import { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Shield, Lock, Eye } from 'lucide-react';
import { useProfileStore, EscalationRule } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

const DEFAULT_RULES: Omit<EscalationRule, 'id'>[] = [
  {
    trigger: 'Budget decisions',
    threshold: '$10,000',
    approver: 'Finance Manager',
    enabled: true,
  },
  {
    trigger: 'External communications',
    threshold: 'Customer-facing',
    approver: 'Communications Lead',
    enabled: true,
  },
  {
    trigger: 'Data access requests',
    threshold: 'PII or sensitive',
    approver: 'Data Protection Officer',
    enabled: true,
  },
  {
    trigger: 'Code deployment',
    threshold: 'Production',
    approver: 'Engineering Lead',
    enabled: false,
  },
];

export function EscalationRulesEditor() {
  const { currentProfile, addEscalationRule, updateEscalationRule, removeEscalationRule, setSecuritySettings } = useProfileStore();
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState<Omit<EscalationRule, 'id'>>({
    trigger: '',
    threshold: '',
    approver: '',
    enabled: true,
  });

  const rules = currentProfile.escalationRules;
  const securitySettings = currentProfile.securitySettings;

  const handleAddDefaultRules = () => {
    DEFAULT_RULES.forEach((rule) => {
      addEscalationRule({
        ...rule,
        id: crypto.randomUUID(),
      });
    });
  };

  const handleAddRule = () => {
    if (newRule.trigger && newRule.approver) {
      addEscalationRule({
        ...newRule,
        id: crypto.randomUUID(),
      });
      setNewRule({ trigger: '', threshold: '', approver: '', enabled: true });
      setIsAddingRule(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Governance & Escalation</h2>
        <p className="text-slate-600 mt-2">
          Define approval workflows and security settings for your Claude profile
        </p>
      </div>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Shield className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Security Settings</h3>
            <p className="text-sm text-slate-500">Configure data protection and compliance</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">PII Detection</p>
                <p className="text-sm text-slate-500">Automatically detect and flag personal information</p>
              </div>
            </div>
            <Switch
              checked={securitySettings.piiDetection}
              onCheckedChange={(checked) => setSecuritySettings({ piiDetection: checked })}
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Data Sensitivity Level</p>
                <p className="text-sm text-slate-500">Set the default sensitivity classification</p>
              </div>
            </div>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                <Button
                  key={level}
                  variant={securitySettings.dataSensitivityLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSecuritySettings({ dataSensitivityLevel: level })}
                  className={securitySettings.dataSensitivityLevel === level ? 'bg-amber-500' : ''}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Escalation Rules */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Escalation Rules</h3>
              <p className="text-sm text-slate-500">Define when Claude should escalate to humans</p>
            </div>
          </div>
          <div className="flex gap-2">
            {rules.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddDefaultRules}
              >
                Add Defaults
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setIsAddingRule(true)}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Rule
            </Button>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-lg border transition-all ${
                rule.enabled
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-50 border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase">Trigger</p>
                    <p className="font-medium text-slate-900">{rule.trigger}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase">Threshold</p>
                    <p className="text-slate-700">{rule.threshold || 'Any'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase">Approver</p>
                    <p className="text-slate-700">{rule.approver}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => updateEscalationRule(rule.id, { enabled: checked })}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEscalationRule(rule.id)}
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {rules.length === 0 && !isAddingRule && (
            <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">No escalation rules defined</p>
              <p className="text-sm text-slate-400 mt-1">
                Add rules to ensure proper oversight
              </p>
            </div>
          )}

          {/* Add Rule Form */}
          {isAddingRule && (
            <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
                    Trigger
                  </label>
                  <Input
                    placeholder="e.g., Budget decisions"
                    value={newRule.trigger}
                    onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
                    Threshold
                  </label>
                  <Input
                    placeholder="e.g., >$5,000"
                    value={newRule.threshold}
                    onChange={(e) => setNewRule({ ...newRule, threshold: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
                    Approver
                  </label>
                  <Input
                    placeholder="e.g., Manager"
                    value={newRule.approver}
                    onChange={(e) => setNewRule({ ...newRule, approver: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsAddingRule(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddRule}
                  disabled={!newRule.trigger || !newRule.approver}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Add Rule
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Summary */}
      <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-xl">
        <Badge variant={rules.filter(r => r.enabled).length > 0 ? 'default' : 'secondary'}>
          {rules.filter(r => r.enabled).length} active rules
        </Badge>
        <span className="text-sm text-slate-500">
          Security: <span className="font-medium text-slate-700">{securitySettings.dataSensitivityLevel}</span>
        </span>
        {securitySettings.piiDetection && (
          <Badge variant="outline" className="text-emerald-600 border-emerald-200">
            PII Detection On
          </Badge>
        )}
      </div>
    </div>
  );
}
