/**
 * @fileoverview Application-wide constants and enumerations
 * @module lib/constants
 * @description Defines all constant values, enums, and immutable data structures
 * 
 * This file provides:
 * - Type-safe enumerations for common values
 * - Immutable constant objects
 * - Regular expressions for validation
 * - HTTP status codes
 * - Error messages
 * 
 * @author INT Inc Engineering Team
 * @version 1.0.0
 * @since 2025-12-11
 */

/**
 * Application roles enumeration
 * @enum {string}
 */
export enum Role {
  ALL = 'All',
  FINANCE = 'Finance',
  SALES = 'Sales',
  ENGINEERING = 'Engineering',
  MARKETING = 'Marketing',
  OPERATIONS = 'Operations',
  HR = 'HR'
}

/**
 * Application sections enumeration
 * @enum {string}
 */
export enum Section {
  OVERVIEW = 'overview',
  BASELINE = 'baseline',
  FEATURES = 'features',
  TOOLS = 'tools',
  ROLES = 'roles',
  BEST_PRACTICES = 'best-practices',
  FAQ = 'faq',
  DEPLOYMENT = 'deployment'
}

/**
 * FAQ difficulty levels
 * @enum {string}
 */
export enum FAQLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

/**
 * Feature types
 * @enum {string}
 */
export enum FeatureType {
  WEB_SEARCH = 'web-search',
  MEMORY = 'memory',
  ARTIFACTS = 'artifacts',
  CODE_EXECUTION = 'code-execution',
  FILES = 'files'
}

/**
 * Toast notification types
 * @enum {string}
 */
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Analytics event types
 * @enum {string}
 */
export enum AnalyticsEvent {
  PAGE_VIEW = 'page_view',
  SEARCH = 'search',
  BOOKMARK = 'bookmark',
  TASK_COMPLETION = 'task_completion',
  EXPORT = 'export',
  FEATURE_INTERACTION = 'feature_interaction'
}

/**
 * Storage keys enumeration
 * @enum {string}
 */
export enum StorageKey {
  PREFERENCES = 'preferences',
  BOOKMARKS = 'bookmarks',
  COMPLETED_TASKS = 'completed-tasks',
  VIEW_HISTORY = 'view-history',
  ANALYTICS_EVENTS = 'analytics-events',
  ACTIVE_SECTION = 'active-section',
  SELECTED_ROLE = 'selected-role'
}

/**
 * MCP server categories
 * @enum {string}
 */
export enum MCPCategory {
  DATA = 'data',
  DEVELOPMENT = 'development',
  COMMUNICATION = 'communication',
  DESIGN = 'design',
  OTHER = 'other'
}

/**
 * Badge variants
 * @enum {string}
 */
export enum BadgeVariant {
  DEFAULT = 'default',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info'
}

/**
 * Button variants
 * @enum {string}
 */
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  GHOST = 'ghost',
  DANGER = 'danger'
}

/**
 * Button sizes
 * @enum {string}
 */
export enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg'
}

/**
 * Regular expressions for validation
 */
export const REGEX = {
  /** Email validation */
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  /** URL validation */
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  
  /** UUID validation */
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  
  /** Semantic version validation */
  SEMVER: /^v?\d+\.\d+\.\d+$/,
  
  /** File extension validation */
  FILE_EXT: /\.[0-9a-z]+$/i,
  
  /** Alphanumeric with dashes */
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  RATE_LIMIT: 'Too many requests. Please slow down.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed.',
  INVALID_FILE_TYPE: 'File type is not supported.',
  STORAGE_QUOTA: 'Storage quota exceeded. Please clear some data.',
  PARSE_ERROR: 'Failed to parse data. The format may be invalid.'
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  DELETED: 'Item deleted successfully.',
  COPIED: 'Copied to clipboard.',
  BOOKMARKED: 'Bookmark added.',
  BOOKMARK_REMOVED: 'Bookmark removed.',
  TASK_COMPLETED: 'Task marked as completed.',
  TASK_INCOMPLETE: 'Task marked as incomplete.',
  EXPORT_SUCCESS: 'Export completed successfully.'
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  SEARCH: { key: 'k', ctrl: true, description: 'Open search' },
  SEARCH_ALT: { key: '/', ctrl: false, description: 'Open search' },
  ESCAPE: { key: 'Escape', ctrl: false, description: 'Close dialogs' },
  HELP: { key: '?', ctrl: false, description: 'Show help' },
  NAVIGATE_UP: { key: 'ArrowUp', ctrl: false, description: 'Navigate up' },
  NAVIGATE_DOWN: { key: 'ArrowDown', ctrl: false, description: 'Navigate down' }
} as const;

