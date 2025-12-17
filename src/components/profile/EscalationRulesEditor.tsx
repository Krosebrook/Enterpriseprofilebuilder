import { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Shield, Lock, Eye } from 'lucide-react';
import { useProfileStore, EscalationRule } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { roleProfiles } from '../../data/role-profiles';

// Default escalation rules by role
const defaultRulesByRole: Record<string, Omit<EscalationRule, 'id'>[]> = {
  'Finance': [
    { trigger: 'Budget change', threshold: '>$50K', approver: 'CFO', action: 'Require approval before proceeding' },
    { trigger: 'Forecast assumption change', threshold: 'Any', approver: 'Finance Manager', action: 'Document in artifact' },
    { trigger: 'Data discrepancy', threshold: 'Any', approver: 'Analyst', action: 'Flag immediately, don\'t guess' },
  ],
  'Engineering': [
    { trigger: 'Security vulnerability', threshold: '>Medium severity', approver: 'CSO', action: 'Immediate review required' },
    { trigger: 'Production deployment', threshold: 'Any', approver: 'Tech Lead', action: 'Code review and approval' },
    { trigger: 'Architecture change', threshold: 'Any', approver: 'Principal Engineer', action: 'Design review required' },
  ],
  'Sales': [
    { trigger: 'Discount', threshold: '>15%', approver: 'Sales Director', action: 'Require approval' },
    { trigger: 'Contract terms', threshold: 'Non-standard', approver: 'Legal', action: 'Legal review required' },
    { trigger: 'Deal size', threshold: '>$100K', approver: 'VP Sales', action: 'Executive approval required' },
  ],
  'Legal': [
    { trigger: 'Legal advice', threshold: 'Any', approver: 'General Counsel', action: 'Attorney review required' },
    { trigger: 'Contract execution', threshold: 'Any', approver: 'Authorized Signatory', action: 'Signature required' },
    { trigger: 'Litigation matter', threshold: 'Any', approver: 'Outside Counsel', action: 'Escalate immediately' },
  ],
};

