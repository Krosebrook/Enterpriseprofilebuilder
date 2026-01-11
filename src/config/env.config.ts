/**
 * @fileoverview Type-safe environment configuration
 * @module config/env
 * @description Validates and provides type-safe access to environment variables
 * 
 * Security Features:
 * - Runtime validation of required variables
 * - Type safety for all environment values
 * - Sanitization of sensitive data in logs
 * - Clear error messages for missing configuration
 * 
 * @author INT Inc Security Team
 * @version 1.0.0
 * @since 2026-01-11
 */

import { logger } from '../lib/logger';

/**
 * Environment types
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/**
 * Validated environment configuration interface
 */
export interface EnvConfig {
  // Supabase
  supabase: {
    projectId: string;
    anonKey: string;
    url: string;
  };
  
  // Application
  app: {
    env: Environment;
    version: string;
    debugMode: boolean;
  };
  
  // Security
  security: {
    enableCSP: boolean;
    rateLimitRPM: number;
    sessionTimeout: number;
    enableSecurityHeaders: boolean;
  };
  
  // Analytics
  analytics: {
    enabled: boolean;
    id?: string;
  };
  
  // Feature Flags
  features: {
    darkMode: boolean;
    pdfExport: boolean;
    collaboration: boolean;
  };
}

/**
 * Configuration validation error
 */
export class EnvConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvConfigError';
  }
}

/**
 * Get required environment variable
 * @throws {EnvConfigError} If variable is not set
 */
function getRequiredEnv(key: string, context: string): string {
  const value = import.meta.env[key];
  
  if (!value || value === 'undefined' || value === 'null' || value.trim() === '') {
    throw new EnvConfigError(
      `Missing required environment variable: ${key}\n` +
      `Context: ${context}\n` +
      `Please check your .env.local file and ensure it matches .env.example`
    );
  }
  
  return value;
}

/**
 * Get optional environment variable with default
 */
function getOptionalEnv(key: string, defaultValue: string): string {
  const value = import.meta.env[key];
  return value && value !== 'undefined' && value !== 'null' ? value : defaultValue;
}

/**
 * Get boolean environment variable
 */
