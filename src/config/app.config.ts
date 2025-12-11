/**
 * @fileoverview Application-wide configuration
 * @module config/app
 * @description Centralized configuration for the INT Inc Claude Profile Builder
 * 
 * This configuration file manages all application-level settings including:
 * - Application metadata and versioning
 * - Feature flags for progressive rollout
 * - Performance optimization settings
 * - Security and compliance parameters
 * - Environment-specific configurations
 * 
 * @author INT Inc Engineering Team
 * @version 1.0.0
 * @since 2025-12-11
 */

/**
 * Application metadata and version information
 */
export const APP_CONFIG = {
  /** Application version following semantic versioning */
  version: 'v1.0.0',
  
  /** Release date in ISO format */
  releaseDate: '2025-12-11',
  
  /** Human-readable release date */
  displayDate: 'December 11, 2025',
  
  /** Application name */
  name: 'INT Inc Enterprise Claude Profile Builder',
  
  /** Short application name for displays */
  shortName: 'Claude Profile Builder',
  
  /** Application description */
  description: 'Comprehensive System Prompt Baseline & Feature Documentation',
  
  /** Organization information */
  organization: {
    name: 'INT Inc',
    location: 'Buffalo Grove, IL',
    employeeCount: 41,
    engineerRange: '50-200'
  }
} as const;

/**
 * Feature flags for progressive rollout and A/B testing
 * @description Controls which features are enabled in the application
 */
export const FEATURE_FLAGS = {
  /** Enable advanced search with fuzzy matching */
  advancedSearch: true,
  
  /** Enable user bookmarking system */
  bookmarks: true,
  
  /** Enable analytics tracking */
  analytics: true,
  
  /** Enable keyboard shortcuts */
  keyboardShortcuts: true,
  
  /** Enable dark mode (future feature) */
  darkMode: false,
  
  /** Enable internationalization (future feature) */
  i18n: false,
  
  /** Enable PDF export (future feature) */
  pdfExport: false,
  
  /** Enable collaborative features (future feature) */
  collaboration: false,
  
  /** Enable PWA features (future feature) */
  pwa: false
} as const;

/**
 * Performance optimization settings
 */
export const PERFORMANCE_CONFIG = {
  /** Search debounce delay in milliseconds */
  searchDebounceMs: 300,
  
  /** Maximum search results to display */
  maxSearchResults: 50,
  
  /** Scroll threshold for back-to-top button (pixels) */
  backToTopThreshold: 400,
  
  /** Toast notification duration in milliseconds */
  toastDuration: 5000,
  
  /** Maximum number of toasts to show simultaneously */
  maxToasts: 3,
  
  /** Animation duration for transitions */
  transitionDuration: 300,
  
  /** Virtual scroll threshold for large lists */
  virtualScrollThreshold: 100
} as const;

/**
 * Security and compliance configuration
 */
export const SECURITY_CONFIG = {
  /** Content Security Policy directives */
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"]
  },
  
  /** Maximum file upload size in bytes (20MB) */
  maxFileSize: 20 * 1024 * 1024,
  
  /** Allowed file types for uploads */
  allowedFileTypes: [
    '.pdf', '.docx', '.txt', '.md',
    '.csv', '.json', '.xml', '.yaml',
    '.py', '.js', '.ts', '.sql',
    '.png', '.jpg', '.jpeg', '.gif', '.webp',
    '.xlsx'
  ],
  
  /** Rate limiting configuration */
  rateLimit: {
    requestsPerMinute: 20,
    tokensPerConversation: 50000,
    maxFilesPerConversation: 10
  },
  
  /** Compliance levels */
  compliance: ['SOC 2 Type II', 'GDPR-ready', 'HIPAA-ready', 'WCAG 2.1 AA']
} as const;

/**
 * Storage configuration
 */
