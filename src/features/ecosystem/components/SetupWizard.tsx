import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowRight, CheckCircle2, RefreshCw, Briefcase, Building, Target, Zap, Loader2 } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { departments, useCases, platforms, models, plans } from '../../../data/ecosystem';
import { useEcosystemStore } from '../hooks/useEcosystemStore';

interface WizardState {
  role: string | null;
  departmentId: string | null;
  useCaseId: string | null;
}

const INITIAL_STATE: WizardState = {
  role: null,
  departmentId: null,
  useCaseId: null
};

export function SetupWizard({ onReset }: { onReset: () => void }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const { setArchitecture } = useEcosystemStore();

  const handleSelection = (key: keyof WizardState, value: string) => {
    setState(prev => ({ ...prev, [key]: value }));
    // Auto-advance
    setTimeout(() => setStep(s => s + 1), 300);
  };

  const reset = () => {
    setState(INITIAL_STATE);
    setStep(1);
    onReset();
  };

  const getRecommendation = () => {
    if (!state.departmentId || !state.useCaseId) return null;

    const dept = departments.find(d => d.id === state.departmentId);
    const useCase = useCases.find(u => u.id === state.useCaseId);
    
    if (!dept || !useCase) return null;

    const platform = platforms.find(p => p.id === dept.recommendedPlatform);
    const model = models.find(m => m.id === dept.recommendedModel);
    const plan = plans.find(p => p.id === dept.plan);

    return {
      platform: platform?.name || 'Claude Web',
      platformIcon: platform?.iconChar || '🌐',
      model: model?.name || 'Claude Sonnet',
      features: dept.features,
      plan: plan?.name || 'Team',
      roi: dept.roi,
      useCaseName: useCase.name
    };
  };

  const rec = getRecommendation();

  // If recommendation is ready, set it in the global store for other components to access
  React.useEffect(() => {
    if (rec) {
      setArchitecture(rec);
    }
  }, [rec, setArchitecture]);

  if (step === 4 && rec) {
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-t-4 border-t-primary shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 text-center border-b">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-3xl">
              ✨
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Recommended Stack</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Optimized for {state.role} in {departments.find(d => d.id === state.departmentId)?.name}
            </p>
          </div>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="text-3xl">{rec.platformIcon}</div>
                    <div>
                      <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">Platform</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{rec.platform}</div>
                    </div>
                 </div>

                 <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                    <div className="text-3xl">🤖</div>
                    <div>
                      <div className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">Model</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{rec.model}</div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 h-full">
                  <div className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-4">Key Features</div>
                  <div className="space-y-3">
                    {rec.features.map(f => (
                      <div key={f} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="font-medium capitalize">{f.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-sm text-gray-500">Recommended Plan</span>
                       <Badge variant="outline" className="border-primary text-primary">{rec.plan}</Badge>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-500">Est. ROI</span>
                       <span className="font-bold text-green-600 dark:text-green-400">{rec.roi}</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 dark:bg-gray-900/30 p-6 flex justify-center gap-4">
            <Button onClick={reset} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Start Over
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white min-w-[200px]">
              Deploy This Stack <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="flex justify-center items-center mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded transition-all duration-500" 
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-0 mx-auto bg-white border-2 transition-all duration-300 ${
              s === step ? 'border-primary text-primary scale-110 shadow-lg' : 
              s < step ? 'bg-primary border-primary text-white' : 
              'border-gray-300 text-gray-400'
            }`}
            style={{ left: `${((s - 1) / 3) * 100}%` }} // Simplified positioning for now
          >
            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
        ))}
        {/* Helper to space the dots */}
        <div className="w-full flex justify-between absolute px-2">
           {/* Just visual spacing hack since grid logic is complex */}
        </div>
      </div>
      
      <div className="flex justify-between w-full max-w-[calc(100%-20px)] mx-auto mb-10 -mt-8 text-xs font-medium text-gray-500 uppercase tracking-wide">
        <span>Role</span>
        <span>Department</span>
        <span>Goal</span>
        <span>Results</span>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">What's your role?</h2>
                <p className="text-gray-500">Help us tailor the experience to your needs.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'executive', label: 'Executive', desc: 'C-suite, VP, Director', icon: '👔' },
                  { id: 'it-security', label: 'IT/Security', desc: 'Infrastructure, Security', icon: '🔒' },
                  { id: 'developer', label: 'Developer', desc: 'Engineer, Architect', icon: '👨‍💻' },
                  { id: 'end-user', label: 'End User', desc: 'Sales, Marketing, Ops', icon: '👥' }
                ].map((opt) => (
                  <OptionCard 
                    key={opt.id}
                    icon={opt.icon}
                    label={opt.label}
                    desc={opt.desc}
                    selected={state.role === opt.id}
                    onClick={() => handleSelection('role', opt.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-bold">Which department?</h2>
                 <p className="text-gray-500">We'll identify relevant features and compliance needs.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div 
                    key={dept.id}
                    className={`p-6 bg-white dark:bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                      state.departmentId === dept.id ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                    onClick={() => handleSelection('departmentId', dept.id)}
                  >
                    <div className="font-bold text-lg mb-1">{dept.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{dept.roi}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                 <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-bold">What's your main goal?</h2>
                 <p className="text-gray-500">Select the primary use case for your workflows.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {useCases.map((uc) => (
                    <OptionCard 
                      key={uc.id}
                      icon={uc.iconChar}
                      label={uc.name}
                      desc={uc.examples.slice(0, 2).join(', ')}
                      selected={state.useCaseId === uc.id}
                      onClick={() => handleSelection('useCaseId', uc.id)}
                    />
                 ))}
              </div>
              <div className="flex justify-center">
                 <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OptionCard({ icon, label, desc, selected, onClick }: { icon: string, label: string, desc: string, selected: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3
        hover:shadow-lg hover:-translate-y-1
        ${selected 
          ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50'
        }
      `}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="font-bold text-gray-900 dark:text-gray-100">{label}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
    </div>
  );
}