/**
 * Icon names (Lucide React)
 */
export const ICONS = {
  BOOK_OPEN: 'BookOpen',
  SETTINGS: 'Settings',
  ZAP: 'Zap',
  WRENCH: 'Wrench',
  USERS: 'Users',
  LIGHTBULB: 'Lightbulb',
  HELP_CIRCLE: 'HelpCircle',
  CHECK_SQUARE: 'CheckSquare',
  SEARCH: 'Search',
  MENU: 'Menu',
  X: 'X',
  ARROW_UP: 'ArrowUp',
  BOOKMARK: 'Bookmark',
  COPY: 'Copy',
  PRINTER: 'Printer',
  DOWNLOAD: 'Download'
} as const;

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  OVERLAY: 30,
  MODAL: 40,
  TOAST: 50,
  TOOLTIP: 60
} as const;

/**
 * Deployment task categories
 */
export const DEPLOYMENT_CATEGORIES = {
  SETUP: 'Admin Setup',
  CONFIG: 'Feature Configuration',
  CONNECTORS: 'Connector Setup',
  TRAINING: 'Training',
  MONITORING: 'Monitoring'
} as const;

/**
 * Common date formats
 */
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  US: 'MM/DD/YYYY',
  EU: 'DD/MM/YYYY',
  FULL: 'MMMM DD, YYYY',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss'
} as const;

/**
 * File size units
 */
export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  SHOW_PAGES: 5
} as const;

/**
 * Color palette (Tailwind-compatible)
 */
export const COLORS = {
  PRIMARY: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#E88A1D',
    600: '#D07614',
    700: '#B85C0C',
    800: '#9A4109',
    900: '#7C2D12'
  },
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },
  SUCCESS: {
    500: '#10B981',
    600: '#059669',
    700: '#047857'
  },
  WARNING: {
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309'
  },
  ERROR: {
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C'
  },
  INFO: {
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8'
  }
} as const;

/**
 * Accessibility ARIA labels
 */
export const ARIA_LABELS = {
  SEARCH_INPUT: 'Search documentation',
  CLOSE_BUTTON: 'Close',
  MENU_BUTTON: 'Open menu',
  BACK_TO_TOP: 'Back to top',
  BOOKMARK_ADD: 'Add bookmark',
  BOOKMARK_REMOVE: 'Remove bookmark',
  PRINT: 'Print this page',
  COPY: 'Copy to clipboard',
  EXPAND: 'Expand section',
  COLLAPSE: 'Collapse section'
} as const;

/**
 * Export all constants as a unified object
 */
export const CONSTANTS = {
  REGEX,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  KEYBOARD_SHORTCUTS,
  ICONS,
  ANIMATION,
  Z_INDEX,
  DEPLOYMENT_CATEGORIES,
  DATE_FORMATS,
  FILE_SIZE_UNITS,
  PAGINATION,
  COLORS,
  ARIA_LABELS
} as const;

/**
 * Type exports for TypeScript consumers
 */
export type HTTPStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];
export type SuccessMessage = typeof SUCCESS_MESSAGES[keyof typeof SUCCESS_MESSAGES];
export type IconName = typeof ICONS[keyof typeof ICONS];
export type ColorShade = keyof typeof COLORS.PRIMARY;
