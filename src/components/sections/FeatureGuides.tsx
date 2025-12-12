import { Search, Brain, FileText, Code, Upload, Eye, Mic, FolderKanban, Users, Webhook } from 'lucide-react';
import { useState } from 'react';
import { featuresData } from '../../data/features';
import { FeatureType } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

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
    <div className="space-y-8">
      <div>
        <h2 className="text-slate-900 mb-4">Feature Guides</h2>
        <p className="text-slate-700">
          Comprehensive guides for each Claude Enterprise feature available at INT Inc.
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="flex flex-wrap gap-2">
        {featuresData.map((feature) => {
          const Icon = iconMap[feature.id];
          const isActive = activeFeature === feature.id;
          
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isActive
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-amber-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{feature.name}</span>
            </button>
          );
        })}
      </div>

      {/* Feature Content */}
      {activeFeatureData && (
        <Card>
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-slate-900 mb-3">{activeFeatureData.name}</h3>
              <p className="text-slate-700">{activeFeatureData.description}</p>
            </div>

            {/* When to Use / When NOT to Use */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-slate-900 mb-2">When to Use</h4>
                <ul className="space-y-1 text-slate-700">
                  {activeFeatureData.whenToUse.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-slate-900 mb-2">When NOT to Use</h4>
                <ul className="space-y-1 text-slate-700">
                  {activeFeatureData.whenNotToUse.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best Practices */}
            <div>
              <h4 className="text-slate-900 mb-3">Best Practices</h4>
              <div className="space-y-3">
                {activeFeatureData.bestPractices.map((practice) => (
                  <div key={practice.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-slate-900 mb-2">{practice.title}</p>
                    <p className="text-slate-700 mb-2">{practice.description}</p>
                    
                    {practice.examples && (
                      <div className="space-y-2 mt-3">
                        {practice.examples.bad && (
                          <div className="flex items-start gap-2">
                            <span className="text-red-600">✗</span>
                            <code className="text-slate-700">{practice.examples.bad}</code>
                          </div>
                        )}
                        {practice.examples.good && (
                          <div className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <code className="text-slate-700">{practice.examples.good}</code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            {activeFeatureData.examples.length > 0 && (
              <div>
                <h4 className="text-slate-900 mb-3">Examples</h4>
                <div className="space-y-4">
                  {activeFeatureData.examples.map((example) => (
                    <div key={example.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="text-slate-900 mb-2">{example.title}</h5>
                      <p className="text-slate-700 mb-2">{example.description}</p>
                      
                      {example.code && (
                        <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto mt-2">
                          {example.code}
                        </pre>
                      )}
                      
                      {example.output && (
                        <div className="mt-2">
                          <p className="text-slate-600 text-sm mb-1">Output:</p>
                          <div className="text-slate-700 whitespace-pre-line">{example.output}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Limitations */}
            {activeFeatureData.limitations && activeFeatureData.limitations.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-slate-900 mb-2">Limitations</h4>
                <ul className="space-y-1 text-slate-700">
                  {activeFeatureData.limitations.map((limitation, index) => (
                    <li key={index}>• {limitation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
