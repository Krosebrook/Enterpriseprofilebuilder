import { create } from 'zustand';
import { Integration, integrations } from '../../../data/integrations';

interface IntegrationsState {
  installedIntegrations: string[];
  searchQuery: string;
  activeCategory: string;
  
  // Actions
  installIntegration: (id: string) => void;
  uninstallIntegration: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  getFilteredIntegrations: () => Integration[];
}

export const useIntegrationsStore = create<IntegrationsState>((set, get) => ({
  installedIntegrations: ['slack', 'github'], // Defaults
  searchQuery: '',
  activeCategory: 'all',

  installIntegration: (id) => set((state) => ({
    installedIntegrations: [...state.installedIntegrations, id]
  })),

  uninstallIntegration: (id) => set((state) => ({
    installedIntegrations: state.installedIntegrations.filter(i => i !== id)
  })),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ activeCategory: category }),

  getFilteredIntegrations: () => {
    const { searchQuery, activeCategory } = get();
    return integrations.filter(integration => {
      const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          integration.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || integration.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }
}));
