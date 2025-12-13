import React from 'react';
import { Card } from '../../../components/ui/Card';
import { DeploymentPhase } from '../../../types';
import { CheckCircle, Circle, Clock, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';

interface PhaseCardProps {
  phase: DeploymentPhase;
  isExpanded: boolean;
  onToggle: () => void;
}

export function PhaseCard({ phase, isExpanded, onToggle }: PhaseCardProps) {
  const isCompleted = phase.status === 'completed';
  const isInProgress = phase.status === 'in-progress';

  return (
    <Card 
      className={`transition-all duration-200 cursor-pointer border-l-4 ${
        isCompleted ? 'border-l-emerald-500' : 
        isInProgress ? 'border-l-amber-500' : 
        'border-l-slate-200 hover:border-l-slate-300'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div className="mt-1">
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          ) : isInProgress ? (
            <div className="relative">
              <Circle className="w-6 h-6 text-amber-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              </div>
            </div>
          ) : (
            <Circle className="w-6 h-6 text-slate-300" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phase {phase.number}
                </span>
                {isInProgress && <Badge variant="warning">In Progress</Badge>}
                {isCompleted && <Badge variant="success">Completed</Badge>}
              </div>
              <h3 className="font-bold text-lg text-slate-900">{phase.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{phase.description}</p>
            </div>
            
            <div className="text-right hidden md:block">
              <div className="flex items-center gap-1 text-sm text-slate-600 justify-end">
                <Clock className="w-4 h-4" />
                {phase.duration}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Owner: {phase.owner}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500 font-medium">{phase.progress}% Complete</span>
              </div>
              <ProgressBar progress={phase.progress} variant={isCompleted ? 'success' : 'default'} />
            </div>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-slate-400 ml-auto" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
