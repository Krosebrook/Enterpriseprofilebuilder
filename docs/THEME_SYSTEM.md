# Theme System Documentation

## Overview

The Enterprise Profile Builder now includes a comprehensive dark/light theme system built with `next-themes`. This system provides a production-ready, accessible, and performant theme switching experience.

## Features

### Core Features
- ✅ **Light/Dark/System Modes**: Users can choose between light, dark, or system-synchronized themes
- ✅ **No FOUC**: Flash of Unstyled Content prevention via inline script
- ✅ **Persistent Storage**: Theme preference saved in localStorage
- ✅ **System Preference Detection**: Automatic detection of OS theme preference
- ✅ **Real-time Updates**: Instant theme switching without page reload
- ✅ **Smooth Transitions**: CSS transitions for smooth color changes

### Security & Performance
- ✅ **Rate Limiting**: Prevents rapid theme toggling (max 30 changes/minute)
- ✅ **Cooldown Period**: 500ms minimum between theme changes
- ✅ **Error Handling**: Graceful error handling with user feedback
- ✅ **Input Validation**: Validates theme values before applying
- ✅ **Backup Storage**: Dual persistence (next-themes + manual backup)

### Accessibility
- ✅ **ARIA Labels**: Proper labels for screen readers
- ✅ **ARIA Pressed States**: Button states announced to assistive technology
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Focus Management**: Visible focus indicators
- ✅ **Loading States**: Skeleton screen during hydration

## Quick Start

### Basic Usage

```tsx
import { ThemeToggle } from './components/ThemeToggle';

function Header() {
  return (
    <header>
      {/* Compact mode - single button */}
      <ThemeToggle compact />
      
      {/* Full mode - three button group */}
      <ThemeToggle />
      
      {/* With labels */}
      <ThemeToggle showLabel />
    </header>
  );
}
```

### Styling with Dark Mode

```tsx
// Background colors
<div className="bg-slate-50 dark:bg-slate-900">
  
// Text colors
<h1 className="text-slate-900 dark:text-slate-100">

// Borders
<div className="border-slate-200 dark:border-slate-700">

// Transitions
<div className="transition-colors duration-300">
```

## Architecture

### Components

1. **ThemeProvider** (`src/providers/ThemeProvider.tsx`)
   - Wraps app with theme context
   - Integrates next-themes
   - Handles persistence

2. **ThemeToggle** (`src/components/ThemeToggle.tsx`)
   - User interface for theme switching
   - Rate limiting built-in
   - Accessible and responsive

3. **Rate Limiter**
   - 500ms cooldown between changes
   - 30 changes max per minute
   - Automatic reset

## Testing

```bash
# Run theme tests
npm test -- ThemeToggle.test.tsx

# Run all tests
npm test
```

## Browser Support

- ✅ Chrome/Edge (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)

## Troubleshooting

### Theme Not Persisting
Check localStorage is enabled in your browser.

### Flash of Wrong Theme
Ensure the inline script in `index.html` is present.

### System Theme Not Working
Verify your OS has dark mode enabled.

---

**Version**: 1.0.0  
**Last Updated**: December 21, 2025
