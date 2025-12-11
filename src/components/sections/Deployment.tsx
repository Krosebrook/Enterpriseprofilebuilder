import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { deploymentData } from '../../data/deployment';
import { isTaskCompleted, markTaskCompleted, markTaskIncomplete } from '../../utils/storage';
import { trackTaskCompletion } from '../../utils/analytics';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { ToastNotification } from '../../types';

interface DeploymentProps {
  onAddToast: (toast: Omit<ToastNotification, 'id'>) => void;
}

export function Deployment({ onAddToast }: DeploymentProps) {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Load completed tasks from storage
  useEffect(() => {
    const tasks: Record<string, boolean> = {};
    deploymentData.forEach(step => {
      step.tasks.forEach(task => {
        tasks[task.id] = isTaskCompleted(task.id);
      });
    });
    setCompletedTasks(tasks);
  }, []);

  const handleTaskToggle = (taskId: string) => {
    const newState = !completedTasks[taskId];
    
    if (newState) {
      markTaskCompleted(taskId);
      trackTaskCompletion(taskId, true);
      onAddToast({
        type: 'success',
        message: 'Task marked as completed!'
      });
    } else {
      markTaskIncomplete(taskId);
      trackTaskCompletion(taskId, false);
      onAddToast({
        type: 'info',
        message: 'Task marked as incomplete'
      });
    }

    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: newState
    }));
  };

  // Calculate overall progress
  const totalTasks = deploymentData.reduce((sum, step) => sum + step.tasks.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const overallProgress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  // Calculate step progress
  const getStepProgress = (stepId: string) => {
    const step = deploymentData.find(s => s.id === stepId);
    if (!step) return 0;
    
    const stepCompleted = step.tasks.filter(t => completedTasks[t.id]).length;
    return step.tasks.length > 0 ? (stepCompleted / step.tasks.length) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-slate-900 mb-4">Deployment Checklist</h2>
        <p className="text-slate-700">
          Step-by-step guide to deploying Claude Enterprise across INT Inc. Track your progress as you complete each task.
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-900">Overall Deployment Progress</h3>
            <span className="text-slate-600">
              {completedCount} of {totalTasks} tasks completed
            </span>
          </div>
          <ProgressBar
            value={overallProgress}
            color={overallProgress === 100 ? 'success' : 'primary'}
            showPercentage
          />
        </div>

        {overallProgress === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-900">🎉 Congratulations! Deployment Complete</p>
              <p className="text-green-700 text-sm mt-1">
                All tasks have been completed. Review the Post-Deployment Checklist below.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Deployment Timeline */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-3">Deployment Timeline</h3>
        <p className="text-slate-700">
          Complete deployment takes approximately 3-4 weeks, from initial setup to full monitoring and adoption.
        </p>
      </div>

      {/* Deployment Steps */}
      <div className="space-y-6">
        {deploymentData.map((step, index) => {
          const stepProgress = getStepProgress(step.id);
          const stepCompleted = step.tasks.every(t => completedTasks[t.id]);
          const stepInProgress = step.tasks.some(t => completedTasks[t.id]) && !stepCompleted;

          return (
            <Card key={step.id} className="overflow-hidden">
              {/* Step Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  stepCompleted ? 'bg-green-500' : stepInProgress ? 'bg-amber-500' : 'bg-slate-300'
                } text-white`}>
                  {stepCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-slate-900">{step.title}</h3>
                    <Badge variant="default" size="sm">{step.week}</Badge>
                    {step.criticalPath && (
                      <Badge variant="danger" size="sm">Critical Path</Badge>
                    )}
                  </div>
                  
                  <ProgressBar
                    value={stepProgress}
                    color={stepCompleted ? 'success' : stepInProgress ? 'warning' : 'primary'}
                  />

                  {step.dependencies && step.dependencies.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Depends on: {step.dependencies.map(depId => {
                          const dep = deploymentData.find(d => d.id === depId);
                          return dep?.title;
                        }).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {step.tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskToggle(task.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                      completedTasks[task.id]
                        ? 'bg-green-50 hover:bg-green-100'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {completedTasks[task.id] ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`block ${
                        completedTasks[task.id] ? 'text-slate-600 line-through' : 'text-slate-700'
                      }`}>
                        {task.description}
                      </span>
                      {task.owner && (
                        <span className="text-sm text-slate-500 mt-1 block">
                          Owner: {task.owner}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Success Metrics */}
      <Card>
        <h3 className="text-slate-900 mb-4">Success Metrics</h3>
        <p className="text-slate-700 mb-4">Track these metrics to measure deployment success:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-slate-900 mb-2">Adoption Metrics</p>
            <ul className="space-y-1 text-slate-700">
              <li>• Daily Active Users (DAU)</li>
              <li>• Feature utilization rate</li>
              <li>• Average conversations per user</li>
              <li>• Training completion rate</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-slate-900 mb-2">Quality Metrics</p>
            <ul className="space-y-1 text-slate-700">
              <li>• Security incidents (target: 0)</li>
              <li>• User satisfaction score</li>
              <li>• Task completion time (30% faster)</li>
              <li>• Escalation rate (human review)</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-slate-900 mb-2">Cost Metrics</p>
            <ul className="space-y-1 text-slate-700">
              <li>• Average tokens per conversation</li>
              <li>• Monthly spend vs budget</li>
              <li>• Cost per department</li>
              <li>• ROI calculation</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-slate-900 mb-2">Compliance Metrics</p>
            <ul className="space-y-1 text-slate-700">
              <li>• Audit log completeness</li>
              <li>• ZDR verification</li>
              <li>• RBAC enforcement</li>
              <li>• Data leakage incidents (target: 0)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Post-Deployment Checklist */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Post-Deployment Verification</h3>
        <div className="space-y-2">
          {[
            'All users can login successfully',
            'Features are enabled per role (verified)',
            'MCP connectors authorized and tested',
            '>80% of staff completed training',
            'Cost dashboard monitoring is active',
            'Security alerts configured in Sentry',
            'Claude champions assigned per department',
            'Feedback collection process established'
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 text-slate-700">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="border-l-4 border-amber-500 bg-amber-50 p-6 rounded-r-lg">
        <h3 className="text-slate-900 mb-3">Need Help?</h3>
        <ul className="space-y-2 text-slate-700">
          <li><strong>Security incident?</strong> → Contact CSO immediately</li>
          <li><strong>Feature request?</strong> → Discuss with CTO (features controlled at org level)</li>
          <li><strong>Unsure if you should ask Claude?</strong> → Ask HR or your manager</li>
          <li><strong>Claude is hallucinating?</strong> → Report to security team; don't rely on output</li>
        </ul>
      </div>
    </div>
  );
}
