import React from 'react';
import { AppProvider } from './providers/AppProvider';
import { useToast } from './contexts/ToastContext';
import { MainLayout } from './components/layout/MainLayout';
import { ContentViewer } from './components/ContentViewer';
import { ToastContainer } from './components/ui/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SkipToMainContent } from './lib/accessibility';
import { useFeaturePreloading, useInitialPreload } from './hooks/useFeaturePreloading';
import { initPerformanceMonitoring } from './lib/performance';
import { FeedbackWidget } from './components/Feedback/FeedbackWidget';

function AppContent() {
  const { toasts, removeToast } = useToast();
  
  // Intelligent preloading for better performance
  useFeaturePreloading();
  useInitialPreload();
  
  // Initialize performance monitoring
  React.useEffect(() => {
    initPerformanceMonitoring();
  }, []);
  
  return (
    <>
      <SkipToMainContent />
      <MainLayout>
        <ErrorBoundary>
          <main id="main-content" tabIndex={-1}>
            <ContentViewer />
          </main>
        </ErrorBoundary>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <FeedbackWidget />
      </MainLayout>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;