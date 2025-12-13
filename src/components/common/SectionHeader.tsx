import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, icon: Icon, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <Icon className="w-8 h-8 text-amber-600" />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
