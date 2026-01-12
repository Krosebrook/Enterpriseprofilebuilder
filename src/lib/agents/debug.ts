/**
 * Debug Utilities for Agent Execution
 * Phase 11 - Production Implementation
 */

export interface DebugLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: any;
}

class AgentDebugger {
  private logs: DebugLog[] = [];
  private enabled: boolean = true;
  private maxLogs: number = 500;

  constructor() {
    // Check if debug mode is enabled
    this.enabled = localStorage.getItem('agent-debug-mode') === 'true' || 
                   import.meta.env.DEV === true;
  }

  log(level: 'info' | 'warn' | 'error' | 'debug', category: string, message: string, data?: any) {
    const log: DebugLog = {
      timestamp: Date.now(),
      level,
      category,
      message,
      data
    };

    this.logs.push(log);

    // Trim logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output if enabled
    if (this.enabled) {
      const prefix = `[Agent ${category}]`;
      switch (level) {
        case 'error':
          console.error(prefix, message, data || '');
          break;
        case 'warn':
          console.warn(prefix, message, data || '');
          break;
        case 'debug':
          console.debug(prefix, message, data || '');
          break;
        default:
          console.log(prefix, message, data || '');
      }
    }
  }

  info(category: string, message: string, data?: any) {
    this.log('info', category, message, data);
  }

  warn(category: string, message: string, data?: any) {
    this.log('warn', category, message, data);
  }

  error(category: string, message: string, data?: any) {
    this.log('error', category, message, data);
  }

  debug(category: string, message: string, data?: any) {
    this.log('debug', category, message, data);
  }

  getLogs(category?: string, level?: string): DebugLog[] {
    let filtered = this.logs;

    if (category) {
      filtered = filtered.filter(l => l.category === category);
    }

    if (level) {
      filtered = filtered.filter(l => l.level === level);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  clear() {
    this.logs = [];
  }

  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  enableDebugMode(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('agent-debug-mode', enabled ? 'true' : 'false');
  }
}

export const agentDebugger = new AgentDebugger();
