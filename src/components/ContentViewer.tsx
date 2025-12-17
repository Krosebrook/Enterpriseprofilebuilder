import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useToast } from '../contexts/ToastContext';

// Legacy Sections (to be refactored later if needed, but keeping for now as they work)
import { BaselinePrompt } from './sections/BaselinePrompt';
import { FeatureGuides } from './sections/FeatureGuides';
import { ToolsConnectors } from './sections/ToolsConnectors';
import { RoleProfiles } from './sections/RoleProfiles';
import { BestPractices } from './sections/BestPractices';
import { FAQ } from './sections/FAQ';
import { Governance } from './sections/Governance';
import { governanceData } from '../data/governance';

// New Feature Modules (Max Depth Refactor)
import { Dashboard } from '../features/dashboard/Dashboard';
import { Deployment } from '../features/deployment/Deployment';
import { OperationsManual } from '../features/operations/OperationsManual';
import { ReferenceLibrary } from '../features/library/ReferenceLibrary';
import { EcosystemExplorer } from '../features/ecosystem/EcosystemExplorer';
import { IntegrationMarketplace } from '../features/integrations/IntegrationMarketplace';

// Profile Builder
import { ProfileWizard } from './profile/ProfileWizard';

export function ContentViewer() {
  const { activeSection, selectedRole, searchQuery } = useNavigation();
  const { addToast } = useToast();

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Dashboard />;
      case 'ecosystem':
        return <EcosystemExplorer />;
      case 'baseline':
        return <BaselinePrompt />;
      case 'features':
        return <FeatureGuides />;
      case 'tools':
        return <ToolsConnectors />;
      case 'roles':
        return <RoleProfiles selectedRole={selectedRole} />;
      case 'best-practices':
        return <BestPractices />;
      case 'faq':
        return <FAQ searchQuery={searchQuery} />;
      case 'deployment':
        return <Deployment />;
      case 'governance':
        return <Governance data={governanceData} />;
      case 'operations':
        return <OperationsManual />;
      case 'reference':
        return <ReferenceLibrary />;
      case 'integrations': // New Route
        return <IntegrationMarketplace />;
      case 'profile':
        return <ProfileWizard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-300 slide-in-from-bottom-2">
      {renderSection()}
    </div>
  );
}
