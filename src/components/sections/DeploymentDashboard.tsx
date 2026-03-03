/**
 * @fileoverview Comprehensive deployment dashboard with phase tracking
 * @module components/sections/DeploymentDashboard
 * @description Production-grade deployment tracking dashboard
 * 
 * Features:
 * - Visual phase progress
 * - Task breakdown by status
 * - Timeline visualization
 * - Team workload view
 * - Critical path analysis
 * - Export functionality
 * 
 * @author INT Inc Engineering Team
 * @version 1.0.0
 * @since 2025-12-11
 */

import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Download,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/card';
import { ProgressBar } from '../ui/ProgressBar';
import {
  deploymentPhases,
  getCurrentPhase,
  getOverallProgress,
  getTasksByStatus,
  getTasksByAssignee
} from '../../data/deployment-phases';
import type { DeploymentPhase, DeploymentSubPhase, DeploymentTask } from '../../types';

/**
 * Status icons mapping
 */
const statusIcons = {
  completed: CheckCircle2,
  'in-progress': Clock,
  pending: Circle,
  blocked: AlertCircle
};

/**
 * Status colors mapping
 */
const statusColors = {
  completed: 'success',
  'in-progress': 'warning',
  pending: 'default',
  blocked: 'danger'
} as const;

/**
 * Priority colors mapping
 */
const priorityColors = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'default'
} as const;

/**
 * Deployment Dashboard Component
 */
