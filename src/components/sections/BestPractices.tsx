import { useState } from 'react';
import { MessageSquare, Shield, Zap, Users, AlertTriangle, PlayCircle, BookOpen } from 'lucide-react';
import { bestPracticesData } from '../../data/best-practices';
import { tutorialsData } from '../../data/tutorials';
import { useNavigation } from '../../contexts/NavigationContext';
import { GlobalBestPracticeCategory } from '../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/Button';
import { SectionHeader } from '../common/SectionHeader';
import { InteractiveTutorial } from './InteractiveTutorial';

export function BestPractices() {
  const [activeTutorialId, setActiveTutorialId] = useState<string | null>(null);
  const { selectedRole } = useNavigation();

  const activeTutorial = activeTutorialId 
    ? tutorialsData.find(t => t.techniqueId === activeTutorialId) 
    : null;

  const filterByRole = (items: GlobalBestPracticeCategory[] | undefined) => {
    if (!items) return [];
    if (selectedRole === 'All') return items;
    return items.filter(item => 
      !item.roles || 
      item.roles.includes('All') || 
      item.roles.includes(selectedRole)
    );
  };

  const promptingPractices = filterByRole(bestPracticesData.prompting);
  const advancedTechniques = filterByRole(bestPracticesData.advanced_techniques);
  const securityPractices = filterByRole(bestPracticesData.security);
  const workflowPractices = filterByRole(bestPracticesData.workflow);
  const troubleshootingPractices = filterByRole(bestPracticesData.troubleshooting);
  const collaborationPractices = filterByRole(bestPracticesData.collaboration);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {activeTutorial && (
        <InteractiveTutorial 
          tutorial={activeTutorial} 
          onClose={() => setActiveTutorialId(null)} 
        />
      )}

      <SectionHeader 
        title="Best Practices" 
        description={`Master the art of prompting, secure your workflows, and optimize collaboration. Tailored for: ${selectedRole}`}
        icon={BookOpen}
      />

      {/* Grid Layout for Sections */}
      <div className="grid grid-cols-1 gap-12">
        
        {/* Prompting Best Practices */}
        {promptingPractices.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200">
              <div className="p-2 bg-amber-100 rounded-lg">
                 <MessageSquare className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Prompting Best Practices</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {promptingPractices.map((practice) => (
                <Card key={practice.id} className="h-full flex flex-col hover:shadow-md transition-all">
                  <div className="flex-1">
                     <h4 className="text-lg font-bold text-slate-900 mb-3">{practice.title}</h4>
                     <p className="text-slate-600 mb-4">{practice.description}</p>
                     
                     {practice.examples && practice.examples.length > 0 && (
                       <div className="space-y-3">
                         {practice.examples.map((example, index) => (
                           <div key={index} className="space-y-2 text-sm">
                             {example.bad && (
                               <div className="bg-red-50 border border-red-100 rounded-md p-3 flex gap-2 text-red-700">
                                 <span className="font-bold text-xs bg-red-200 px-1 rounded h-fit">AVOID</span>
                                 <span className="italic">"{example.bad.replace(/"/g, '')}"</span>
                               </div>
                             )}
                             {example.good && (
                               <div className="bg-emerald-50 border border-emerald-100 rounded-md p-3 flex gap-2 text-emerald-700">
                                 <span className="font-bold text-xs bg-emerald-200 px-1 rounded h-fit">TRY</span>
                                 <span className="font-medium">
                                   "{typeof example.good === 'string' ? example.good.replace(/"/g, '') : example.good}"
                                 </span>
                               </div>
                             )}
                           </div>
                         ))}
                       </div>
                     )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Advanced Techniques */}
        {advancedTechniques.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200">
              <div className="p-2 bg-indigo-100 rounded-lg">
                 <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Advanced Techniques</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {advancedTechniques.map((practice) => (
                <Card key={practice.id} className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{practice.title}</h4>
                      <p className="text-slate-600 text-sm">{practice.description}</p>
                    </div>
                    {tutorialsData.some(t => t.techniqueId === practice.id) && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setActiveTutorialId(practice.id)}
                        className="flex-shrink-0 bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Interactive Tutorial
                      </Button>
                    )}
                  </div>
                  
                  {practice.examples && practice.examples.length > 0 && (
                    <div className="space-y-3">
                      {practice.examples.map((example, index) => (
                        <div key={index} className="bg-white border border-indigo-100 rounded-lg p-4 shadow-sm">
                           <div className="flex gap-2 text-indigo-900">
                             <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                             <code className="text-sm font-mono whitespace-pre-line">{example.good}</code>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Security & Workflow Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Security */}
           {securityPractices.length > 0 && (
             <section>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                     <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Security Protocols</h3>
                </div>
                <div className="space-y-6">
                   {securityPractices.map((practice) => (
                     <Card key={practice.id} className="border-l-4 border-l-emerald-500">
                        <h4 className="font-bold text-slate-900 mb-2">{practice.title}</h4>
                        <p className="text-slate-600 text-sm mb-3">{practice.description}</p>
                        {practice.tips && (
                           <ul className="space-y-1">
                              {practice.tips.map((tip, i) => (
                                 <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                                    {tip}
                                 </li>
                              ))}
                           </ul>
                        )}
                     </Card>
                   ))}
                </div>
             </section>
           )}

           {/* Workflow */}
           {workflowPractices.length > 0 && (
             <section>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                     <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Workflow Optimization</h3>
                </div>
                <div className="space-y-6">
                   {workflowPractices.map((practice) => (
                     <Card key={practice.id} className="border-l-4 border-l-blue-500">
                        <h4 className="font-bold text-slate-900 mb-2">{practice.title}</h4>
                        <p className="text-slate-600 text-sm mb-3">{practice.description}</p>
                        {practice.approach && (
                           <div className="bg-slate-50 p-3 rounded text-sm text-slate-700">
                              <ol className="list-decimal ml-4 space-y-1">
                                 {practice.approach.map((step, i) => <li key={i}>{step}</li>)}
                              </ol>
                           </div>
                        )}
                     </Card>
                   ))}
                </div>
             </section>
           )}
        </div>

        {/* Troubleshooting & Collab */}
        {(troubleshootingPractices.length > 0 || collaborationPractices.length > 0) && (
          <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {troubleshootingPractices.length > 0 && (
                  <div>
                     <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-slate-900">Troubleshooting</h3>
                     </div>
                     <div className="space-y-4">
                        {troubleshootingPractices.map((item) => (
                           <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                              <p className="text-slate-600 text-xs">{item.description}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
                
                {collaborationPractices.length > 0 && (
                  <div>
                     <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-bold text-slate-900">Team Collaboration</h3>
                     </div>
                     <div className="space-y-4">
                        {collaborationPractices.map((item) => (
                           <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                              <p className="text-slate-600 text-xs">{item.description}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </section>
        )}

      </div>
    </div>
  );
}
