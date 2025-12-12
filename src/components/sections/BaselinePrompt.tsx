import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, DollarSign, Lock, Sparkles } from 'lucide-react';
import { baselineOptionsData } from '../../data/baseline-options';
import { Button } from '../ui/Button';

export function BaselinePrompt() {
  const [selectedBaselineId, setSelectedBaselineId] = useState(baselineOptionsData[0].id);
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
    <div className="space-y-8">
      <div>
        <h2 className="text-slate-900 mb-4">System Prompts</h2>
        <p className="text-slate-700 mb-6">
          Select a baseline configuration to view its foundational behavior, security guardrails, and operational expectations.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {baselineOptionsData.map((option) => (
            <Button
              key={option.id}
              variant={selectedBaselineId === option.id ? 'primary' : 'secondary'}
              onClick={() => setSelectedBaselineId(option.id)}
              className="text-sm"
            >
              {option.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-slate-100 p-6 rounded-lg">
        <h3 className="text-amber-400 mb-4">INT Inc Claude Enterprise Assistant</h3>
        <p className="mb-4 text-sm text-slate-400">
          <strong>Baseline:</strong> {selectedBaseline.name} | <strong>Version:</strong> {selectedBaseline.version} | <strong>Effective Date:</strong> {selectedBaseline.date}
        </p>
        
        <div className="space-y-4 text-slate-300">
          <div>
            <h4 className="text-white mb-2">Core Directive</h4>
            <p className="whitespace-pre-line">
              {selectedBaseline.sections.coreDirective}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-slate-900 mb-4">Operational Parameters</h3>
        
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
          <h4 className="text-slate-900 mb-3">Identity & Context</h4>
          <ul className="space-y-2 text-slate-700">
            {selectedBaseline.sections.identity.map((item, i) => (
              <li key={i}>{item.startsWith('•') ? item : `• ${item}`}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h4 className="text-slate-900 mb-3">Your Role in INT Inc</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-3 text-slate-900">You are NOT:</p>
              <ul className="space-y-2 text-slate-700">
                {selectedBaseline.sections.notAllowed.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="mb-3 text-slate-900">You ARE:</p>
              <ul className="space-y-2 text-slate-700">
                {selectedBaseline.sections.allowed.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-slate-900 mb-4">Critical Security Behaviors</h3>
        
        <div className="space-y-4">
          {selectedBaseline.sections.securityBehaviors.map((behavior, i) => {
            const Icon = iconMap[behavior.icon] || Shield;
            const colorClass = behavior.color === 'red' ? 'bg-red-50 border-red-200 text-red-600' :
                             behavior.color === 'orange' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                             behavior.color === 'yellow' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' :
                             behavior.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                             behavior.color === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-600' :
                             'bg-slate-50 border-slate-200 text-slate-600';
            
            return (
              <div key={i} className={`border rounded-lg p-6 ${colorClass.split(' text')[0]}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-6 h-6 ${colorClass.split(' ')[2]}`} />
                  <h4 className="text-slate-900">{i + 1}. {behavior.title}</h4>
                </div>
                <ul className="space-y-2 text-slate-700">
                  {behavior.rules.map((rule, j) => (
                    <li key={j}>• {rule}</li>
                  ))}
                </ul>
                {behavior.example && (
                  <div className="mt-4 bg-white border border-opacity-50 rounded p-4 border-current">
                    <p className="text-slate-600 italic">
                      Example: {behavior.example}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-slate-900 mb-4">Escalation Triggers</h3>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-slate-900">Trigger</th>
                <th className="px-6 py-3 text-left text-slate-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {selectedBaseline.sections.escalationTriggers.map((trigger, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 text-slate-700">{trigger.trigger}</td>
                  <td className="px-6 py-4 text-slate-700">{trigger.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-l-4 border-amber-500 bg-amber-50 p-6 rounded-r-lg">
        <h3 className="text-slate-900 mb-3">Communication Standards</h3>
        <ul className="space-y-2 text-slate-700">
          {selectedBaseline.sections.communicationStandards.map((std, i) => (
            <li key={i}>• {std}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
