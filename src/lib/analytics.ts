/**
 * Analytics and event tracking utilities
 * Privacy-first analytics with GDPR compliance
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface UserProperties {
  userId?: string;
  role?: string;
  plan?: string;
  createdAt?: number;
}

/**
 * Analytics provider interface
 */
interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  identify(userId: string, properties: UserProperties): void;
  page(name: string, properties?: Record<string, any>): void;
}

/**
 * Analytics manager class
 */
class AnalyticsManager {
  private providers: AnalyticsProvider[] = [];
  private sessionId: string;
  private enabled: boolean = true;
  private consentGiven: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.checkConsent();
  }

  /**
   * Register analytics provider
   */
  registerProvider(provider: AnalyticsProvider) {
    this.providers.push(provider);
  }

  /**
   * Track an event
   */
  track(eventName: string, properties?: Record<string, any>) {
    if (!this.enabled || !this.consentGiven) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: this.sanitizeProperties(properties),
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }

    // Send to all providers
    this.providers.forEach(provider => {
      try {
        provider.track(event);
      } catch (error) {
        console.error('Analytics provider error:', error);
      }
    });

    // Store locally for analytics dashboard
    this.storeEventLocally(event);
  }

  /**
   * Identify user
   */
  identify(userId: string, properties: UserProperties = {}) {
    if (!this.enabled || !this.consentGiven) return;

    this.providers.forEach(provider => {
      try {
        provider.identify(userId, properties);
      } catch (error) {
        console.error('Analytics provider error:', error);
      }
    });
  }

  /**
   * Track page view
   */
  page(pageName: string, properties?: Record<string, any>) {
    if (!this.enabled || !this.consentGiven) return;

    this.track('page_view', {
      page: pageName,
      ...properties,
    });

    this.providers.forEach(provider => {
      try {
        provider.page(pageName, properties);
      } catch (error) {
        console.error('Analytics provider error:', error);
      }
    });
  }

  /**
   * Set analytics consent
   */
  setConsent(granted: boolean) {
    this.consentGiven = granted;
    localStorage.setItem('analytics-consent', granted ? 'granted' : 'denied');
  }

  /**
   * Check if consent was previously given
   */
  private checkConsent() {
    const consent = localStorage.getItem('analytics-consent');
    this.consentGiven = consent === 'granted';
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Sanitize properties to remove PII
   */
  private sanitizeProperties(properties?: Record<string, any>): Record<string, any> {
    if (!properties) return {};

    const sanitized: Record<string, any> = {};
    const piiKeys = ['email', 'password', 'apiKey', 'token', 'ssn', 'creditCard'];

    for (const [key, value] of Object.entries(properties)) {
      // Remove PII
      if (piiKeys.some(piiKey => key.toLowerCase().includes(piiKey))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 500) {
        // Truncate long strings
        sanitized[key] = value.substring(0, 500) + '...';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Store event locally for analytics dashboard
   */
  private storeEventLocally(event: AnalyticsEvent) {
    try {
      const key = 'analytics-events';
      const stored = localStorage.getItem(key);
      const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
      
      // Keep only last 1000 events
      events.push(event);
      if (events.length > 1000) {
        events.shift();
      }

      localStorage.setItem(key, JSON.stringify(events));
    } catch (error) {
      // Ignore storage errors
    }
  }

  /**
   * Get stored events
   */
  getStoredEvents(): AnalyticsEvent[] {
    try {
      const key = 'analytics-events';
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear stored events
   */
  clearStoredEvents() {
    localStorage.removeItem('analytics-events');
  }
}

// Singleton instance
export const analytics = new AnalyticsManager();

// ═══════════════════════════════════════════════════════════
// Predefined Event Tracking
// ═══════════════════════════════════════════════════════════

export const trackEvents = {
  // Agent events
  agentCreated: (agentName: string, model: string) => {
    analytics.track('agent_created', { agentName, model });
  },

  agentUpdated: (agentId: string) => {
    analytics.track('agent_updated', { agentId });
  },

  agentDeleted: (agentId: string) => {
    analytics.track('agent_deleted', { agentId });
  },

  agentExecuted: (agentId: string, success: boolean, duration: number) => {
    analytics.track('agent_executed', { agentId, success, duration });
  },

  // Tool events
  toolAdded: (toolId: string, agentId: string) => {
    analytics.track('tool_added', { toolId, agentId });
  },

  toolRemoved: (toolId: string, agentId: string) => {
    analytics.track('tool_removed', { toolId, agentId });
  },

  toolInvoked: (toolId: string, success: boolean) => {
    analytics.track('tool_invoked', { toolId, success });
  },

  // Navigation events
  sectionViewed: (section: string) => {
    analytics.track('section_viewed', { section });
  },

  featureUsed: (feature: string) => {
    analytics.track('feature_used', { feature });
  },

  // Governance events
  policyCreated: (policyType: string) => {
    analytics.track('policy_created', { policyType });
  },

  permissionGranted: (permission: string, resource: string) => {
    analytics.track('permission_granted', { permission, resource });
  },

  permissionDenied: (permission: string, resource: string, reason: string) => {
    analytics.track('permission_denied', { permission, resource, reason });
  },

  // Error events
  errorOccurred: (errorType: string, errorMessage: string, context?: string) => {
    analytics.track('error_occurred', { 
      errorType, 
      errorMessage: errorMessage.substring(0, 200), 
      context 
    });
  },

  // User engagement
  searchPerformed: (query: string, resultsCount: number) => {
    analytics.track('search_performed', { 
      query: query.substring(0, 100), 
      resultsCount 
    });
  },

  exportDownloaded: (format: string, itemCount: number) => {
    analytics.track('export_downloaded', { format, itemCount });
  },

  // Performance
  pageLoadTime: (page: string, duration: number) => {
    analytics.track('page_load_time', { page, duration });
  },
};

// ═══════════════════════════════════════════════════════════
// React Hook for Analytics
// ═══════════════════════════════════════════════════════════

import { useEffect } from 'react';

export function usePageTracking(pageName: string, properties?: Record<string, any>) {
  useEffect(() => {
    const startTime = performance.now();
    analytics.page(pageName, properties);

    return () => {
      const duration = performance.now() - startTime;
      trackEvents.pageLoadTime(pageName, duration);
    };
  }, [pageName]);
}

export function useEventTracking() {
  return {
    track: analytics.track.bind(analytics),
    trackEvents,
  };
}

// ═══════════════════════════════════════════════════════════
// Console Analytics Provider (Development)
// ═══════════════════════════════════════════════════════════

class ConsoleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    console.log('[Analytics] Track:', event);
  }

  identify(userId: string, properties: UserProperties): void {
    console.log('[Analytics] Identify:', userId, properties);
  }

  page(name: string, properties?: Record<string, any>): void {
    console.log('[Analytics] Page:', name, properties);
  }
}

// Register console provider in development
if (process.env.NODE_ENV === 'development') {
  analytics.registerProvider(new ConsoleAnalyticsProvider());
}

// ═══════════════════════════════════════════════════════════
// Export for external analytics providers
// ═══════════════════════════════════════════════════════════

export { analytics as default };
