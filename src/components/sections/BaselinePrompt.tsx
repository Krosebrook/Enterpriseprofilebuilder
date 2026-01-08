import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, DollarSign, Lock, Sparkles, Terminal, ArrowRight } from 'lucide-react';
import { baselineOptionsData } from '../../data/baseline-options';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/Button';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../ui/card';

export function BaselinePrompt() {
  const { selectedRole } = useNavigation();
  const [selectedBaselineId, setSelectedBaselineId] = useState(baselineOptionsData[0].id);

  // Auto-select baseline based on role
  useEffect(() => {
    const recommended = baselineOptionsData.find(b => b.roles?.includes(selectedRole));
    if (recommended && recommended.id !== selectedBaselineId) {
      setSelectedBaselineId(recommended.id);
    }
  }, [selectedRole]);

  const selectedBaseline = baselineOptionsData.find(b => b.id === selectedBaselineId) || baselineOptionsData[0];

  const iconMap: Record<string, any> = {
    'Shield': Shield,
    'AlertTriangle': AlertTriangle,
    'CheckCircle': CheckCircle,
    'DollarSign': DollarSign,
    'Lock': Lock,
    'Sparkles': Sparkles
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="System Baseline Prompts"
        description="Core security directives and behavioral configurations for Claude Enterprise. These prompts define the foundational logic that governs every interaction."
        icon={Terminal}
        action={
           <div className="flex gap-2">
             {baselineOptionsData.map((option) => (
               <Button
                 key={option.id}
                 variant={selectedBaselineId === option.id ? 'primary' : 'outline'}
                 size="sm"
                 onClick={() => setSelectedBaselineId(option.id)}
               >
                 {option.name}
               </Button>
             ))}
           </div>
        }
      />

      {/* Code Block / Prompt Display */}
      <Card className="bg-slate-900 border-slate-800 text-slate-300 shadow-2xl overflow-hidden">
        <div className="border-b border-slate-800 bg-slate-950/50 p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-amber-500" />
              <span className="text-slate-100 font-mono font-bold text-sm">
                 SYSTEM_PROMPT_V{selectedBaseline.version}
              </span>
           </div>
           <div className="text-xs text-slate-500 font-mono">
              Effective: {selectedBaseline.date}
           </div>
        </div>
        
        <div className="p-6 font-mono text-sm leading-relaxed space-y-6">
           <div>
              <div className="text-amber-500 mb-2 uppercase tracking-wider text-xs font-bold">/// CORE DIRECTIVE</div>
              <p className="text-slate-300">{selectedBaseline.sections.coreDirective}</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <div className="text-blue-400 mb-2 uppercase tracking-wider text-xs font-bold">/// IDENTITY PARAMETERS</div>
                 <ul className="space-y-1">
                   {selectedBaseline.sections.identity.map((item, i) => (
                     <li key={i} className="flex items-start gap-2">
                       <span className="text-slate-600">›</span> {item}
                     </li>
                   ))}
                 </ul>
              </div>
              <div>
                 <div className="text-emerald-400 mb-2 uppercase tracking-wider text-xs font-bold">/// ALLOWED CAPABILITIES</div>
                 <ul className="space-y-1">
                   {selectedBaseline.sections.allowed.map((item, i) => (
                     <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600">✓</span> {item}
                     </li>
                   ))}
                 </ul>
              </div>
           </div>
           
           <div>
              <div className="text-red-400 mb-2 uppercase tracking-wider text-xs font-bold">/// RESTRICTED ACTIONS</div>
              <ul className="space-y-1">
                {selectedBaseline.sections.notAllowed.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-red-200/80">
                    <span className="text-red-500">✗</span> {item}
                  </li>
                ))}
              </ul>
           </div>
        </div>
      </Card>

      {/* Security Behaviors */}
      <div className="space-y-6">
         <h3 className="text-xl font-bold text-slate-900">Security Behavior Protocols</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedBaseline.sections.securityBehaviors.map((behavior, i) => {
               const Icon = iconMap[behavior.icon] || Shield;
               const colorStyles = behavior.color === 'red' ? 'bg-red-50 text-red-700 border-red-200' :
                                 behavior.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                 behavior.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                 'bg-slate-50 text-slate-700 border-slate-200';
               const iconColor = behavior.color === 'red' ? 'text-red-600' :
                                 behavior.color === 'orange' ? 'text-orange-600' :
                                 behavior.color === 'blue' ? 'text-blue-600' : 'text-slate-600';
               
               return (
                  <div key={i} className={`p-6 rounded-xl border ${colorStyles.split(' ')[2]} ${colorStyles.split(' ')[0]}`}>
                     <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 bg-white rounded-lg shadow-sm ${iconColor}`}>
                           <Icon className="w-6 h-6" />
                        </div>
                        <h4 className={`font-bold ${colorStyles.split(' ')[1]}`}>{behavior.title}</h4>
                     </div>
                     <ul className="space-y-2 mb-4">
                        {behavior.rules.map((rule, j) => (
                           <li key={j} className="text-sm flex items-start gap-2 opacity-90">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                              {rule}
                           </li>
                        ))}
                     </ul>
                     {behavior.example && (
                        <div className="text-xs bg-white/60 p-3 rounded border border-black/5 italic opacity-80">
                           "{behavior.example}"
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
      
      {/* Escalation Matrix */}
      <Card>
         <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Escalation Matrix</h3>
            <div className="overflow-hidden rounded-lg border border-slate-200">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-xs">
                     <tr>
                        <th className="px-6 py-4">Trigger Event</th>
                        <th className="px-6 py-4">Required Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                     {selectedBaseline.sections.escalationTriggers.map((trigger, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                           <td className="px-6 py-4 font-medium text-slate-900">{trigger.trigger}</td>
                           <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                              {trigger.action}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </Card>
      
      {/* Footer Info */}
      <div className="flex items-center justify-between text-sm text-slate-500 pt-8 border-t border-slate-200">
         <p>Communication Standards: {selectedBaseline.sections.communicationStandards.join(', ')}</p>
         <p>ID: {selectedBaseline.id}</p>
      </div>
    </div>
  );
}
