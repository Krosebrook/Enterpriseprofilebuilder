import { MessageSquare, Shield, Zap } from 'lucide-react';
import { bestPracticesData } from '../../data/best-practices';
import { Card } from '../ui/Card';

export function BestPractices() {
  return (
    <div className="space-y-8">
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
                            <code className="text-slate-700">{example.bad}</code>
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
