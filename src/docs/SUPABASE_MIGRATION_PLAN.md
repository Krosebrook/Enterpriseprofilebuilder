# Migration Plan: localStorage → Supabase

## Overview
Currently, agent data, governance policies, and audit logs are stored in browser localStorage. This document outlines the migration to Supabase Postgres for production-ready multi-device sync and data persistence.

## Current localStorage Usage

### 1. Agent Library (`useAgentStore`)
- **Storage Key**: `agent-library-storage`
- **Data**: Saved agents (config, tools, execution mode)
- **Size**: ~1-5 KB per agent, up to ~500 KB for 100 agents
- **Issues**: 
  - Data lost on cache clear
  - No multi-device sync
  - No team sharing

### 2. Governance Policies (`governanceManager`)
- **Storage Key**: Not persistent (in-memory only)
- **Data**: Tool permissions, rate limits, audit logs
- **Issues**:
  - Lost on page refresh
  - No compliance trail
  - No enterprise features

### 3. Debug Logs (`agentDebugger`)
- **Storage Key**: `agent-debug-mode`
- **Data**: Execution traces
- **Issues**:
  - Lost on page refresh
  - Limited to 500 entries
  - No aggregation across users

## Supabase Schema

### Agents Table
```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  goal TEXT NOT NULL,
  system_prompt TEXT,
  model TEXT DEFAULT 'claude-3-5-sonnet-20241022',
  temperature DECIMAL(2,1) DEFAULT 0.7,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_updated_at ON agents(updated_at DESC);

-- Row-Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY agents_isolation ON agents
  FOR ALL USING (auth.uid() = user_id);
```

### Agent Tools (Many-to-Many)
```sql
CREATE TABLE agent_tools (
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  PRIMARY KEY (agent_id, tool_id)
);

CREATE INDEX idx_agent_tools_agent_id ON agent_tools(agent_id);

-- Row-Level Security
ALTER TABLE agent_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY agent_tools_isolation ON agent_tools
  FOR ALL USING (
    agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
  );
```

### Execution Logs (Time-Series)
```sql
CREATE TABLE execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  steps JSONB NOT NULL,
  result TEXT,
  success BOOLEAN,
  dry_run BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  token_usage INT,
  cost_usd DECIMAL(10,6)
);

-- Convert to TimescaleDB hypertable for efficient time-series queries
SELECT create_hypertable('execution_logs', 'started_at');

CREATE INDEX idx_execution_logs_user_id ON execution_logs(user_id, started_at DESC);
CREATE INDEX idx_execution_logs_agent_id ON execution_logs(agent_id, started_at DESC);

-- Row-Level Security
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY execution_logs_isolation ON execution_logs
  FOR ALL USING (auth.uid() = user_id);
```

### Governance Policies
```sql
CREATE TABLE governance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  allowed_tools TEXT[] DEFAULT ARRAY[]::TEXT[],
  denied_tools TEXT[] DEFAULT ARRAY[]::TEXT[],
  max_executions_per_hour INT DEFAULT 100,
  require_approval_for_write BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_governance_policies_user_id ON governance_policies(user_id);
CREATE INDEX idx_governance_policies_agent_id ON governance_policies(agent_id);

-- Row-Level Security
ALTER TABLE governance_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY governance_policies_isolation ON governance_policies
  FOR ALL USING (auth.uid() = user_id);
```

## Migration Strategy

### Phase 1: Add Supabase Client (Done ✅)
- Supabase already configured in `/utils/supabase/info.tsx`
- Edge functions already deployed

### Phase 2: Implement Supabase CRUD Operations
1. Create `/lib/supabase/agents.ts` with:
   - `fetchAgents(userId: string)`
   - `createAgent(userId: string, agent: AgentInput)`
   - `updateAgent(agentId: string, updates: Partial<Agent>)`
   - `deleteAgent(agentId: string)`

2. Create `/lib/supabase/governance.ts` with:
   - `fetchPolicies(userId: string)`
   - `upsertPolicy(policy: GovernancePolicy)`

3. Create `/lib/supabase/logs.ts` with:
   - `logExecution(log: ExecutionLog)`
   - `fetchExecutionLogs(agentId: string, filters: LogFilters)`

### Phase 3: Dual-Write Strategy (Safe Migration)
1. Continue writing to localStorage (backward compatibility)
2. Also write to Supabase (new persistence layer)
3. Read from Supabase first, fallback to localStorage if unavailable
4. User can opt-in to "sync" localStorage data to cloud

```typescript
// Example dual-write strategy
async function saveAgent(agent: SavedAgent) {
  // Write to localStorage (immediate, offline-capable)
  localStorage.setItem('agent-library-storage', JSON.stringify({ agents: [agent] }));
  
  // Also write to Supabase (cloud persistence)
  try {
    await supabase.from('agents').upsert(agent);
  } catch (error) {
    console.warn('Failed to sync to cloud:', error);
    // Show toast: "Changes saved locally. Will sync when online."
  }
}
```

### Phase 4: Add "Sync to Cloud" UI
- Add button in Agent Library: "Sync to Cloud"
- Show sync status: ✅ Synced | ⚠️ Local only | 🔄 Syncing
- Handle conflicts (local vs. cloud version)

### Phase 5: Gradual Migration
- New users: Default to Supabase only
- Existing users: localStorage + Supabase dual-write
- After 90 days: Deprecate localStorage, show migration prompt

## Implementation Checklist

### Backend (Supabase)
- [ ] Run migration SQL to create tables
- [ ] Test Row-Level Security policies
- [ ] Add indexes for performance
- [ ] Create Edge Function endpoints for CRUD operations
- [ ] Add rate limiting on server

### Frontend
- [ ] Create Supabase client wrapper
- [ ] Implement dual-write strategy in Zustand store
- [ ] Add sync UI indicators
- [ ] Create migration assistant component
- [ ] Add conflict resolution UI
- [ ] Test offline → online sync

### Testing
- [ ] Test with no network (localStorage fallback)
- [ ] Test with slow network (optimistic updates)
- [ ] Test multi-device sync
- [ ] Test concurrent edits (conflict resolution)
- [ ] Load test: 1000 agents per user
- [ ] Security test: Try to access another user's agents

## Rollback Plan

If migration causes issues:
1. Feature flag: `ENABLE_CLOUD_SYNC=false`
2. Revert to localStorage-only mode
3. Keep Supabase data (don't delete)
4. Debug issues, re-enable feature flag

## Timeline

- **Week 1**: Schema creation + backend endpoints
- **Week 2**: Dual-write implementation
- **Week 3**: Sync UI + testing
- **Week 4**: Gradual rollout (10% → 50% → 100%)

## Success Metrics

- [ ] 95% of agents successfully synced
- [ ] <1% sync failures
- [ ] Multi-device sync works within 5 seconds
- [ ] Zero data loss incidents
- [ ] User satisfaction: 4.5+ stars on "cloud sync" feature
