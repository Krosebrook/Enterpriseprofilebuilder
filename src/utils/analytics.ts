import { AnalyticsEvent, Section, Role } from '../types';

/**
 * Track analytics event
 * In production, this would send to an analytics service like PostHog, Mixpanel, etc.
 */
export function trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): void {
  const fullEvent: AnalyticsEvent = {
    ...event,
    timestamp: Date.now()
  };

  // Log to console in development
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('local'));
     
  if (isDevelopment) {
    console.log('[Analytics]', fullEvent);
  }

  // In production, send to analytics service
  // Example: posthog.capture(event.event, event.metadata);
  
  // Store in localStorage for demo purposes
  try {
    const events = JSON.parse(localStorage.getItem('analytics-events') || '[]');
    events.push(fullEvent);
    // Keep only last 100 events
    if (events.length > 100) {
      events.shift();
    }
    localStorage.setItem('analytics-events', JSON.stringify(events));
  } catch (e) {
    console.error('Failed to store analytics event:', e);
  }
}

/**
 * Track page view
 */
export function trackPageView(section: Section, role?: Role): void {
  trackEvent({
    event: 'page_view',
    section,
    role,
    metadata: {
      path: window.location.pathname,
      referrer: document.referrer
    }
  });
}

/**
 * Track search
 */
export function trackSearch(query: string, resultsCount: number): void {
  trackEvent({
    event: 'search',
    metadata: {
      query,
      resultsCount
    }
  });
}

/**
 * Track bookmark action
 */
export function trackBookmark(action: 'add' | 'remove', itemId: string): void {
  trackEvent({
    event: 'bookmark',
    metadata: {
      action,
      itemId
    }
  });
}

/**
 * Track task completion
 */
export function trackTaskCompletion(taskId: string, completed: boolean): void {
  trackEvent({
    event: 'task_completion',
    metadata: {
      taskId,
      completed
    }
  });
}

/**
 * Track export/print action
 */
export function trackExport(format: 'pdf' | 'print', section: Section): void {
  trackEvent({
    event: 'export',
    section,
    metadata: {
      format
    }
  });
}

/**
 * Track feature interaction
 */
export function trackFeatureInteraction(feature: string, action: string): void {
  trackEvent({
    event: 'feature_interaction',
    metadata: {
      feature,
      action
    }
  });
}

/**
 * Get analytics summary
 */
export function getAnalyticsSummary(): {
  totalEvents: number;
  eventsByType: Record<string, number>;
  popularSections: Array<{ section: string; count: number }>;
} {
  try {
    const events: AnalyticsEvent[] = JSON.parse(
      localStorage.getItem('analytics-events') || '[]'
    );

    const eventsByType: Record<string, number> = {};
    const sectionCounts: Record<string, number> = {};

    events.forEach(event => {
      eventsByType[event.event] = (eventsByType[event.event] || 0) + 1;
      
      if (event.section) {
        sectionCounts[event.section] = (sectionCounts[event.section] || 0) + 1;
      }
    });

    const popularSections = Object.entries(sectionCounts)
      .map(([section, count]) => ({ section, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalEvents: events.length,
      eventsByType,
      popularSections
    };
  } catch (e) {
    return {
      totalEvents: 0,
      eventsByType: {},
      popularSections: []
    };
  }
}