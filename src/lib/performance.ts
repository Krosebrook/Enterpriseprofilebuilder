/**
 * Performance monitoring utilities for Web Vitals and custom metrics
 * Implements Core Web Vitals tracking (LCP, FID, CLS)
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

// Core Web Vitals thresholds (from Google)
const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint
  FID: { good: 100, poor: 300 },        // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint
};

function getRating(name: keyof typeof WEB_VITALS_THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report metric to analytics service (extend with your analytics provider)
 */
function reportMetric(metric: PerformanceMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Performance Metric:', metric);
  }

  // TODO: Send to analytics service
  // Example integrations:
  // - Google Analytics 4
  // - Vercel Analytics
  // - Sentry Performance
  // - Custom backend

  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      metric_timestamp: metric.timestamp,
    });
  }

  // Example: Custom backend
  if (typeof window !== 'undefined' && navigator.sendBeacon) {
    const body = JSON.stringify({
      ...metric,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
    
    // Uncomment and configure your analytics endpoint
    // navigator.sendBeacon('/api/analytics/web-vitals', body);
  }
}

/**
 * Initialize Web Vitals monitoring
 * Uses the web-vitals library pattern without the actual dependency
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        const lcp = lastEntry.renderTime || lastEntry.loadTime;
        reportMetric({
          name: 'LCP',
          value: lcp,
          rating: getRating('LCP', lcp),
          timestamp: Date.now(),
        });
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP observation failed:', e);
    }

    // FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          reportMetric({
            name: 'FID',
            value: fid,
            rating: getRating('FID', fid),
            timestamp: Date.now(),
          });
        });
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID observation failed:', e);
    }

    // CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // Report CLS on page unload
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportMetric({
            name: 'CLS',
            value: clsValue,
            rating: getRating('CLS', clsValue),
            timestamp: Date.now(),
          });
        }
      }, { once: true });
    } catch (e) {
      console.warn('CLS observation failed:', e);
    }

    // FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          reportMetric({
            name: 'FCP',
            value: fcpEntry.startTime,
            rating: getRating('FCP', fcpEntry.startTime),
            timestamp: Date.now(),
          });
        }
      });
      
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.warn('FCP observation failed:', e);
    }
  }

  // TTFB (Time to First Byte) - from Navigation Timing API
  if ('performance' in window && 'getEntriesByType' in window.performance) {
    const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
      reportMetric({
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
        timestamp: Date.now(),
      });
    }
  }
}

/**
 * Track custom performance mark
 */
export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.performance.mark(name);
  }
}

/**
 * Measure custom performance duration
 */
export function measurePerformance(name: string, startMark: string, endMark?: string) {
  if (typeof window === 'undefined' || !('performance' in window)) return null;

  try {
    if (endMark) {
      window.performance.measure(name, startMark, endMark);
    } else {
      window.performance.measure(name, startMark);
    }

    const measures = window.performance.getEntriesByName(name, 'measure');
    if (measures.length > 0) {
      const duration = measures[measures.length - 1].duration;
      
      // Report custom metric
      reportMetric({
        name: `custom_${name}`,
        value: duration,
        rating: duration < 1000 ? 'good' : duration < 2000 ? 'needs-improvement' : 'poor',
        timestamp: Date.now(),
      });

      return duration;
    }
  } catch (e) {
    console.warn('Performance measurement failed:', e);
  }

  return null;
}

/**
 * Track feature load time
 */
export function trackFeatureLoad(featureName: string) {
  markPerformance(`feature-${featureName}-start`);
  
  return () => {
    markPerformance(`feature-${featureName}-end`);
    measurePerformance(`feature-${featureName}-load`, `feature-${featureName}-start`, `feature-${featureName}-end`);
  };
}

/**
 * Get current performance metrics summary
 */
export function getPerformanceMetrics(): Record<string, number> {
  if (typeof window === 'undefined' || !('performance' in window)) return {};

  const metrics: Record<string, number> = {};

  // Navigation Timing
  const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    metrics.domInteractive = navigation.domInteractive;
    metrics.domComplete = navigation.domComplete;
    metrics.loadComplete = navigation.loadEventEnd;
  }

  // Memory (Chrome only)
  if ('memory' in window.performance) {
    const memory = (window.performance as any).memory;
    metrics.usedJSHeapSize = memory.usedJSHeapSize;
    metrics.totalJSHeapSize = memory.totalJSHeapSize;
    metrics.jsHeapSizeLimit = memory.jsHeapSizeLimit;
  }

  return metrics;
}

/**
 * Log performance summary (useful for debugging)
 */
export function logPerformanceSummary() {
  const metrics = getPerformanceMetrics();
  console.group('📊 Performance Summary');
  console.table(metrics);
  console.groupEnd();
}
