import React from 'react';
import { Rocket, Filter, Download } from 'lucide-react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { useDeployment, FilterType } from './hooks/useDeployment';
import { PhaseItem } from './components/PhaseItem';
import { MetricsSidebar } from './components/MetricsSidebar';

export function DeploymentDashboard() {
  const { phases, activePhase, togglePhase, filter, setFilter, stats } = useDeployment();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <SectionHeader 
          title="Deployment Hub" 
          description="Track the 11-phase enterprise rollout, managing tasks, dependencies, and critical path milestones."
          icon={Rocket}
          className="flex-1"
        />
        <div className="flex gap-2">
           <button 
             className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors flex items-center gap-2"
             onClick={() => alert('Exporting Gantt chart...')}
           >
             <Download className="w-4 h-4" />
             Export Plan
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content: Phase List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-slate-400" />
            {(['all', 'critical', 'pending', 'completed'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  filter === f 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f} Tasks
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {phases.length > 0 ? (
              phases.map(phase => (
                <PhaseItem 
                  key={phase.id} 
                  phase={phase} 
                  isOpen={activePhase === phase.id} 
                  onToggle={() => togglePhase(phase.id)} 
                />
              ))
            ) : (
              <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">No phases match your filter.</p>
                <button 
                  onClick={() => setFilter('all')}
                  className="text-amber-600 font-bold text-sm mt-2 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <MetricsSidebar stats={stats} />
        </div>
      </div>
    </div>
  );
}
