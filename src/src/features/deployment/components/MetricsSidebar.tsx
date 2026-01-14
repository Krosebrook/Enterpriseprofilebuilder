import React from 'react';
import { Card } from '../../../components/ui/Card';
import { useDeployment } from '../hooks/useDeployment';
import { Rocket, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { ProgressBar } from '../../../components/ui/ProgressBar';

interface MetricsSidebarProps {
    stats: ReturnType<typeof useDeployment>['stats'];
}

export function MetricsSidebar({ stats }: MetricsSidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 text-white border-none shadow-xl">
        <div className="p-2">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-sm tracking-wide">DEPLOYMENT VELOCITY</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Overall Completion</span>
                <span className="text-white font-bold">{stats.progress}%</span>
              </div>
              <ProgressBar value={stats.progress} color="bg-emerald-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Critical Path</span>
                <span className="text-amber-400 font-bold">{stats.criticalProgress}%</span>
              </div>
              <ProgressBar value={stats.criticalProgress} color="bg-amber-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-2xl font-bold font-mono">{stats.completedTasks}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Tasks Done</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{stats.velocity}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Tasks / Week</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-slate-400" />
          Quick Filters
        </h4>
        <div className="space-y-1">
          {/* Note: In a real app, these would be controlled inputs connected to the hook */}
          <div className="text-xs text-slate-500 italic">
            (Connected in parent dashboard)
          </div>
        </div>
      </Card>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Next Critical Milestone
        </h4>
        <p className="text-sm font-bold text-slate-900">Phase 2: Security Audit</p>
        <p className="text-xs text-slate-600 mt-1">Due: Dec 30, 2025</p>
        <div className="mt-3 text-xs bg-white/50 p-2 rounded text-amber-800">
          Blocker: Pending CISO signoff on DLP regex patterns.
        </div>
      </div>
    </div>
  );
}
