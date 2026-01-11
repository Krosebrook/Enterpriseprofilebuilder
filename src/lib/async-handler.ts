/**
 * @fileoverview Centralized async operation handler with retry logic and error handling
 * @module lib/async-handler
 * @description Utilities for handling async operations with retry, timeout, and error handling
 */

import { logger } from './logger';
import { ERROR_CONFIG } from '../config/app.config';

/**
 * Async operation options
 */
export interface AsyncOptions {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Initial backoff delay in milliseconds */
  backoffMs?: number;
  /** Maximum backoff delay in milliseconds */
  maxBackoffMs?: number;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Custom error message */
  errorMessage?: string;
  /** Whether to suppress error logging */
  suppressLog?: boolean;
  /** Retry condition function */
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Result type for async operations
 */
export type AsyncResult<T> = 
  | { success: true; data: T }
  | { success: false; error: Error };

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const calculateBackoff = (attempt: number, baseMs: number, maxMs: number): number => {
  const delay = Math.min(baseMs * Math.pow(2, attempt), maxMs);
  // Add jitter to prevent thundering herd
  return delay * (0.5 + Math.random() * 0.5);
};

/**
 * Wrap async operation with timeout
 */
export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([operation, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

/**
 * Retry async operation with exponential backoff
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: AsyncOptions = {}
): Promise<T> {
  const {
    maxRetries = ERROR_CONFIG.retry.maxAttempts,
    backoffMs = ERROR_CONFIG.retry.backoffMs,
    maxBackoffMs = ERROR_CONFIG.retry.maxBackoffMs,
    timeout,
    errorMessage = 'Operation failed after retries',
    suppressLog = false,
    shouldRetry = () => true
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const promise = operation();
      const result = timeout 
        ? await withTimeout(promise, timeout, `${errorMessage} (timeout)`)
        : await promise;
      
      if (attempt > 0 && !suppressLog) {
        logger.info('Operation succeeded after retry', { attempt });
      }
      
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry this error
      if (!shouldRetry(lastError)) {
        throw lastError;
      }

      // Don't sleep on last attempt
      if (attempt < maxRetries) {
        const delay = calculateBackoff(attempt, backoffMs, maxBackoffMs);
        
        if (!suppressLog) {
          logger.warn('Operation failed, retrying...', { 
            attempt: attempt + 1, 
            maxRetries, 
            delayMs: delay,
            error: lastError.message 
          });
        }
        
        await sleep(delay);
      }
    }
  }

  if (!suppressLog) {
    logger.error(errorMessage, lastError!, { maxRetries });
  }

  throw lastError!;
}

/**
 * Safe async operation wrapper with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  options: AsyncOptions = {}
): Promise<AsyncResult<T>> {
  try {
    const data = await retry(operation, options);
    return { success: true, data };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    
    if (!options.suppressLog) {
      logger.error(options.errorMessage || 'Async operation failed', err);
    }
    
    return { success: false, error: err };
  }
}

/**
 * Batch async operations with concurrency limit
 */
export async function batchAsync<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  options: { 
    concurrency?: number;
    onProgress?: (completed: number, total: number) => void;
  } = {}
): Promise<AsyncResult<R>[]> {
  const { concurrency = 5, onProgress } = options;
  const results: AsyncResult<R>[] = [];
  const queue = [...items];
  let completed = 0;

  const worker = async (): Promise<void> => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      const result = await safeAsync(() => operation(item), { suppressLog: true });
      results.push(result);
      
      completed++;
      onProgress?.(completed, items.length);
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);

  return results;
}

/**
 * Debounce async function
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let latestResolve: ((value: any) => void) | null = null;
  let latestReject: ((error: any) => void) | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        // Reject previous pending promise
        latestReject?.(new Error('Debounced'));
      }

      latestResolve = resolve;
      latestReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          timeoutId = null;
          latestResolve = null;
          latestReject = null;
        }
      }, delayMs);
    });
  };
}

/**
 * Create a cancellable async operation
 */
export interface CancellablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
}

export function makeCancellable<T>(
  promise: Promise<T>
): CancellablePromise<T> {
  let isCancelled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then(value => {
        if (!isCancelled) {
          resolve(value);
        }
      })
      .catch(error => {
        if (!isCancelled) {
          reject(error);
        }
      });
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCancelled = true;
    }
  };
}

/**
 * Network-aware retry (don't retry if offline)
 */
export function shouldRetryNetworkError(error: Error): boolean {
  // Don't retry if offline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }

  // Retry on network errors
  const networkErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'NetworkError'];
  return networkErrors.some(errType => error.message.includes(errType));
}
