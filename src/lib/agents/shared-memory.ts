/**
 * Shared Memory System - Multi-Agent Context Management
 * Phase 12 - INT Inc Enterprise Claude Profile Builder
 * 
 * Manages shared context and memory across multiple agents in a workflow,
 * enabling agents to share information and coordinate their actions.
 */

import { agentDebugger } from './debug';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Memory entry with metadata
 */
export interface MemoryEntry {
  /** Unique entry ID */
  id: string;
  
  /** Execution/workflow ID this entry belongs to */
  executionId: string;
  
  /** Agent that created this entry */
  agentId: string;
  
  /** Timestamp of creation */
  timestamp: number;
  
  /** Memory key */
  key: string;
  
  /** Memory value */
  value: any;
  
  /** Optional tags for categorization */
  tags?: string[];
  
  /** Time-to-live in milliseconds (optional) */
  ttl?: number;
  
  /** Whether this entry is volatile (cleared on workflow completion) */
  volatile?: boolean;
}

/**
 * Memory query options
 */
export interface MemoryQueryOptions {
  /** Filter by agent ID */
  agentId?: string;
  
  /** Filter by tags */
  tags?: string[];
  
  /** Maximum age in milliseconds */
  maxAge?: number;
  
  /** Maximum number of results */
  limit?: number;
  
  /** Sort order */
  sortBy?: 'timestamp' | 'key';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// SHARED MEMORY MANAGER
// ============================================================================

/**
 * Manages shared memory across agents in workflows
 */
export class SharedMemoryManager {
  private memories: Map<string, MemoryEntry[]> = new Map(); // executionId -> entries
  private maxEntriesPerExecution = 1000;

  /**
   * Store a value in shared memory
   */
  set(
    executionId: string,
    agentId: string,
    key: string,
    value: any,
    options?: {
      tags?: string[];
      ttl?: number;
      volatile?: boolean;
    }
  ): MemoryEntry {
    const entry: MemoryEntry = {
      id: this.generateId(),
      executionId,
      agentId,
      timestamp: Date.now(),
      key,
      value,
      tags: options?.tags,
      ttl: options?.ttl,
      volatile: options?.volatile ?? true,
    };

    // Get or create memory array for this execution
    const executionMemories = this.memories.get(executionId) || [];
    
    // Remove existing entry with same key (update behavior)
    const filtered = executionMemories.filter(m => m.key !== key);
    
    // Add new entry
    filtered.push(entry);
    
    // Enforce max entries limit
    if (filtered.length > this.maxEntriesPerExecution) {
      // Remove oldest entries
      filtered.sort((a, b) => b.timestamp - a.timestamp);
      filtered.splice(this.maxEntriesPerExecution);
    }
    
    this.memories.set(executionId, filtered);

    agentDebugger.debug('SharedMemory', `Memory set: ${key}`, {
      executionId,
      agentId,
      key,
      valueType: typeof value,
    });

    return entry;
  }

  /**
   * Get a value from shared memory
   */
  get(executionId: string, key: string): any {
    const executionMemories = this.memories.get(executionId) || [];
    const entry = executionMemories.find(m => m.key === key);

    if (!entry) return undefined;

    // Check TTL
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      // Entry expired, remove it
      this.delete(executionId, key);
      return undefined;
    }

    agentDebugger.debug('SharedMemory', `Memory retrieved: ${key}`, {
      executionId,
      key,
      found: !!entry,
    });

    return entry.value;
  }

  /**
   * Get multiple values matching a pattern
   */
  getByPattern(executionId: string, keyPattern: RegExp): Record<string, any> {
    const executionMemories = this.memories.get(executionId) || [];
    const results: Record<string, any> = {};

    executionMemories.forEach(entry => {
      if (keyPattern.test(entry.key)) {
        // Check TTL
        if (!entry.ttl || Date.now() - entry.timestamp <= entry.ttl) {
          results[entry.key] = entry.value;
        }
      }
    });

    return results;
  }

