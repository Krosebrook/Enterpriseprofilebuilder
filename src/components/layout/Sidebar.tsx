import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Hammer,
  Users,
  BookOpen,
  HelpCircle,
  Rocket,
  ChevronLeft,
  FileText, // Icon for Operations Manual
  Library, // Icon for Reference Library
  Globe, // Icon for Ecosystem Explorer
  Puzzle, // Icon for Integrations
  UserCog // Icon for Profile Builder
} from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { Section } from '../../types';

interface SidebarProps {
  className?: string;
}

const NAV_ITEMS: { id: Section | 'integrations'; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile Builder', icon: UserCog }, // Profile Builder - prominent placement
  { id: 'ecosystem', label: 'Ecosystem Explorer', icon: Globe },
  { id: 'integrations', label: 'App Marketplace', icon: Puzzle },
  { id: 'baseline', label: 'System Baseline', icon: ShieldCheck },
  { id: 'features', label: 'Feature Guides', icon: Sparkles },
  { id: 'tools', label: 'MCP Tools', icon: Hammer },
  { id: 'roles', label: 'Role Profiles', icon: Users },
  { id: 'best-practices', label: 'Best Practices', icon: BookOpen },
  { id: 'operations', label: 'Operations Manual', icon: FileText },
  { id: 'reference', label: 'Reference Library', icon: Library },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'deployment', label: 'Deployment', icon: Rocket },
];

export function Sidebar({ className = '' }: SidebarProps) {
  const { activeSection, setActiveSection, toggleSidebar } = useNavigation();

  return (
    <aside className={`h-full bg-slate-900 text-slate-300 flex flex-col shadow-xl ${className}`}>
      {/* Logo / Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-900/20">
            I
          </div>
          <div>
            <div className="font-bold text-slate-100 tracking-tight">INT Inc.</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Enterprise</div>
          </div>
        </div>
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-slate-800 rounded-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as Section)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-amber-400'}`} />
              <span className="font-medium text-sm">{item.label}</span>
              
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="text-xs text-slate-500 text-center">
          © 2025 INT Inc.<br />
          Internal Use Only
        </div>
      </div>
    </aside>
  );
}