function getBooleanEnv(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (!value || value === 'undefined' || value === 'null') {
    return defaultValue;
  }
  return value === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getNumberEnv(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (!value || value === 'undefined' || value === 'null') {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate Supabase URL format
 */
function validateSupabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

/**
 * Validate Supabase anon key format (JWT)
 */
function validateAnonKey(key: string): boolean {
  // JWT format: header.payload.signature
  const parts = key.split('.');
  if (parts.length !== 3) return false;
  
  // Basic length check (JWTs are typically long)
  return key.length > 100;
}

/**
 * Sanitize sensitive values for logging
 */
function sanitizeForLog(value: string): string {
  if (value.length <= 8) return '***';
  return value.substring(0, 4) + '...' + value.substring(value.length - 4);
}

/**
 * Load and validate environment configuration
 */
export function loadEnvConfig(): EnvConfig {
  try {
    // Check if we're using fallback hardcoded values (legacy)
    const usingHardcodedFallback = !import.meta.env.VITE_SUPABASE_PROJECT_ID;
    
    if (usingHardcodedFallback) {
      logger.warn(
        'Using fallback Supabase configuration. ' +
        'For production, set environment variables in .env.local'
      );
    }
    
    // Supabase Configuration
    const projectId = getOptionalEnv(
      'VITE_SUPABASE_PROJECT_ID',
      'gloqchibrcklsjsznvjg' // Fallback for backward compatibility
    );
    
    const anonKey = getOptionalEnv(
      'VITE_SUPABASE_ANON_KEY',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsb3FjaGlicmNrbHNqc3pudmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTY4MzMsImV4cCI6MjA3NDQ3MjgzM30.vtRPBTXGPJVPoflLPjSeC88G34m2LmHcXg4tmaZ9bFw'
    );
    
    const supabaseUrl = getOptionalEnv(
      'VITE_SUPABASE_URL',
      `https://${projectId}.supabase.co`
    );
    
    // Validate Supabase configuration
    if (!validateSupabaseUrl(supabaseUrl)) {
      throw new EnvConfigError(
        `Invalid Supabase URL format: ${supabaseUrl}\n` +
        'Expected format: https://your-project-id.supabase.co'
      );
    }
    
    if (!validateAnonKey(anonKey)) {
      logger.warn('Supabase anon key format appears invalid. Ensure it is a valid JWT.');
    }
    
    // Application Configuration
    const appEnv = getOptionalEnv('VITE_APP_ENV', 'development') as Environment;
    const appVersion = getOptionalEnv('VITE_APP_VERSION', '1.0.0');
    const debugMode = getBooleanEnv('VITE_DEBUG_MODE', appEnv === 'development');
    
    // Security Configuration
    const enableCSP = getBooleanEnv('VITE_ENABLE_CSP', true);
    const rateLimitRPM = getNumberEnv('VITE_RATE_LIMIT_RPM', 20);
    const sessionTimeout = getNumberEnv('VITE_SESSION_TIMEOUT', 30);
    const enableSecurityHeaders = getBooleanEnv('VITE_ENABLE_SECURITY_HEADERS', true);
    
    // Analytics Configuration
    const analyticsEnabled = getBooleanEnv('VITE_ENABLE_ANALYTICS', false);
    const analyticsId = getOptionalEnv('VITE_ANALYTICS_ID', '');
    
    // Feature Flags
    const darkMode = getBooleanEnv('VITE_ENABLE_DARK_MODE', false);
    const pdfExport = getBooleanEnv('VITE_ENABLE_PDF_EXPORT', false);
    const collaboration = getBooleanEnv('VITE_ENABLE_COLLABORATION', false);
    
    const config: EnvConfig = {
      supabase: {
        projectId,
        anonKey,
        url: supabaseUrl,
      },
      app: {
        env: appEnv,
        version: appVersion,
        debugMode,
      },
      security: {
        enableCSP,
        rateLimitRPM,
        sessionTimeout,
        enableSecurityHeaders,
      },
      analytics: {
        enabled: analyticsEnabled,
        id: analyticsId || undefined,
      },
      features: {
        darkMode,
        pdfExport,
        collaboration,
      },
    };
    
    // Log configuration (sanitized)
    if (debugMode) {
      logger.debug('Environment configuration loaded', {
        env: appEnv,
        version: appVersion,
        supabaseProjectId: projectId,
        supabaseAnonKey: sanitizeForLog(anonKey),
        features: config.features,
        usingFallback: usingHardcodedFallback,
      });
    }
    
    return config;
    
  } catch (error) {
    if (error instanceof EnvConfigError) {
      logger.error('Environment configuration error', error);
      throw error;
    }
    
    logger.error('Unexpected error loading environment config', error as Error);
    throw new EnvConfigError(
      'Failed to load environment configuration. See console for details.'
    );
  }
}

/**
 * Validate environment configuration
 */
export function validateEnvConfig(config: EnvConfig): void {
  // Validate environment
  const validEnvs: Environment[] = ['development', 'staging', 'production', 'test'];
  if (!validEnvs.includes(config.app.env)) {
    throw new EnvConfigError(
      `Invalid environment: ${config.app.env}. Must be one of: ${validEnvs.join(', ')}`
    );
  }
  
  // Validate version format (semantic versioning)
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(config.app.version)) {
    logger.warn(`Invalid version format: ${config.app.version}. Expected semantic versioning (e.g., 1.0.0)`);
  }
  
  // Validate rate limit
  if (config.security.rateLimitRPM < 1 || config.security.rateLimitRPM > 1000) {
    throw new EnvConfigError(
      `Invalid rate limit: ${config.security.rateLimitRPM}. Must be between 1 and 1000.`
    );
  }
  
  // Validate session timeout
  if (config.security.sessionTimeout < 1 || config.security.sessionTimeout > 1440) {
    throw new EnvConfigError(
      `Invalid session timeout: ${config.security.sessionTimeout}. Must be between 1 and 1440 minutes.`
    );
  }
  
  // Warn about production configuration
  if (config.app.env === 'production') {
    if (config.app.debugMode) {
      logger.warn('Debug mode is enabled in production. This should be disabled.');
    }
    
    if (!config.security.enableCSP) {
      logger.warn('CSP is disabled in production. This reduces security.');
    }
    
    if (!config.security.enableSecurityHeaders) {
      logger.warn('Security headers are disabled in production. This reduces security.');
    }
  }
}

/**
 * Singleton environment configuration
 */
let envConfigInstance: EnvConfig | null = null;

/**
 * Get environment configuration (singleton)
 */
export function getEnvConfig(): EnvConfig {
  if (!envConfigInstance) {
    envConfigInstance = loadEnvConfig();
    validateEnvConfig(envConfigInstance);
  }
  return envConfigInstance;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnvConfig().app.env === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return getEnvConfig().app.env === 'development';
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return getEnvConfig().app.debugMode;
}

/**
 * Export for testing
 */
export const __testing__ = {
  getRequiredEnv,
  getOptionalEnv,
  getBooleanEnv,
  getNumberEnv,
  validateSupabaseUrl,
  validateAnonKey,
  sanitizeForLog,
};