export function DeploymentDashboard() {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['phase-2']));
  const [expandedSubPhases, setExpandedSubPhases] = useState<Set<string>>(new Set());
  const [selectedView, setSelectedView] = useState<'timeline' | 'tasks' | 'team'>('timeline');

  const currentPhase = getCurrentPhase();
  const overallProgress = getOverallProgress();

  const completedTasks = getTasksByStatus('completed');
  const inProgressTasks = getTasksByStatus('in-progress');
  const pendingTasks = getTasksByStatus('pending');
  const blockedTasks = getTasksByStatus('blocked');

  const totalTasks = completedTasks.length + inProgressTasks.length + pendingTasks.length + blockedTasks.length;

  /**
   * Toggle phase expansion
   */
  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  /**
   * Toggle sub-phase expansion
   */
  const toggleSubPhase = (subPhaseId: string) => {
    setExpandedSubPhases(prev => {
      const next = new Set(prev);
      if (next.has(subPhaseId)) {
        next.delete(subPhaseId);
      } else {
        next.add(subPhaseId);
      }
      return next;
    });
  };

  /**
   * Export deployment data
   */
  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      overallProgress,
      currentPhase: currentPhase?.title,
      statistics: {
        totalTasks,
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        pending: pendingTasks.length,
        blocked: blockedTasks.length
      },
      phases: deploymentPhases
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement('a');
    anchorElement.href = url;
    anchorElement.download = `deployment-status-${new Date().toISOString().split('T')[0]}.json`;
    anchorElement.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-slate-900 mb-2">Deployment Dashboard</h1>
            <p className="text-slate-600">
              Production deployment tracking and progress visualization
            </p>
          </div>
          <Button variant="ghost" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Overall Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-900 mb-1">Overall Progress</h3>
              <p className="text-slate-600">
                {currentPhase ? `Current Phase: ${currentPhase.title}` : 'All phases complete'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-slate-900 mb-1">{overallProgress}%</div>
              <p className="text-slate-600">{completedTasks.length} of {totalTasks} tasks</p>
            </div>
          </div>
          <ProgressBar 
            value={overallProgress} 
            color="success"
            className="mb-4"
          />
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <StatCard
              label="Completed"
              value={completedTasks.length}
              icon={CheckCircle2}
              color="success"
            />
            <StatCard
              label="In Progress"
              value={inProgressTasks.length}
              icon={Clock}
              color="warning"
            />
            <StatCard
              label="Pending"
              value={pendingTasks.length}
              icon={Circle}
              color="info"
            />
            <StatCard
              label="Blocked"
              value={blockedTasks.length}
              icon={AlertCircle}
              color="danger"
            />
          </div>
        </Card>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          className={`px-4 py-2 border-b-2 transition-colors ${
            selectedView === 'timeline'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => setSelectedView('timeline')}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Timeline
        </button>
        <button
          className={`px-4 py-2 border-b-2 transition-colors ${
            selectedView === 'tasks'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => setSelectedView('tasks')}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Tasks
        </button>
        <button
          className={`px-4 py-2 border-b-2 transition-colors ${
            selectedView === 'team'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => setSelectedView('team')}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Team
        </button>
      </div>

      {/* Timeline View */}
      {selectedView === 'timeline' && (
        <div className="space-y-4">
          {deploymentPhases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              isExpanded={expandedPhases.has(phase.id)}
              onToggle={() => togglePhase(phase.id)}
              expandedSubPhases={expandedSubPhases}
              onToggleSubPhase={toggleSubPhase}
              isLast={index === deploymentPhases.length - 1}
            />
          ))}
        </div>
      )}

      {/* Tasks View */}
      {selectedView === 'tasks' && (
        <TasksView
          completed={completedTasks}
          inProgress={inProgressTasks}
          pending={pendingTasks}
          blocked={blockedTasks}
        />
      )}

      {/* Team View */}
      {selectedView === 'team' && <TeamView />}
    </div>
  );
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'success' | 'warning' | 'info' | 'danger';
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-blue-50 text-blue-600',
    danger: 'bg-red-50 text-red-600'
  };

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
        <div className="text-2xl">{value}</div>
      </div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}

/**
 * Phase Card Component
 */
interface PhaseCardProps {
  phase: DeploymentPhase;
  isExpanded: boolean;
  onToggle: () => void;
  expandedSubPhases: Set<string>;
  onToggleSubPhase: (id: string) => void;
  isLast: boolean;
}

function PhaseCard({ 
  phase, 
  isExpanded, 
  onToggle, 
  expandedSubPhases, 
  onToggleSubPhase,
  isLast 
}: PhaseCardProps) {
  const StatusIcon = statusIcons[phase.status];

  return (
    <div className="relative">
      {/* Vertical line connector */}
      {!isLast && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-slate-200" />
      )}

      <Card className="relative">
        <div 
          className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-start gap-4">
            {/* Status Icon */}
            <div className={`
              flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
              ${phase.status === 'completed' ? 'bg-green-100' : 
                phase.status === 'in-progress' ? 'bg-amber-100' : 
                'bg-slate-100'}
            `}>
              <StatusIcon className={`
                w-6 h-6
                ${phase.status === 'completed' ? 'text-green-600' : 
                  phase.status === 'in-progress' ? 'text-amber-600' : 
                  'text-slate-400'}
              `} />
            </div>

            {/* Phase Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-slate-900">
                  Phase {phase.number}: {phase.title}
                </h3>
                <Badge variant={statusColors[phase.status]}>
                  {phase.status}
                </Badge>
              </div>
              <p className="text-slate-600 mb-3">{phase.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {phase.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {phase.owner}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {phase.startDate} - {phase.endDate}
                </div>
              </div>

              <ProgressBar value={phase.progress} color="success" />
            </div>

            {/* Expand Icon */}
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <h4 className="text-slate-900 mb-4">Sub-Phases ({phase.subPhases.length})</h4>
            <div className="space-y-3">
              {phase.subPhases.map(subPhase => (
                <SubPhaseCard
                  key={subPhase.id}
                  subPhase={subPhase}
                  isExpanded={expandedSubPhases.has(subPhase.id)}
                  onToggle={() => onToggleSubPhase(subPhase.id)}
                />
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/**
 * Sub-Phase Card Component
 */
interface SubPhaseCardProps {
  subPhase: DeploymentSubPhase;
  isExpanded: boolean;
  onToggle: () => void;
}

function SubPhaseCard({ subPhase, isExpanded, onToggle }: SubPhaseCardProps) {
  const StatusIcon = statusIcons[subPhase.status];

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div 
        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <StatusIcon className={`
            w-5 h-5 flex-shrink-0
            ${subPhase.status === 'completed' ? 'text-green-600' : 
              subPhase.status === 'in-progress' ? 'text-amber-600' : 
              'text-slate-400'}
          `} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="text-slate-900">{subPhase.title}</h5>
              <Badge variant={statusColors[subPhase.status]} size="sm">
                {subPhase.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mb-2">{subPhase.description}</p>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>{subPhase.duration}</span>
              <span>{subPhase.tasks.length} tasks</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Tasks */}
      {isExpanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="space-y-2">
            {subPhase.tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Task Card Component
 */
interface TaskCardProps {
  task: DeploymentTask;
}

function TaskCard({ task }: TaskCardProps) {
  const StatusIcon = statusIcons[task.status];

  return (
    <div className="bg-white rounded p-3 border border-slate-200">
      <div className="flex items-start gap-3">
        <StatusIcon className={`
          w-4 h-4 flex-shrink-0 mt-0.5
          ${task.status === 'completed' ? 'text-green-600' : 
            task.status === 'in-progress' ? 'text-amber-600' : 
            'text-slate-400'}
        `} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h6 className="text-slate-900">{task.title}</h6>
            <Badge variant={priorityColors[task.priority]} size="sm">
              {task.priority}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mb-2">{task.description}</p>
          
          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            <span>Category: {task.category}</span>
            <span>Assignee: {task.assignee}</span>
            <span>Est: {task.estimatedHours}h</span>
            {task.actualHours > 0 && <span>Actual: {task.actualHours}h</span>}
            {task.completedDate && <span>Completed: {task.completedDate}</span>}
          </div>

          {task.acceptanceCriteria.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Acceptance Criteria:</p>
              <ul className="text-xs text-slate-600 space-y-0.5">
                {task.acceptanceCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-amber-500">✓</span>
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Tasks View Component
 */
interface TasksViewProps {
  completed: DeploymentTask[];
  inProgress: DeploymentTask[];
  pending: DeploymentTask[];
  blocked: DeploymentTask[];
}

function TasksView({ completed, inProgress, pending, blocked }: TasksViewProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <TaskList title="Completed" tasks={completed} color="success" />
      <TaskList title="In Progress" tasks={inProgress} color="warning" />
      <TaskList title="Pending" tasks={pending} color="info" />
      <TaskList title="Blocked" tasks={blocked} color="danger" />
    </div>
  );
}

/**
 * Task List Component
 */
interface TaskListProps {
  title: string;
  tasks: DeploymentTask[];
  color: 'success' | 'warning' | 'info' | 'danger';
}

function TaskList({ title, tasks, color }: TaskListProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-slate-900">{title}</h4>
        <Badge variant={color}>{tasks.length}</Badge>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tasks.map(task => (
          <div key={task.id} className="p-2 bg-slate-50 rounded text-sm">
            <div className="text-slate-900 mb-1">{task.title}</div>
            <div className="text-slate-600 text-xs">{task.assignee} • {task.category}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * Team View Component
 */
function TeamView() {
  const assignees = useMemo(() => {
    const assigneeMap = new Map<string, DeploymentTask[]>();
    
    deploymentPhases.forEach(phase => {
      phase.subPhases.forEach(subPhase => {
        subPhase.tasks.forEach(task => {
          if (!assigneeMap.has(task.assignee)) {
            assigneeMap.set(task.assignee, []);
          }
          assigneeMap.get(task.assignee)!.push(task);
        });
      });
    });
    
    return Array.from(assigneeMap.entries()).map(([name, tasks]) => ({
      name,
      tasks,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      pending: tasks.filter(task => task.status === 'pending').length,
      estimatedHours: tasks.reduce((sum, task) => sum + task.estimatedHours, 0),
      actualHours: tasks.reduce((sum, task) => sum + task.actualHours, 0)
    }));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {assignees.map(assignee => (
        <Card key={assignee.name} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-slate-900 mb-1">{assignee.name}</h4>
              <p className="text-slate-600">{assignee.tasks.length} tasks assigned</p>
            </div>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-2xl text-green-600">{assignee.completed}</div>
              <div className="text-xs text-green-700">Completed</div>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded">
              <div className="text-2xl text-amber-600">{assignee.inProgress}</div>
              <div className="text-xs text-amber-700">In Progress</div>
            </div>
            <div className="text-center p-2 bg-slate-100 rounded">
              <div className="text-2xl text-slate-600">{assignee.pending}</div>
              <div className="text-xs text-slate-700">Pending</div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-slate-600 pt-4 border-t border-slate-200">
            <span>Estimated: {assignee.estimatedHours}h</span>
            <span>Actual: {assignee.actualHours}h</span>
            <span>Variance: {assignee.actualHours - assignee.estimatedHours > 0 ? '+' : ''}{assignee.actualHours - assignee.estimatedHours}h</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default DeploymentDashboard;
