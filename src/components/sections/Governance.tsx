import React, { useState } from 'react';
import { GovernanceData, DocumentResource, ComplianceCheckItem } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { ShieldAlert, AlertTriangle, Activity, CheckCircle2, FileText, Shield, Lock, Eye, ClipboardCheck, GraduationCap, Wrench, Download } from 'lucide-react';
import { complianceChecklistData, complianceDocs } from '../../data/documents/compliance-docs';
import { DocumentViewer } from '../documents/DocumentViewer';

interface GovernanceProps {
  data: GovernanceData;
}

// Category icons and labels for compliance checklist
const categoryConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  'security': { icon: Shield, label: 'Security', color: 'text-red-600 bg-red-50' },
  'data-privacy': { icon: Lock, label: 'Data Privacy', color: 'text-purple-600 bg-purple-50' },
  'access-control': { icon: Eye, label: 'Access Control', color: 'text-blue-600 bg-blue-50' },
  'audit': { icon: ClipboardCheck, label: 'Audit', color: 'text-amber-600 bg-amber-50' },
  'training': { icon: GraduationCap, label: 'Training', color: 'text-green-600 bg-green-50' },
  'technical': { icon: Wrench, label: 'Technical', color: 'text-slate-600 bg-slate-50' },
};

type CheckItemStatus = 'pending' | 'in-progress' | 'completed' | 'not-applicable';

