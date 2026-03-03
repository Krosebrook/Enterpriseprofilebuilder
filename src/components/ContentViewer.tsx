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

// Always-loaded features
import { Dashboard } from '../features/dashboard/Dashboard';
import { Deployment } from '../features/deployment/Deployment';
import { OperationsManual } from '../features/operations/OperationsManual';
import { ReferenceLibrary } from '../features/library/ReferenceLibrary';

// Lazy-loaded heavy features (code splitting)
const EcosystemExplorer = React.lazy(() => import('../features/ecosystem/EcosystemExplorer').then(m => ({ default: m.EcosystemExplorer })));
const IntegrationMarketplace = React.lazy(() => import('../features/integrations/IntegrationMarketplace').then(m => ({ default: m.IntegrationMarketplace })));
const AgentBuilder = React.lazy(() => import('../features/agents/AgentBuilder').then(m => ({ default: m.AgentBuilder })));
const FeatureMatrix = React.lazy(() => import('../features/comparison/components/FeatureMatrix').then(m => ({ default: m.FeatureMatrix })));
const StrategyDashboard = React.lazy(() => import('../features/strategy/components/StrategyDashboard').then(m => ({ default: m.StrategyDashboard })));
const ROICalculator = React.lazy(() => import('../features/roi/components/ROICalculator').then(m => ({ default: m.ROICalculator })));
const AssessmentEngine = React.lazy(() => import('../features/assessment/components/AssessmentEngine').then(m => ({ default: m.AssessmentEngine })));
const Governance = React.lazy(() => import('../features/governance/Governance').then(m => ({ default: m.Governance })));
const Settings = React.lazy(() => import('../features/settings/Settings').then(m => ({ default: m.Settings })));
const RoleProfiles = React.lazy(() => import('../features/roles/RoleProfiles').then(m => ({ default: m.RoleProfiles })));
const BestPractices = React.lazy(() => import('../features/best-practices/BestPractices').then(m => ({ default: m.BestPractices })));
const FAQ = React.lazy(() => import('../features/faq/FAQ').then(m => ({ default: m.FAQ })));
const AnalyticsDashboard = React.lazy(() => import('../features/analytics/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const KnowledgeBase = React.lazy(() => import('../features/knowledge-base/KnowledgeBase').then(m => ({ default: m.KnowledgeBase })));
const CollaborationHub = React.lazy(() => import('../features/collaboration/CollaborationHub').then(m => ({ default: m.CollaborationHub })));

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
          <SuspenseWrapper featureName="Role Profiles" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
             <RoleProfiles />
          </SuspenseWrapper>
        );
      
      case 'best-practices':
        return (
          <SuspenseWrapper featureName="Best Practices" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <BestPractices />
          </SuspenseWrapper>
        );
      
      case 'faq':
        return (
          <SuspenseWrapper featureName="FAQ" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <FAQ />
          </SuspenseWrapper>
        );
      
      case 'deployment':
        return (
          <FeatureErrorBoundary featureName="Deployment">
            <Deployment />
          </FeatureErrorBoundary>
        );
      
      case 'governance':
        return (
          <SuspenseWrapper featureName="Governance" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <Governance />
          </SuspenseWrapper>
        );

      case 'settings':
        return (
          <SuspenseWrapper featureName="Settings" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <Settings />
          </SuspenseWrapper>
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

      case 'comparison':
        return (
          <SuspenseWrapper featureName="Feature Matrix" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <FeatureMatrix />
          </SuspenseWrapper>
        );

      case 'strategy':
        return (
          <SuspenseWrapper featureName="Strategy Dashboard" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <StrategyDashboard />
          </SuspenseWrapper>
        );

      case 'roi':
        return (
          <SuspenseWrapper featureName="ROI Calculator" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <ROICalculator />
          </SuspenseWrapper>
        );

      case 'assessment':
        return (
          <SuspenseWrapper featureName="Assessment Engine" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <AssessmentEngine />
          </SuspenseWrapper>
        );
      
      case 'analytics':
        return (
          <SuspenseWrapper featureName="Analytics Dashboard" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <AnalyticsDashboard />
          </SuspenseWrapper>
        );

      case 'knowledge':
        return (
          <SuspenseWrapper featureName="Knowledge Base" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <KnowledgeBase />
          </SuspenseWrapper>
        );

      case 'collaboration':
        return (
          <SuspenseWrapper featureName="Collaboration Hub" fallback={<div className="p-6"><AgentCardSkeleton /></div>}>
            <CollaborationHub />
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