import React from 'react';
import { useEcosystemStore } from '../hooks/useEcosystemStore';
import { departments } from '../../../data/ecosystem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';

export function Comparison() {
  const { generatedArchitecture } = useEcosystemStore();

  // If we have a generated architecture, show a tailored comparison
  // Otherwise show a general plan comparison
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Plan Comparison & ROI Analysis</h2>
        <p className="text-muted-foreground">
          Compare features, security controls, and pricing across Claude for Work plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Free / Pro (Lightweight) */}
        <PricingCard 
          title="Team" 
          price="$30" 
          unit="/user/month"
          description="For small teams and startups scaling AI adoption."
          features={[
            "Claude 3.5 Sonnet access",
            "Project sharing & collaboration",
            "Usage limits: Higher than Free",
            "Admin console"
          ]}
          missing={[
            "SSO / SCIM",
            "DLP / Audit Logs",
            "GitHub / Jira Integrations"
          ]}
        />

        {/* Enterprise (Highlight) */}
        <PricingCard 
          title="Enterprise" 
          price="Custom" 
          unit="Volume discounts"
          isPopular
          description="For organizations requiring security, scale, and control."
          features={[
            "Everything in Team +",
            "SSO (SAML/OIDC) & SCIM",
            "Role-Based Access Control (RBAC)",
            "Audit Logs & DLP Integration",
            "GitHub / Jira Native Connectors",
            "Higher Rate Limits"
          ]}
        />

        {/* API / Bedrock (Developer) */}
        <PricingCard 
          title="API / Bedrock" 
          price="Usage" 
          unit="Per 1M tokens"
          description="For building custom internal tools and applications."
          features={[
            "Pay-as-you-go pricing",
            "Full model availability (Haiku/Sonnet/Opus)",
            "Private VPC deployment (AWS)",
            "Fine-tuning options",
            "Highest throughput"
          ]}
        />
      </div>

      {/* ROI Calculator Preview */}
      <Card className="bg-slate-50 dark:bg-slate-900 border-dashed border-2">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <span className="text-xl">💰</span>
             ROI Estimator
           </CardTitle>
           <CardDescription>Based on industry averages for {generatedArchitecture?.useCaseName || 'general knowledge work'}.</CardDescription>
         </CardHeader>
         <CardContent>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Metric</TableHead>
                 <TableHead>Team Plan</TableHead>
                 <TableHead className="font-bold text-primary">Enterprise Plan</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               <TableRow>
                 <TableCell className="font-medium">Time Saved / Employee</TableCell>
                 <TableCell>2-3 hours/week</TableCell>
                 <TableCell className="font-bold text-green-600">4-5 hours/week</TableCell>
               </TableRow>
               <TableRow>
                 <TableCell className="font-medium">Engineering Velocity</TableCell>
                 <TableCell>+15%</TableCell>
                 <TableCell className="font-bold text-green-600">+35% (Context Caching)</TableCell>
               </TableRow>
               <TableRow>
                 <TableCell className="font-medium">Risk Reduction</TableCell>
                 <TableCell>Standard</TableCell>
                 <TableCell className="font-bold text-green-600">High (DLP + SSO)</TableCell>
               </TableRow>
             </TableBody>
           </Table>
         </CardContent>
      </Card>
    </div>
  );
}

function PricingCard({ title, price, unit, description, features, missing = [], isPopular }: any) {
  return (
    <Card className={`relative flex flex-col h-full ${isPopular ? 'border-primary shadow-lg scale-105 z-10' : 'border-slate-200 dark:border-slate-800'}`}>
      {isPopular && (
        <div className="absolute top-0 inset-x-0 h-2 bg-primary rounded-t-xl" />
      )}
      <CardHeader>
        {isPopular && <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/20">Recommended</Badge>}
        <CardTitle className="text-2xl">{title}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground text-sm ml-1">{unit}</span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <ul className="space-y-3">
          {features.map((f: string, i: number) => (
            <li key={i} className="flex items-start text-sm">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">{f}</span>
            </li>
          ))}
          {missing.map((m: string, i: number) => (
            <li key={i} className="flex items-start text-sm text-slate-400">
              <XCircle className="w-5 h-5 mr-2 shrink-0" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
