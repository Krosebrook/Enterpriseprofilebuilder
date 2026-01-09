/**
 * @fileoverview Performance monitoring and Web Vitals tracking
 * @module lib/performance
 */

import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { logger } from './logger';
import { captureMessage } from './sentry';
import { getEnv, isDevelopment } from './env';

/**
 * Performance metric thresholds (in milliseconds)
 * Based on Google's Core Web Vitals recommendations
 */
export const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // First Input Delay (FID) - deprecated in favor of INP
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  // Interaction to Next Paint (INP)
  INP: {
    good: 200,
    needsImprovement: 500,
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
} as const;

/**
 * Performance metric rating
 */
type MetricRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Get rating for a metric based on thresholds
 */
function getMetricRating(name: string, value: number): MetricRating {
  const thresholds = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
  
  if (!thresholds) {
    return 'good';
  }

  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Format metric value for display
 */
function formatMetricValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return Math.round(value).toString();
}

/**
 * Send metric to analytics and monitoring services
 */
function sendToAnalytics(metric: Metric): void {
  const { name, value, delta, id } = metric;
  const formattedValue = formatMetricValue(name, value);
  const metricRating = getMetricRating(name, value);

  // Log to console in development
  if (isDevelopment()) {
    const emoji = metricRating === 'good' ? '✅' : metricRating === 'needs-improvement' ? '⚠️' : '❌';
    // eslint-disable-next-line no-console
    console.log(`${emoji} ${name}: ${formattedValue} (${metricRating})`);
  }

  // Log to our logging system
  logger.info('Performance metric recorded', {
    metric: name,
    value: formattedValue,
    rating: metricRating,
    delta,
    id,
  });

  // Send to Sentry if performance is poor
  if (metricRating === 'poor') {
    captureMessage(
      `Poor performance detected: ${name}`,
      'warning',
      {
        metric: name,
        value: formattedValue,
        rating: metricRating,
        threshold: PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS],
      }
    );
  }

  // Send to Google Analytics if configured
  const gaTrackingId = getEnv('VITE_GA_TRACKING_ID');
  if (gaTrackingId && typeof window.gtag === 'function') {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(value),
      event_label: id,
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint if configured
  const analyticsEndpoint = getEnv('VITE_ANALYTICS_ENDPOINT');
  if (analyticsEndpoint && navigator.sendBeacon) {
    void navigator.sendBeacon(
      analyticsEndpoint,
      JSON.stringify({
        name,
        value,
        rating: metricRating,
        delta,
        id,
        timestamp: Date.now(),
      })
    );
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this once when your app loads
 */
export function initPerformanceMonitoring(): void {
  try {
    // Monitor Largest Contentful Paint (LCP)
    onLCP(sendToAnalytics);

    // Monitor First Input Delay (FID) - deprecated but still useful
    onFID(sendToAnalytics);

    // Monitor Interaction to Next Paint (INP) - new metric replacing FID
    onINP(sendToAnalytics);

    // Monitor Cumulative Layout Shift (CLS)
    onCLS(sendToAnalytics);

    // Monitor First Contentful Paint (FCP)
    onFCP(sendToAnalytics);

    // Monitor Time to First Byte (TTFB)
    onTTFB(sendToAnalytics);

    logger.info('Performance monitoring initialized');
  } catch (error) {
    logger.error('Failed to initialize performance monitoring', error as Error);
  }
}

/**
 * Custom performance mark
 * Use this to mark important events in your app
 */
export function performanceMark(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure time between two marks
 */
export function performanceMeasure(
  name: string,
  startMark: string,
  endMark?: string
): number | null {
  try {
    if (typeof performance !== 'undefined' && performance.measure) {
      const measure = performance.measure(name, startMark, endMark);
      const duration = measure.duration;

      logger.info('Performance measure', {
        name,
        duration: Math.round(duration),
        startMark,
        endMark,
      });

      return duration;
    }
  } catch (error) {
    logger.warn('Performance measure failed', error as Error);
  }

  return null;
}

/**
 * Get all performance entries
 */
export function getPerformanceEntries(type?: string): PerformanceEntry[] {
  if (typeof performance === 'undefined' || !performance.getEntries) {
    return [];
  }

  return type
    ? performance.getEntriesByType(type)
    : performance.getEntries();
}

/**
 * Clear performance entries
 */
export function clearPerformanceEntries(): void {
  if (typeof performance !== 'undefined' && performance.clearMarks) {
    performance.clearMarks();
    performance.clearMeasures();
  }
}

/**
 * Get navigation timing information
 */
export function getNavigationTiming(): PerformanceNavigationTiming | null {
  if (typeof performance === 'undefined' || !performance.getEntriesByType) {
    return null;
  }

  const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  const [navigationEntry] = entries;
  return navigationEntry || null;
}

/**
 * Calculate and log detailed navigation timing metrics
 */
export function logNavigationMetrics(): void {
  const timing = getNavigationTiming();
  
  if (!timing) {
    logger.warn('Navigation timing not available');
    return;
  }

  const metrics = {
    // Time to first byte
    ttfb: timing.responseStart - timing.requestStart,
    // DNS lookup time
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    // TCP connection time
    tcp: timing.connectEnd - timing.connectStart,
    // Request time
    request: timing.responseEnd - timing.requestStart,
    // Response time
    response: timing.responseEnd - timing.responseStart,
    // DOM processing time
    domProcessing: timing.domComplete - timing.domLoading,
    // DOM content loaded
    domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
    // Page load time
    load: timing.loadEventEnd - timing.loadEventStart,
    // Total time
    total: timing.loadEventEnd - timing.fetchStart,
  };

  logger.info('Navigation timing metrics', metrics);
}

/**
 * Monitor resource loading performance
 */
export function monitorResourceLoading(): void {
  if (typeof performance === 'undefined' || !performance.getEntriesByType) {
    return;
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  // Find slow resources (>2 seconds)
  const slowResources = resources.filter(resource => resource.duration > 2000);
  
  if (slowResources.length > 0) {
    logger.warn('Slow resources detected', {
      count: slowResources.length,
      resources: slowResources.map(r => ({
        name: r.name,
        duration: Math.round(r.duration),
        size: r.transferSize,
        type: r.initiatorType,
      })),
    });

    // Send to Sentry if there are many slow resources
    if (slowResources.length >= 5) {
      captureMessage(
        `${slowResources.length} slow resources detected`,
        'warning',
        {
          slowResources: slowResources.map(r => ({
            name: r.name,
            duration: Math.round(r.duration),
          })),
        }
      );
    }
  }
}

/**
 * Memory info interface
 */
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/**
 * Performance with memory extension
 */
interface PerformanceWithMemory extends Performance {
  memory?: MemoryInfo;
}

/**
 * Get memory usage information (if available)
 */
export function getMemoryUsage(): MemoryInfo | null {
  if (
    typeof performance !== 'undefined' &&
    'memory' in performance &&
    (performance as PerformanceWithMemory).memory
  ) {
    const memory = (performance as PerformanceWithMemory).memory;
    if (!memory) {
      return null;
    }
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }

  return null;
}

/**
 * Log memory usage
 */
export function logMemoryUsage(): void {
  const memory = getMemoryUsage();
  
  if (memory) {
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
    const usagePercent = ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1);

    logger.info('Memory usage', {
      used: `${usedMB} MB`,
      total: `${totalMB} MB`,
      limit: `${limitMB} MB`,
      usage: `${usagePercent}%`,
    });

    // Warn if memory usage is high
    if (parseFloat(usagePercent) > 80) {
      logger.warn('High memory usage detected', {
        usage: `${usagePercent}%`,
      });
    }
  }
}

// TypeScript augmentation for gtag
declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}
