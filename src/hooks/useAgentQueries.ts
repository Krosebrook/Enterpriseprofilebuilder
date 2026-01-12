/**
 * React Query hooks for Agent data
 * These provide server-side state management with caching, optimistic updates, and automatic refetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SavedAgent } from '../features/agents/hooks/useAgentStore';

// Query keys for cache management
export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...agentKeys.lists(), { filters }] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
  executions: (id: string) => [...agentKeys.detail(id), 'executions'] as const,
};

/**
 * Fetch agents from Supabase (example - replace with actual API)
 */
async function fetchAgents(): Promise<SavedAgent[]> {
  // TODO: Replace with actual Supabase query
  // const { data, error } = await supabase
  //   .from('agents')
  //   .select('*')
  //   .order('updated_at', { ascending: false });
  // 
  // if (error) throw error;
  // return data;

  // For now, return empty array (localStorage fallback still works)
  return [];
}

/**
 * Create agent on server (example - replace with actual API)
 */
async function createAgent(agent: Omit<SavedAgent, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedAgent> {
  // TODO: Replace with actual Supabase mutation
  // const { data, error } = await supabase
  //   .from('agents')
  //   .insert({
  //     name: agent.name,
  //     role: agent.role,
  //     goal: agent.goal,
  //     model: agent.model,
  //     temperature: agent.temperature,
  //     selected_tool_ids: agent.selectedToolIds,
  //     execution_mode: agent.executionMode,
  //   })
  //   .select()
  //   .single();
  //
  // if (error) throw error;
  // return data;

  // For now, return mock data
  return {
    ...agent,
    id: Math.random().toString(36).substring(7),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Update agent on server (example - replace with actual API)
 */
async function updateAgent(agent: SavedAgent): Promise<SavedAgent> {
  // TODO: Replace with actual Supabase mutation
  return { ...agent, updatedAt: Date.now() };
}

/**
 * Delete agent from server (example - replace with actual API)
 */
async function deleteAgent(id: string): Promise<void> {
  // TODO: Replace with actual Supabase mutation
  // const { error } = await supabase
  //   .from('agents')
  //   .delete()
  //   .eq('id', id);
  //
  // if (error) throw error;
}

/**
 * Hook to fetch all agents
 */
export function useAgents() {
  return useQuery({
    queryKey: agentKeys.lists(),
    queryFn: fetchAgents,
    // Enable this query even if the component unmounts temporarily
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single agent
 */
export function useAgent(id: string | null) {
  return useQuery({
    queryKey: agentKeys.detail(id || ''),
    queryFn: async () => {
      // TODO: Fetch from Supabase
      return null;
    },
    enabled: !!id, // Only run query if id is provided
  });
}

/**
 * Hook to create an agent with optimistic updates
 */
export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAgent,
    
    // Optimistic update: Add agent immediately to UI
    onMutate: async (newAgent) => {
      // Cancel outgoing queries to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: agentKeys.lists() });

      // Snapshot previous value
      const previousAgents = queryClient.getQueryData<SavedAgent[]>(agentKeys.lists());

      // Optimistically update cache
      queryClient.setQueryData<SavedAgent[]>(agentKeys.lists(), (old = []) => [
        {
          ...newAgent,
          id: 'temp-' + Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        } as SavedAgent,
        ...old,
      ]);

      return { previousAgents };
    },

    // On error, rollback optimistic update
    onError: (err, newAgent, context) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(agentKeys.lists(), context.previousAgents);
      }
    },

    // Always refetch after error or success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });
}

/**
 * Hook to update an agent with optimistic updates
 */
export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAgent,
    
    onMutate: async (updatedAgent) => {
      await queryClient.cancelQueries({ queryKey: agentKeys.lists() });
      await queryClient.cancelQueries({ queryKey: agentKeys.detail(updatedAgent.id) });

      const previousAgents = queryClient.getQueryData<SavedAgent[]>(agentKeys.lists());
      const previousAgent = queryClient.getQueryData<SavedAgent>(agentKeys.detail(updatedAgent.id));

      // Optimistically update list
      queryClient.setQueryData<SavedAgent[]>(agentKeys.lists(), (old = []) =>
        old.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent)
      );

      // Optimistically update detail
      queryClient.setQueryData(agentKeys.detail(updatedAgent.id), updatedAgent);

      return { previousAgents, previousAgent };
    },

    onError: (err, updatedAgent, context) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(agentKeys.lists(), context.previousAgents);
      }
      if (context?.previousAgent) {
        queryClient.setQueryData(agentKeys.detail(updatedAgent.id), context.previousAgent);
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete an agent with optimistic updates
 */
export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAgent,
    
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: agentKeys.lists() });

      const previousAgents = queryClient.getQueryData<SavedAgent[]>(agentKeys.lists());

      // Optimistically remove from list
      queryClient.setQueryData<SavedAgent[]>(agentKeys.lists(), (old = []) =>
        old.filter(agent => agent.id !== id)
      );

      return { previousAgents };
    },

    onError: (err, id, context) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(agentKeys.lists(), context.previousAgents);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });
}

/**
 * Prefetch agents (useful for hover states, predicted navigation, etc.)
 */
export function usePrefetchAgents() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: agentKeys.lists(),
      queryFn: fetchAgents,
      staleTime: 5 * 60 * 1000,
    });
  };
}
