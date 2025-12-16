import { create } from 'zustand';
import { Platform, Model, Feature, McpServer, Skill } from '../../../data/ecosystem';

interface EcosystemState {
  selectedPlatforms: string[];
  selectedModels: string[];
  selectedFeatures: string[];
  selectedServers: string[];
  selectedSkills: string[];
  
  // Computed Architecture State
  architectureName: string;
  isGenerating: boolean;
  generatedArchitecture: any | null; // Placeholder for the AI response

  // Actions
  togglePlatform: (id: string) => void;
  toggleModel: (id: string) => void;
  toggleFeature: (id: string) => void;
  toggleServer: (id: string) => void;
  toggleSkill: (id: string) => void;
  resetSelection: () => void;
  setGenerating: (isGenerating: boolean) => void;
  setArchitecture: (data: any) => void;
}

export const useEcosystemStore = create<EcosystemState>((set) => ({
  selectedPlatforms: [],
  selectedModels: [],
  selectedFeatures: [],
  selectedServers: [],
  selectedSkills: [],
  
  architectureName: 'Custom Enterprise Stack',
  isGenerating: false,
  generatedArchitecture: null,

  togglePlatform: (id) => set((state) => ({
    selectedPlatforms: state.selectedPlatforms.includes(id) 
      ? state.selectedPlatforms.filter(p => p !== id)
      : [...state.selectedPlatforms, id]
  })),

  toggleModel: (id) => set((state) => ({
    selectedModels: state.selectedModels.includes(id) 
      ? state.selectedModels.filter(m => m !== id)
      : [...state.selectedModels, id]
  })),

  toggleFeature: (id) => set((state) => ({
    selectedFeatures: state.selectedFeatures.includes(id) 
      ? state.selectedFeatures.filter(f => f !== id)
      : [...state.selectedFeatures, id]
  })),

  toggleServer: (id) => set((state) => ({
    selectedServers: state.selectedServers.includes(id) 
      ? state.selectedServers.filter(s => s !== id)
      : [...state.selectedServers, id]
  })),

  toggleSkill: (id) => set((state) => ({
    selectedSkills: state.selectedSkills.includes(id) 
      ? state.selectedSkills.filter(s => s !== id)
      : [...state.selectedSkills, id]
  })),

  resetSelection: () => set({
    selectedPlatforms: [],
    selectedModels: [],
    selectedFeatures: [],
    selectedServers: [],
    selectedSkills: [],
    generatedArchitecture: null
  }),

  setGenerating: (isGenerating) => set({ isGenerating }),
  setArchitecture: (data) => set({ generatedArchitecture: data })
}));
