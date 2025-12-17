import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, FeatureType } from '../types';

// Profile Types
export interface EscalationRule {
  id: string;
  trigger: string;
  threshold?: string;
  approver: string;
  action: string;
}

export interface ToolConnection {
  id: string;
  name: string;
  connected: boolean;
  apiKeySet: boolean;
  lastConnected?: string;
}

export interface SecuritySettings {
  piiDetection: boolean;
  dataSensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
  approvedDataSources: string[];
  restrictedOperations: string[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface CustomWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  estimatedTime?: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface ClaudeProfile {
  id: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;

  // Core
  role: Role;
  responsibilities: string;
  capabilities: string[];

  // Features
  enabledFeatures: FeatureType[];
  disabledFeatures: FeatureType[];

  // Tools
  connectedTools: ToolConnection[];
  selectedMcpServers: string[];

  // Governance
  escalationRules: EscalationRule[];
  securitySettings: SecuritySettings;

  // Persona
  baselineId: string;
  customInstructions: string;
  securityLevel: 'strict' | 'balanced' | 'permissive';

  // Workflows
  customWorkflows: CustomWorkflow[];
}

// Default values
const defaultSecuritySettings: SecuritySettings = {
  piiDetection: true,
  dataSensitivityLevel: 'medium',
  approvedDataSources: [],
  restrictedOperations: [],
};

const defaultProfile: Partial<ClaudeProfile> = {
  role: 'All',
  responsibilities: '',
  capabilities: [],
  enabledFeatures: ['web-search', 'memory', 'artifacts', 'files'],
  disabledFeatures: [],
  connectedTools: [],
  selectedMcpServers: [],
  escalationRules: [],
  securitySettings: defaultSecuritySettings,
  baselineId: 'balanced-v2',
  customInstructions: '',
  securityLevel: 'balanced',
  customWorkflows: [],
};

// Wizard State
export interface WizardState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
}

// Store State
interface ProfileState {
  // Current profile being edited
  currentProfile: Partial<ClaudeProfile>;

  // Saved profiles
  savedProfiles: ClaudeProfile[];

  // Wizard state
  wizard: WizardState;

  // Actions
  setCurrentProfile: (profile: Partial<ClaudeProfile>) => void;
  updateProfile: (updates: Partial<ClaudeProfile>) => void;
  resetProfile: () => void;
  saveProfile: () => ClaudeProfile;
  loadProfile: (id: string) => void;
  deleteProfile: (id: string) => void;

  // Wizard actions
  setWizardStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeWizard: () => void;

  // Feature actions
  toggleFeature: (feature: FeatureType) => void;

  // Tool actions
  connectTool: (toolId: string) => void;
  disconnectTool: (toolId: string) => void;

  // Escalation actions
  addEscalationRule: (rule: Omit<EscalationRule, 'id'>) => void;
  updateEscalationRule: (id: string, updates: Partial<EscalationRule>) => void;
  removeEscalationRule: (id: string) => void;

