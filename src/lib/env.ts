/**
 * @fileoverview Type-safe environment variable access
 * @module lib/env
 */

/**
 * Environment variables interface
 */
interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_GA_TRACKING_ID?: string;
  readonly VITE_ANALYTICS_ENDPOINT?: string;
  readonly VITE_SECURITY_EMAIL_RECIPIENTS?: string;
  readonly VITE_SLACK_SECURITY_WEBHOOK?: string;
  readonly VITE_PAGERDUTY_API_KEY?: string;
  readonly VITE_SECURITY_WEBHOOK_URL?: string;
  readonly VITE_ANTHROPIC_API_KEY?: string;
  readonly VITE_APP_VERSION?: string;
  readonly MODE?: string;
  readonly DEV?: boolean;
  readonly PROD?: boolean;
}

/**
 * Safely get environment variable
 */
export function getEnv<K extends keyof ImportMetaEnv>(
  key: K
): ImportMetaEnv[K] | undefined {
  if (typeof import.meta === 'undefined' || !import.meta.env) {
    return undefined;
  }
  
  const env = import.meta.env as ImportMetaEnv;
  return env[key];
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return getEnv('DEV') === true || getEnv('MODE') === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return getEnv('PROD') === true || getEnv('MODE') === 'production';
}

/**
 * Get app version
 */
export function getAppVersion(): string {
  return getEnv('VITE_APP_VERSION') || '0.1.0';
}

/**
 * Get current environment mode
 */
export function getMode(): string {
  return (getEnv('MODE') as string) || 'development';
}
