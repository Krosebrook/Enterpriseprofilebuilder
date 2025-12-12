import { useState } from 'react';
import { ArrowRight, CheckCircle, RefreshCcw, MessageSquare, Play, HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TutorialScenario, TechniqueTutorial } from '../../data/tutorials';

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

  const handleReset = () => {
    setUserPrompt('');
    setFeedback(null);
    setStatus('idle');
    setShowThinking(false);
  };

  const handleNext = () => {
    if (scenarioIndex < tutorial.scenarios.length - 1) {
      setScenarioIndex(prev => prev + 1);
      handleReset();
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
        setTimeout(() => setShowThinking(true), 500);
      } else {
        setStatus('error');
        setFeedback(validation.feedback);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>Scenario {scenarioIndex + 1} of {tutorial.scenarios.length}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="font-medium text-amber-600">{scenario.title}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{scenario.problem}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500 hover:text-slate-700">
            Close
          </Button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Goal Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide mb-1">Your Goal</h4>
              <p className="text-slate-800">{scenario.goal}</p>
            </div>
          </div>

          {/* Context/Initial State */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-sm text-slate-600">
            <strong className="text-slate-900 block mb-2">Context:</strong>
            {scenario.initialState}
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Draft your prompt:
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm resize-none"
              placeholder="Type your prompt here..."
              disabled={status === 'success'}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-500">
                Tip: Apply the technique discussed to solve the goal.
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={handleReset}
                  disabled={userPrompt.length === 0}
                >
                  Clear
                </Button>
                <Button 
                  onClick={analyzePrompt}
                  disabled={userPrompt.length < 5 || status === 'success' || status === 'analyzing'}
                  isLoading={status === 'analyzing'}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Simulate
                </Button>
              </div>
            </div>
          </div>

          {/* Feedback Area */}
          {status === 'error' && feedback && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <HelpCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Not quite right</h4>
                <p className="text-red-700 text-sm">{feedback}</p>
              </div>
            </div>
          )}

          {/* Success Area */}
          {status === 'success' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">Great prompt! Processing...</p>
              </div>

              {/* Simulated Claude Response */}
              <Card className="bg-white border-2 border-indigo-100 shadow-md">
                <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                  <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">C</div>
                  <span className="font-semibold text-slate-900">Claude</span>
                </div>
                
                <div className="space-y-3">
                  {showThinking && (
                    <div className="bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-600 italic animate-pulse">
                      <span className="block font-semibold not-italic text-slate-500 mb-1 text-xs">Thinking Process:</span>
                      {scenario.successResponse.thinking}
                    </div>
                  )}
                  
                  {showThinking && (
                    <div className="text-slate-800 animate-in fade-in duration-700 delay-500">
                       {scenario.successResponse.output}
                    </div>
                  )}
                </div>
              </Card>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                <strong>Why this worked:</strong> {scenario.successResponse.explanation}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} className="w-full md:w-auto">
                  {scenarioIndex < tutorial.scenarios.length - 1 ? (
                    <>
                      Next Scenario <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'Finish Tutorial'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