export function EscalationRulesEditor() {
  const { currentProfile, updateProfile, addEscalationRule, updateEscalationRule, removeEscalationRule } = useProfileStore();
  const [newRule, setNewRule] = useState<Omit<EscalationRule, 'id'>>({
    trigger: '',
    threshold: '',
    approver: '',
    action: '',
  });
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);

  const escalationRules = currentProfile.escalationRules || [];
  const securitySettings = currentProfile.securitySettings || {
    piiDetection: true,
    dataSensitivityLevel: 'medium',
    approvedDataSources: [],
    restrictedOperations: [],
  };

  // Load default rules for role
  const handleLoadDefaults = () => {
    const role = currentProfile.role || 'All';
    const defaults = defaultRulesByRole[role] || [];
    defaults.forEach(rule => addEscalationRule(rule));
  };

  const handleAddRule = () => {
    if (newRule.trigger && newRule.approver && newRule.action) {
      addEscalationRule(newRule);
      setNewRule({ trigger: '', threshold: '', approver: '', action: '' });
    }
  };

  const handleSecurityChange = (key: keyof typeof securitySettings, value: any) => {
    updateProfile({
      securitySettings: { ...securitySettings, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      {/* Escalation Rules Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-intNeutral-700">Escalation Rules</h4>
          {escalationRules.length === 0 && currentProfile.role && defaultRulesByRole[currentProfile.role] && (
            <Button variant="outline" size="sm" onClick={handleLoadDefaults}>
              Load {currentProfile.role} Defaults
            </Button>
          )}
        </div>

        {/* Existing Rules */}
        <div className="space-y-3 mb-4">
          {escalationRules.map((rule) => (
            <Card key={rule.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-xs text-intNeutral-500 block mb-1">Trigger</span>
                    <span className="text-sm font-medium text-intNeutral-900">{rule.trigger}</span>
                  </div>
                  <div>
                    <span className="text-xs text-intNeutral-500 block mb-1">Threshold</span>
                    <span className="text-sm text-intNeutral-700">{rule.threshold || 'Any'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-intNeutral-500 block mb-1">Approver</span>
                    <span className="text-sm text-intNeutral-700">{rule.approver}</span>
                  </div>
                  <div>
                    <span className="text-xs text-intNeutral-500 block mb-1">Action</span>
                    <span className="text-sm text-intNeutral-700">{rule.action}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEscalationRule(rule.id)}
                  className="text-intError-500 hover:text-intError-700 hover:bg-intError-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          {escalationRules.length === 0 && (
            <Card className="p-6 text-center text-intNeutral-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-intWarning-400" />
              <p className="text-sm">No escalation rules defined yet.</p>
              <p className="text-xs mt-1">Add rules to ensure proper governance.</p>
            </Card>
          )}
        </div>

        {/* Add New Rule */}
        <Card className="p-4 bg-intNeutral-50">
          <h5 className="text-sm font-medium text-intNeutral-700 mb-3">Add New Rule</h5>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Trigger (e.g., Budget change)"
              value={newRule.trigger}
              onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
            />
            <Input
              placeholder="Threshold (e.g., >$50K)"
              value={newRule.threshold}
              onChange={(e) => setNewRule({ ...newRule, threshold: e.target.value })}
            />
            <Input
              placeholder="Approver (e.g., CFO)"
              value={newRule.approver}
              onChange={(e) => setNewRule({ ...newRule, approver: e.target.value })}
            />
            <Input
              placeholder="Action (e.g., Require approval)"
              value={newRule.action}
              onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
            />
          </div>
          <Button
            onClick={handleAddRule}
            disabled={!newRule.trigger || !newRule.approver || !newRule.action}
            className="mt-3"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </Card>
      </div>

      {/* Security Settings Section */}
      <div>
        <button
          onClick={() => setShowSecuritySettings(!showSecuritySettings)}
          className="flex items-center gap-2 text-sm font-medium text-intNeutral-700 mb-4 hover:text-intPrimary-600"
        >
          <Shield className="w-4 h-4" />
          Security Settings
          <Badge variant="neutral">{showSecuritySettings ? 'Hide' : 'Show'}</Badge>
        </button>

        {showSecuritySettings && (
          <Card className="p-4 space-y-4">
            {/* PII Detection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-intNeutral-500" />
                <div>
                  <span className="text-sm font-medium text-intNeutral-900">PII Detection</span>
                  <p className="text-xs text-intNeutral-500">Automatically detect and flag personal information</p>
                </div>
              </div>
              <Switch
                checked={securitySettings.piiDetection}
                onCheckedChange={(checked) => handleSecurityChange('piiDetection', checked)}
              />
            </div>

            {/* Data Sensitivity Level */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-intNeutral-500" />
                <span className="text-sm font-medium text-intNeutral-900">Data Sensitivity Level</span>
              </div>
              <div className="flex gap-2">
                {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={securitySettings.dataSensitivityLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSecurityChange('dataSensitivityLevel', level)}
                    className={
                      securitySettings.dataSensitivityLevel === level
                        ? level === 'critical' ? 'bg-intError-500' : level === 'high' ? 'bg-intWarning-500' : ''
                        : ''
                    }
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Warning for high/critical */}
            {(securitySettings.dataSensitivityLevel === 'high' || securitySettings.dataSensitivityLevel === 'critical') && (
              <Card className="p-3 bg-intWarning-50 border-intWarning-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-intWarning-500 mt-0.5" />
                  <div className="text-sm text-intWarning-700">
                    <strong>{securitySettings.dataSensitivityLevel.charAt(0).toUpperCase() + securitySettings.dataSensitivityLevel.slice(1)} sensitivity</strong> selected.
                    Additional restrictions will apply to data handling and storage.
                  </div>
                </div>
              </Card>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
