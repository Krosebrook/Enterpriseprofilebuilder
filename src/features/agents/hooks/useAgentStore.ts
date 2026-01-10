import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SavedAgent {
  id: string;
  name: string;
  role: string;
  goal: string;
  model: string;
  temperature: number;
  selectedToolIds: string[];
  createdAt: number;
  updatedAt: number;
}

interface AgentStoreState {
  // --- Current Builder State ---
  currentAgentId: string | null; // null = creating new
  name: string;
  role: string;
  goal: string;
  model: string;
  temperature: number;
  selectedToolIds: string[];
  
  // UI State
  activeTab: 'config' | 'tools' | 'test';
  messages: ChatMessage[];
  isThinking: boolean;

  // --- Agent Library ---
  savedAgents: SavedAgent[];

  // --- Actions ---
  // Builder Actions
  updateConfig: (updates: Partial<AgentStoreState>) => void;
  toggleTool: (toolId: string) => void;
  setActiveTab: (tab: 'config' | 'tools' | 'test') => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  // Library Actions
  saveCurrentAgent: () => void;
  createNewAgent: () => void;
  loadAgent: (agentId: string) => void;
  deleteAgent: (agentId: string) => void;
}

export const useAgentStore = create<AgentStoreState>()(
  persist(
    (set, get) => ({
      // Defaults
      currentAgentId: null,
      name: 'New Agent',
      role: 'Helpful Assistant',
      goal: 'Assist users with their tasks.',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      selectedToolIds: [],
      
      activeTab: 'config',
      messages: [],
      isThinking: false,
      savedAgents: [],

      updateConfig: (updates) => set((state) => ({ ...state, ...updates })),

      toggleTool: (toolId) => set((state) => {
        const isSelected = state.selectedToolIds.includes(toolId);
        return {
          selectedToolIds: isSelected
            ? state.selectedToolIds.filter(id => id !== toolId)
            : [...state.selectedToolIds, toolId]
        };
      }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      addMessage: (msg) => set((state) => ({
        messages: [
          ...state.messages,
          {
            ...msg,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now()
          }
        ]
      })),

      clearChat: () => set({ messages: [] }),

      saveCurrentAgent: () => set((state) => {
        const now = Date.now();
        const existingAgentIndex = state.savedAgents.findIndex(a => a.id === state.currentAgentId);
        
        const agentData: SavedAgent = {
          id: state.currentAgentId || Math.random().toString(36).substring(7),
          name: state.name,
          role: state.role,
          goal: state.goal,
          model: state.model,
          temperature: state.temperature,
          selectedToolIds: state.selectedToolIds,
          createdAt: existingAgentIndex >= 0 ? state.savedAgents[existingAgentIndex].createdAt : now,
          updatedAt: now
        };

        let newSavedAgents = [...state.savedAgents];
        if (existingAgentIndex >= 0) {
          newSavedAgents[existingAgentIndex] = agentData;
        } else {
          newSavedAgents.push(agentData);
        }

        return {
          savedAgents: newSavedAgents,
          currentAgentId: agentData.id
        };
      }),

      createNewAgent: () => set({
        currentAgentId: null,
        name: 'New Agent',
        role: 'Helpful Assistant',
        goal: 'Assist users with their tasks.',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        selectedToolIds: [],
        messages: [],
        activeTab: 'config'
      }),

      loadAgent: (agentId) => set((state) => {
        const agent = state.savedAgents.find(a => a.id === agentId);
        if (!agent) return state;

        return {
          currentAgentId: agent.id,
          name: agent.name,
          role: agent.role,
          goal: agent.goal,
          model: agent.model,
          temperature: agent.temperature,
          selectedToolIds: agent.selectedToolIds,
          messages: [], // Clear chat when loading new agent
          activeTab: 'config'
        };
      }),

      deleteAgent: (agentId) => set((state) => ({
        savedAgents: state.savedAgents.filter(a => a.id !== agentId),
        // If deleting current agent, reset to new
        ...(state.currentAgentId === agentId ? {
          currentAgentId: null,
          name: 'New Agent',
          role: 'Helpful Assistant',
          goal: 'Assist users with their tasks.',
          model: 'claude-3-5-sonnet-20241022',
          temperature: 0.7,
          selectedToolIds: [],
          messages: []
        } : {})
      }))
    }),
    {
      name: 'agent-library-storage', // Renamed to reflect expanded scope
      version: 1
    }
  )
);
