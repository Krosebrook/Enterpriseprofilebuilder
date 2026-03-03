import React from 'react';
import { DeploymentPhase, DeploymentTask } from '../../../types';
import { CheckSquare, Square, AlertOctagon, User, Calendar } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';

interface PhaseDetailProps {
  phase: DeploymentPhase;
}

export function PhaseDetail({ phase }: PhaseDetailProps) {
  return (
    <div className="mt-4 pl-4 md:pl-10 space-y-6 border-l-2 border-slate-100 ml-3 md:ml-6 pb-6 animate-in slide-in-from-top-2 duration-200">
      
      {/* Stakeholders & Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg text-sm">
        <div>
          <span className="font-bold text-slate-700 block mb-1">Stakeholders</span>
          <div className="flex flex-wrap gap-2">
            {phase.stakeholders.map(s => (
              <span key={s} className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="font-bold text-slate-700 block mb-1">Timeline</span>
          <div className="text-slate-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {phase.startDate || 'TBD'} — {phase.endDate || 'TBD'}
          </div>
        </div>
      </div>

      {/* Sub-phases */}
      <div className="space-y-6">
        {phase.subPhases.map((sub, idx) => (
          <div key={sub.id} className="relative">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded font-mono">
                {phase.number}.{idx + 1}
              </span>
              {sub.title}
            </h4>
            
            <div className="space-y-3">
              {sub.tasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: DeploymentTask }) {
  const isDone = task.status === 'completed';
  const isCritical = task.priority === 'critical';

  return (
    <div className={`group flex items-start gap-3 p-3 rounded-lg border transition-colors ${
      isDone ? 'bg-slate-50 border-slate-100 opacity-75' : 'bg-white border-slate-200 hover:border-indigo-300'
    }`}>
      <div className="mt-0.5">
        {isDone ? (
          <CheckSquare className="w-4 h-4 text-emerald-500" />
        ) : (
          <Square className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start gap-2">
          <span className={`text-sm font-medium ${isDone ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
            {task.title}
          </span>
          {isCritical && !isDone && (
            <Badge variant="warning" className="text-[10px] px-1 py-0 h-5">
              CRITICAL
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
        
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" /> {task.assignee}
          </span>
          {task.estimatedHours && (
            <span>Est: {task.estimatedHours}h</span>
          )}
        </div>

        {/* Acceptance Criteria (Only show if not done, to save space) */}
        {!isDone && task.acceptanceCriteria && (
          <div className="mt-3 bg-slate-50 p-2 rounded border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Acceptance Criteria</span>
            <ul className="list-disc list-inside space-y-0.5">
              {task.acceptanceCriteria.map((ac, i) => (
                <li key={i} className="text-xs text-slate-600">{ac}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
