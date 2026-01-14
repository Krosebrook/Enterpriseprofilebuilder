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
  executionMode?: 'simulation' | 'real' | 'dry-run';
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
  executionMode: 'simulation' | 'real' | 'dry-run';
  
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
  setExecutionMode: (mode: 'simulation' | 'real' | 'dry-run') => void;
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
      executionMode: 'simulation',
      
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

      setExecutionMode: (mode) => set({ executionMode: mode }),

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
          updatedAt: now,
          executionMode: state.executionMode
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
        executionMode: 'simulation',
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
          executionMode: agent.executionMode || 'simulation',
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