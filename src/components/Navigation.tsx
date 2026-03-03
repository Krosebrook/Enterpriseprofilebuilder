import { Section } from '../types';
import { navigationData } from '../data/navigation';
import { BookOpen, Settings, Zap, Wrench, Users, Lightbulb, HelpCircle, CheckSquare, ChevronLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip } from './ui/Tooltip';

interface NavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onCollapse?: () => void;
}

const iconComponents = {
  BookOpen,
  Settings,
  Zap,
  Wrench,
  Users,
  Lightbulb,
  HelpCircle,
  CheckSquare
};

export function Navigation({ activeSection, onSectionChange, onCollapse }: NavigationProps) {
  return (
    <nav className="w-64 bg-slate-900 text-white p-6 flex flex-col h-screen" role="navigation">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-amber-400">INT Inc</div>
          {onCollapse && (
            <Tooltip content="Collapse sidebar">
              <button
                onClick={onCollapse}
                className="p-1 hover:bg-slate-800 rounded transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </Tooltip>
          )}
        </div>
        <h2 className="text-slate-200">Claude Profile Builder</h2>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {navigationData.map((item) => {
          const Icon = iconComponents[item.icon as keyof typeof iconComponents];
          const isActive = activeSection === item.id;
          
          return (
            <Tooltip key={item.id} content={item.description} position="right">
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-amber-500 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant={isActive ? 'default' : 'info'} size="sm">
                    {item.badge}
                  </Badge>
                )}
              </button>
            </Tooltip>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700">
        <div className="text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Staff:</span>
            <span className="text-white">41 FT</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Engineers:</span>
            <span className="text-white">50-200</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Compliance:</span>
            <Badge variant="success" size="sm">SOC 2</Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}