  // Workflow actions
  addWorkflow: (workflow: Omit<CustomWorkflow, 'id'>) => void;
  updateWorkflow: (id: string, updates: Partial<CustomWorkflow>) => void;
  removeWorkflow: (id: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      currentProfile: { ...defaultProfile },
      savedProfiles: [],
      wizard: {
        currentStep: 0,
        totalSteps: 6,
        isComplete: false,
      },

      // Profile actions
      setCurrentProfile: (profile) => set({ currentProfile: profile }),

      updateProfile: (updates) => set((state) => ({
        currentProfile: { ...state.currentProfile, ...updates }
      })),

      resetProfile: () => set({
        currentProfile: { ...defaultProfile },
        wizard: { currentStep: 0, totalSteps: 6, isComplete: false }
      }),

      saveProfile: () => {
        const state = get();
        const now = new Date().toISOString();
        const newProfile: ClaudeProfile = {
          id: crypto.randomUUID(),
          name: state.currentProfile.name || `Profile ${state.savedProfiles.length + 1}`,
          version: 1,
          createdAt: now,
          updatedAt: now,
          role: state.currentProfile.role || 'All',
          responsibilities: state.currentProfile.responsibilities || '',
          capabilities: state.currentProfile.capabilities || [],
          enabledFeatures: state.currentProfile.enabledFeatures || [],
          disabledFeatures: state.currentProfile.disabledFeatures || [],
          connectedTools: state.currentProfile.connectedTools || [],
          selectedMcpServers: state.currentProfile.selectedMcpServers || [],
          escalationRules: state.currentProfile.escalationRules || [],
          securitySettings: state.currentProfile.securitySettings || defaultSecuritySettings,
          baselineId: state.currentProfile.baselineId || 'balanced-v2',
          customInstructions: state.currentProfile.customInstructions || '',
          securityLevel: state.currentProfile.securityLevel || 'balanced',
          customWorkflows: state.currentProfile.customWorkflows || [],
        };

        set((state) => ({
          savedProfiles: [...state.savedProfiles, newProfile],
          currentProfile: newProfile,
        }));

        return newProfile;
      },

      loadProfile: (id) => {
        const state = get();
        const profile = state.savedProfiles.find(p => p.id === id);
        if (profile) {
          set({ currentProfile: profile });
        }
      },

      deleteProfile: (id) => set((state) => ({
        savedProfiles: state.savedProfiles.filter(p => p.id !== id)
      })),

      // Wizard actions
      setWizardStep: (step) => set((state) => ({
        wizard: { ...state.wizard, currentStep: step }
      })),

      nextStep: () => set((state) => ({
        wizard: {
          ...state.wizard,
          currentStep: Math.min(state.wizard.currentStep + 1, state.wizard.totalSteps - 1)
        }
      })),

      prevStep: () => set((state) => ({
        wizard: {
          ...state.wizard,
          currentStep: Math.max(state.wizard.currentStep - 1, 0)
        }
      })),

      completeWizard: () => set((state) => ({
        wizard: { ...state.wizard, isComplete: true }
      })),

      // Feature actions
      toggleFeature: (feature) => set((state) => {
        const enabled = state.currentProfile.enabledFeatures || [];
        const disabled = state.currentProfile.disabledFeatures || [];

        if (enabled.includes(feature)) {
          return {
            currentProfile: {
              ...state.currentProfile,
              enabledFeatures: enabled.filter(f => f !== feature),
              disabledFeatures: [...disabled, feature],
            }
          };
        } else {
          return {
            currentProfile: {
              ...state.currentProfile,
              enabledFeatures: [...enabled, feature],
              disabledFeatures: disabled.filter(f => f !== feature),
            }
          };
        }
      }),

      // Tool actions
      connectTool: (toolId) => set((state) => {
        const tools = state.currentProfile.connectedTools || [];
        const existingTool = tools.find(t => t.id === toolId);

        if (existingTool) {
          return {
            currentProfile: {
              ...state.currentProfile,
              connectedTools: tools.map(t =>
                t.id === toolId
                  ? { ...t, connected: true, lastConnected: new Date().toISOString() }
                  : t
              ),
            }
          };
        } else {
          return {
            currentProfile: {
              ...state.currentProfile,
              connectedTools: [...tools, {
                id: toolId,
                name: toolId,
                connected: true,
                apiKeySet: false,
                lastConnected: new Date().toISOString(),
              }],
            }
          };
        }
      }),

      disconnectTool: (toolId) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          connectedTools: (state.currentProfile.connectedTools || []).map(t =>
            t.id === toolId ? { ...t, connected: false } : t
          ),
        }
      })),

      // Escalation actions
      addEscalationRule: (rule) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          escalationRules: [
            ...(state.currentProfile.escalationRules || []),
            { ...rule, id: crypto.randomUUID() }
          ],
        }
      })),

      updateEscalationRule: (id, updates) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          escalationRules: (state.currentProfile.escalationRules || []).map(r =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }
      })),

      removeEscalationRule: (id) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          escalationRules: (state.currentProfile.escalationRules || []).filter(r => r.id !== id),
        }
      })),

      // Workflow actions
      addWorkflow: (workflow) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          customWorkflows: [
            ...(state.currentProfile.customWorkflows || []),
            { ...workflow, id: crypto.randomUUID() }
          ],
        }
      })),

      updateWorkflow: (id, updates) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          customWorkflows: (state.currentProfile.customWorkflows || []).map(w =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }
      })),

      removeWorkflow: (id) => set((state) => ({
        currentProfile: {
          ...state.currentProfile,
          customWorkflows: (state.currentProfile.customWorkflows || []).filter(w => w.id !== id),
        }
      })),
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
