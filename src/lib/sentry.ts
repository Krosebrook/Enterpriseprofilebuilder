/**
 * @fileoverview Sentry error tracking and performance monitoring
 * @module lib/sentry
 */

import * as Sentry from '@sentry/react';
import { logger } from './logger';
import { getEnv, getMode, getAppVersion, isDevelopment } from './env';

/**
 * Initialize Sentry error tracking
 * Only initializes in production with valid DSN
 */
export function initSentry(): void {
  const sentryDsn = getEnv('VITE_SENTRY_DSN');
  const environment = getMode();
  const release = getAppVersion();

  // Skip initialization if no DSN provided or not in production
  if (!sentryDsn) {
    logger.info('Sentry not initialized: No DSN provided');
    return;
  }

  if (isDevelopment()) {
    logger.info('Sentry not initialized: Development environment');
    return;
  }

  try {
    Sentry.init({
      dsn: sentryDsn,
      environment,
      release: `enterprise-profile-builder@${release}`,
      
      // Performance Monitoring
      integrations: [
        // Browser tracing for performance monitoring
        Sentry.browserTracingIntegration({
          // Track navigation and resource loading
          tracePropagationTargets: [
            'localhost',
            /^https:\/\/.*\.enterpriseprofilebuilder\.com/,
          ],
        }),
        // Replay integration for session recording
        Sentry.replayIntegration({
          maskAllText: true, // Privacy: mask all text
          blockAllMedia: true, // Privacy: block all media
        }),
      ],

      // Capture 100% of transactions for performance monitoring in production
      // Adjust this value in production: 0.1 = 10%
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,

      // Capture 10% of sessions for replay
      // Adjust based on volume
      replaysSessionSampleRate: 0.1,
      
      // Capture 100% of sessions with errors for replay
      replaysOnErrorSampleRate: 1.0,

      // Before sending, scrub sensitive data
      beforeSend(event, hint) {
        // Remove sensitive data from breadcrumbs and context
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
            if (breadcrumb.data) {
              // Remove potential PII
              const sanitized = { ...breadcrumb.data };
              ['password', 'token', 'apiKey', 'secret', 'authorization'].forEach(key => {
                if (key in sanitized) {
                  sanitized[key] = '[Filtered]';
                }
              });
              return { ...breadcrumb, data: sanitized };
            }
            return breadcrumb;
          });
        }

        // Log error to console in development
        if (environment !== 'production') {
          console.error('Sentry Error:', hint.originalException || event.message);
        }

        return event;
      },

      // Ignore certain errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Random plugins/extensions
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        // Facebook borked
        'fb_xd_fragment',
        // ISP "optimizing" proxy
        '__gCrWeb',
        '__gCrWeb.autofill',
        // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
        'Can\'t find variable: ZiteReader',
        'jigsaw is not defined',
        'ComboSearch is not defined',
        // Network errors
        'NetworkError',
        'Network request failed',
        'Failed to fetch',
      ],
    });

    logger.info('Sentry initialized successfully', {
      environment,
      release,
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    });
  } catch (error) {
    logger.error('Failed to initialize Sentry', error as Error);
  }
}

/**
 * Manually capture an exception
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (context) {
    Sentry.captureException(error, { extra: context });
  } else {
    Sentry.captureException(error);
  }
  
  // Also log locally
  logger.error('Exception captured', error, context);
}

/**
 * Capture a message
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, unknown>
): void {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });

  // Also log locally
  logger.info(`Message captured: ${message}`, context);
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; username?: string }): void {
  Sentry.setUser(user);
  logger.info('Sentry user context set', { userId: user.id });
}

/**
 * Clear user context
 */
export function clearUser(): void {
  Sentry.setUser(null);
  logger.info('Sentry user context cleared');
}

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  level?: Sentry.SeverityLevel,
  data?: Record<string, unknown>
): void {
  Sentry.addBreadcrumb({
    message,
    category: category || 'user-action',
    level: level || 'info',
    data,
  });
}

/**
 * Start a performance transaction
 */
export function startTransaction(
  name: string,
  op: string
): Sentry.Transaction | undefined {
  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * ErrorBoundary component from Sentry
 * Use this to wrap your app for automatic error boundary
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

/**
 * Profiler component from Sentry
 * Use this to profile component performance
 */
export const Profiler = Sentry.Profiler;

/**
 * withProfiler HOC from Sentry
 * Use this to wrap components for automatic profiling
 */
export const withProfiler = Sentry.withProfiler;
