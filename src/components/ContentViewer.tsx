import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useToast } from '../contexts/ToastContext';
import { FeatureErrorBoundary } from './ErrorBoundary/FeatureErrorBoundary';
import { SuspenseWrapper } from './LoadingStates/SuspenseWrapper';
import { AgentCardSkeleton } from './LoadingStates/SkeletonLoader';

// Legacy Sections (to be refactored later if needed, but keeping for now as they work)
import { BaselinePrompt } from './sections/BaselinePrompt';
import { FeatureGuides } from './sections/FeatureGuides';
import { ToolsConnectors } from './sections/ToolsConnectors';
import { RoleProfiles } from './sections/RoleProfiles';
import { BestPractices } from './sections/BestPractices';
import { FAQ } from './sections/FAQ';
import { Governance } from './sections/Governance';
import { governanceData } from '../data/governance';

// Always-loaded features
import { Dashboard } from '../features/dashboard/Dashboard';
import { Deployment } from '../features/deployment/Deployment';
import { OperationsManual } from '../features/operations/OperationsManual';
import { ReferenceLibrary } from '../features/library/ReferenceLibrary';

// Lazy-loaded heavy features (code splitting)
const EcosystemExplorer = React.lazy(() => import('../features/ecosystem/EcosystemExplorer').then(m => ({ default: m.EcosystemExplorer })));
const IntegrationMarketplace = React.lazy(() => import('../features/integrations/IntegrationMarketplace').then(m => ({ default: m.IntegrationMarketplace })));
const AgentBuilder = React.lazy(() => import('../features/agents/AgentBuilder').then(m => ({ default: m.AgentBuilder })));

export function ContentViewer() {
  const { activeSection, selectedRole, searchQuery } = useNavigation();
  const { addToast } = useToast();

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <FeatureErrorBoundary featureName="Dashboard">
            <Dashboard />
          </FeatureErrorBoundary>
        );
      
      case 'ecosystem':
        return (
          <SuspenseWrapper featureName="Ecosystem Explorer" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <EcosystemExplorer />
          </SuspenseWrapper>
        );
      
      case 'baseline':
        return (
          <FeatureErrorBoundary featureName="Baseline Prompt">
            <BaselinePrompt />
          </FeatureErrorBoundary>
        );
      
      case 'features':
        return (
          <FeatureErrorBoundary featureName="Feature Guides">
            <FeatureGuides />
          </FeatureErrorBoundary>
        );
      
      case 'tools':
        return (
          <FeatureErrorBoundary featureName="Tools & Connectors">
            <ToolsConnectors />
          </FeatureErrorBoundary>
        );
      
      case 'roles':
        return (
          <FeatureErrorBoundary featureName="Role Profiles">
            <RoleProfiles selectedRole={selectedRole} />
          </FeatureErrorBoundary>
        );
      
      case 'best-practices':
        return (
          <FeatureErrorBoundary featureName="Best Practices">
            <BestPractices />
          </FeatureErrorBoundary>
        );
      
      case 'faq':
        return (
          <FeatureErrorBoundary featureName="FAQ">
            <FAQ searchQuery={searchQuery} />
          </FeatureErrorBoundary>
        );
      
      case 'deployment':
        return (
          <FeatureErrorBoundary featureName="Deployment">
            <Deployment />
          </FeatureErrorBoundary>
        );
      
      case 'governance':
        return (
          <FeatureErrorBoundary featureName="Governance">
            <Governance data={governanceData} />
          </FeatureErrorBoundary>
        );
      
      case 'operations':
        return (
          <FeatureErrorBoundary featureName="Operations Manual">
            <OperationsManual />
          </FeatureErrorBoundary>
        );
      
      case 'reference':
        return (
          <FeatureErrorBoundary featureName="Reference Library">
            <ReferenceLibrary />
          </FeatureErrorBoundary>
        );
      
      case 'integrations':
        return (
          <SuspenseWrapper featureName="Integration Marketplace" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <IntegrationMarketplace />
          </SuspenseWrapper>
        );
      
      case 'agents':
        return (
          <SuspenseWrapper featureName="Agent Builder" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <AgentBuilder />
          </SuspenseWrapper>
        );
      
      default:
        return (
          <FeatureErrorBoundary featureName="Dashboard">
            <Dashboard />
          </FeatureErrorBoundary>
        );
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-300 slide-in-from-bottom-2">
      {renderSection()}
    </div>
  );
}