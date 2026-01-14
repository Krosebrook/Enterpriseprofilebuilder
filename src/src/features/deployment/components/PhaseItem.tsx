import React from 'react';
import { ChevronDown, ChevronRight, Calendar, User } from 'lucide-react';
import { DeploymentPhase } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { TaskItem } from './TaskItem';

interface PhaseItemProps {
  phase: DeploymentPhase;
  isOpen: boolean;
  onToggle: () => void;
}

export function PhaseItem({ phase, isOpen, onToggle }: PhaseItemProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'border-l-emerald-500';
      case 'in-progress': return 'border-l-amber-500';
      default: return 'border-l-slate-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 border-l-4 ${getStatusColor(phase.status)}`}>
      <button 
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className={`p-1 rounded transition-transform duration-200 ${isOpen ? 'rotate-90 bg-slate-100' : ''}`}>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400">PHASE {phase.number}</span>
            <h3 className="font-bold text-slate-900">{phase.title}</h3>
            {phase.status === 'in-progress' && <Badge variant="warning">Active</Badge>}
            {phase.status === 'completed' && <Badge variant="success">Done</Badge>}
          </div>
          <p className="text-sm text-slate-500 line-clamp-1">{phase.description}</p>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-500 mr-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {phase.duration}
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {phase.owner}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
          <div className="pl-11 space-y-6 pt-2 border-t border-slate-100">
            {phase.subPhases.map(sub => (
              <div key={sub.id} className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {sub.title}
                </h4>
                <div className="space-y-2">
                  {sub.tasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
