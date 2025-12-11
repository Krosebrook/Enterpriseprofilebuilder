// Core Types
export type Role = 'All' | 'Finance' | 'Sales' | 'Engineering' | 'Marketing' | 'Operations' | 'HR';

export type Section = 
  | 'overview'
  | 'baseline'
  | 'features'
  | 'tools'
  | 'roles'
  | 'best-practices'
  | 'faq'
  | 'deployment';

export type FAQLevel = 'beginner' | 'intermediate' | 'advanced';

export type FeatureType = 'web-search' | 'memory' | 'artifacts' | 'code-execution' | 'files';

// Content Types
export interface FAQItem {
  id: string;
  level: FAQLevel;
  question: string;
  answer: string;
  tags: string[];
  relatedQuestions?: string[];
}

export interface FeatureGuide {
  id: FeatureType;
  name: string;
  description: string;
  whenToUse: string[];
  whenNotToUse: string[];
  bestPractices: BestPractice[];
  examples: Example[];
  limitations?: string[];
}

export interface BestPractice {
  id: string;
  title: string;
  description: string;
  examples?: {
    bad?: string;
    good: string;
  };
}

export interface Example {
  id: string;
  title: string;
  description: string;
  code?: string;
  output?: string;
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  roles: Role[];
  useCases: string[];
  category: 'data' | 'communication' | 'development' | 'design' | 'other';
}

export interface RoleProfile {
  role: Role;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'indigo';
  responsibilities: string;
  capabilities: string[];
  features: {
    enabled: string[];
    disabled: string[];
  };
  tools: string[];
  escalationRules: string[];
  commonRequests: CommonRequest[];
  quickWins: string[];
}

export interface CommonRequest {
  id: string;
  request: string;
  process: string[];
  estimatedTime?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
}

export interface DeploymentStep {
  id: string;
  week: string;
  title: string;
  tasks: Task[];
  criticalPath: boolean;
  dependencies?: string[];
}

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  owner?: string;
  dueDate?: string;
}

export interface NavigationItem {
  id: Section;
  label: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  section: Section;
  content: string;
  relevance: number;
  path: string[];
}

export interface UserPreferences {
  role: Role;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  bookmarks: string[];
  completedTasks: string[];
  viewHistory: string[];
}

export interface AnalyticsEvent {
  event: string;
  section?: Section;
  role?: Role;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// UI State Types
export interface AppState {
  activeSection: Section;
  selectedRole: Role;
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  sidebarCollapsed: boolean;
  preferences: UserPreferences;
  viewHistory: Section[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
