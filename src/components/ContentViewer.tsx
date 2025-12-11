import { Section, Role, ToastNotification } from '../types';
import { Overview } from './sections/Overview';
import { BaselinePrompt } from './sections/BaselinePrompt';
import { FeatureGuides } from './sections/FeatureGuides';
import { ToolsConnectors } from './sections/ToolsConnectors';
import { RoleProfiles } from './sections/RoleProfiles';
import { BestPractices } from './sections/BestPractices';
import { FAQ } from './sections/FAQ';
import { Deployment } from './sections/Deployment';

interface ContentViewerProps {
  section: Section;
  role: Role;
  searchQuery: string;
  onAddToast: (toast: Omit<ToastNotification, 'id'>) => void;
}

export function ContentViewer({ section, role, searchQuery, onAddToast }: ContentViewerProps) {
  const renderSection = () => {
    switch (section) {
      case 'overview':
        return <Overview />;
      case 'baseline':
        return <BaselinePrompt />;
      case 'features':
        return <FeatureGuides />;
      case 'tools':
        return <ToolsConnectors />;
      case 'roles':
        return <RoleProfiles selectedRole={role} />;
      case 'best-practices':
        return <BestPractices />;
      case 'faq':
        return <FAQ searchQuery={searchQuery} />;
      case 'deployment':
        return <Deployment onAddToast={onAddToast} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="prose prose-slate max-w-none">
      {renderSection()}
    </div>
  );
}
