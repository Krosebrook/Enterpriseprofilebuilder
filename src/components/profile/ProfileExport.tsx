import { useState } from 'react';
import { Download, Copy, Check, FileJson, FileText, Eye, AlertTriangle, Save } from 'lucide-react';
import { useProfileStore, ClaudeProfile } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function ProfileExport() {
  const { currentProfile, saveProfile, savedProfiles } = useProfileStore();
  const [profileName, setProfileName] = useState(currentProfile.name || '');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'yaml'>('json');

  const generateExportData = () => {
    const exportProfile = {
      name: profileName || `Claude Profile - ${currentProfile.role}`,
      version: 1,
      createdAt: new Date().toISOString(),
      role: currentProfile.role,
      responsibilities: currentProfile.responsibilities,
      capabilities: currentProfile.capabilities,
      features: {
        enabled: currentProfile.enabledFeatures,
        disabled: currentProfile.disabledFeatures,
      },
      tools: currentProfile.connectedTools?.filter(t => t.connected).map(t => t.name),
      mcpServers: currentProfile.selectedMcpServers,
      governance: {
        escalationRules: currentProfile.escalationRules,
        security: currentProfile.securitySettings,
      },
      persona: {
        baselineId: currentProfile.baselineId,
        securityLevel: currentProfile.securityLevel,
        customInstructions: currentProfile.customInstructions,
      },
      workflows: currentProfile.customWorkflows,
    };

    return exportFormat === 'json'
      ? JSON.stringify(exportProfile, null, 2)
      : toYaml(exportProfile);
  };

  // Simple YAML conversion
  const toYaml = (obj: any, indent = 0): string => {
    const spaces = '  '.repeat(indent);
    let yaml = '';

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue;

      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach((item) => {
          if (typeof item === 'object') {
            yaml += `${spaces}  -\n${toYaml(item, indent + 2)}`;
          } else {
            yaml += `${spaces}  - ${item}\n`;
          }
        });
      } else if (typeof value === 'object') {
        yaml += `${spaces}${key}:\n${toYaml(value, indent + 1)}`;
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }

    return yaml;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateExportData());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const data = generateExportData();
    const blob = new Blob([data], { type: exportFormat === 'json' ? 'application/json' : 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claude-profile-${profileName || 'export'}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (profileName) {
      const profile = saveProfile();
      alert(`Profile "${profile.name}" saved successfully!`);
    }
  };

  // Validation warnings
  const warnings: string[] = [];
  if (!currentProfile.role || currentProfile.role === 'All') warnings.push('No specific role selected');
  if (!currentProfile.escalationRules?.length) warnings.push('No escalation rules defined');
  if (!currentProfile.connectedTools?.filter(t => t.connected).length) warnings.push('No tools connected');

  return (
    <div className="space-y-6">
      {/* Profile Name */}
      <div>
        <h4 className="text-sm font-medium text-intNeutral-700 mb-3">Profile Name</h4>
        <Input
          placeholder="Enter a name for this profile"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
      </div>

      {/* Profile Summary */}
      <Card className="p-4">
        <h4 className="font-medium text-intNeutral-900 mb-3">Profile Summary</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-intNeutral-500 block">Role</span>
            <span className="text-sm font-medium text-intNeutral-900">{currentProfile.role || 'Not selected'}</span>
          </div>
          <div>
            <span className="text-xs text-intNeutral-500 block">Security Level</span>
            <Badge
              variant={
                currentProfile.securityLevel === 'strict' ? 'error' :
                currentProfile.securityLevel === 'permissive' ? 'warning' : 'success'
              }
            >
              {currentProfile.securityLevel || 'balanced'}
            </Badge>
          </div>
          <div>
            <span className="text-xs text-intNeutral-500 block">Features Enabled</span>
            <span className="text-sm text-intNeutral-700">{currentProfile.enabledFeatures?.length || 0} features</span>
          </div>
          <div>
            <span className="text-xs text-intNeutral-500 block">Tools Connected</span>
            <span className="text-sm text-intNeutral-700">{currentProfile.connectedTools?.filter(t => t.connected).length || 0} tools</span>
          </div>
          <div>
            <span className="text-xs text-intNeutral-500 block">Escalation Rules</span>
            <span className="text-sm text-intNeutral-700">{currentProfile.escalationRules?.length || 0} rules</span>
          </div>
          <div>
            <span className="text-xs text-intNeutral-500 block">Custom Workflows</span>
            <span className="text-sm text-intNeutral-700">{currentProfile.customWorkflows?.length || 0} workflows</span>
          </div>
        </div>
      </Card>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card className="p-4 bg-intWarning-50 border-intWarning-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-intWarning-500 mt-0.5" />
            <div>
              <h5 className="font-medium text-intWarning-900">Incomplete Configuration</h5>
              <ul className="mt-1 text-sm text-intWarning-700 list-disc list-inside">
                {warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Export Format */}
      <div>
        <h4 className="text-sm font-medium text-intNeutral-700 mb-3">Export Format</h4>
        <div className="flex gap-2">
          <Button
            variant={exportFormat === 'json' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setExportFormat('json')}
          >
            <FileJson className="w-4 h-4 mr-2" />
            JSON
          </Button>
          <Button
            variant={exportFormat === 'yaml' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setExportFormat('yaml')}
          >
            <FileText className="w-4 h-4 mr-2" />
            YAML
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="mb-3"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Hide' : 'Show'} Preview
        </Button>

        {showPreview && (
          <Card className="p-4 bg-intNeutral-900 overflow-auto max-h-64">
            <pre className="text-xs text-intNeutral-100 font-mono whitespace-pre-wrap">
              {generateExportData()}
            </pre>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={!profileName}>
          <Save className="w-4 h-4 mr-2" />
          Save Profile
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download {exportFormat.toUpperCase()}
        </Button>
      </div>

      {/* Saved Profiles */}
      {savedProfiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-intNeutral-700 mb-3">Saved Profiles</h4>
          <div className="space-y-2">
            {savedProfiles.map((profile) => (
              <Card key={profile.id} className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-intNeutral-900">{profile.name}</span>
                  <span className="text-xs text-intNeutral-500 ml-2">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Badge variant="neutral">{profile.role}</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
