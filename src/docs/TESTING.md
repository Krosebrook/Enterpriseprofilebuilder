# Testing Guide

**INT Inc Enterprise Claude Profile Builder**  
**Comprehensive Testing Documentation**

---

## Table of Contents

1. [Overview](#overview)
2. [Testing Philosophy](#testing-philosophy)
3. [Testing Stack](#testing-stack)
4. [Unit Testing](#unit-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Performance Testing](#performance-testing)
9. [Security Testing](#security-testing)
10. [Visual Regression Testing](#visual-regression-testing)
11. [Coverage Requirements](#coverage-requirements)
12. [Best Practices](#best-practices)
13. [Continuous Integration](#continuous-integration)

---

## Overview

This document outlines our comprehensive testing strategy, ensuring high quality, reliability, and maintainability of the Claude Profile Builder application.

### Testing Pyramid

```
        /\
       /  \      E2E Tests (10%)
      /    \     - Critical user flows
     /------\    - Production-like environment
    /        \   
   /  INTEG  \   Integration Tests (20%)
  /            \  - Component interactions
 /--------------\ - Data flow
/                \
/   UNIT TESTS   \ Unit Tests (70%)
/                 \ - Individual functions
-------------------  - Component logic
```

### Goals

- **Catch bugs early**: Before they reach production
- **Enable refactoring**: With confidence
- **Document behavior**: Tests as specifications
- **Improve quality**: Higher code quality standards
- **Speed development**: Faster feedback loops

---

## Testing Philosophy

### Principles

1. **Test Behavior, Not Implementation**
   ```typescript
   // ✅ Good - Tests what user sees
   it('shows error message when form is invalid', () => {
     render(<LoginForm />);
     fireEvent.click(screen.getByText('Submit'));
     expect(screen.getByText('Email is required')).toBeInTheDocument();
   });
   
   // ❌ Bad - Tests implementation details
   it('sets hasError state to true', () => {
     const form = mount(<LoginForm />);
     form.find('button').simulate('click');
     expect(form.state('hasError')).toBe(true);
   });
   ```

2. **Write Tests That Give Confidence**
   - Focus on user-facing functionality
   - Test integration points
   - Cover edge cases
   - Avoid testing trivial code

3. **Make Tests Maintainable**
   - DRY (Don't Repeat Yourself)
   - Clear test names
   - Arrange-Act-Assert pattern
   - Minimal mocking

4. **Test Accessibility**
   - Query by accessible selectors
   - Test keyboard navigation
   - Test screen reader output

---

## Testing Stack

### Core Framework

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "playwright": "^1.40.0",
    "@axe-core/react": "^4.8.0",
    "lighthouse": "^11.0.0"
  }
}
```

### Tools

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **Vitest** | Unit/integration test runner | [vitest.dev](https://vitest.dev) |
| **Testing Library** | DOM testing utilities | [testing-library.com](https://testing-library.com) |
| **Playwright** | E2E testing | [playwright.dev](https://playwright.dev) |
| **axe-core** | Accessibility testing | [deque.com/axe](https://www.deque.com/axe/) |
| **Lighthouse** | Performance testing | [developers.google.com/web/tools/lighthouse](https://developers.google.com/web/tools/lighthouse) |

---

## Unit Testing

### Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
        'dist/'
      ]
    }
  }
});
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Component Testing

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });
    
    it('applies variant class', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-primary');
    });
    
    it('applies size class', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-lg');
    });
    
    it('renders with icon', () => {
      const icon = <span data-testid="icon">★</span>;
      render(<Button icon={icon}>With Icon</Button>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });
  
  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} disabled>Click</Button>);
      await user.click(screen.getByRole('button'));
      
      expect(handleClick).not.toHaveBeenCalled();
    });
    
    it('shows loading spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
  
  describe('Accessibility', () => {
    it('is keyboard accessible', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole('button');
      
      await user.tab();
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });
    
    it('has correct ARIA attributes when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });
  });
  
  describe('Edge Cases', () => {
    it('handles rapid clicks (debouncing)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup({ delay: null });
      
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole('button');
      
      await user.tripleClick(button);
      
      // Should only call once if debounced
      expect(handleClick).toHaveBeenCalled();
    });
    
    it('handles null onClick gracefully', () => {
      expect(() => {
        render(<Button>No Handler</Button>);
      }).not.toThrow();
    });
  });
});
```

### Hook Testing

```typescript
// useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  it('initializes with default value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    
    expect(result.current[0]).toBe('default');
  });
  
  it('loads existing value from localStorage', () => {
    localStorage.setItem('claude-profile-builder:key', JSON.stringify('existing'));
    
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    
    expect(result.current[0]).toBe('existing');
  });
  
  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('claude-profile-builder:key')).toBe(
      JSON.stringify('updated')
    );
  });
  
  it('supports function updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    
    act(() => {
      result.current[1](prev => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
  });
  
  it('handles complex objects', () => {
    const { result } = renderHook(() => 
      useLocalStorage('user', { name: 'John', age: 30 })
    );
    
    act(() => {
      result.current[1]({ name: 'Jane', age: 25 });
    });
    
    expect(result.current[0]).toEqual({ name: 'Jane', age: 25 });
  });
  
  it('handles storage quota errors gracefully', () => {
    // Mock localStorage.setItem to throw
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('QuotaExceededError');
    });
    
    const { result } = renderHook(() => useLocalStorage('key', 'value'));
    
    expect(() => {
      act(() => {
        result.current[1]('new value');
      });
    }).not.toThrow();
    
    // Restore
    Storage.prototype.setItem = originalSetItem;
  });
});
```

### Utility Testing

```typescript
// search.test.ts
import { describe, it, expect } from 'vitest';
import { fuzzyMatch, calculateRelevance, performSearch } from './search';

describe('Search Utilities', () => {
  describe('fuzzyMatch', () => {
    it('returns 1 for exact match', () => {
      expect(fuzzyMatch('test', 'test')).toBe(1);
    });
    
    it('returns null for no match', () => {
      expect(fuzzyMatch('test', 'xyz')).toBeNull();
    });
    
    it('handles case insensitivity', () => {
      expect(fuzzyMatch('Test', 'test')).toBeGreaterThan(0);
    });
    
    it('tolerates typos', () => {
      expect(fuzzyMatch('secruity', 'security')).toBeGreaterThan(0.5);
    });
    
    it('handles partial matches', () => {
      const score = fuzzyMatch('testing', 'test');
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1);
    });
  });
  
  describe('calculateRelevance', () => {
    it('scores title matches higher than content', () => {
      const titleMatch = calculateRelevance(
        { title: 'security', content: 'other' },
        'security'
      );
      const contentMatch = calculateRelevance(
        { title: 'other', content: 'security' },
        'security'
      );
      
      expect(titleMatch).toBeGreaterThan(contentMatch);
    });
    
    it('considers tag matches', () => {
      const withTag = calculateRelevance(
        { title: '', content: '', tags: ['security'] },
        'security'
      );
      const withoutTag = calculateRelevance(
        { title: '', content: '', tags: [] },
        'security'
      );
      
      expect(withTag).toBeGreaterThan(withoutTag);
    });
  });
  
  describe('performSearch', () => {
    const mockData = [
      { id: '1', title: 'Security Best Practices', content: 'Learn security', tags: ['security'] },
      { id: '2', title: 'Getting Started', content: 'Security setup guide', tags: ['guide'] },
      { id: '3', title: 'Other Topic', content: 'Unrelated content', tags: ['other'] }
    ];
    
    it('returns relevant results', () => {
      const results = performSearch('security', mockData);
      
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('1'); // Title match scores higher
    });
    
    it('limits results to maxResults', () => {
      const results = performSearch('security', mockData, { maxResults: 1 });
      
      expect(results).toHaveLength(1);
    });
    
    it('filters by minimum relevance', () => {
      const results = performSearch('security', mockData, { minRelevance: 0.8 });
      
      expect(results.every(r => r.relevance >= 0.8)).toBe(true);
    });
    
    it('returns empty array for no matches', () => {
      const results = performSearch('xyz', mockData);
      
      expect(results).toEqual([]);
    });
  });
});
```

---

## Integration Testing

### Component Integration

```typescript
// SearchBar.integration.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

describe('Search Integration', () => {
  it('shows results when typing query', async () => {
    const user = userEvent.setup();
    
    render(
      <div>
        <SearchBar />
        <SearchResults />
      </div>
    );
    
    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'security');
    
    await waitFor(() => {
      expect(screen.getByText(/results/i)).toBeInTheDocument();
    });
  });
  
  it('highlights query in results', async () => {
    const user = userEvent.setup();
    
    render(
      <div>
        <SearchBar />
        <SearchResults />
      </div>
    );
    
    await user.type(screen.getByPlaceholderText('Search...'), 'security');
    
    await waitFor(() => {
      const highlighted = screen.getAllByRole('mark');
      expect(highlighted.length).toBeGreaterThan(0);
      expect(highlighted[0]).toHaveTextContent('security');
    });
  });
  
  it('navigates to result on click', async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    
    render(
      <div>
        <SearchBar />
        <SearchResults onNavigate={mockNavigate} />
      </div>
    );
    
    await user.type(screen.getByPlaceholderText('Search...'), 'security');
    
    await waitFor(() => {
      expect(screen.getByText('Security Best Practices')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Security Best Practices'));
    
    expect(mockNavigate).toHaveBeenCalledWith(expect.objectContaining({
      section: 'best-practices'
    }));
  });
  
  it('closes results on Escape', async () => {
    const user = userEvent.setup();
    
    render(
      <div>
        <SearchBar />
        <SearchResults />
      </div>
    );
    
    await user.type(screen.getByPlaceholderText('Search...'), 'security');
    
    await waitFor(() => {
      expect(screen.getByText(/results/i)).toBeInTheDocument();
    });
    
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText(/results/i)).not.toBeInTheDocument();
    });
  });
});
```

---

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
});
```

### E2E Test Examples

```typescript
// e2e/search-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Search Workflow', () => {
  test('complete search flow', async ({ page }) => {
    // Navigate to app
    await page.goto('/');
    
    // Open search
    await page.getByLabel('Search').click();
    
    // Type query
    await page.getByPlaceholder('Search...').fill('security');
    
    // Wait for results
    await expect(page.getByText(/results/i)).toBeVisible();
    
    // Verify result count
    const results = page.getByRole('listitem');
    await expect(results).toHaveCount(5);
    
    // Click first result
    await results.first().click();
    
    // Verify navigation
    await expect(page).toHaveURL(/best-practices/);
    await expect(page.getByRole('heading', { name: /security/i })).toBeVisible();
  });
  
  test('keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Open search with keyboard
    await page.keyboard.press('Control+k');
    
    // Type query
    await page.keyboard.type('deployment');
    
    // Navigate results with arrows
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    
    // Select with Enter
    await page.keyboard.press('Enter');
    
    // Verify navigation
    await expect(page).toHaveURL(/deployment/);
  });
});

// e2e/bookmark-workflow.spec.ts
test.describe('Bookmark Workflow', () => {
  test('add and remove bookmark', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to FAQ
    await page.getByRole('link', { name: 'FAQ' }).click();
    
    // Add bookmark
    await page.getByLabel('Add bookmark').first().click();
    
    // Verify toast
    await expect(page.getByText('Bookmark added')).toBeVisible();
    
    // Check bookmark count
    await expect(page.getByText(/1 bookmark/i)).toBeVisible();
    
    // Remove bookmark
    await page.getByLabel('Remove bookmark').first().click();
    
    // Verify toast
    await expect(page.getByText('Bookmark removed')).toBeVisible();
    
    // Check bookmark count
    await expect(page.getByText(/0 bookmarks/i)).toBeVisible();
  });
  
  test('bookmarks persist across sessions', async ({ page, context }) => {
    await page.goto('/');
    
    // Add bookmark
    await page.getByRole('link', { name: 'FAQ' }).click();
    await page.getByLabel('Add bookmark').first().click();
    
    // Close and reopen
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto('/');
    
    // Verify bookmark persisted
    await expect(newPage.getByText(/1 bookmark/i)).toBeVisible();
  });
});
```

---

## Accessibility Testing

### Automated Accessibility

```typescript
// a11y.test.tsx
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { App } from './App';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
  
  it('has proper heading hierarchy', async () => {
    const { container } = render(<App />);
    const results = await axe(container, {
      rules: {
        'heading-order': { enabled: true }
      }
    });
    
    expect(results).toHaveNoViolations();
  });
  
  it('has sufficient color contrast', async () => {
    const { container } = render(<App />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Accessibility Checklist

```markdown
## WCAG 2.1 AA Compliance Checklist

### Perceivable
- [ ] All images have alt text
- [ ] Color is not the only means of conveying information
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] No flashing content (seizure risk)

### Operable
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Skip links provided
- [ ] Page has descriptive title
- [ ] Focus order is logical
- [ ] Link purpose is clear
- [ ] Multiple ways to navigate (menu, search, sitemap)

### Understandable
- [ ] Language of page is specified
- [ ] Navigation is consistent
- [ ] Forms have labels
- [ ] Error messages are clear
- [ ] Help is available

### Robust
- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Compatible with assistive technologies
```

---

## Performance Testing

### Lighthouse CLI

```bash
# Run Lighthouse audit
lighthouse https://localhost:5173 \
  --view \
  --output html \
  --output json \
  --output-path ./reports/lighthouse

# CI mode
lighthouse https://localhost:5173 \
  --chrome-flags="--headless" \
  --preset=desktop \
  --output json \
  --output-path ./reports/lighthouse-ci.json
```

### Performance Budget

```javascript
// lighthouse-budget.json
{
  "budgets": [
    {
      "path": "/*",
      "timings": [
        {
          "metric": "first-contentful-paint",
          "budget": 1500
        },
        {
          "metric": "interactive",
          "budget": 3000
        },
        {
          "metric": "largest-contentful-paint",
          "budget": 2500
        }
      ],
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 150
        },
        {
          "resourceType": "stylesheet",
          "budget": 50
        },
        {
          "resourceType": "image",
          "budget": 100
        },
        {
          "resourceType": "total",
          "budget": 300
        }
      ]
    }
  ]
}
```

---

## Coverage Requirements

### Minimum Coverage Targets

| Category | Minimum | Target | Current |
|----------|---------|--------|---------|
| **Overall** | 80% | 85% | 88% |
| **Components** | 75% | 80% | 82% |
| **Hooks** | 85% | 90% | 92% |
| **Utils** | 90% | 95% | 96% |
| **Critical Paths** | 100% | 100% | 100% |

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html

# Check coverage thresholds
npm run test:coverage -- --coverage.thresholds.lines=85
```

---

## Best Practices

### 1. Test Naming

```typescript
// ✅ Good - Describes behavior
it('shows error message when email is invalid', () => { });

// ❌ Bad - Describes implementation
it('sets state.error to true', () => { });
```

### 2. Arrange-Act-Assert

```typescript
it('adds item to cart', () => {
  // Arrange
  const cart = new ShoppingCart();
  const item = { id: '1', name: 'Product', price: 100 };
  
  // Act
  cart.add(item);
  
  // Assert
  expect(cart.items).toContain(item);
  expect(cart.total).toBe(100);
});
```

### 3. Test Isolation

```typescript
// ✅ Good - Tests are independent
describe('Counter', () => {
  it('increments count', () => {
    const counter = new Counter(0);
    counter.increment();
    expect(counter.value).toBe(1);
  });
  
  it('decrements count', () => {
    const counter = new Counter(10);
    counter.decrement();
    expect(counter.value).toBe(9);
  });
});

// ❌ Bad - Tests depend on each other
describe('Counter', () => {
  const counter = new Counter(0);
  
  it('increments count', () => {
    counter.increment();
    expect(counter.value).toBe(1);
  });
  
  it('decrements count', () => {
    counter.decrement(); // Depends on previous test
    expect(counter.value).toBe(0);
  });
});
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload E2E artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

**Document Version**: 1.0.0  
**Last Updated**: December 11, 2025  
**Maintained By**: INT Inc Engineering Team
