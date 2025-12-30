import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, FeatureType } from '../types';

// Profile Types
export interface EscalationRule {
  id: string;
  trigger: string;
  threshold?: string;
  approver: string;
  enabled: boolean;
}

export interface SecuritySettings {
  piiDetection: boolean;
  dataSensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
  approvedDataSources: string[];
  restrictedOperations: string[];
}

export interface ToolConnection {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  apiKeyConfigured?: boolean;
  lastSynced?: Date;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
}

export interface CustomWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedTotalMinutes: number;
}

export interface ClaudeProfile {
  id: string;
  name: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;

  // Core Settings
  role: Role | null;
  responsibilities: string[];

  // Features & Capabilities
  enabledFeatures: FeatureType[];

  // Tool Integrations
  connectedTools: ToolConnection[];

  // Governance
  escalationRules: EscalationRule[];
  securitySettings: SecuritySettings;

  // Persona Configuration
  baselinePrompt: string;
  customInstructions: string;
  securityLevel: 'strict' | 'balanced' | 'permissive';

  // Custom Workflows
  customWorkflows: CustomWorkflow[];
}

interface ProfileState {
  // Current Profile being built
  currentProfile: ClaudeProfile;

  // Wizard State
  currentStep: number;
  isWizardComplete: boolean;

  // Saved Profiles
  savedProfiles: ClaudeProfile[];

  // Actions
  setRole: (role: Role) => void;
  setResponsibilities: (responsibilities: string[]) => void;
  toggleFeature: (feature: FeatureType) => void;
  setEnabledFeatures: (features: FeatureType[]) => void;

  connectTool: (toolId: string) => void;
  disconnectTool: (toolId: string) => void;
  updateToolConnection: (tool: ToolConnection) => void;

  addEscalationRule: (rule: EscalationRule) => void;
  updateEscalationRule: (id: string, updates: Partial<EscalationRule>) => void;
  removeEscalationRule: (id: string) => void;

  setSecuritySettings: (settings: Partial<SecuritySettings>) => void;

  setBaselinePrompt: (prompt: string) => void;
  setCustomInstructions: (instructions: string) => void;
  setSecurityLevel: (level: 'strict' | 'balanced' | 'permissive') => void;

  addCustomWorkflow: (workflow: CustomWorkflow) => void;
  updateCustomWorkflow: (id: string, updates: Partial<CustomWorkflow>) => void;
  removeCustomWorkflow: (id: string) => void;

  // Wizard Navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeWizard: () => void;

  // Profile Management
  saveProfile: (name?: string) => void;
  loadProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  resetCurrentProfile: () => void;

  // Export
  exportProfileAsJSON: () => string;
  exportProfileAsYAML: () => string;
}

const defaultSecuritySettings: SecuritySettings = {
  piiDetection: true,
  dataSensitivityLevel: 'medium',
  approvedDataSources: [],
  restrictedOperations: [],
};

