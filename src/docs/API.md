# API Documentation

**INT Inc Enterprise Claude Profile Builder**  
**Version**: 1.0.0  
**Last Updated**: December 11, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Core Components](#core-components)
3. [Custom Hooks](#custom-hooks)
4. [Utility Functions](#utility-functions)
5. [Type Definitions](#type-definitions)
6. [Configuration](#configuration)
7. [Error Handling](#error-handling)
8. [Storage API](#storage-api)
9. [Analytics API](#analytics-api)
10. [Examples](#examples)

---

## Overview

This document provides comprehensive API documentation for all public interfaces, components, hooks, and utilities in the Claude Profile Builder application.

### Design Philosophy

- **Type-Safe**: All APIs are fully typed with TypeScript
- **Composable**: Small, focused functions that work together
- **Predictable**: No side effects unless explicitly stated
- **Documented**: JSDoc comments on all public interfaces
- **Testable**: Pure functions with minimal dependencies

---

## Core Components

### Button

Multi-variant button component with full accessibility support.

```typescript
import { Button } from './components/ui/Button';

interface ButtonProps {
  /** Button content */
  children: ReactNode;
  
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Click handler */
  onClick?: () => void;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state (shows spinner) */
  loading?: boolean;
  
  /** Full width */
  fullWidth?: boolean;
  
  /** Icon to display before text */
  icon?: ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

function Button(props: ButtonProps): JSX.Element;
```

**Usage:**

```tsx
// Primary button
<Button variant="primary" onClick={handleSave}>
  Save Changes
</Button>

// Button with icon
<Button variant="secondary" icon={<Download />}>
  Export Data
</Button>

// Loading state
<Button loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>

// Danger variant for destructive actions
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>
```

**Accessibility:**
- Keyboard accessible (Tab, Enter, Space)
- ARIA attributes for screen readers
- Focus visible indicator
- Disabled state communicated to assistive tech

---

### Badge

Semantic badge component for status indicators.

```typescript
import { Badge } from './components/ui/Badge';

interface BadgeProps {
  /** Badge content */
  children: ReactNode;
  
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Rounded pill style */
  pill?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

function Badge(props: BadgeProps): JSX.Element;
```

**Usage:**

```tsx
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>

// Pill style
<Badge variant="info" pill>New Feature</Badge>

// Small size
<Badge variant="default" size="sm">v1.0</Badge>
```

---

### Card

Container component for content grouping.

```typescript
import { Card } from './components/ui/Card';

interface CardProps {
  /** Card content */
  children: ReactNode;
  
  /** Hover effect */
  hoverable?: boolean;
  
  /** Click handler (makes card interactive) */
  onClick?: () => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

function Card(props: CardProps): JSX.Element;
```

**Usage:**

```tsx
// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Clickable card with hover effect
<Card hoverable onClick={handleCardClick}>
  <h3>Interactive Card</h3>
</Card>

// Custom padding
<Card padding="lg">
  <h3>Large Padding Card</h3>
</Card>
```

---

### Toast

Toast notification system for user feedback.

```typescript
import { ToastContainer, useToast } from './components/ui/Toast';

interface ToastNotification {
  /** Unique identifier */
  id: string;
  
  /** Toast type */
  type: 'success' | 'error' | 'warning' | 'info';
  
  /** Message to display */
  message: string;
  
  /** Optional title */
  title?: string;
  
  /** Duration in milliseconds (default: 5000) */
  duration?: number;
  
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UseToastReturn {
  /** Add a toast notification */
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  
  /** Remove a toast by ID */
  removeToast: (id: string) => void;
  
  /** Remove all toasts */
  clearToasts: () => void;
  
  /** Current toasts */
  toasts: ToastNotification[];
}

function useToast(): UseToastReturn;
```

**Usage:**

```tsx
// In your app root
function App() {
  const { toasts, addToast, removeToast } = useToast();
  
  return (
    <div>
      {/* Your app content */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

// In any component
function MyComponent() {
  const { addToast } = useToast();
  
  const handleSuccess = () => {
    addToast({
      type: 'success',
      message: 'Data saved successfully!'
    });
  };
  
  const handleError = () => {
    addToast({
      type: 'error',
      title: 'Error',
      message: 'Failed to save data. Please try again.',
      duration: 7000
    });
  };
  
  const handleWithAction = () => {
    addToast({
      type: 'info',
      message: 'New update available',
      action: {
        label: 'Refresh',
        onClick: () => window.location.reload()
      }
    });
  };
}
```

---

### ProgressBar

Visual progress indicator with variants.

```typescript
import { ProgressBar } from './components/ui/ProgressBar';

interface ProgressBarProps {
  /** Progress value (0-100) */
  value: number;
  
  /** Color variant */
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Show percentage label */
  showLabel?: boolean;
  
  /** Custom label */
  label?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Animated progress */
  animated?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

function ProgressBar(props: ProgressBarProps): JSX.Element;
```

**Usage:**

```tsx
// Basic progress bar
<ProgressBar value={75} />

// With label
<ProgressBar value={60} label="Upload Progress" showLabel />

// Color variants
<ProgressBar value={100} color="success" />
<ProgressBar value={50} color="warning" />
<ProgressBar value={25} color="danger" />

// Animated
<ProgressBar value={progress} animated />
```

---

## Custom Hooks

### useLocalStorage

Persist state to localStorage with type safety.

```typescript
import { useLocalStorage } from './hooks/useLocalStorage';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void];
```

**Parameters:**
- `key`: LocalStorage key (will be prefixed with app namespace)
- `initialValue`: Default value if no stored value exists

**Returns:**
- `[value, setValue]`: Tuple similar to useState, but persisted

**Usage:**

```tsx
function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16);
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>('bookmarks', []);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const addBookmark = (id: string) => {
    setBookmarks(prev => [...prev, id]);
  };
  
  return (
    <div>
      <button onClick={toggleTheme}>
        Current theme: {theme}
      </button>
      <p>Bookmarks: {bookmarks.length}</p>
    </div>
  );
}
```

**Features:**
- Type-safe generic interface
- Automatic JSON serialization/deserialization
- Syncs with localStorage on every change
- SSR-safe (checks for window)
- Handles storage quota errors

---

### useSearch

Fuzzy search with debouncing and relevance scoring.

```typescript
import { useSearch } from './hooks/useSearch';

interface SearchResult {
  /** Item ID */
  id: string;
  
  /** Matched title */
  title: string;
  
  /** Matched content snippet */
  snippet: string;
  
  /** Result type */
  type: 'faq' | 'feature' | 'deployment' | 'best-practice';
  
  /** Relevance score (0-1) */
  relevance: number;
  
  /** Matched tags */
  tags: string[];
}

interface UseSearchOptions {
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  
  /** Maximum results to return */
  maxResults?: number;
  
  /** Minimum relevance score (0-1) */
  minRelevance?: number;
}

interface UseSearchReturn {
  /** Search results */
  results: SearchResult[];
  
  /** Loading state */
  isSearching: boolean;
  
  /** Error state */
  error: Error | null;
}

function useSearch(
  query: string,
  options?: UseSearchOptions
): UseSearchReturn;
```

**Usage:**

```tsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const { results, isSearching, error } = useSearch(query, {
    debounceMs: 300,
    maxResults: 10,
    minRelevance: 0.3
  });
  
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      {isSearching && <Spinner />}
      {error && <ErrorMessage error={error} />}
      
      {results.map(result => (
        <SearchResult key={result.id} {...result} />
      ))}
      
      {query && results.length === 0 && !isSearching && (
        <p>No results found for "{query}"</p>
      )}
    </div>
  );
}
```

**Features:**
- Fuzzy matching with typo tolerance
- Multi-field search (title, content, tags)
- Relevance scoring and ranking
- Debounced for performance
- Search analytics tracking

---

### useKeyboardShortcuts

Declarative keyboard shortcut handling.

```typescript
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

interface KeyboardShortcut {
  /** Key to listen for */
  key: string;
  
  /** Require Ctrl/Cmd key */
  ctrl?: boolean;
  
  /** Require Shift key */
  shift?: boolean;
  
  /** Require Alt key */
  alt?: boolean;
  
  /** Handler function */
  handler: (event: KeyboardEvent) => void;
  
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  
  /** Stop event propagation */
  stopPropagation?: boolean;
}

function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void;
```

**Usage:**

```tsx
function Editor() {
  const [content, setContent] = useState('');
  const { addToast } = useToast();
  
  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      preventDefault: true,
      handler: () => {
        saveContent(content);
        addToast({ type: 'success', message: 'Saved!' });
      }
    },
    {
      key: 'k',
      ctrl: true,
      handler: () => {
        openSearchModal();
      }
    },
    {
      key: 'Escape',
      handler: () => {
        closeModal();
      }
    },
    {
      key: 'z',
      ctrl: true,
      handler: () => {
        undo();
      }
    }
  ]);
  
  return <textarea value={content} onChange={e => setContent(e.target.value)} />;
}
```

**Features:**
- Multiple shortcuts in one hook
- Modifier key support (Ctrl, Shift, Alt)
- Event control (preventDefault, stopPropagation)
- Automatic cleanup on unmount
- Cross-platform (Ctrl on Windows/Linux, Cmd on Mac)

---

## Utility Functions

### Search Utilities

```typescript
import {
  performSearch,
  fuzzyMatch,
  calculateRelevance,
  highlightMatches
} from './utils/search';

/**
 * Perform fuzzy search across all content
 * @param query - Search query string
 * @param options - Search configuration
 * @returns Array of search results sorted by relevance
 */
function performSearch(
  query: string,
  options?: {
    maxResults?: number;
    minRelevance?: number;
  }
): SearchResult[];

/**
 * Check if text fuzzy matches query
 * @param text - Text to search in
 * @param query - Search query
 * @returns Match score (0-1) or null if no match
 */
function fuzzyMatch(text: string, query: string): number | null;

/**
 * Calculate relevance score for a search result
 * @param item - Content item
 * @param query - Search query
 * @returns Relevance score (0-1)
 */
function calculateRelevance(item: any, query: string): number;

/**
 * Highlight query matches in text
 * @param text - Text to highlight
 * @param query - Search query
 * @returns Text with <mark> tags around matches
 */
function highlightMatches(text: string, query: string): string;
```

**Usage:**

```tsx
// Perform search
const results = performSearch('security', {
  maxResults: 10,
  minRelevance: 0.3
});

// Check fuzzy match
const score = fuzzyMatch('Claude AI Security', 'secrity'); // 0.85 (typo tolerant)

// Highlight matches
const highlighted = highlightMatches(
  'Learn about Claude AI security features',
  'security'
);
// Returns: "Learn about Claude AI <mark>security</mark> features"
```

---

### Storage Utilities

```typescript
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearStorage,
  getStorageSize,
  isStorageAvailable
} from './utils/storage';

/**
 * Save data to localStorage
 * @param key - Storage key
 * @param value - Data to save (will be JSON stringified)
 * @throws StorageQuotaError if quota exceeded
 */
function saveToStorage<T>(key: string, value: T): void;

/**
 * Load data from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Stored value or default
 */
function loadFromStorage<T>(key: string, defaultValue: T): T;

/**
 * Remove item from localStorage
 * @param key - Storage key
 */
function removeFromStorage(key: string): void;

/**
 * Clear all app data from localStorage
 */
function clearStorage(): void;

/**
 * Get current storage usage in bytes
 * @returns Approximate storage size
 */
function getStorageSize(): number;

/**
 * Check if localStorage is available
 * @returns true if localStorage is accessible
 */
function isStorageAvailable(): boolean;
```

**Usage:**

```tsx
// Save data
saveToStorage('user-preferences', {
  theme: 'dark',
  fontSize: 16,
  notifications: true
});

// Load data
const preferences = loadFromStorage('user-preferences', {
  theme: 'light',
  fontSize: 14,
  notifications: false
});

// Check storage size
const sizeInKB = getStorageSize() / 1024;
console.log(`Storage usage: ${sizeInKB.toFixed(2)} KB`);

// Check availability (important for SSR)
if (isStorageAvailable()) {
  saveToStorage('key', 'value');
}
```

---

### Analytics Utilities

```typescript
import {
  trackEvent,
  trackPageView,
  trackSearch,
  trackBookmark,
  getAnalyticsEvents,
  exportAnalytics
} from './utils/analytics';

/**
 * Track a custom event
 * @param eventName - Event identifier
 * @param properties - Event metadata
 */
function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void;

/**
 * Track page view
 * @param section - Section identifier
 * @param role - User role filter
 */
function trackPageView(section: Section, role: Role): void;

/**
 * Track search query
 * @param query - Search query string
 * @param resultsCount - Number of results
 */
function trackSearch(query: string, resultsCount: number): void;

/**
 * Track bookmark action
 * @param itemId - Bookmarked item ID
 * @param action - 'added' or 'removed'
 */
function trackBookmark(itemId: string, action: 'added' | 'removed'): void;

/**
 * Get all tracked events
 * @param options - Filter options
 * @returns Array of analytics events
 */
function getAnalyticsEvents(options?: {
  startDate?: Date;
  endDate?: Date;
  eventType?: string;
}): AnalyticsEvent[];

/**
 * Export analytics data as JSON
 * @returns JSON string of all events
 */
function exportAnalytics(): string;
```

**Usage:**

```tsx
// Track page view
trackPageView('overview', 'Engineering');

// Track custom event
trackEvent('feature_interaction', {
  feature: 'deployment-checklist',
  action: 'task-completed',
  taskId: 'task-123'
});

// Track search
const handleSearch = (query: string) => {
  const results = performSearch(query);
  trackSearch(query, results.length);
};

// Track bookmark
const handleBookmark = (id: string) => {
  if (isBookmarked(id)) {
    removeBookmark(id);
    trackBookmark(id, 'removed');
  } else {
    addBookmark(id);
    trackBookmark(id, 'added');
  }
};

// Export analytics
const downloadAnalytics = () => {
  const data = exportAnalytics();
  const blob = new Blob([data], { type: 'application/json' });
  // ... download logic
};
```

**Privacy:**
- All user IDs are hashed
- No PII is collected
- Events stored locally (max 100)
- User can clear analytics data
- GDPR/CCPA compliant

---

## Type Definitions

### Core Types

```typescript
/**
 * User role enumeration
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
 * Application section enumeration
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
 * FAQ difficulty level
 */
export enum FAQLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

/**
 * FAQ item interface
 */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  level: FAQLevel;
  category: string;
  tags: string[];
  relatedQuestions?: string[];
}

/**
 * Deployment task interface
 */
export interface DeploymentTask {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours: number;
  actualHours: number;
  assignee: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  dependencies: string[];
  acceptanceCriteria: string[];
  completedDate?: string;
}

/**
 * Toast notification interface
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  id: string;
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
  userId: string; // Hashed
}
```

---

## Configuration

### App Configuration

```typescript
import { APP_CONFIG } from './config/app.config';

// Application metadata
APP_CONFIG.version        // 'v1.0.0'
APP_CONFIG.releaseDate    // '2025-12-11'
APP_CONFIG.name           // 'INT Inc Enterprise Claude Profile Builder'

// Feature flags
FEATURE_FLAGS.advancedSearch   // true
FEATURE_FLAGS.bookmarks        // true
FEATURE_FLAGS.analytics        // true
FEATURE_FLAGS.darkMode         // false (coming soon)

// Performance settings
PERFORMANCE_CONFIG.searchDebounceMs     // 300
PERFORMANCE_CONFIG.maxSearchResults     // 50
PERFORMANCE_CONFIG.toastDuration        // 5000

// Security settings
SECURITY_CONFIG.maxFileSize             // 20MB
SECURITY_CONFIG.allowedFileTypes        // ['.pdf', '.docx', ...]
```

---

## Error Handling

### Custom Error Classes

```typescript
import {
  AppError,
  ValidationError,
  NetworkError,
  StorageQuotaError,
  NotFoundError
} from './lib/errors';

// Base application error
throw new AppError('Something went wrong', ErrorCode.UNKNOWN);

// Validation error
throw new ValidationError('Invalid email address', {
  field: 'email',
  value: 'invalid-email'
});

// Storage quota exceeded
throw new StorageQuotaError({
  currentSize: 10485760,
  maxSize: 5242880
});

// Resource not found
throw new NotFoundError('FAQ item', {
  id: 'faq-999'
});
```

### Error Handler

```typescript
import { ErrorHandler } from './lib/errors';

try {
  // Some operation
} catch (error) {
  // Handle error
  const { message, code } = ErrorHandler.handle(error);
  
  // Log error
  ErrorHandler.log(error);
  
  // Show user-friendly message
  const userMessage = ErrorHandler.getUserMessage(error);
  showToast({ type: 'error', message: userMessage });
}
```

---

## Storage API

### LocalStorage Wrapper

```typescript
import { storage } from './utils/storage';

// Save data
storage.set('preferences', { theme: 'dark' });

// Load data
const preferences = storage.get('preferences', { theme: 'light' });

// Remove data
storage.remove('preferences');

// Clear all
storage.clear();

// Check size
const size = storage.getSize(); // bytes

// Check availability
if (storage.isAvailable()) {
  storage.set('key', 'value');
}
```

---

## Analytics API

### Event Tracking

```typescript
import { analytics } from './utils/analytics';

// Track event
analytics.track('button_clicked', {
  buttonId: 'save-button',
  section: 'deployment'
});

// Track page view
analytics.pageView('overview', 'Engineering');

// Track search
analytics.search('security best practices', 15);

// Get events
const events = analytics.getEvents({
  startDate: new Date('2025-12-01'),
  endDate: new Date('2025-12-31')
});

// Export data
const json = analytics.export();
```

---

## Examples

### Complete Search Implementation

```tsx
import { useState } from 'react';
import { useSearch } from './hooks/useSearch';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { trackSearch } from './utils/analytics';

function SearchExample() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const { results, isSearching, error } = useSearch(query, {
    debounceMs: 300,
    maxResults: 10
  });
  
  const handleSearchChange = (newQuery: string) => {
    setQuery(newQuery);
    setIsOpen(true);
    
    if (newQuery) {
      trackSearch(newQuery, results.length);
    }
  };
  
  const handleResultClick = (result: SearchResult) => {
    navigateTo(result.id);
    setIsOpen(false);
    setQuery('');
  };
  
  return (
    <div className="relative">
      <SearchBar
        value={query}
        onChange={handleSearchChange}
        onFocus={() => setIsOpen(true)}
        isSearching={isSearching}
      />
      
      {isOpen && query && (
        <SearchResults
          results={results}
          query={query}
          onResultClick={handleResultClick}
          onClose={() => setIsOpen(false)}
        />
      )}
      
      {error && (
        <ErrorMessage message={error.message} />
      )}
    </div>
  );
}
```

### Complete Bookmark Implementation

```tsx
import { useLocalStorage } from './hooks/useLocalStorage';
import { trackBookmark } from './utils/analytics';
import { useToast } from './components/ui/Toast';
import { BookmarkButton } from './components/BookmarkButton';

function BookmarkExample() {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>('bookmarks', []);
  const { addToast } = useToast();
  
  const isBookmarked = (id: string) => bookmarks.includes(id);
  
  const toggleBookmark = (id: string) => {
    if (isBookmarked(id)) {
      setBookmarks(prev => prev.filter(b => b !== id));
      trackBookmark(id, 'removed');
      addToast({
        type: 'info',
        message: 'Bookmark removed'
      });
    } else {
      setBookmarks(prev => [...prev, id]);
      trackBookmark(id, 'added');
      addToast({
        type: 'success',
        message: 'Bookmark added'
      });
    }
  };
  
  return (
    <div>
      <h2>Your Bookmarks ({bookmarks.length})</h2>
      
      {bookmarks.map(id => (
        <div key={id}>
          <ContentItem id={id} />
          <BookmarkButton
            isBookmarked={true}
            onClick={() => toggleBookmark(id)}
          />
        </div>
      ))}
    </div>
  );
}
```

### Complete Form with Validation

```tsx
import { useState } from 'react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { useToast } from './components/ui/Toast';
import { ValidationError } from './lib/errors';

function FormExample() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    try {
      await submitForm({ name, email });
      
      addToast({
        type: 'success',
        message: 'Form submitted successfully!'
      });
      
      // Reset form
      setName('');
      setEmail('');
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to submit form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />
      
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      
      <Button
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
```

---

## Best Practices

### Component Development

1. **Always provide TypeScript types**
   ```tsx
   // ✅ Good
   interface Props {
     title: string;
     count: number;
   }
   
   // ❌ Bad
   function Component(props: any) { }
   ```

2. **Use composition over props drilling**
   ```tsx
   // ✅ Good
   <Card>
     <Card.Header>Title</Card.Header>
     <Card.Body>Content</Card.Body>
   </Card>
   
   // ❌ Bad
   <Card title="Title" body="Content" />
   ```

3. **Memoize expensive computations**
   ```tsx
   // ✅ Good
   const sorted = useMemo(() => 
     items.sort((a, b) => b.score - a.score),
     [items]
   );
   ```

4. **Extract logic to custom hooks**
   ```tsx
   // ✅ Good
   const { data, loading } = useDataFetching(id);
   
   // ❌ Bad - logic in component
   ```

### Error Handling

1. **Use custom error classes**
2. **Always provide context**
3. **Log errors appropriately**
4. **Show user-friendly messages**

### Performance

1. **Debounce user input**
2. **Lazy load large components**
3. **Virtualize long lists**
4. **Optimize images**

---

**For more information, see:**
- [Architecture Documentation](./ARCHITECTURE.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Testing Guide](./TESTING.md)

---

**Document Version**: 1.0.0  
**Last Updated**: December 11, 2025  
**Maintained By**: INT Inc Engineering Team
