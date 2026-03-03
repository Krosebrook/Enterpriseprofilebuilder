import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Play, HelpCircle, X, RotateCcw, Brain, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TechniqueTutorial } from '../../data/tutorials';

interface InteractiveTutorialProps {
  tutorial: TechniqueTutorial;
  onClose: () => void;
}

export function InteractiveTutorial({ tutorial, onClose }: InteractiveTutorialProps) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
  const [showThinking, setShowThinking] = useState(false);

  const scenario = tutorial.scenarios[scenarioIndex];

  useEffect(() => {
     // Reset state when scenario changes
     setUserPrompt('');
     setFeedback(null);
     setStatus('idle');
     setShowThinking(false);
  }, [scenarioIndex]);

  const handleReset = () => {
    setUserPrompt('');
    setFeedback(null);
    setStatus('idle');
    setShowThinking(false);
  };

  const handleNext = () => {
    if (scenarioIndex < tutorial.scenarios.length - 1) {
      setScenarioIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const analyzePrompt = () => {
    setStatus('analyzing');
    setFeedback(null);

    // Simulate analysis delay
    setTimeout(() => {
      const { validation } = scenario;
      let isValid = false;

      if (validation.type === 'keyword') {
        const patterns = Array.isArray(validation.pattern) ? validation.pattern : [validation.pattern];
        isValid = patterns.some(p => userPrompt.toLowerCase().includes(p.toLowerCase()));
      } else if (validation.type === 'structure') {
        const patterns = Array.isArray(validation.pattern) ? validation.pattern : [validation.pattern];
        isValid = patterns.every(p => userPrompt.includes(p));
      }

      if (isValid) {
        setStatus('success');
        // Start thinking animation
        setTimeout(() => setShowThinking(true), 600);
      } else {
        setStatus('error');
        setFeedback(validation.feedback);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Scenario {scenarioIndex + 1} / {tutorial.scenarios.length}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-indigo-600">{tutorial.title}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{scenario.title}</h3>
          </div>
          <button 
             onClick={onClose}
             className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
             <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {/* Challenge Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
             <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg shrink-0">
                   <Brain className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900 mb-1">The Challenge</h4>
                   <p className="text-slate-700 text-sm leading-relaxed mb-3">{scenario.problem}</p>
                   <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono text-slate-600">
                      <strong>Context:</strong> {scenario.initialState}
                   </div>
                </div>
             </div>
             
             <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm font-medium text-emerald-700">
                <CheckCircle className="w-4 h-4" />
                Goal: {scenario.goal}
             </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
             <textarea
               value={userPrompt}
               onChange={(e) => setUserPrompt(e.target.value)}
               className="w-full h-32 p-4 rounded-lg focus:outline-none text-slate-700 resize-none font-mono text-sm placeholder:text-slate-400"
               placeholder="Draft your prompt here. Remember to apply the technique..."
               disabled={status === 'success' || status === 'analyzing'}
             />
             <div className="px-4 pb-3 flex justify-between items-center border-t border-slate-50 pt-3">
                <span className="text-xs text-slate-400 font-medium">
                   {userPrompt.length} chars
                </span>
                <div className="flex gap-2">
                   {status !== 'success' && userPrompt.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={handleReset}>
                         Clear
                      </Button>
                   )}
                   <Button 
                      onClick={analyzePrompt}
                      disabled={userPrompt.length < 5 || status === 'success' || status === 'analyzing'}
                      isLoading={status === 'analyzing'}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                   >
                      <Play className="w-3 h-3 mr-2 fill-current" />
                      Run Simulation
                   </Button>
                </div>
             </div>
          </div>

          {/* Feedback States */}
          <div className="min-h-[100px]">
             {status === 'error' && feedback && (
               <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                 <div className="bg-white p-1.5 rounded-full border border-red-100 h-fit shadow-sm">
                    <X className="w-4 h-4 text-red-500" />
                 </div>
                 <div>
                   <h4 className="font-bold text-red-900 text-sm mb-1">Needs Improvement</h4>
                   <p className="text-red-700 text-sm leading-relaxed">{feedback}</p>
                   <button 
                      onClick={() => setStatus('idle')}
                      className="mt-3 text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                   >
                      <RotateCcw className="w-3 h-3" /> Try Again
                   </button>
                 </div>
               </div>
             )}

             {status === 'success' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                 <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                   <div className="bg-white p-1.5 rounded-full border border-emerald-100 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                   </div>
                   <p className="text-emerald-800 font-medium text-sm">Excellent prompting! Generating response...</p>
                 </div>

                 {/* Simulated Response */}
                 <div className="bg-white border border-indigo-100 rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-indigo-50/50 px-4 py-2 border-b border-indigo-50 flex items-center gap-2">
                       <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold">C</div>
                       <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Claude Output</span>
                    </div>
                    
                    <div className="p-5 space-y-4">
                       {showThinking ? (
                          <>
                             <div className="bg-slate-50 border-l-2 border-slate-300 p-3 text-xs text-slate-500 font-mono">
                                <span className="block font-bold mb-1 text-slate-400 uppercase tracking-wider text-[10px]">Chain of Thought</span>
                                {scenario.successResponse.thinking}
                             </div>
                             <div className="text-slate-800 text-sm leading-relaxed animate-in fade-in duration-700">
                                {scenario.successResponse.output}
                             </div>
                          </>
                       ) : (
                          <div className="flex items-center justify-center py-8">
                             <div className="animate-pulse flex space-x-2">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animation-delay-200"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animation-delay-400"></div>
                             </div>
                          </div>
                       )}
                    </div>
                    
                    {showThinking && (
                       <div className="bg-indigo-900 p-4 flex items-center justify-between">
                          <div className="text-indigo-200 text-xs">
                             <strong className="text-white block mb-0.5">Technique Mastery:</strong>
                             {scenario.successResponse.explanation}
                          </div>
                          <Button 
                             onClick={handleNext} 
                             className="bg-white text-indigo-900 hover:bg-indigo-50 border-transparent shadow-none"
                             size="sm"
                          >
                             {scenarioIndex < tutorial.scenarios.length - 1 ? 'Next Scenario' : 'Complete Tutorial'}
                             <ArrowRight className="w-3 h-3 ml-2" />
                          </Button>
                       </div>
                    )}
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
