import React from 'react';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export function TroubleshootingGuide() {
  const issues = [
    {
      category: "Web Platform",
      items: [
        { issue: "Artifacts not rendering", cause: "Browser compatibility", fix: "Use Chrome/Edge/Firefox latest" },
        { issue: "File upload fails", cause: "Size >10MB or format", fix: "Compress file or convert format" },
        { issue: "Conversation load fail", cause: "Network/Timeout", fix: "Clear cache, check connection" }
      ]
    },
    {
      category: "Desktop & MCP",
      items: [
        { issue: "MCP server connect fail", cause: "Invalid JSON/Config", fix: "Validate JSON, check credentials" },
        { issue: "Computer use timeout", cause: "Permissions/Path", fix: "Check chmod +x, use absolute paths" },
        { issue: "Slow responses", cause: "Context >100K tokens", fix: "Start new chat, summarize context" }
      ]
    },
    {
      category: "Mobile",
      items: [
        { issue: "Camera upload fail", cause: "Permissions denied", fix: "Enable Camera in OS Settings" },
        { issue: "No push notifications", cause: "Background refresh off", fix: "Enable Background App Refresh" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
        <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Quick Support Channels</h4>
          <ul className="text-sm text-amber-800 mt-1 space-y-1">
            <li>• Status Page: <a href="https://status.anthropic.com" target="_blank" rel="noreferrer" className="underline hover:text-amber-900">status.anthropic.com</a></li>
            <li>• Internal Slack: #claude-support</li>
            <li>• Urgent Issues: Contact Incident Response Team via PagerDuty</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {issues.map((section) => (
          <Card key={section.category}>
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-400" />
              {section.category}
            </h4>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-800 text-sm mb-1">{item.issue}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="text-slate-500"><span className="font-bold">Cause:</span> {item.cause}</div>
                    <div className="text-emerald-600"><span className="font-bold">Fix:</span> {item.fix}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
