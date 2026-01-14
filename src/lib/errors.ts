/**
 * @fileoverview Custom error classes for the application
 * @module lib/errors
 * @description Provides structured error handling with custom error types
 * 
 * Features:
 * - Type-safe error classes
 * - Error codes for programmatic handling
 * - Context metadata for debugging
 * - User-friendly error messages
 * 
 * @author INT Inc Engineering Team
 * @version 1.0.0
 * @since 2025-12-11
 */

import { ERROR_MESSAGES } from './constants';

/**
 * Error codes enumeration
 */
export enum ErrorCode {
  // Generic errors
  UNKNOWN = 'UNKNOWN_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  
  // Network errors
  NETWORK = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  
  // Storage errors
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_PARSE_ERROR = 'STORAGE_PARSE_ERROR',
  
  // File errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  
  // Authorization errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Configuration errors
  INVALID_CONFIG = 'INVALID_CONFIG'
}

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: number;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    this.timestamp = Date.now();

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.VALIDATION, context?: Record<string, unknown>) {
    super(message, ErrorCode.VALIDATION, 422, true, context);
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NETWORK, context?: Record<string, unknown>) {
    super(message, ErrorCode.NETWORK, 503, true, context);
  }
}

/**
 * Storage error
 */
export class StorageError extends AppError {
  constructor(message: string, code: ErrorCode, context?: Record<string, unknown>) {
    super(message, code, 507, true, context);
  }
}

/**
 * Storage quota exceeded error
 */
export class StorageQuotaError extends StorageError {
  constructor(context?: Record<string, unknown>) {
    super(ERROR_MESSAGES.STORAGE_QUOTA, ErrorCode.STORAGE_QUOTA_EXCEEDED, context);
  }
}

/**
 * Storage parse error
 */
export class StorageParseError extends StorageError {
  constructor(context?: Record<string, unknown>) {
    super(ERROR_MESSAGES.PARSE_ERROR, ErrorCode.STORAGE_PARSE_ERROR, context);
  }
}

/**
 * File error
 */
export class FileError extends AppError {
  constructor(message: string, code: ErrorCode, context?: Record<string, unknown>) {
    super(message, code, 400, true, context);
  }
}

/**
 * File too large error
 */
export class FileTooLargeError extends FileError {
  constructor(context?: Record<string, unknown>) {
    super(ERROR_MESSAGES.FILE_TOO_LARGE, ErrorCode.FILE_TOO_LARGE, context);
  }
}

/**
 * Invalid file type error
 */
export class InvalidFileTypeError extends FileError {
  constructor(context?: Record<string, unknown>) {
    super(ERROR_MESSAGES.INVALID_FILE_TYPE, ErrorCode.INVALID_FILE_TYPE, context);
  }
}

/**
 * Authorization error
 */
export class AuthError extends AppError {
  constructor(message: string, code: ErrorCode, statusCode: number, context?: Record<string, unknown>) {
    super(message, code, statusCode, true, context);
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends AuthError {
  constructor(context?: Record<string, unknown>) {
    super(ERROR_MESSAGES.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, 401, context);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', context?: Record<string, unknown>) {
    super(`${resource} ${ERROR_MESSAGES.NOT_FOUND}`, ErrorCode.NOT_FOUND, 404, true, context);
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  public readonly retryAfter?: number;

  constructor(retryAfter?: number, context?: Record<string, unknown>) {
    super(ERROR_MESSAGES.RATE_LIMIT, ErrorCode.RATE_LIMIT_EXCEEDED, 429, true, context);
    this.retryAfter = retryAfter;
  }
}

/**
 * Configuration error
 */
export class ConfigError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.INVALID_CONFIG, 500, false, context);
  }
}

/**
 * Error handler utility
 */
export class ErrorHandler {
  /**
   * Handle error based on type
   */
  static handle(error: Error): { message: string; code?: ErrorCode } {
    if (error instanceof AppError) {
      return {
        message: error.message,
        code: error.code
      };
    }

    // Unknown error
    return {
      message: ERROR_MESSAGES.GENERIC,
      code: ErrorCode.UNKNOWN
    };
  }

  /**
   * Log error appropriately
   */
  static log(error: Error): void {
    if (error instanceof AppError && error.isOperational) {
      // Operational error - expected
      console.warn('[Operational Error]', error.toJSON());
    } else {
      // Programming error - unexpected
      console.error('[Programming Error]', error);
    }
  }

  /**
   * Check if error is operational
   */
  static isOperational(error: Error): boolean {
    return error instanceof AppError && error.isOperational;
  }

  /**
   * Get user-friendly message
   */
  static getUserMessage(error: Error): string {
    if (error instanceof AppError) {
      return error.message;
    }
    return ERROR_MESSAGES.GENERIC;
  }
}

/**
 * Assert utility for validation
 */
export function assert(
  condition: boolean,
  message: string,
  code: ErrorCode = ErrorCode.VALIDATION
): asserts condition {
  if (!condition) {
    throw new AppError(message, code, 400);
  }
}

/**
 * Try-catch wrapper with error handling
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  fallback?: T,
  onError?: (error: Error) => void
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      ErrorHandler.log(error as Error);
    }
    return fallback;
  }
}
