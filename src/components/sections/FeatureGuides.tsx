import { Search, Brain, FileText, Code, Upload, Eye, Mic, FolderKanban, Users, Webhook, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { featuresData } from '../../data/features';
import { FeatureType } from '../../types';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';

export function FeatureGuides() {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('web-search');

  const iconMap: Record<string, any> = {
    'web-search': Search,
    'memory': Brain,
    'artifacts': FileText,
    'code-execution': Code,
    'files': Upload,
    'vision': Eye,
    'voice-mode': Mic,
    'projects': FolderKanban,
    'team-collaboration': Users,
    'api-integration': Webhook
  };

  const activeFeatureData = featuresData.find(f => f.id === activeFeature);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="Feature Guides"
        description="Comprehensive documentation for Claude Enterprise capabilities. Learn when to use each feature, best practices, and limitations."
        icon={Sparkles}
      />

      {/* Feature Tabs */}
      <div className="flex flex-wrap gap-3 pb-4 border-b border-slate-200">
        {featuresData.map((feature) => {
          const Icon = iconMap[feature.id];
          const isActive = activeFeature === feature.id;
          
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{feature.name}</span>
            </button>
          );
        })}
      </div>

      {/* Feature Content */}
      {activeFeatureData && (
        <div className="grid grid-cols-1 gap-8">
           {/* Header Card */}
           <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{activeFeatureData.name}</h3>
              <p className="text-slate-600 text-lg leading-relaxed">{activeFeatureData.description}</p>
           </div>

           {/* Usage Guidelines */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                 <h4 className="flex items-center gap-2 font-bold text-emerald-900 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 text-xs">✓</span>
                    When to Use
                 </h4>
                 <ul className="space-y-2">
                    {activeFeatureData.whenToUse.map((item, i) => (
                       <li key={i} className="flex items-start gap-2 text-emerald-800 text-sm">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                          {item}
                       </li>
                    ))}
                 </ul>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
                 <h4 className="flex items-center gap-2 font-bold text-rose-900 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-200 text-rose-700 text-xs">✗</span>
                    When NOT to Use
                 </h4>
                 <ul className="space-y-2">
                    {activeFeatureData.whenNotToUse.map((item, i) => (
                       <li key={i} className="flex items-start gap-2 text-rose-800 text-sm">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                          {item}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>

           {/* Best Practices & Examples Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Best Practices */}
              <div className="lg:col-span-2 space-y-6">
                 <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Best Practices
                 </h3>
                 <div className="space-y-4">
                    {activeFeatureData.bestPractices.map((practice) => (
                       <Card key={practice.id} className="hover:border-amber-200 transition-colors">
                          <h5 className="font-bold text-slate-800 mb-2">{practice.title}</h5>
                          <p className="text-slate-600 text-sm mb-4">{practice.description}</p>
                          
                          {practice.examples && (
                             <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-2 border border-slate-100">
                                {practice.examples.bad && (
                                   <div className="flex gap-2 text-rose-700 opacity-80">
                                      <span className="font-mono text-xs font-bold border border-rose-200 px-1 rounded bg-rose-50 h-fit">BAD</span>
                                      <span className="font-mono text-xs">{practice.examples.bad}</span>
                                   </div>
                                )}
                                {practice.examples.good && (
                                   <div className="flex gap-2 text-emerald-700">
                                      <span className="font-mono text-xs font-bold border border-emerald-200 px-1 rounded bg-emerald-50 h-fit">GOOD</span>
                                      <span className="font-mono text-xs">{practice.examples.good}</span>
                                   </div>
                                )}
                             </div>
                          )}
                       </Card>
                    ))}
                 </div>
              </div>

              {/* Right Column: Examples & Limitations */}
              <div className="space-y-6">
                 {activeFeatureData.examples.length > 0 && (
                    <div className="space-y-4">
                       <h3 className="font-bold text-slate-900 text-lg">Real-World Examples</h3>
                       {activeFeatureData.examples.map((example) => (
                          <div key={example.id} className="bg-slate-900 text-slate-300 rounded-xl p-5 shadow-lg">
                             <h5 className="font-bold text-white mb-2 text-sm">{example.title}</h5>
                             <p className="text-xs text-slate-400 mb-3">{example.description}</p>
                             
                             {example.code && (
                                <div className="bg-black/50 rounded p-3 mb-3 border border-slate-800">
                                   <code className="text-xs font-mono text-amber-300 break-all whitespace-pre-wrap">{example.code}</code>
                                </div>
                             )}
                             {example.output && (
                                <div className="border-t border-slate-800 pt-3 mt-3">
                                   <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Output Preview</div>
                                   <div className="text-xs text-slate-400 whitespace-pre-wrap">{example.output}</div>
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 )}

                 {activeFeatureData.limitations && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                       <h4 className="font-bold text-amber-900 mb-3 text-sm uppercase tracking-wide">System Limitations</h4>
                       <ul className="space-y-2">
                          {activeFeatureData.limitations.map((lim, i) => (
                             <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 bg-amber-500 rounded-full shrink-0" />
                                {lim}
                             </li>
                          ))}
                       </ul>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
