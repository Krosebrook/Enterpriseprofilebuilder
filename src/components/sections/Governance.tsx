import React from 'react';
import { GovernanceData } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { ShieldAlert, AlertTriangle, Activity, CheckCircle2, FileText } from 'lucide-react';

interface GovernanceProps {
  data: GovernanceData;
}

export const Governance: React.FC<GovernanceProps> = ({ data }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Governance & Operations</h2>
        <p className="text-lg text-slate-600">
          Critical operational documents, risk registers, and incident response protocols.
        </p>
      </div>

      <Tabs defaultValue="playbooks" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
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
      </Tabs>
    </div>
  );
};