export const STORAGE_CONFIG = {
  /** LocalStorage key prefix */
  keyPrefix: 'claude-profile-builder',
  
  /** Memory expiration in days */
  memoryExpirationDays: 30,
  
  /** Maximum analytics events to store */
  maxAnalyticsEvents: 100,
  
  /** Maximum view history entries */
  maxViewHistory: 10,
  
  /** Storage quota warning threshold (bytes) */
  quotaWarningThreshold: 5 * 1024 * 1024 // 5MB
} as const;

/**
 * UI/UX configuration
 */
export const UI_CONFIG = {
  /** Responsive breakpoints in pixels */
  breakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  },
  
  /** Maximum content width in pixels */
  maxContentWidth: 1200,
  
  /** Sidebar width in pixels */
  sidebarWidth: 256,
  
  /** Color palette */
  colors: {
    primary: '#E88A1D',
    primaryHover: '#D07614',
    primaryActive: '#B85C0C',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  
  /** Typography scale */
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    }
  }
} as const;

/**
 * Navigation configuration
 */
export const NAVIGATION_CONFIG = {
  /** Default active section on app load */
  defaultSection: 'overview' as const,
  
  /** Default role filter */
  defaultRole: 'All' as const,
  
  /** Section order in navigation */
  sectionOrder: [
    'overview',
    'baseline',
    'features',
    'tools',
    'roles',
    'best-practices',
    'faq',
    'deployment'
  ] as const
} as const;

/**
 * Analytics configuration
 */
export const ANALYTICS_CONFIG = {
  /** Enable console logging in development */
  enableDevLogging: true,
  
  /** Events to track */
  trackedEvents: [
    'page_view',
    'search',
    'bookmark',
    'task_completion',
    'export',
    'feature_interaction'
  ],
  
  /** Batch size for analytics events */
  batchSize: 10,
  
  /** Flush interval in milliseconds */
  flushInterval: 60000 // 1 minute
} as const;

/**
 * Error handling configuration
 */
export const ERROR_CONFIG = {
  /** Show detailed error messages in development */
  verboseErrors: false,
  
  /** Error reporting endpoint (future) */
  reportingEndpoint: null,
  
  /** Retry configuration */
  retry: {
    maxAttempts: 3,
    backoffMs: 1000,
    maxBackoffMs: 5000
  }
} as const;

/**
 * Get environment-specific configuration
 * @returns {boolean} Whether the app is running in development mode
 */
export function isDevelopment(): boolean {
  return typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('local'));
}

/**
 * Get environment-specific configuration
 * @returns {boolean} Whether the app is running in production mode
 */
export function isProduction(): boolean {
  return !isDevelopment();
}

/**
 * Validate configuration on startup
 * @throws {Error} If configuration is invalid
 */
export function validateConfig(): void {
  // Validate version format
  const versionRegex = /^v\d+\.\d+\.\d+$/;
  if (!versionRegex.test(APP_CONFIG.version)) {
    throw new Error(`Invalid version format: ${APP_CONFIG.version}`);
  }
  
  // Validate performance settings
  if (PERFORMANCE_CONFIG.searchDebounceMs < 0) {
    throw new Error('Search debounce must be non-negative');
  }
  
  if (PERFORMANCE_CONFIG.maxSearchResults < 1) {
    throw new Error('Max search results must be at least 1');
  }
  
  // Validate security settings
  if (SECURITY_CONFIG.maxFileSize < 1024) {
    throw new Error('Max file size must be at least 1KB');
  }
}

/**
 * Export type-safe configuration
 */
export type AppConfig = typeof APP_CONFIG;
export type FeatureFlags = typeof FEATURE_FLAGS;
export type PerformanceConfig = typeof PERFORMANCE_CONFIG;
export type SecurityConfig = typeof SECURITY_CONFIG;
export type StorageConfig = typeof STORAGE_CONFIG;
export type UIConfig = typeof UI_CONFIG;
export type NavigationConfig = typeof NAVIGATION_CONFIG;
export type AnalyticsConfig = typeof ANALYTICS_CONFIG;
export type ErrorConfig = typeof ERROR_CONFIG;
