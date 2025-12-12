import { useState } from 'react';
import { MessageSquare, Shield, Zap, Users, AlertTriangle, PlayCircle } from 'lucide-react';
import { bestPracticesData } from '../../data/best-practices';
import { tutorialsData } from '../../data/tutorials';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { InteractiveTutorial } from './InteractiveTutorial';

export function BestPractices() {
  const [activeTutorialId, setActiveTutorialId] = useState<string | null>(null);

  const activeTutorial = activeTutorialId 
    ? tutorialsData.find(t => t.techniqueId === activeTutorialId) 
    : null;

  return (
    <div className="space-y-8">
      {activeTutorial && (
        <InteractiveTutorial 
          tutorial={activeTutorial} 
          onClose={() => setActiveTutorialId(null)} 
        />
      )}

      <div>
        <h2 className="text-slate-900 mb-4">Best Practices</h2>
        <p className="text-slate-700">
          Guidelines for effective prompting, security, and workflow optimization.
        </p>
      </div>

      {/* Prompting Best Practices */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-amber-600" />
          <h3 className="text-slate-900">Prompting Best Practices</h3>
        </div>

        <div className="space-y-6">
          {bestPracticesData.prompting.map((practice) => (
            <Card key={practice.id}>
              <h4 className="text-slate-900 mb-4">{practice.title}</h4>
              <p className="text-slate-700 mb-4">{practice.description}</p>
              
              {practice.examples && practice.examples.length > 0 && (
                <div className="space-y-4">
                  {practice.examples.map((example, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="space-y-2">
                        {example.bad && (
                          <div className="flex items-start gap-2">
                            <span className="text-red-600 flex-shrink-0">✗</span>
                            <code className="text-slate-700 whitespace-pre-line">{example.bad}</code>
                          </div>
                        )}
                        {example.good && (
                          <div className="flex items-start gap-2">
                            <span className="text-green-600 flex-shrink-0">✓</span>
                            <div className="text-slate-700 whitespace-pre-line">
                              {typeof example.good === 'string' ? (
                                <code>{example.good}</code>
                              ) : (
                                example.good
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Techniques */}
      {bestPracticesData.advanced_techniques && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-amber-600" />
            <h3 className="text-slate-900">Advanced Techniques</h3>
          </div>

          <div className="space-y-6">
            {bestPracticesData.advanced_techniques.map((practice) => (
              <Card key={practice.id}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-slate-900 mb-4">{practice.title}</h4>
                    <p className="text-slate-700 mb-4">{practice.description}</p>
                  </div>
                  {tutorialsData.some(t => t.techniqueId === practice.id) && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setActiveTutorialId(practice.id)}
                      className="flex-shrink-0"
                    >
                      <PlayCircle className="w-4 h-4 mr-2 text-indigo-600" />
                      Try Tutorial
                    </Button>
                  )}
                </div>
                
                {practice.examples && practice.examples.length > 0 && (
                  <div className="space-y-4">
                    {practice.examples.map((example, index) => (
                      <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <span className="text-green-600 flex-shrink-0">✓</span>
                          <div className="text-slate-700 whitespace-pre-line">
                            <code>{example.good}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Security Best Practices */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-amber-600" />
          <h3 className="text-slate-900">Security Best Practices</h3>
        </div>

        <div className="space-y-6">
          {bestPracticesData.security.map((practice) => (
            <Card key={practice.id}>
              <h4 className="text-slate-900 mb-4">{practice.title}</h4>
              <p className="text-slate-700 mb-4">{practice.description}</p>
              
              {practice.examples && practice.examples.length > 0 && (
                <div className="space-y-3">
                  {practice.examples.map((example, index) => (
                    <div key={index}>
                      {example.bad && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-2">
                          <p className="text-slate-900 mb-2">❌ DON'T:</p>
                          <code className="block bg-white border border-red-300 rounded p-3 text-slate-700">
                            {example.bad}
                          </code>
                        </div>
                      )}

                      {example.good && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-slate-900 mb-2">✅ DO:</p>
                          <code className="block bg-white border border-green-300 rounded p-3 text-slate-700">
                            {example.good}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {practice.tips && (
                <div className="mt-4">
                  <ul className="space-y-2 text-slate-700">
                    {practice.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Optimization */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-amber-600" />
          <h3 className="text-slate-900">Workflow Optimization</h3>
        </div>

        <div className="space-y-6">
          {bestPracticesData.workflow.map((practice) => (
            <Card key={practice.id}>
              <h4 className="text-slate-900 mb-4">{practice.title}</h4>
              <p className="text-slate-700 mb-4">{practice.description}</p>
              
              {practice.approach && (
                <div>
                  <ol className="space-y-2 ml-4 list-decimal text-slate-700">
                    {practice.approach.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {practice.process && (
                <div>
                  <ol className="space-y-2 ml-4 list-decimal text-slate-700">
                    {practice.process.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {practice.example && (
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-slate-900 mb-2">Example:</p>
                  <div className="text-slate-700 whitespace-pre-line">{practice.example}</div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Collaboration */}
      {bestPracticesData.collaboration && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-amber-600" />
            <h3 className="text-slate-900">Team Collaboration</h3>
          </div>

          <div className="space-y-6">
            {bestPracticesData.collaboration.map((practice) => (
              <Card key={practice.id}>
                <h4 className="text-slate-900 mb-4">{practice.title}</h4>
                <p className="text-slate-700 mb-4">{practice.description}</p>
                {practice.examples && practice.examples.length > 0 && (
                  <div className="space-y-4">
                    {practice.examples.map((example, index) => (
                      <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="text-slate-700 whitespace-pre-line">
                          {example.good}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Troubleshooting */}
      {bestPracticesData.troubleshooting && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h3 className="text-slate-900">Troubleshooting</h3>
          </div>

          <div className="space-y-6">
            {bestPracticesData.troubleshooting.map((practice) => (
              <Card key={practice.id}>
                <h4 className="text-slate-900 mb-4">{practice.title}</h4>
                <p className="text-slate-700 mb-4">{practice.description}</p>
                
                {practice.actions && (
                   <ul className="space-y-2 ml-4 list-disc text-slate-700">
                    {practice.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                )}
                 {practice.reason && (
                  <p className="text-slate-600 italic mt-2">
                    Why: {practice.reason}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Key Takeaways */}
      <div className="border-l-4 border-amber-500 bg-amber-50 p-6 rounded-r-lg">
        <h3 className="text-slate-900 mb-3">Key Takeaways</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            <span><strong>Be specific</strong> in your prompts to get better results</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            <span><strong>Never share</strong> credentials, API keys, or customer PII</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            <span><strong>Use follow-ups</strong> instead of starting new conversations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            <span><strong>Leverage memory</strong> to save time on repeated workflows</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-1">•</span>
            <span><strong>Iterate with artifacts</strong> for code and documents</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
