// Core Types
import { LucideIcon } from 'lucide-react';

export type Section =
  | 'overview'
  | 'ecosystem'
  | 'baseline'
  | 'features'
  | 'tools'
  | 'roles'
  | 'best-practices'
  | 'faq'
  | 'deployment'
  | 'governance'
  | 'operations'
  | 'reference'
  | 'profile'; // Added profile builder

export type Role = 
  | 'All' 
  | 'Finance' 
  | 'Sales' 
  | 'Engineering' 
  | 'Marketing' 
  | 'Operations' 
  | 'HR' 
  | 'Product Management' 
  | 'Legal' 
  | 'Customer Support' 
  | 'Data Science' 
  | 'Executive / Leadership' 
  | 'QA / Testing';

export type FeatureType = 
  | 'web-search' 
  | 'memory' 
  | 'artifacts' 
  | 'code-execution' 
  | 'files' 
  | 'vision' 
  | 'voice-mode' 
  | 'projects' 
  | 'team-collaboration' 
  | 'api-integration';

export type FAQLevel = 'beginner' | 'intermediate' | 'advanced';

// Navigation & Search
export interface NavigationItem {
  id: Section;
  label: string;
  description: string;
  icon: LucideIcon;
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

// Baseline & Governance
export interface BaselineOption {
  id: string;
  name: string;
  roles?: Role[]; // Added for role-based selection
  description?: string;
  version: string;
  date: string;
  owner?: string;
  sections: {
    coreDirective: string;
    identity: string[];
    allowed: string[];
    notAllowed: string[];
    securityBehaviors: {
      title: string;
      icon: string;
      color: string;
      rules: string[];
      example?: string;
    }[];
    escalationTriggers: {
      trigger: string;
      action: string;
      id?: string;
    }[];
    communicationStandards: string[];
  };
}

export interface IncidentStep {
  id: string;
  step: string;
  action: string;
  owner: string;
}

export interface IncidentPlaybook {
  id: string;
  name: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  trigger: string;
  steps: IncidentStep[];
}

export interface SLAMetric {
  id: string;
  metric: string;
  target: string;
  window: string;
  description: string;
}

export interface RiskItem {
  id: string;
  category: 'Security' | 'Operational' | 'Legal' | 'Financial';
  risk: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
  owner?: string;
}

export interface StagingChecklistItem {
  id: string;
  category: string;
  item: string;
  critical: boolean;
}

export interface GovernanceData {
  playbooks: IncidentPlaybook[];
  sla: SLAMetric[];
  risks: RiskItem[];
  stagingChecklist: StagingChecklistItem[];
}

// Features & Guides
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

// Global Best Practices Section
export interface GlobalBestPractices {
  prompting: GlobalBestPracticeCategory[];
  security: GlobalBestPracticeCategory[];
  workflow: GlobalBestPracticeCategory[];
  collaboration?: GlobalBestPracticeCategory[];
  troubleshooting?: GlobalBestPracticeCategory[];
  advanced_techniques?: GlobalBestPracticeCategory[];
}

export interface GlobalBestPracticeCategory {
  id: string;
  title: string;
  description: string;
  roles?: Role[]; // Added for role-based filtering
  examples?: {
    bad?: string;
    good: string | React.ReactNode;
  }[];
  tips?: string[];
  approach?: string[];
  process?: string[];
  actions?: string[];
  reason?: string;
}

// MCP Servers
export interface MCPServer {
  id: string;
  name: string;
  description: string;
  category: 'data' | 'development' | 'communication' | 'design' | 'other';
  roles: Role[];
  useCases: string[];
}

// FAQ
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  level: FAQLevel;
  tags: string[];
  relatedQuestions?: string[];
}

// Deployment
export interface DeploymentTask {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  owner?: string;
  assignee?: string;
  dueDate?: string;
  completedDate?: string;
  category?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[];
  acceptanceCriteria?: string[];
}

export interface DeploymentSubPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  tasks: DeploymentTask[];
}

export interface DeploymentPhase {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  owner: string;
  stakeholders: string[];
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  startDate?: string;
  endDate?: string;
  subPhases: DeploymentSubPhase[];
}

export interface DeploymentStep {
  id: string;
  title: string;
  week: string | number;
  criticalPath: boolean;
  dependencies?: string[];
  tasks: DeploymentTask[];
}

// Role Profiles
export interface RoleProfile {
  role: Role;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'indigo' | 'emerald' | 'rose' | 'slate' | 'cyan' | 'zinc' | 'teal' | 'pink';
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

// UI & Analytics
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface AnalyticsEvent {
  event: string;
  section?: Section;
  role?: Role;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// Tutorial Types
export interface TutorialScenario {
  title: string;
  problem: string;
  goal: string;
  initialState: string;
  validation: {
    type: 'keyword' | 'structure';
    pattern: string | string[];
    feedback: string;
  };
  successResponse: {
    thinking: string;
    output: string;
    explanation: string;
  };
}

export interface TechniqueTutorial {
  techniqueId: string;
  title: string;
  scenarios: TutorialScenario[];
}

// Document Resource Types (for integrated documentation)
export type DocumentCategory =
  | 'deployment'
  | 'compliance'
  | 'guide'
  | 'kyle'
  | 'mcp'
  | 'roles'
  | 'reference'
  | 'presentation';

export interface DocumentResource {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  fileName: string;
  downloadPath: string;
  section: Section;
  tags: string[];
  lastUpdated?: string;
  author?: string;
  order?: number;
  featured?: boolean;
}

// Extended MCP Server type for expanded catalog
export interface MCPServerExtended {
  id: string;
  name: string;
  description: string;
  category: 'project-management' | 'crm' | 'payments' | 'automation' | 'developer' | 'design' | 'knowledge' | 'communication' | 'data' | 'development' | 'other';
  mcpUrl?: string;
  authType?: 'oauth2' | 'api-key' | 'none';
  platforms?: ('web' | 'desktop')[];
  useCases: string[];
  capabilities?: string[];
  configExample?: string;
  securityNotes?: string;
  roles: Role[];
}

// Compliance Checklist Types
export interface ComplianceCheckItem {
  id: string;
  category: 'security' | 'data-privacy' | 'access-control' | 'audit' | 'training' | 'technical';
  title: string;
  description: string;
  required: boolean;
  status?: 'pending' | 'in-progress' | 'completed' | 'not-applicable';
  notes?: string;
  assignee?: string;
  dueDate?: string;
}

export interface ComplianceChecklist {
  id: string;
  name: string;
  description: string;
  items: ComplianceCheckItem[];
  lastUpdated: string;
  version: string;
}

// Presentation/Kyle Materials Types
export interface PresentationPhase {
  id: string;
  number: number;
  title: string;
  description: string;
  subPhases: {
    id: string;
    title: string;
    content: string;
    deliveryNotes?: string;
  }[];
  duration?: string;
  keyPoints?: string[];
}

export interface KyleMaterial {
  id: string;
  title: string;
  type: 'narrative' | 'roadmap' | 'tracker' | 'quick-reference';
  description: string;
  content: string;
  deliveryTime?: string;
  audience?: string;
}

// Framework Types (R-I-S-E, F-L-O-W)
export interface PromptingFramework {
  id: string;
  name: string;
  acronym: string;
  description: string;
  steps: {
    letter: string;
    name: string;
    description: string;
    examples?: string[];
  }[];
  useCases: string[];
}

// Self-Assessment Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  categoryBreakdown: {
    category: string;
    correct: number;
    total: number;
  }[];
  recommendations: string[];
}
