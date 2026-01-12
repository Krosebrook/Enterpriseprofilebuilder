/**
 * Supabase utilities for Agent operations
 * Provides type-safe CRUD operations with RLS (Row-Level Security)
 */

import { createClient } from '@supabase/supabase-js';
import type { SavedAgent } from '../../features/agents/hooks/useAgentStore';

// Get Supabase credentials
let supabaseUrl: string;
let supabaseAnonKey: string;

try {
  const info = require('../../utils/supabase/info');
  supabaseUrl = `https://${info.projectId}.supabase.co`;
  supabaseAnonKey = info.publicAnonKey;
} catch (e) {
  console.warn('Supabase credentials not found. Using localStorage only.');
  supabaseUrl = '';
  supabaseAnonKey = '';
}

// Create Supabase client (lazy initialization)
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClient && supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

/**
 * Check if Supabase is available
 */
export function isSupabaseAvailable(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey;
}

/**
 * Database schema types
 */
export interface AgentRow {
  id: string;
  user_id: string;
  name: string;
  role: string;
  goal: string;
  system_prompt?: string;
  model: string;
  temperature: number;
  config: {
    selectedToolIds: string[];
    executionMode?: 'simulation' | 'real' | 'dry-run';
  };
  created_at: string;
  updated_at: string;
}

/**
 * Convert SavedAgent to database row
 */
function toAgentRow(agent: SavedAgent, userId: string): Partial<AgentRow> {
  return {
    id: agent.id,
    user_id: userId,
    name: agent.name,
    role: agent.role,
    goal: agent.goal,
    model: agent.model,
    temperature: agent.temperature,
    config: {
      selectedToolIds: agent.selectedToolIds,
      executionMode: agent.executionMode,
    },
    updated_at: new Date().toISOString(),
  };
}

/**
 * Convert database row to SavedAgent
 */
function fromAgentRow(row: AgentRow): SavedAgent {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    goal: row.goal,
    model: row.model,
    temperature: row.temperature,
    selectedToolIds: row.config.selectedToolIds || [],
    executionMode: row.config.executionMode || 'simulation',
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

/**
 * Fetch all agents for the current user
 */
export async function fetchAgents(): Promise<SavedAgent[]> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await client
    .from('agents')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching agents:', error);
    throw new Error(`Failed to fetch agents: ${error.message}`);
  }

  return (data || []).map(fromAgentRow);
}

/**
 * Fetch a single agent by ID
 */
export async function fetchAgent(id: string): Promise<SavedAgent | null> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await client
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching agent:', error);
    throw new Error(`Failed to fetch agent: ${error.message}`);
  }

  return fromAgentRow(data);
}

/**
 * Create a new agent
 */
export async function createAgent(agent: Omit<SavedAgent, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedAgent> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }

  // Get current user
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const newAgent: SavedAgent = {
    ...agent,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const row = toAgentRow(newAgent, user.id);

  const { data, error } = await client
    .from('agents')
    .insert({
      ...row,
      created_at: new Date(newAgent.createdAt).toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating agent:', error);
    throw new Error(`Failed to create agent: ${error.message}`);
  }

  return fromAgentRow(data);
}

/**
 * Update an existing agent
 */
export async function updateAgent(agent: SavedAgent): Promise<SavedAgent> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }

  // Get current user
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const row = toAgentRow(agent, user.id);

  const { data, error } = await client
    .from('agents')
    .update(row)
    .eq('id', agent.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating agent:', error);
    throw new Error(`Failed to update agent: ${error.message}`);
  }

  return fromAgentRow(data);
}

/**
 * Delete an agent
 */
export async function deleteAgent(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }

  const { error } = await client
    .from('agents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting agent:', error);
    throw new Error(`Failed to delete agent: ${error.message}`);
  }
}

/**
 * Sync localStorage agents to Supabase (one-time migration helper)
 */
export async function syncLocalAgentsToCloud(localAgents: SavedAgent[]): Promise<{
  synced: number;
  failed: number;
  errors: Array<{ agent: string; error: string }>;
}> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }

  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  let synced = 0;
  let failed = 0;
  const errors: Array<{ agent: string; error: string }> = [];

  for (const agent of localAgents) {
    try {
      const row = toAgentRow(agent, user.id);
      
      const { error } = await client
        .from('agents')
        .upsert({
          ...row,
          created_at: new Date(agent.createdAt).toISOString(),
        });

      if (error) throw error;
      synced++;
    } catch (error: any) {
      failed++;
      errors.push({
        agent: agent.name,
        error: error.message || 'Unknown error',
      });
    }
  }

  return { synced, failed, errors };
}