  /**
   * Query memory entries with filters
   */
  query(executionId: string, options: MemoryQueryOptions = {}): MemoryEntry[] {
    let executionMemories = this.memories.get(executionId) || [];

    // Filter by agent ID
    if (options.agentId) {
      executionMemories = executionMemories.filter(m => m.agentId === options.agentId);
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      executionMemories = executionMemories.filter(m =>
        m.tags && options.tags!.some(tag => m.tags!.includes(tag))
      );
    }

    // Filter by max age
    if (options.maxAge) {
      const cutoff = Date.now() - options.maxAge;
      executionMemories = executionMemories.filter(m => m.timestamp >= cutoff);
    }

    // Filter out expired entries
    executionMemories = executionMemories.filter(m =>
      !m.ttl || Date.now() - m.timestamp <= m.ttl
    );

    // Sort
    const sortBy = options.sortBy || 'timestamp';
    const sortOrder = options.sortOrder || 'desc';
    executionMemories.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Limit
    if (options.limit) {
      executionMemories = executionMemories.slice(0, options.limit);
    }

    return executionMemories;
  }

  /**
   * Delete a memory entry
   */
  delete(executionId: string, key: string): boolean {
    const executionMemories = this.memories.get(executionId) || [];
    const initialLength = executionMemories.length;
    
    const filtered = executionMemories.filter(m => m.key !== key);
    this.memories.set(executionId, filtered);

    agentDebugger.debug('SharedMemory', `Memory deleted: ${key}`, {
      executionId,
      key,
      deleted: initialLength !== filtered.length,
    });

    return initialLength !== filtered.length;
  }

  /**
   * Clear all memory for an execution
   */
  clear(executionId: string, volatileOnly = false): void {
    if (volatileOnly) {
      const executionMemories = this.memories.get(executionId) || [];
      const filtered = executionMemories.filter(m => !m.volatile);
      this.memories.set(executionId, filtered);
    } else {
      this.memories.delete(executionId);
    }

    agentDebugger.info('SharedMemory', 'Memory cleared', {
      executionId,
      volatileOnly,
    });
  }

  /**
   * Get all memory entries for an execution
   */
  getAll(executionId: string): Record<string, any> {
    const executionMemories = this.memories.get(executionId) || [];
    const result: Record<string, any> = {};

    executionMemories.forEach(entry => {
      // Check TTL
      if (!entry.ttl || Date.now() - entry.timestamp <= entry.ttl) {
        result[entry.key] = entry.value;
      }
    });

    return result;
  }

  /**
   * Get memory statistics for an execution
   */
  getStats(executionId: string): {
    totalEntries: number;
    byAgent: Record<string, number>;
    byTag: Record<string, number>;
    volatileCount: number;
    persistentCount: number;
  } {
    const executionMemories = this.memories.get(executionId) || [];
    
    const stats = {
      totalEntries: executionMemories.length,
      byAgent: {} as Record<string, number>,
      byTag: {} as Record<string, number>,
      volatileCount: 0,
      persistentCount: 0,
    };

    executionMemories.forEach(entry => {
      // Count by agent
      stats.byAgent[entry.agentId] = (stats.byAgent[entry.agentId] || 0) + 1;

      // Count by tag
      if (entry.tags) {
        entry.tags.forEach(tag => {
          stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
        });
      }

      // Count volatile vs persistent
      if (entry.volatile) {
        stats.volatileCount++;
      } else {
        stats.persistentCount++;
      }
    });

    return stats;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    let totalRemoved = 0;

    this.memories.forEach((entries, executionId) => {
      const initialLength = entries.length;
      const filtered = entries.filter(entry =>
        !entry.ttl || Date.now() - entry.timestamp <= entry.ttl
      );
      
      if (filtered.length !== initialLength) {
        this.memories.set(executionId, filtered);
        totalRemoved += initialLength - filtered.length;
      }
    });

    if (totalRemoved > 0) {
      agentDebugger.info('SharedMemory', 'Cleanup completed', {
        entriesRemoved: totalRemoved,
      });
    }

    return totalRemoved;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

/**
 * Global shared memory manager instance
 */
export const sharedMemory = new SharedMemoryManager();

/**
 * Auto-cleanup expired entries every 5 minutes
 */
if (typeof window !== 'undefined') {
  setInterval(() => {
    sharedMemory.cleanup();
  }, 5 * 60 * 1000);
}
