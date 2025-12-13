import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { Rocket, Filter, AlertTriangle } from 'lucide-react';
import { PhaseCard } from './components/PhaseCard';
import { PhaseDetail } from './components/PhaseDetail';
import { allDeploymentPhases } from '../../../data/deployment-phases';
import { DeploymentPhase, DeploymentTask } from '../../../types';

type FilterType = 'all' | 'critical' | 'pending' | 'completed';

function useDeploymentPlan() {
  const [activePhase, setActivePhase] = useState<string | null>('phase-0');
  const [filter, setFilter] = useState<FilterType>('all');

  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let criticalTasks = 0;
    let criticalCompleted = 0;

    allDeploymentPhases.forEach(phase => {
      phase.subPhases.forEach(sub => {
        sub.tasks.forEach(task => {
          totalTasks++;
          if (task.status === 'completed') completedTasks++;
          if (task.priority === 'critical') {
            criticalTasks++;
            if (task.status === 'completed') criticalCompleted++;
          }
        });
      });
    });

    return {
      totalTasks,
      completedTasks,
      progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      criticalProgress: criticalTasks > 0 ? Math.round((criticalCompleted / criticalTasks) * 100) : 0,
      velocity: 4.2 // Mock velocity
    };
  }, []);

  const filteredPhases = useMemo(() => {
    if (filter === 'all') return allDeploymentPhases;

    return allDeploymentPhases.map(phase => {
      const filteredSubPhases = phase.subPhases.map(sub => {
        const filteredTasks = sub.tasks.filter(task => {
          if (filter === 'critical') return task.priority === 'critical';
          if (filter === 'pending') return task.status !== 'completed';
          if (filter === 'completed') return task.status === 'completed';
          return true;
        });
        return { ...sub, tasks: filteredTasks };
      }).filter(sub => sub.tasks.length > 0);

      return { ...phase, subPhases: filteredSubPhases };
    }).filter(phase => phase.subPhases.length > 0);
  }, [filter]);

  const togglePhase = (phaseId: string) => {
    setActivePhase(current => current === phaseId ? null : phaseId);
  };

  return {
    phases: filteredPhases,
    activePhase,
    togglePhase,
    filter,
    setFilter,
    stats
  };
}

export function Deployment() {
  const { phases, stats, activePhase, togglePhase, filter, setFilter } = useDeploymentPlan();

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[calc(100vh-100px)] animate-in fade-in duration-500">
      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        <SectionHeader 
          title="Deployment Roadmap" 
          description="Track the 11-phase enterprise rollout plan from pilot to full scale."
          icon={Rocket}
        />

        {/* Phase List */}
        <div className="space-y-4">
          {phases.map(phase => (
            <div key={phase.id}>
              <PhaseCard 
                phase={phase} 
                isExpanded={activePhase === phase.id}
                onToggle={() => togglePhase(phase.id)}
              />
              {activePhase === phase.id && (
                <PhaseDetail phase={phase} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Metrics */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
        <Card className="sticky top-6">
          <h3 className="font-bold text-slate-900 mb-4">Live Metrics</h3>
          
          <div className="space-y-6">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Overall Completion</span>
                <span className="font-bold text-slate-900">{stats.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.completedTasks}</div>
                <div className="text-xs text-emerald-800 font-medium">Tasks Done</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-600">{stats.totalTasks - stats.completedTasks}</div>
                <div className="text-xs text-amber-800 font-medium">Pending</div>
              </div>
            </div>

            {/* Critical Path Warning */}
            {stats.criticalProgress < 100 && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <div className="font-bold text-rose-700 text-sm">Critical Path</div>
                  <div className="text-xs text-rose-600 mt-1">
                    {100 - stats.criticalProgress}% of critical tasks remaining.
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="pt-6 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setFilter('all')}
                  className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                    filter === 'all' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  All Phases
                </button>
                <button 
                  onClick={() => setFilter('critical')}
                  className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                    filter === 'critical' ? 'bg-rose-50 text-rose-700 font-medium' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Critical Path Only
                </button>
                <button 
                  onClick={() => setFilter('pending')}
                  className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                    filter === 'pending' ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Pending / In Progress
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
