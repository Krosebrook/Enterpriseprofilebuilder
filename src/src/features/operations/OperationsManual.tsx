import React, { useState } from 'react';
import { BookOpen, DollarSign, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ServiceTiers } from './components/ServiceTiers';
import { ROIFramework } from './components/ROIFramework';
import { SuccessMetrics } from './components/SuccessMetrics';
import { TroubleshootingGuide } from './components/TroubleshootingGuide';

export function OperationsManual() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'roi' | 'metrics' | 'troubleshooting'>('tiers');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Service Operations Manual" 
        description="Operational frameworks, service tiers, ROI methodologies, and troubleshooting guides for Claude Enterprise delivery."
        icon={BookOpen}
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'tiers', label: 'Service Tiers', icon: Target },
          { id: 'roi', label: 'ROI Framework', icon: DollarSign },
          { id: 'metrics', label: 'Success Metrics', icon: CheckCircle },
          { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-700 bg-amber-50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'tiers' && <ServiceTiers />}
        {activeTab === 'roi' && <ROIFramework />}
        {activeTab === 'metrics' && <SuccessMetrics />}
        {activeTab === 'troubleshooting' && <TroubleshootingGuide />}
      </div>
    </div>
  );
}
