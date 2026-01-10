import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useNavigation } from '../../contexts/NavigationContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isSidebarCollapsed } = useNavigation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Fixed width or collapsed */}
      <div 
        className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-0' : 'w-72'
        }`}
      >
        <Sidebar className={isSidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-72'} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="py-6 px-8 border-t border-slate-200 mt-auto bg-white/50">
            <div className="flex justify-between items-center text-sm text-slate-500 max-w-7xl mx-auto">
               <span>INT Inc. Enterprise Internal</span>
               <div className="flex gap-4">
                 <span>v2.4.0</span>
                 <a href="#" className="hover:text-amber-600 transition-colors">Support</a>
               </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
