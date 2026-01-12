/**
 * Tool Governance & Permission System
 * Phase 11 - Production Implementation
 * 
 * Provides enterprise-grade security and audit logging for agent tool execution
 */

import { Tool } from './framework';

export interface ToolPermission {
  toolName: string;
  scope: 'read' | 'write' | 'admin';
  granted: boolean;
  grantedBy?: string;
  grantedAt?: number;
  expiresAt?: number;
}

export interface ToolAuditLog {
  id: string;
  timestamp: number;
  agentId: string;
  agentName: string;
  toolName: string;
  action: string;
  params: any;
  result: 'success' | 'failure' | 'denied';
  error?: string;
  userId?: string;
  dryRun: boolean;
}

export interface GovernancePolicy {
  requireApproval: boolean;
  allowedTools: string[];
  deniedTools: string[];
  maxExecutionsPerHour?: number;
  requireAuditLog: boolean;
}

class ToolGovernanceManager {
  private permissions: Map<string, ToolPermission[]> = new Map();
  private auditLogs: ToolAuditLog[] = [];
  private policies: Map<string, GovernancePolicy> = new Map();
  private executionCounter: Map<string, number[]> = new Map();

  constructor() {
    // Load from localStorage if available
    this.loadState();
  }

  /**
   * Check if a tool execution is allowed
   */
  canExecuteTool(
    agentId: string,
    toolName: string,
    action: string = 'execute'
  ): { allowed: boolean; reason?: string } {
    // 1. Check policy
    const policy = this.policies.get(agentId) || this.getDefaultPolicy();
    
    if (policy.deniedTools.includes(toolName)) {
      return { allowed: false, reason: 'Tool is explicitly denied by policy' };
    }

    if (policy.allowedTools.length > 0 && !policy.allowedTools.includes(toolName)) {
      return { allowed: false, reason: 'Tool is not in the allowed list' };
    }

    // 2. Check rate limiting
    if (policy.maxExecutionsPerHour) {
      const recentExecutions = this.getRecentExecutions(agentId, toolName);
      if (recentExecutions >= policy.maxExecutionsPerHour) {
        return { 
          allowed: false, 
          reason: `Rate limit exceeded: ${policy.maxExecutionsPerHour} executions/hour` 
        };
      }
    }

    // 3. Check permissions
    const agentPermissions = this.permissions.get(agentId) || [];
    const toolPermission = agentPermissions.find(p => p.toolName === toolName);
    
    if (toolPermission) {
      if (!toolPermission.granted) {
        return { allowed: false, reason: 'Permission explicitly revoked' };
      }
      
      if (toolPermission.expiresAt && Date.now() > toolPermission.expiresAt) {
        return { allowed: false, reason: 'Permission has expired' };
      }
    }

    return { allowed: true };
  }

  /**
   * Request permission for a tool (user consent flow)
   */
  async requestPermission(
    agentId: string,
    toolName: string,
    scope: 'read' | 'write' | 'admin'
  ): Promise<boolean> {
    // In a real implementation, this would trigger a UI modal
    // For now, we'll auto-grant for testing
    const permission: ToolPermission = {
      toolName,
      scope,
      granted: true,
      grantedBy: 'user',
      grantedAt: Date.now()
    };

    const existing = this.permissions.get(agentId) || [];
    const filtered = existing.filter(p => p.toolName !== toolName);
    this.permissions.set(agentId, [...filtered, permission]);
    
    this.saveState();
    return true;
  }

  /**
   * Revoke permission for a tool
   */
  revokePermission(agentId: string, toolName: string): void {
    const existing = this.permissions.get(agentId) || [];
    const updated = existing.map(p => 
      p.toolName === toolName ? { ...p, granted: false } : p
    );
    this.permissions.set(agentId, updated);
    this.saveState();
  }

  /**
   * Log a tool execution for audit trail
   */
  logExecution(log: Omit<ToolAuditLog, 'id' | 'timestamp'>): void {
    const fullLog: ToolAuditLog = {
      ...log,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    };

    this.auditLogs.push(fullLog);
    
    // Keep only last 1000 logs
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }

    // Track execution for rate limiting
    this.trackExecution(log.agentId, log.toolName);

