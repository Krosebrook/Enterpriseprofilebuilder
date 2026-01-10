/**
 * @fileoverview Claude API Client with comprehensive error handling and retry logic
 * @module lib/api/claude-client
 * @description Production-grade Claude API client with streaming, caching, and security
 * 
 * Features:
 * - Request/response streaming
 * - Automatic retry with exponential backoff
 * - Response caching (Anthropic prompt caching)
 * - Rate limiting
 * - Error handling and logging
 * - Security validation
 * - Token counting and cost tracking
 * 
 * @author INT Inc Engineering Team
 * @version 2.0.0
 * @since 2025-12-11
 */

import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../logger';
import { AppError, ErrorCode } from '../errors';
import { securePipeline } from '@/security/prompt-injection-defense';

// ═══════════════════════════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════════════════════════

export interface ClaudeRequestOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  systemPrompt?: string;
  useCache?: boolean;
  userId?: string;
}

export interface ClaudeResponse {
  content: string;
  id: string;
  model: string;
  stopReason: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens?: number;
    cacheCreationTokens?: number;
  };
  cost: {
    input: number;
    output: number;
    cache: number;
    total: number;
  };
}

export interface StreamChunk {
  type: 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_stop';
  delta?: {
    type: 'text_delta';
    text: string;
  };
  index?: number;
}

// ═══════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════

const CLAUDE_CONFIG = {
  models: {
    HAIKU: 'claude-3-haiku-20240307',
    SONNET: 'claude-3-5-sonnet-20241022',
    OPUS: 'claude-3-opus-20240229'
  },
  
  pricing: {
    // Input tokens per million
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
    'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
    'claude-3-opus-20240229': { input: 15.00, output: 75.00 }
  },
  
  limits: {
    maxTokens: 4096,
    maxRetries: 3,
    retryDelay: 1000, // ms
    timeout: 60000 // ms
  }
} as const;

// ═══════════════════════════════════════════════════════════
// Claude API Client Class
// ═══════════════════════════════════════════════════════════

