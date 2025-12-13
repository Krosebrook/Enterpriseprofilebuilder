import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  height?: string;
  className?: string;
}

export function ProgressBar({ 
  value, 
  color = 'primary', 
  showPercentage = false, 
  height = 'h-2.5',
  className = ''
}: ProgressBarProps) {
  
  const colors = {
    primary: "bg-amber-600",
    success: "bg-green-600",
    warning: "bg-amber-500",
    danger: "bg-red-600",
  };

  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm font-medium text-slate-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full ${height}`}>
        <div 
          className={`${colors[color]} ${height} rounded-full transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
