import { AppProvider } from './providers/AppProvider';
import { useToast } from './contexts/ToastContext';
import { MainLayout } from './components/layout/MainLayout';
import { ContentViewer } from './components/ContentViewer';
import { ToastContainer } from './components/ui/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const { toasts, removeToast } = useToast();
  
  return (
    <MainLayout>
      <ErrorBoundary>
        <ContentViewer />
      </ErrorBoundary>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </MainLayout>
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