export const Governance: React.FC<GovernanceProps> = ({ data }) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentResource | null>(null);
  const [checklistStatuses, setChecklistStatuses] = useState<Record<string, CheckItemStatus>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Toggle status of a checklist item
  const toggleItemStatus = (itemId: string) => {
    setChecklistStatuses(prev => {
      const currentStatus = prev[itemId] || 'pending';
      const statusOrder: CheckItemStatus[] = ['pending', 'in-progress', 'completed', 'not-applicable'];
      const currentIndex = statusOrder.indexOf(currentStatus);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      return { ...prev, [itemId]: nextStatus };
    });
  };

  // Get status styling
  const getStatusStyle = (status: CheckItemStatus) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500 border-emerald-500';
      case 'in-progress': return 'bg-amber-400 border-amber-400';
      case 'not-applicable': return 'bg-slate-300 border-slate-300';
      default: return 'bg-white border-slate-300';
    }
  };

  // Filter items by category
  const filteredItems = selectedCategory === 'all'
    ? complianceChecklistData.items
    : complianceChecklistData.items.filter(item => item.category === selectedCategory);

  // Calculate progress
  const completedCount = complianceChecklistData.items.filter(
    item => checklistStatuses[item.id] === 'completed'
  ).length;
  const requiredItems = complianceChecklistData.items.filter(item => item.required);
  const requiredCompleted = requiredItems.filter(
    item => checklistStatuses[item.id] === 'completed'
  ).length;

  // If viewing a document, show the viewer
  if (selectedDocument) {
    return (
      <div className="animate-in fade-in duration-300">
        <DocumentViewer
          document={selectedDocument}
          onBack={() => setSelectedDocument(null)}
          showTableOfContents={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Governance & Operations</h2>
        <p className="text-lg text-slate-600">
          Critical operational documents, risk registers, and incident response protocols.
        </p>
      </div>

      <Tabs defaultValue="playbooks" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="playbooks" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            IR Playbooks
          </TabsTrigger>
          <TabsTrigger value="sla" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            SLA & Metrics
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Register
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Staging Checklist
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Incident Response Playbooks */}
        <TabsContent value="playbooks" className="space-y-6">
          <div className="grid gap-6">
            {data.playbooks.map((playbook) => (
              <Card key={playbook.id} className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {playbook.name}
                        <Badge variant={playbook.severity === 'Critical' ? 'destructive' : 'secondary'}>
                          {playbook.severity}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2 text-base">
                        <strong>Trigger:</strong> {playbook.trigger}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l border-slate-200 ml-4 pl-8 space-y-6 py-2">
                    {playbook.steps.map((step, index) => (
                      <div key={step.id} className="relative">
                        <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 ring-4 ring-white text-xs font-bold text-slate-600">
                          {index + 1}
                        </span>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-sm font-semibold text-slate-900 leading-none">
                            {step.step}
                          </h4>
                          <p className="text-sm text-slate-600">{step.action}</p>
                          <span className="text-xs text-slate-400 font-medium bg-slate-50 w-fit px-2 py-0.5 rounded">
                            Owner: {step.owner}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* SLAs */}
        <TabsContent value="sla">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.sla.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-slate-700">{item.metric}</CardTitle>
                  <div className="text-3xl font-bold text-indigo-600">{item.target}</div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Window: {item.window}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Risk Register */}
        <TabsContent value="risk">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 font-semibold text-slate-900">Risk</th>
                    <th className="p-4 font-semibold text-slate-900">Category</th>
                    <th className="p-4 font-semibold text-slate-900">Prob.</th>
                    <th className="p-4 font-semibold text-slate-900">Impact</th>
                    <th className="p-4 font-semibold text-slate-900">Mitigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.risks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium text-slate-900">{risk.risk}</td>
                      <td className="p-4 text-slate-500">{risk.category}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={
                          risk.probability === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                          risk.probability === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-green-50 text-green-700 border-green-200'
                        }>
                          {risk.probability}
                        </Badge>
                      </td>
                      <td className="p-4">
                         <Badge variant="outline" className={
                          risk.impact === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                          risk.impact === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-green-50 text-green-700 border-green-200'
                        }>
                          {risk.impact}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs">{risk.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staging Checklist */}
        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Staging & Readiness Checklist</CardTitle>
              <CardDescription>Required checks before Phase 4 (Company-Wide Rollout)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {data.stagingChecklist.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-colors">
                  <div className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center ${item.critical ? 'border-amber-500' : 'border-slate-300'}`}>
                    {/* Simulated Checkbox */}
                    <div className="h-3 w-3 rounded-sm bg-slate-100"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{item.item}</span>
                      {item.critical && (
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-amber-100 text-amber-800 hover:bg-amber-100">
                          CRITICAL
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.category}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enterprise Compliance Checklist */}
        <TabsContent value="compliance" className="space-y-6">
          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Completed</p>
                    <p className="text-3xl font-bold text-emerald-700">{completedCount}/{complianceChecklistData.items.length}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 opacity-60" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Required Items</p>
                    <p className="text-3xl font-bold text-amber-700">{requiredCompleted}/{requiredItems.length}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-amber-500 opacity-60" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Categories</p>
                    <p className="text-3xl font-bold text-blue-700">{Object.keys(categoryConfig).length}</p>
                  </div>
                  <Shield className="h-10 w-10 text-blue-500 opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({complianceChecklistData.items.length})
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              const count = complianceChecklistData.items.filter(i => i.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedCategory === key
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {config.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Checklist Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{complianceChecklistData.name}</CardTitle>
                <CardDescription>
                  Click items to cycle through: Pending → In Progress → Completed → N/A
                </CardDescription>
              </div>
              {complianceDocs[0] && (
                <button
                  onClick={() => setSelectedDocument(complianceDocs[0])}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--int-primary)] hover:bg-[var(--int-primary-light)] rounded-lg transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  View Full Document
                </button>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredItems.map((item) => {
                const config = categoryConfig[item.category];
                const Icon = config?.icon || Shield;
                const status = checklistStatuses[item.id] || 'pending';

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItemStatus(item.id)}
                    className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all group"
                  >
                    {/* Status Checkbox */}
                    <div className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${getStatusStyle(status)}`}>
                      {status === 'completed' && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                      {status === 'in-progress' && (
                        <div className="h-2 w-2 bg-white rounded-full" />
                      )}
                      {status === 'not-applicable' && (
                        <span className="text-xs text-white font-bold">—</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium ${status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                          {item.title}
                        </span>
                        {item.required && (
                          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-red-100 text-red-800">
                            REQUIRED
                          </Badge>
                        )}
                        <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${config?.color || ''}`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {config?.label || item.category}
                        </Badge>
                      </div>
                      <p className={`text-sm mt-1 ${status === 'completed' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.description}
                      </p>
                    </div>

                    {/* Status Label */}
                    <div className="text-xs font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      {status === 'pending' && <span className="text-slate-400">Click to start</span>}
                      {status === 'in-progress' && <span className="text-amber-600">In Progress</span>}
                      {status === 'completed' && <span className="text-emerald-600">Done</span>}
                      {status === 'not-applicable' && <span className="text-slate-400">N/A</span>}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <span className="font-medium text-slate-700">Status Legend:</span>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-slate-300 bg-white" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-amber-400 bg-amber-400 flex items-center justify-center">
                <div className="h-1.5 w-1.5 bg-white rounded-full" />
              </div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-2.5 w-2.5 text-white" />
              </div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-slate-300 bg-slate-300 flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">—</span>
              </div>
              <span>Not Applicable</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
