import React from 'react';
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { DeploymentTask } from '../../../types';

interface TaskItemProps {
  task: DeploymentTask;
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-lg hover:border-amber-200 transition-colors group">
      <div className="mt-0.5">
        {task.status === 'completed' ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : task.status === 'in-progress' ? (
          <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        ) : (
          <Circle className="w-5 h-5 text-slate-300" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h5 className={`text-sm font-medium ${
            task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'
          }`}>
            {task.title}
          </h5>
          <div className="flex gap-2">
            {task.priority === 'critical' && (
              <Badge variant="error" className="text-[10px] py-0">CRITICAL</Badge>
            )}
            <Badge variant="outline" className="text-[10px] py-0 text-slate-500">
              {task.estimatedHours}h
            </Badge>
          </div>
        </div>
        
        <p className="text-xs text-slate-500 mt-1">{task.description}</p>
        
        {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
          <div className="mt-2 pl-3 border-l-2 border-slate-100 hidden group-hover:block transition-all">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Acceptance Criteria</p>
            <ul className="space-y-1">
              {task.acceptanceCriteria.map((criteria, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-slate-400" />
                  {criteria}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
           <span className="flex items-center gap-1">
             <Clock className="w-3 h-3" />
             Due: {task.dueDate || 'TBD'}
           </span>
           <span>Owner: {task.assignee}</span>
        </div>
      </div>
    </div>
  );
}
