import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { CheckCircle2, ArrowRight, RefreshCw, Smartphone, Laptop, Cloud } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';

interface WizardState {
  role: string;
  department: string;
  primaryGoal: string;
  dataSensitivity: string;
}

const INITIAL_STATE: WizardState = {
  role: '',
  department: '',
  primaryGoal: '',
  dataSensitivity: 'standard'
};

export function SetupWizard({ onReset }: { onReset: () => void }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);

  const handleSelection = (key: keyof WizardState, value: string) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  const reset = () => {
    setState(INITIAL_STATE);
    setStep(1);
    onReset();
  };

  const getRecommendation = () => {
    // Basic Logic Engine
    const isDev = state.role === 'developer' || state.department === 'engineering';
    const isExec = state.role === 'executive';
    const isSecure = state.dataSensitivity === 'regulated';
    const needsMobility = state.role === 'field_sales';

    return {
      platform: isDev ? 'Claude Desktop' : needsMobility ? 'Claude Mobile' : 'Claude Web',
      model: isExec || state.primaryGoal === 'reasoning' ? 'Opus 4.5' : isDev ? 'Sonnet 4.5' : 'Haiku 4.5',
      features: [
        isDev ? 'MCP Servers (GitHub, Linear)' : 'Projects',
        state.primaryGoal === 'coding' ? 'Claude Code' : 'Artifacts',
        isSecure ? 'VPC Deployment' : 'Standard API'
      ],
      plan: isSecure ? 'Enterprise (AWS Bedrock)' : 'Team Plan'
    };
  };

  const rec = getRecommendation();

  if (step === 4) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Your Recommended Setup</CardTitle>
            <CardDescription>Based on your profile as a {state.role} in {state.department}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold uppercase text-gray-500 mb-2">Primary Platform</h4>
                  <div className="flex items-center gap-3">
                    {rec.platform.includes('Desktop') ? <Laptop className="w-6 h-6 text-purple-500"/> : 
                     rec.platform.includes('Mobile') ? <Smartphone className="w-6 h-6 text-green-500"/> : 
                     <Cloud className="w-6 h-6 text-blue-500"/>}
                    <span className="text-xl font-bold">{rec.platform}</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold uppercase text-gray-500 mb-2">Recommended Model</h4>
                  <div className="text-xl font-bold text-primary">{rec.model}</div>
                  <p className="text-sm text-gray-500 mt-1">Optimized for {state.primaryGoal}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg h-full">
                  <h4 className="text-sm font-semibold uppercase text-gray-500 mb-3">Essential Features</h4>
                  <div className="space-y-2">
                    {rec.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                     <h4 className="text-sm font-semibold uppercase text-gray-500 mb-2">Plan</h4>
                     <Badge variant="outline" className="text-base py-1 px-3 border-primary text-primary">{rec.plan}</Badge>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Button onClick={reset} variant="outline" className="mr-4">
              <RefreshCw className="mr-2 h-4 w-4" /> Start Over
            </Button>
            <Button className="bg-primary hover:bg-primary-hover text-white">
              View Deployment Guide
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Step {step} of 3</CardTitle>
          <CardDescription>
            {step === 1 && "Tell us about your role"}
            {step === 2 && "What are your primary goals?"}
            {step === 3 && "Security & Compliance Requirements"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Role</Label>
                <RadioGroup value={state.role} onValueChange={(v) => handleSelection('role', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="executive" id="r1" />
                    <Label htmlFor="r1">Executive / Strategy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="developer" id="r2" />
                    <Label htmlFor="r2">Developer / Engineer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manager" id="r3" />
                    <Label htmlFor="r3">Product / Project Manager</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="field_sales" id="r4" />
                    <Label htmlFor="r4">Sales / Field</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                 <Label>Department</Label>
                 <RadioGroup value={state.department} onValueChange={(v) => handleSelection('department', v)}>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="engineering" id="d1" />
                     <Label htmlFor="d1">Engineering & IT</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="marketing" id="d2" />
                     <Label htmlFor="d2">Marketing & Sales</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="ops" id="d3" />
                     <Label htmlFor="d3">Operations & HR</Label>
                   </div>
                 </RadioGroup>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-3">
                <Label>What is your primary use case?</Label>
                <RadioGroup value={state.primaryGoal} onValueChange={(v) => handleSelection('primaryGoal', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reasoning" id="g1" />
                    <Label htmlFor="g1">Complex Reasoning & Strategy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coding" id="g2" />
                    <Label htmlFor="g2">Coding & Architecture</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="docs" id="g3" />
                    <Label htmlFor="g3">Documentation & Writing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analysis" id="g4" />
                    <Label htmlFor="g4">Data Analysis & Research</Label>
                  </div>
                </RadioGroup>
             </div>
          )}

          {step === 3 && (
             <div className="space-y-3">
                <Label>Data Sensitivity Level</Label>
                <RadioGroup value={state.dataSensitivity} onValueChange={(v) => handleSelection('dataSensitivity', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="s1" />
                    <Label htmlFor="s1">Standard (Internal Business Data)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regulated" id="s2" />
                    <Label htmlFor="s2">Regulated (HIPAA/GDPR/PII) - Requires Zero Data Retention</Label>
                  </div>
                </RadioGroup>
             </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={prevStep} disabled={step === 1}>Back</Button>
          <Button onClick={nextStep} disabled={
            (step === 1 && (!state.role || !state.department)) ||
            (step === 2 && !state.primaryGoal) ||
            (step === 3 && !state.dataSensitivity)
          }>
            {step === 3 ? 'Generate Setup' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
