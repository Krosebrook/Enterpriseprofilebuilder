import React from 'react';
import { Card } from '../../../components/ui/Card';
import { CheckCircle } from 'lucide-react';

export function ServiceTiers() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Foundation Tier */}
        <Card className="border-t-4 border-t-slate-400 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Foundation Tier</h3>
            <div className="text-2xl font-bold text-slate-700 mt-2">$15k - $50k</div>
            <p className="text-sm text-slate-500 mt-1">Small teams (10-50 users)</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="bg-slate-50 p-3 rounded text-sm">
              <span className="font-bold block mb-2">Includes:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>1-week discovery</li>
                <li>Basic roadmap (1 use case)</li>
                <li>Out-of-box setup</li>
                <li>2-day training workshop</li>
                <li>30-day support</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-sm block mb-2">Target Outcomes:</span>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 1-2 use cases live</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 70% adoption rate</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 20% productivity gain</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Strategy Tier */}
        <Card className="border-t-4 border-t-amber-500 flex flex-col h-full ring-1 ring-amber-100 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Strategy Tier</h3>
            <div className="text-2xl font-bold text-amber-600 mt-2">$50k - $150k</div>
            <p className="text-sm text-slate-500 mt-1">Mid-size teams (50-200 users)</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="bg-amber-50 p-3 rounded text-sm">
              <span className="font-bold block mb-2">Includes:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>2-week discovery</li>
                <li>Comprehensive roadmap</li>
                <li>Advanced setup (MCPs)</li>
                <li>Role-based training (3 days)</li>
                <li>90-day support + optimization</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-sm block mb-2">Target Outcomes:</span>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 3-5 use cases live</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 80% adoption rate</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 6-month ROI payback</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Advanced Tier */}
        <Card className="border-t-4 border-t-indigo-600 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Advanced Tier</h3>
            <div className="text-2xl font-bold text-indigo-600 mt-2">$150k - $250k+</div>
            <p className="text-sm text-slate-500 mt-1">Large Enterprise (200+ users)</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="bg-indigo-50 p-3 rounded text-sm">
              <span className="font-bold block mb-2">Includes:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>4-week discovery (multi-dept)</li>
                <li>Enterprise roadmap (12-18 mo)</li>
                <li>Custom Dev (Forked Explorer)</li>
                <li>Executive training (5 days)</li>
                <li>6-month support + CSM</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-sm block mb-2">Target Outcomes:</span>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 10+ use cases live</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> Strategic advantage</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 3-4x ROI (12-mo payback)</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h4 className="font-bold text-slate-900 mb-4">Training Delivery Model</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Delivery Methods</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Interactive Workshops</li>
              <li>• Hands-on Labs</li>
              <li>• Weekly Office Hours</li>
              <li>• Asynchronous Video Guides</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Measurement</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• NPS (Net Promoter Score)</li>
              <li>• Activation Rates</li>
              <li>• Feature Usage Metrics</li>
              <li>• Certification Pass Rates</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Key Deliverables</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Production Environment</li>
              <li>• Trained User Base</li>
              <li>• Operations Manual (Customized)</li>
              <li>• Success Metrics Dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
