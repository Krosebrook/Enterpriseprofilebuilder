import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ContentViewer } from './components/ContentViewer';
import { RoleSelector } from './components/RoleSelector';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { PrintButton } from './components/PrintButton';
import { ToastContainer } from './components/ui/Toast';
import { ProgressBar } from './components/ui/ProgressBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSearch } from './hooks/useSearch';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getDeploymentProgress, addToViewHistory } from './utils/storage';
import { trackPageView } from './utils/analytics';
import { Role, Section, ToastNotification } from './types';
import { APP_VERSION, APP_DATE } from './data/constants';
import { ArrowUp, Menu, X } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useLocalStorage<Section>('active-section', 'overview');
  const [selectedRole, setSelectedRole] = useLocalStorage<Role>('selected-role', 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [deploymentProgress] = useState(getDeploymentProgress());

  const { results: searchResults, isSearching } = useSearch(searchQuery);

  // Track page views
  useEffect(() => {
    trackPageView(activeSection, selectedRole);
    addToViewHistory(activeSection);
  }, [activeSection, selectedRole]);

  // Handle section changes
  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setSearchQuery('');
    setShowSearch(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      handler: () => setShowSearch(!showSearch)
    },
    {
      key: '/',
      handler: () => setShowSearch(true)
    },
    {
      key: 'Escape',
      handler: () => {
        setShowSearch(false);
        setSearchQuery('');
      }
    }
  ]);

  // Add toast notification
  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const newToast: ToastNotification = {
      ...toast,
      id: Date.now().toString()
    };
    setToasts(prev => [...prev, newToast]);
  };

  // Remove toast notification
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0' : 'w-64'}`}>
        <div className={`fixed top-0 left-0 h-full ${sidebarCollapsed ? 'hidden' : 'block'}`}>
          <Navigation 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            onCollapse={() => setSidebarCollapsed(true)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-6 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                {sidebarCollapsed && (
                  <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Open sidebar"
                  >
                    <Menu className="w-6 h-6 text-slate-700" />
                  </button>
                )}
                <div>
                  <h1 className="text-slate-900 mb-2">INT Inc Enterprise Claude Profile Builder</h1>
                  <p className="text-slate-600">Comprehensive System Prompt Baseline & Feature Documentation</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PrintButton section={activeSection} />
              </div>
            </div>
            
            {/* Search and Role Selector */}
            <div className="flex gap-4 flex-wrap relative">
              <RoleSelector 
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
              />
              <div className="flex-1 min-w-[200px] relative">
                <SearchBar 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onFocus={() => setShowSearch(true)}
                  isSearching={isSearching}
                />
                {showSearch && searchQuery && (
                  <SearchResults
                    results={searchResults}
                    query={searchQuery}
                    onResultClick={handleSectionChange}
                    onClose={() => setShowSearch(false)}
                  />
                )}
              </div>
            </div>

            {/* Deployment Progress (only show on deployment page) */}
            {activeSection === 'deployment' && deploymentProgress > 0 && (
              <div className="mt-4">
                <ProgressBar
                  value={deploymentProgress}
                  label="Deployment Progress"
                  color="success"
                />
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
            <ContentViewer 
              section={activeSection}
              role={selectedRole}
              searchQuery={searchQuery}
              onAddToast={addToast}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-4 md:px-8 py-4 print:hidden">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600">
            <div className="flex items-center gap-4">
              <span>Version {APP_VERSION}</span>
              <span className="hidden md:inline">•</span>
              <span>{APP_DATE}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Classification: Internal - Training & Reference</span>
              <span className="hidden md:inline">•</span>
              <a 
                href="#" 
                className="text-amber-600 hover:text-amber-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  addToast({
                    type: 'info',
                    message: 'Contact CSO for security questions or CTO for technical support'
                  });
                }}
              >
                Get Help
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors z-40 print:hidden"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;