const defaultProfile: ClaudeProfile = {
  id: '',
  name: 'New Profile',
  version: '1.0.0',
  createdAt: new Date(),
  updatedAt: new Date(),
  role: null,
  responsibilities: [],
  enabledFeatures: [],
  connectedTools: [],
  escalationRules: [],
  securitySettings: defaultSecuritySettings,
  baselinePrompt: '',
  customInstructions: '',
  securityLevel: 'balanced',
  customWorkflows: [],
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      currentProfile: { ...defaultProfile, id: crypto.randomUUID() },
      currentStep: 0,
      isWizardComplete: false,
      savedProfiles: [],

      // Role & Responsibilities
      setRole: (role) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          role,
          updatedAt: new Date(),
        },
      })),

      setResponsibilities: (responsibilities) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          responsibilities,
          updatedAt: new Date(),
        },
      })),

      // Features
      toggleFeature: (feature) => set((state) => {
        const features = state.currentProfile.enabledFeatures;
        const newFeatures = features.includes(feature)
          ? features.filter((f) => f !== feature)
          : [...features, feature];

        return {
          currentProfile: {
            ...state.currentProfile,
            enabledFeatures: newFeatures,
            updatedAt: new Date(),
          },
        };
      }),

      setEnabledFeatures: (features) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          enabledFeatures: features,
          updatedAt: new Date(),
        },
      })),

      // Tool Connections
      connectTool: (toolId) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          connectedTools: state.currentProfile.connectedTools.map((t) =>
            t.id === toolId ? { ...t, connected: true, lastSynced: new Date() } : t
          ),
          updatedAt: new Date(),
        },
      })),

      disconnectTool: (toolId) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          connectedTools: state.currentProfile.connectedTools.map((t) =>
            t.id === toolId ? { ...t, connected: false } : t
          ),
          updatedAt: new Date(),
        },
      })),

      updateToolConnection: (tool) => set((state) => {
        const exists = state.currentProfile.connectedTools.find((t) => t.id === tool.id);
        const newTools = exists
          ? state.currentProfile.connectedTools.map((t) => (t.id === tool.id ? tool : t))
          : [...state.currentProfile.connectedTools, tool];

        return {
          currentProfile: {
            ...state.currentProfile,
            connectedTools: newTools,
            updatedAt: new Date(),
          },
        };
      }),

      // Escalation Rules
      addEscalationRule: (rule) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          escalationRules: [...state.currentProfile.escalationRules, rule],
          updatedAt: new Date(),
        },
      })),

      updateEscalationRule: (id, updates) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          escalationRules: state.currentProfile.escalationRules.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
          updatedAt: new Date(),
        },
      })),

      removeEscalationRule: (id) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          escalationRules: state.currentProfile.escalationRules.filter((r) => r.id !== id),
          updatedAt: new Date(),
        },
      })),

      // Security Settings
      setSecuritySettings: (settings) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          securitySettings: { ...state.currentProfile.securitySettings, ...settings },
          updatedAt: new Date(),
        },
      })),

      // Persona Configuration
      setBaselinePrompt: (prompt) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          baselinePrompt: prompt,
          updatedAt: new Date(),
        },
      })),

      setCustomInstructions: (instructions) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          customInstructions: instructions,
          updatedAt: new Date(),
        },
      })),

      setSecurityLevel: (level) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          securityLevel: level,
          updatedAt: new Date(),
        },
      })),

      // Custom Workflows
      addCustomWorkflow: (workflow) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          customWorkflows: [...state.currentProfile.customWorkflows, workflow],
          updatedAt: new Date(),
        },
      })),

      updateCustomWorkflow: (id, updates) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          customWorkflows: state.currentProfile.customWorkflows.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
          updatedAt: new Date(),
        },
      })),

      removeCustomWorkflow: (id) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          customWorkflows: state.currentProfile.customWorkflows.filter((w) => w.id !== id),
          updatedAt: new Date(),
        },
      })),

      // Wizard Navigation
      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 5)
      })),

      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 0)
      })),

      completeWizard: () => set({ isWizardComplete: true }),

      // Profile Management
      saveProfile: (name) => set((state) => {
        const profileToSave: ClaudeProfile = {
          ...state.currentProfile,
          name: name || state.currentProfile.name,
          updatedAt: new Date(),
        };

        const existingIndex = state.savedProfiles.findIndex(
          (p) => p.id === profileToSave.id
        );

        const newSavedProfiles = existingIndex >= 0
          ? state.savedProfiles.map((p, i) => (i === existingIndex ? profileToSave : p))
          : [...state.savedProfiles, profileToSave];

        return {
          savedProfiles: newSavedProfiles,
          currentProfile: profileToSave,
        };
      }),

      loadProfile: (id) => set((state) => {
        const profile = state.savedProfiles.find((p) => p.id === id);
        if (profile) {
          return {
            currentProfile: { ...profile },
            currentStep: 0,
            isWizardComplete: false,
          };
        }
        return state;
      }),

      deleteProfile: (id) => set((state) => ({
        savedProfiles: state.savedProfiles.filter((p) => p.id !== id),
      })),

      resetCurrentProfile: () => set({
        currentProfile: { ...defaultProfile, id: crypto.randomUUID() },
        currentStep: 0,
        isWizardComplete: false,
      }),

      // Export Functions
      exportProfileAsJSON: () => {
        const { currentProfile } = get();
        return JSON.stringify(currentProfile, null, 2);
      },

      exportProfileAsYAML: () => {
        const { currentProfile } = get();
        // Simple YAML conversion
        const toYAML = (obj: unknown, indent = 0): string => {
          const spaces = '  '.repeat(indent);
          if (Array.isArray(obj)) {
            return obj.map((item) => `${spaces}- ${typeof item === 'object' ? '\n' + toYAML(item, indent + 1) : item}`).join('\n');
          }
          if (typeof obj === 'object' && obj !== null) {
            return Object.entries(obj)
              .map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                  return `${spaces}${key}:\n${toYAML(value, indent + 1)}`;
                }
                return `${spaces}${key}: ${value}`;
              })
              .join('\n');
          }
          return String(obj);
        };
        return toYAML(currentProfile);
      },
    }),
    {
      name: 'claude-profile-storage',
      partialize: (state) => ({
        savedProfiles: state.savedProfiles,
        currentProfile: state.currentProfile,
      }),
    }
  )
);