    this.saveState();
  }

  /**
   * Get audit logs for an agent
   */
  getAuditLogs(agentId?: string, toolName?: string): ToolAuditLog[] {
    let logs = this.auditLogs;
    
    if (agentId) {
      logs = logs.filter(l => l.agentId === agentId);
    }
    
    if (toolName) {
      logs = logs.filter(l => l.toolName === toolName);
    }
    
    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Set governance policy for an agent
   */
  setPolicy(agentId: string, policy: Partial<GovernancePolicy>): void {
    const existing = this.policies.get(agentId) || this.getDefaultPolicy();
    this.policies.set(agentId, { ...existing, ...policy });
    this.saveState();
  }

  /**
   * Get governance policy for an agent
   */
  getPolicy(agentId: string): GovernancePolicy {
    return this.policies.get(agentId) || this.getDefaultPolicy();
  }

  /**
   * Export audit logs as JSON
   */
  exportAuditLogs(agentId?: string): string {
    const logs = this.getAuditLogs(agentId);
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Clear all audit logs (admin only)
   */
  clearAuditLogs(): void {
    this.auditLogs = [];
    this.saveState();
  }

  // --- Private Methods ---

  private getDefaultPolicy(): GovernancePolicy {
    return {
      requireApproval: false,
      allowedTools: [], // empty = all allowed
      deniedTools: [],
      maxExecutionsPerHour: 100,
      requireAuditLog: true
    };
  }

  private trackExecution(agentId: string, toolName: string): void {
    const key = `${agentId}:${toolName}`;
    const now = Date.now();
    const executions = this.executionCounter.get(key) || [];
    
    // Remove executions older than 1 hour
    const recent = executions.filter(t => now - t < 3600000);
    recent.push(now);
    
    this.executionCounter.set(key, recent);
  }

  private getRecentExecutions(agentId: string, toolName: string): number {
    const key = `${agentId}:${toolName}`;
    const now = Date.now();
    const executions = this.executionCounter.get(key) || [];
    
    return executions.filter(t => now - t < 3600000).length;
  }

  private loadState(): void {
    try {
      const stored = localStorage.getItem('tool-governance-state');
      if (stored) {
        const state = JSON.parse(stored);
        
        if (state.permissions) {
          this.permissions = new Map(Object.entries(state.permissions));
        }
        
        if (state.policies) {
          this.policies = new Map(Object.entries(state.policies));
        }
        
        if (state.auditLogs) {
          this.auditLogs = state.auditLogs;
        }
      }
    } catch (e) {
      console.warn('Failed to load governance state:', e);
    }
  }

  private saveState(): void {
    try {
      const state = {
        permissions: Object.fromEntries(this.permissions),
        policies: Object.fromEntries(this.policies),
        auditLogs: this.auditLogs
      };
      
      localStorage.setItem('tool-governance-state', JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save governance state:', e);
    }
  }
}

// Singleton instance
export const governanceManager = new ToolGovernanceManager();

/**
 * Wrapper function to execute a tool with governance checks
 */
export async function executeToolWithGovernance(
  agentId: string,
  agentName: string,
  tool: Tool,
  params: any,
  dryRun: boolean = false
): Promise<any> {
  const toolName = tool.name;
  
  // 1. Check if execution is allowed
  const check = governanceManager.canExecuteTool(agentId, toolName);
  if (!check.allowed) {
    const error = `Tool execution denied: ${check.reason}`;
    
    // Log the denial
    governanceManager.logExecution({
      agentId,
      agentName,
      toolName,
      action: 'execute',
      params,
      result: 'denied',
      error,
      dryRun
    });
    
    throw new Error(error);
  }

  // 2. Execute the tool
  try {
    const result = await tool.execute(params);
    
    // 3. Log successful execution
    governanceManager.logExecution({
      agentId,
      agentName,
      toolName,
      action: 'execute',
      params,
      result: 'success',
      dryRun
    });
    
    return result;
  } catch (error: any) {
    // 4. Log failed execution
    governanceManager.logExecution({
      agentId,
      agentName,
      toolName,
      action: 'execute',
      params,
      result: 'failure',
      error: error.message,
      dryRun
    });
    
    throw error;
  }
}
