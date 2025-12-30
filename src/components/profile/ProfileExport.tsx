import { useState } from 'react';
import { Download, Copy, Check, FileJson, FileText, Eye, AlertTriangle, Save, Trash2 } from 'lucide-react';
import { useProfileStore } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function ProfileExport() {
  const {
    currentProfile,
    savedProfiles,
    saveProfile,
    loadProfile,
    deleteProfile,
    resetCurrentProfile,
    exportProfileAsJSON,
    exportProfileAsYAML,
    completeWizard,
  } = useProfileStore();

  const [profileName, setProfileName] = useState(currentProfile.name);
  const [exportFormat, setExportFormat] = useState<'json' | 'yaml'>('json');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = () => {
    const content = exportFormat === 'json' ? exportProfileAsJSON() : exportProfileAsYAML();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = exportFormat === 'json' ? exportProfileAsJSON() : exportProfileAsYAML();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claude-profile-${profileName.toLowerCase().replace(/\s+/g, '-')}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    saveProfile(profileName);
    completeWizard();
  };

  const getProfileCompleteness = () => {
    let score = 0;
    if (currentProfile.role) score += 20;
    if (currentProfile.enabledFeatures.length > 0) score += 20;
    if (currentProfile.connectedTools.some(t => t.connected)) score += 20;
    if (currentProfile.escalationRules.length > 0) score += 20;
    if (currentProfile.baselinePrompt) score += 20;
    return score;
  };

  const completeness = getProfileCompleteness();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Export & Save Profile</h2>
        <p className="text-slate-600 mt-2">
          Review, save, and export your Claude enterprise profile
        </p>
      </div>

      {/* Completeness Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Profile Completeness</h3>
          <Badge
            variant={completeness === 100 ? 'default' : completeness >= 60 ? 'secondary' : 'destructive'}
            className={completeness === 100 ? 'bg-emerald-500' : ''}
          >
            {completeness}%
          </Badge>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              completeness === 100 ? 'bg-emerald-500' : completeness >= 60 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${completeness}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
          <div className={currentProfile.role ? 'text-emerald-600' : 'text-slate-400'}>
            {currentProfile.role ? <Check className="w-4 h-4 mx-auto" /> : '○'} Role
          </div>
          <div className={currentProfile.enabledFeatures.length > 0 ? 'text-emerald-600' : 'text-slate-400'}>
            {currentProfile.enabledFeatures.length > 0 ? <Check className="w-4 h-4 mx-auto" /> : '○'} Features
          </div>
          <div className={currentProfile.connectedTools.some(t => t.connected) ? 'text-emerald-600' : 'text-slate-400'}>
            {currentProfile.connectedTools.some(t => t.connected) ? <Check className="w-4 h-4 mx-auto" /> : '○'} Tools
          </div>
          <div className={currentProfile.escalationRules.length > 0 ? 'text-emerald-600' : 'text-slate-400'}>
            {currentProfile.escalationRules.length > 0 ? <Check className="w-4 h-4 mx-auto" /> : '○'} Rules
          </div>
          <div className={currentProfile.baselinePrompt ? 'text-emerald-600' : 'text-slate-400'}>
            {currentProfile.baselinePrompt ? <Check className="w-4 h-4 mx-auto" /> : '○'} Prompt
          </div>
        </div>
      </Card>

      {/* Profile Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Profile Summary</h3>
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-1" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase font-medium">Role</p>
            <p className="font-semibold text-slate-900 truncate">{currentProfile.role || 'Not set'}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase font-medium">Features</p>
            <p className="font-semibold text-slate-900">{currentProfile.enabledFeatures.length} enabled</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase font-medium">Tools</p>
            <p className="font-semibold text-slate-900">
              {currentProfile.connectedTools.filter(t => t.connected).length} connected
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase font-medium">Security</p>
            <p className="font-semibold text-slate-900 capitalize">{currentProfile.securityLevel}</p>
          </div>
        </div>

        {showPreview && (
          <div className="mt-4 p-4 bg-slate-900 rounded-lg overflow-auto max-h-80">
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
              {exportFormat === 'json' ? exportProfileAsJSON() : exportProfileAsYAML()}
            </pre>
          </div>
        )}
      </Card>

      {/* Save Profile */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Profile
        </h3>

        <div className="flex gap-4">
          <Input
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Profile name"
            className="flex-1"
          />
          <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>

        {completeness < 100 && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
            <p className="text-sm text-amber-700">
              Your profile is {completeness}% complete. Consider filling in all sections for best results.
            </p>
          </div>
        )}
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Profile
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-slate-600">Format:</span>
          <div className="flex gap-2">
            <Button
              variant={exportFormat === 'json' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setExportFormat('json')}
              className={exportFormat === 'json' ? 'bg-amber-500' : ''}
            >
              <FileJson className="w-4 h-4 mr-1" />
              JSON
            </Button>
            <Button
              variant={exportFormat === 'yaml' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setExportFormat('yaml')}
              className={exportFormat === 'yaml' ? 'bg-amber-500' : ''}
            >
              <FileText className="w-4 h-4 mr-1" />
              YAML
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopy} className="flex-1">
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
          <Button onClick={handleDownload} className="flex-1 bg-amber-500 hover:bg-amber-600">
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </Card>

      {/* Saved Profiles */}
      {savedProfiles.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Saved Profiles</h3>

          <div className="space-y-2">
            {savedProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div>
                  <p className="font-medium text-slate-900">{profile.name}</p>
                  <p className="text-xs text-slate-500">
                    {profile.role} | Updated: {new Date(profile.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => loadProfile(profile.id)}>
                    Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProfile(profile.id)}
                    className="text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reset */}
      <div className="text-center">
        <Button variant="ghost" onClick={resetCurrentProfile} className="text-slate-500">
          Reset and Start Over
        </Button>
      </div>
    </div>
  );
}