export class ClaudeClient {
  private client: Anthropic;
  private metrics: Map<string, number> = new Map();
  
  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY
    });
  }
  
  /**
   * Send a message to Claude with automatic security validation
   */
  async sendMessage(
    prompt: string,
    options: ClaudeRequestOptions = {}
  ): Promise<ClaudeResponse> {
    const startTime = performance.now();
    
    try {
      // Security validation
      if (options.userId) {
        const securityResult = await securePipeline.processRequest(
          prompt,
          options.systemPrompt || '',
          options.userId
        );
        
        if (!securityResult.allowed) {
          throw new AppError(
            securityResult.reason || 'Request blocked by security',
            ErrorCode.FORBIDDEN
          );
        }
      }
      
      // Build messages
      const messages = this.buildMessages(prompt, options);
      
      // Send request with retry logic
      const response = await this.sendWithRetry(messages, options);
      
      // Calculate cost
      const cost = this.calculateCost(
        response.usage.input_tokens,
        response.usage.output_tokens,
        options.model || CLAUDE_CONFIG.models.SONNET,
        response.usage.cache_read_input_tokens,
        response.usage.cache_creation_input_tokens
      );
      
      // Track metrics
      this.trackMetrics('request_success', performance.now() - startTime);
      this.trackMetrics('total_cost', cost.total);
      
      // Log request
      logger.info('Claude API request successful', {
        model: response.model,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        cost: cost.total,
        duration: performance.now() - startTime
      });
      
      // Extract content
      const content = response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');
      
      return {
        content,
        id: response.id,
        model: response.model,
        stopReason: response.stop_reason,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          cacheReadTokens: response.usage.cache_read_input_tokens,
          cacheCreationTokens: response.usage.cache_creation_input_tokens
        },
        cost
      };
      
    } catch (error) {
      this.trackMetrics('request_error', 1);
      
      logger.error('Claude API request failed', error as Error, {
        prompt: prompt.substring(0, 100),
        options
      });
      
      throw this.handleError(error);
    }
  }
  
  /**
   * Stream a response from Claude
   */
  async *streamMessage(
    prompt: string,
    options: ClaudeRequestOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    try {
      // Security validation
      if (options.userId) {
        const securityResult = await securePipeline.processRequest(
          prompt,
          options.systemPrompt || '',
          options.userId
        );
        
        if (!securityResult.allowed) {
          throw new AppError(
            securityResult.reason || 'Request blocked by security',
            ErrorCode.FORBIDDEN
          );
        }
      }
      
      const messages = this.buildMessages(prompt, options);
      
      const stream = await this.client.messages.create({
        model: options.model || CLAUDE_CONFIG.models.SONNET,
        max_tokens: options.maxTokens || CLAUDE_CONFIG.limits.maxTokens,
        temperature: options.temperature,
        messages,
        stream: true
      });
      
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && 
            event.delta.type === 'text_delta') {
          yield event.delta.text;
        }
      }
      
    } catch (error) {
      logger.error('Claude streaming failed', error as Error);
      throw this.handleError(error);
    }
  }
  
  /**
   * Build message array with caching support
   */
  private buildMessages(prompt: string, options: ClaudeRequestOptions): any[] {
    const messages: any[] = [];
    
    if (options.useCache && options.systemPrompt) {
      // Use prompt caching for system prompt
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: options.systemPrompt,
            cache_control: { type: 'ephemeral' }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt
      });
    }
    
    return messages;
  }
  
  /**
   * Send request with automatic retry and exponential backoff
   */
  private async sendWithRetry(
    messages: any[],
    options: ClaudeRequestOptions,
    attempt: number = 1
  ): Promise<any> {
    try {
      return await this.client.messages.create({
        model: options.model || CLAUDE_CONFIG.models.SONNET,
        max_tokens: options.maxTokens || CLAUDE_CONFIG.limits.maxTokens,
        temperature: options.temperature,
        messages
      });
    } catch (error: any) {
      // Retry on rate limit or server errors
      const shouldRetry = 
        (error.status === 429 || error.status >= 500) &&
        attempt < CLAUDE_CONFIG.limits.maxRetries;
      
      if (shouldRetry) {
        const delay = CLAUDE_CONFIG.limits.retryDelay * Math.pow(2, attempt - 1);
        
        logger.warn(`Retrying Claude request (attempt ${attempt + 1}/${CLAUDE_CONFIG.limits.maxRetries})`, {
          error: error.message,
          delay
        });
        
        await this.sleep(delay);
        return this.sendWithRetry(messages, options, attempt + 1);
      }
      
      throw error;
    }
  }
  
  /**
   * Calculate request cost
   */
  private calculateCost(
    inputTokens: number,
    outputTokens: number,
    model: string,
    cacheReadTokens: number = 0,
    cacheCreationTokens: number = 0
  ): ClaudeResponse['cost'] {
    const pricing = CLAUDE_CONFIG.pricing[model as keyof typeof CLAUDE_CONFIG.pricing];
    
    if (!pricing) {
      logger.warn(`Unknown model pricing: ${model}`);
      return { input: 0, output: 0, cache: 0, total: 0 };
    }
    
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    
    // Cache reads are 10% of normal cost
    const cacheReadCost = (cacheReadTokens / 1_000_000) * pricing.input * 0.1;
    
    // Cache creation is same as normal input cost
    const cacheCreationCost = (cacheCreationTokens / 1_000_000) * pricing.input;
    
    const cacheCost = cacheReadCost + cacheCreationCost;
    
    return {
      input: inputCost,
      output: outputCost,
      cache: cacheCost,
      total: inputCost + outputCost + cacheCost
    };
  }
  
  /**
   * Handle API errors with proper error codes
   */
  private handleError(error: any): AppError {
    if (error instanceof AppError) {
      return error;
    }
    
    // Anthropic API errors
    if (error.status === 400) {
      return new AppError('Invalid request to Claude API', ErrorCode.VALIDATION_ERROR);
    }
    
    if (error.status === 401) {
      return new AppError('Invalid API key', ErrorCode.UNAUTHORIZED);
    }
    
    if (error.status === 429) {
      return new AppError('Rate limit exceeded', ErrorCode.RATE_LIMIT_EXCEEDED);
    }
    
    if (error.status >= 500) {
      return new AppError('Claude API service error', ErrorCode.EXTERNAL_SERVICE_ERROR);
    }
    
    return new AppError(
      error.message || 'Unknown error calling Claude API',
      ErrorCode.UNKNOWN
    );
  }
  
  /**
   * Track metrics
   */
  private trackMetrics(metric: string, value: number): void {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current + value);
  }
  
  /**
   * Get accumulated metrics
   */
  public getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
  
  /**
   * Reset metrics
   */
  public resetMetrics(): void {
    this.metrics.clear();
  }
  
  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════
// Singleton Instance
// ═══════════════════════════════════════════════════════════

let claudeClientInstance: ClaudeClient | null = null;

export function getClaudeClient(): ClaudeClient {
  if (!claudeClientInstance) {
    claudeClientInstance = new ClaudeClient();
  }
  return claudeClientInstance;
}

// ═══════════════════════════════════════════════════════════
// Convenience Functions
// ═══════════════════════════════════════════════════════════

/**
 * Send a simple message to Claude
 */
export async function askClaude(
  prompt: string,
  options?: ClaudeRequestOptions
): Promise<string> {
  const client = getClaudeClient();
  const response = await client.sendMessage(prompt, options);
  return response.content;
}

/**
 * Stream a response from Claude
 */
export async function* streamClaude(
  prompt: string,
  options?: ClaudeRequestOptions
): AsyncGenerator<string, void, unknown> {
  const client = getClaudeClient();
  yield* client.streamMessage(prompt, options);
}

/**
 * Get Claude API metrics
 */
export function getClaudeMetrics(): Record<string, number> {
  const client = getClaudeClient();
  return client.getMetrics();
}
