/**
 * Client-side and server-side rate limiting utilities
 * Prevents abuse and ensures fair usage across users
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Client-side rate limiter using localStorage
 * Note: This is a soft limit - server should enforce hard limits
 */
export class ClientRateLimiter {
  private config: RateLimitConfig;
  private storageKey: string;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyPrefix: 'rate-limit',
      ...config,
    };
    this.storageKey = `${this.config.keyPrefix}:${config.maxRequests}:${config.windowMs}`;
  }

  /**
   * Check if request is allowed
   */
  check(identifier: string = 'default'): RateLimitResult {
    const key = `${this.storageKey}:${identifier}`;
    const now = Date.now();
    
    // Get existing data
    const data = this.getData(key);
    
    // Clean up old requests outside the window
    const windowStart = now - this.config.windowMs;
    const recentRequests = data.requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    const allowed = recentRequests.length < this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - recentRequests.length);
    
    // Calculate reset time
    const oldestRequest = recentRequests[0] || now;
    const resetAt = oldestRequest + this.config.windowMs;
    
    // If not allowed, calculate retry after
    let retryAfter: number | undefined;
    if (!allowed) {
      retryAfter = Math.ceil((resetAt - now) / 1000); // seconds
    }
    
    // If allowed, record this request
    if (allowed) {
      recentRequests.push(now);
      this.setData(key, { requests: recentRequests });
    }
    
    return {
      allowed,
      remaining,
      resetAt,
      retryAfter,
    };
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string = 'default'): void {
    const key = `${this.storageKey}:${identifier}`;
    localStorage.removeItem(key);
  }

  private getData(key: string): { requests: number[] } {
    try {
      const item = localStorage.getItem(key);
      if (!item) return { requests: [] };
      return JSON.parse(item);
    } catch {
      return { requests: [] };
    }
  }

  private setData(key: string, data: { requests: number[] }): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save rate limit data:', e);
    }
  }
}

/**
 * Server-side rate limiter (for Supabase Edge Functions)
 * Uses KV store for distributed rate limiting
 */
export async function checkServerRateLimit(
  userId: string,
  action: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // TODO: Implement with Supabase KV store or Redis
  // For now, return a mock response
  
  const key = `rate-limit:${action}:${userId}`;
  const now = Date.now();
  
  // This would be replaced with actual KV store logic:
  // const requests = await kv.get(key);
  // const recentRequests = requests.filter(t => t > now - config.windowMs);
  
  // Mock implementation
  return {
    allowed: true,
    remaining: config.maxRequests - 1,
    resetAt: now + config.windowMs,
  };
}

/**
 * Predefined rate limits for different actions
 */
export const RATE_LIMITS = {
  // Agent execution: 100 per hour
  AGENT_EXECUTION: {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'agent-exec',
  },
  
  // Tool invocation: 500 per hour
  TOOL_INVOCATION: {
    maxRequests: 500,
    windowMs: 60 * 60 * 1000,
    keyPrefix: 'tool-invoke',
  },
  
  // API calls (Claude): 50 per minute
  CLAUDE_API: {
    maxRequests: 50,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'claude-api',
  },
  
  // Save agent: 20 per minute
  SAVE_AGENT: {
    maxRequests: 20,
    windowMs: 60 * 1000,
    keyPrefix: 'save-agent',
  },
  
  // General API: 1000 per hour
  API_GENERAL: {
    maxRequests: 1000,
    windowMs: 60 * 60 * 1000,
    keyPrefix: 'api-general',
  },
} as const;

/**
 * React hook for rate limiting
 */
import { useState, useCallback } from 'react';

export function useRateLimit(config: RateLimitConfig) {
  const [limiter] = useState(() => new ClientRateLimiter(config));
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitResult | null>(null);

  const checkLimit = useCallback((identifier?: string) => {
    const result = limiter.check(identifier);
    setRateLimitInfo(result);
    return result;
  }, [limiter]);

  const reset = useCallback((identifier?: string) => {
    limiter.reset(identifier);
    setRateLimitInfo(null);
  }, [limiter]);

  return {
    checkLimit,
    reset,
    rateLimitInfo,
  };
}

/**
 * Rate limit error class
 */
export class RateLimitError extends Error {
  constructor(
    public retryAfter: number,
    public resetAt: number,
    message?: string
  ) {
    super(message || `Rate limit exceeded. Try again in ${retryAfter} seconds.`);
    this.name = 'RateLimitError';
  }
}

/**
 * Middleware to enforce rate limits on async functions
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  config: RateLimitConfig,
  identifier?: string
): T {
  const limiter = new ClientRateLimiter(config);

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const result = limiter.check(identifier);
    
    if (!result.allowed) {
      throw new RateLimitError(
        result.retryAfter || 0,
        result.resetAt,
        `Rate limit exceeded. ${result.remaining} requests remaining. Try again in ${result.retryAfter} seconds.`
      );
    }
    
    return fn(...args);
  }) as T;
}
