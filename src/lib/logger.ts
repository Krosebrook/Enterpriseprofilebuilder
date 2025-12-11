/**
 * @fileoverview Centralized logging utility
 * @module lib/logger
 * @description Production-grade logging system with multiple levels and formatters
 * 
 * Features:
 * - Multiple log levels (debug, info, warn, error)
 * - Structured logging with metadata
 * - Environment-aware (verbose in dev, silent in prod)
 * - Performance tracking
 * - Error aggregation
 * 
 * @author INT Inc Engineering Team
 * @version 1.0.0
 * @since 2025-12-11
 */

import { isDevelopment } from '../config/app.config';

/**
 * Log levels enumeration
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4
}

/**
 * Log entry interface
 */
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
  stack?: string;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStoredLogs: number;
}

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  level: isDevelopment() ? LogLevel.DEBUG : LogLevel.WARN,
  enableConsole: true,
  enableStorage: isDevelopment(),
  maxStoredLogs: 100
};

/**
 * Logger class for application-wide logging
 */
class Logger {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadStoredLogs();
  }

  /**
   * Load logs from localStorage
   */
  private loadStoredLogs(): void {
    if (!this.config.enableStorage) return;

    try {
      const stored = localStorage.getItem('app-logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load stored logs:', error);
    }
  }

  /**
   * Save logs to localStorage
   */
  private saveLogsToStorage(): void {
    if (!this.config.enableStorage) return;

    try {
      // Keep only the most recent logs
      const logsToStore = this.logs.slice(-this.config.maxStoredLogs);
      localStorage.setItem('app-logs', JSON.stringify(logsToStore));
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: Date.now(),
      level,
      message,
      metadata,
      stack: error?.stack
    };
  }

  /**
   * Write log entry
   */
  private write(entry: LogEntry): void {
    // Check if log level is sufficient
    if (entry.level < this.config.level) return;

    // Add to in-memory logs
    this.logs.push(entry);

    // Save to storage
    this.saveLogsToStorage();

    // Console output
    if (this.config.enableConsole) {
      this.writeToConsole(entry);
    }
  }

  /**
   * Write to console with appropriate formatting
   */
  private writeToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${levelName}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.metadata || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.metadata || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.metadata || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.metadata || '', entry.stack || '');
        break;
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, metadata);
    this.write(entry);
  }

  /**
   * Info level logging
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, metadata);
    this.write(entry);
  }

  /**
   * Warning level logging
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, metadata);
    this.write(entry);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, metadata, error);
    this.write(entry);
  }

  /**
   * Performance timing
   */
  time(label: string): void {
    if (this.config.level > LogLevel.DEBUG) return;
    console.time(label);
  }

  /**
   * End performance timing
   */
  timeEnd(label: string): void {
    if (this.config.level > LogLevel.DEBUG) return;
    console.timeEnd(label);
  }

  /**
   * Group related logs
   */
  group(label: string): void {
    if (this.config.level > LogLevel.DEBUG) return;
    console.group(label);
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (this.config.level > LogLevel.DEBUG) return;
    console.groupEnd();
  }

  /**
   * Get all logs
   */
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
    if (this.config.enableStorage) {
      localStorage.removeItem('app-logs');
    }
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get logger statistics
   */
  getStats(): {
    total: number;
    byLevel: Record<string, number>;
  } {
    const byLevel: Record<string, number> = {
      DEBUG: 0,
      INFO: 0,
      WARN: 0,
      ERROR: 0
    };

    this.logs.forEach(log => {
      const levelName = LogLevel[log.level];
      byLevel[levelName]++;
    });

    return {
      total: this.logs.length,
      byLevel
    };
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();

/**
 * Export default logger
 */
export default logger;

/**
 * Convenience methods for quick logging
 */
export const log = {
  debug: (message: string, metadata?: Record<string, unknown>) => logger.debug(message, metadata),
  info: (message: string, metadata?: Record<string, unknown>) => logger.info(message, metadata),
  warn: (message: string, metadata?: Record<string, unknown>) => logger.warn(message, metadata),
  error: (message: string, error?: Error, metadata?: Record<string, unknown>) => logger.error(message, error, metadata)
};
