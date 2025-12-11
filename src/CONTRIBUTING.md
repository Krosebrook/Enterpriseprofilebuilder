# Contributing Guide

**INT Inc Enterprise Claude Profile Builder**

Thank you for your interest in contributing to the Claude Profile Builder! This document provides guidelines and best practices for contributing to this project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)
9. [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Examples of behavior that contributes to a positive environment:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project team at conduct@int-inc.com. All complaints will be reviewed and investigated promptly and fairly.

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** >= 2.30.0
- **VSCode** (recommended) with recommended extensions

### Initial Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-profile-builder.git
   cd claude-profile-builder
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/int-inc/claude-profile-builder.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   ```
   http://localhost:5173
   ```

### Recommended VSCode Extensions

Install these extensions for the best development experience:

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript and JavaScript Language Features** - Enhanced TypeScript support
- **Tailwind CSS IntelliSense** - Tailwind class autocomplete
- **Error Lens** - Inline error display
- **GitLens** - Git integration
- **Pretty TypeScript Errors** - Better error messages

---

## Development Workflow

### Branch Strategy

We use **Git Flow** for branch management:

```
main
  └─ develop
      ├─ feature/search-improvement
      ├─ feature/dark-mode
      ├─ bugfix/search-crash
      └─ hotfix/critical-security-fix
```

**Branch Types:**

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `release/*` - Release preparation

### Development Cycle

1. **Sync with upstream**
   ```bash
   git checkout develop
   git fetch upstream
   git merge upstream/develop
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Write code
   - Write tests
   - Update documentation

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new search filter"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill out PR template
   - Request reviews

7. **Address feedback**
   - Make requested changes
   - Push updates
   - Re-request review

8. **Merge**
   - Squash and merge when approved
   - Delete branch after merge

---

## Coding Standards

### TypeScript

#### General Rules

```typescript
// ✅ DO: Use explicit types
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ DON'T: Use 'any'
function calculateTotal(items: any): any {
  return items.reduce((sum: any, item: any) => sum + item.price, 0);
}

// ✅ DO: Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// ❌ DON'T: Use inline types repeatedly
function getUser(): { id: string; name: string; email: string } { }

// ✅ DO: Use type guards
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ✅ DO: Use const assertions for constant objects
export const CONFIG = {
  maxItems: 100,
  timeout: 5000
} as const;

// ✅ DO: Use enums for related constants
enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}
```

#### Naming Conventions

```typescript
// ✅ Interfaces: PascalCase
interface UserProfile { }

// ✅ Types: PascalCase
type UserId = string;

// ✅ Enums: PascalCase
enum UserRole { }

// ✅ Functions: camelCase
function getUserById(id: string): User { }

// ✅ Variables: camelCase
const userCount = 42;

// ✅ Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// ✅ Components: PascalCase
function UserProfile() { }

// ✅ Custom hooks: camelCase starting with 'use'
function useUserData(id: string) { }

// ✅ Private methods: _camelCase
class UserService {
  private _validateEmail(email: string): boolean { }
}
```

### React Components

#### Functional Components

```typescript
// ✅ DO: Use function declarations
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ DON'T: Use arrow functions for components
export const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};

// ✅ DO: Define props interface above component
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ✅ DO: Use early returns for conditional rendering
export function UserProfile({ userId }: UserProfileProps) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// ✅ DO: Extract complex logic to custom hooks
export function UserDashboard() {
  const { user, loading } = useCurrentUser();
  const { notifications } = useNotifications(user?.id);
  const { tasks } = useTasks(user?.id);
  
  return (
    <div>
      {/* Render logic */}
    </div>
  );
}
```

#### Component Organization

```typescript
// File: Button.tsx

// 1. Imports (grouped)
import { ReactNode, MouseEvent } from 'react';
import { Spinner } from './Spinner';
import './Button.css';

// 2. Type definitions
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

// 3. Component
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick
}: ButtonProps) {
  // 3a. Hooks
  const [isHovered, setIsHovered] = useState(false);
  
  // 3b. Computed values
  const className = `btn btn-${variant} btn-${size}`;
  const isDisabled = disabled || loading;
  
  // 3c. Event handlers
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };
  
  // 3d. Render
  return (
    <button
      className={className}
      disabled={isDisabled}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
}

// 4. Default export (if needed)
export default Button;
```

### CSS/Tailwind

```typescript
// ✅ DO: Use Tailwind classes
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// ❌ DON'T: Use inline styles
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

// ✅ DO: Use conditional classes with proper formatting
<div className={`
  flex items-center gap-4
  ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}
  ${size === 'lg' ? 'text-xl p-6' : 'text-sm p-4'}
`}>

// ✅ DO: Use clsx for complex conditional classes
import clsx from 'clsx';

<div className={clsx(
  'flex items-center gap-4',
  isActive && 'bg-blue-500 text-white',
  !isActive && 'bg-gray-100 text-gray-700',
  size === 'lg' && 'text-xl p-6',
  size === 'sm' && 'text-sm p-4'
)}>
```

### File Organization

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts       # Barrel export
│   │   └── index.ts           # All UI exports
│   ├── sections/              # Page-specific components
│   └── layout/                # Layout components
├── hooks/                     # Custom React hooks
├── utils/                     # Utility functions
├── lib/                       # Core libraries
├── types/                     # Type definitions
├── data/                      # Static data
└── config/                    # Configuration
```

### Import Organization

```typescript
// 1. External dependencies
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';

// 2. Internal dependencies (absolute imports)
import { Button } from '@/components/ui/Button';
import { useSearch } from '@/hooks/useSearch';
import { performSearch } from '@/utils/search';

// 3. Relative imports (same directory)
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';

// 4. Types
import type { SearchResult, SearchOptions } from '@/types';

// 5. Styles (if any)
import './SearchPage.css';
```

---

## Commit Guidelines

We follow **Conventional Commits** specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring (no feature change, no bug fix)
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling
- `ci`: CI/CD configuration
- `revert`: Revert a previous commit

### Examples

```bash
# Feature
git commit -m "feat(search): add fuzzy matching algorithm"

# Bug fix
git commit -m "fix(navbar): correct active link highlighting"

# Documentation
git commit -m "docs(api): add search hook documentation"

# Performance
git commit -m "perf(search): optimize search index building"

# Breaking change
git commit -m "feat(auth)!: change authentication API

BREAKING CHANGE: authentication now requires OAuth2 token instead of API key"

# Multiple paragraphs
git commit -m "feat(deployment): add deployment phase tracking

This commit introduces a comprehensive deployment tracking system with:
- Phase and sub-phase tracking
- Task management with dependencies
- Progress calculation
- Team workload visualization

Closes #123"
```

### Commit Message Rules

1. **Use imperative mood** in subject line
   - ✅ "Add feature" not "Added feature" or "Adds feature"
   - ✅ "Fix bug" not "Fixed bug" or "Fixes bug"

2. **Limit subject line to 72 characters**

3. **Capitalize subject line**

4. **No period at the end of subject line**

5. **Separate subject from body with blank line**

6. **Wrap body at 72 characters**

7. **Use body to explain what and why, not how**

---

## Pull Request Process

### Before Creating PR

- [ ] Code follows project coding standards
- [ ] All tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] Code reviewed by yourself first

### PR Title Format

Follow the same format as commit messages:

```
feat(search): add advanced filtering options
fix(ui): resolve button alignment issue
docs(api): update hook documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues
Closes #123
Related to #456

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. **Self-review** - Review your own code first
2. **Automated checks** - CI/CD must pass
3. **Peer review** - At least 1 approval required
4. **Address feedback** - Make requested changes
5. **Re-review** - Request review after changes
6. **Merge** - Squash and merge when approved

### Code Review Guidelines

**For Authors:**
- Keep PRs small and focused
- Provide context in description
- Respond promptly to feedback
- Don't take feedback personally

**For Reviewers:**
- Review promptly (within 1-2 business days)
- Be respectful and constructive
- Ask questions, don't make demands
- Approve when satisfied

---

## Testing Requirements

### Test Coverage Goals

- **Overall**: >85%
- **Components**: >80%
- **Hooks**: >90%
- **Utils**: >95%
- **Critical paths**: 100%

### Writing Tests

```typescript
// Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows spinner when loading', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('is disabled when loading', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

// Hook test
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter(0));
    expect(result.current.count).toBe(0);
  });
  
  it('increments count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});

// Utility test
import { calculateRelevance } from './search';

describe('calculateRelevance', () => {
  it('returns 1 for exact match', () => {
    const score = calculateRelevance('test', 'test');
    expect(score).toBe(1);
  });
  
  it('returns 0 for no match', () => {
    const score = calculateRelevance('test', 'xyz');
    expect(score).toBe(0);
  });
  
  it('returns partial score for partial match', () => {
    const score = calculateRelevance('testing', 'test');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Button"
```

---

## Documentation

### Code Documentation

```typescript
/**
 * Calculate the relevance score between a search query and content
 * 
 * Uses fuzzy matching algorithm to determine how well the content
 * matches the search query. Scores range from 0 (no match) to 1 
 * (perfect match).
 * 
 * @param content - The content to search in
 * @param query - The search query
 * @returns Relevance score between 0 and 1
 * 
 * @example
 * ```typescript
 * const score = calculateRelevance('Claude AI Security', 'security');
 * // Returns: 0.85
 * ```
 * 
 * @see {@link performSearch} for the main search function
 */
export function calculateRelevance(content: string, query: string): number {
  // Implementation
}
```

### Component Documentation

```typescript
/**
 * Button component with multiple variants and states
 * 
 * @component
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Save Changes
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * <Button variant="danger" loading={isDeleting}>
 *   {isDeleting ? 'Deleting...' : 'Delete'}
 * </Button>
 * ```
 */
export function Button({ children, variant, onClick }: ButtonProps) {
  // Implementation
}
```

### README Files

Every major directory should have a README.md:

```markdown
# Component Name

Brief description of the component and its purpose.

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

\`\`\`tsx
import { Component } from './Component';

<Component prop="value" />
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prop1` | `string` | - | Description |
| `prop2` | `number` | `0` | Description |

## Examples

### Basic Example
\`\`\`tsx
<Component prop1="value" />
\`\`\`

### Advanced Example
\`\`\`tsx
<Component prop1="value" prop2={42} />
\`\`\`

## Testing

\`\`\`bash
npm test Component.test.tsx
\`\`\`
```

---

## Community

### Communication Channels

- **Slack**: #claude-dev (for general discussion)
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and help
- **Email**: dev@int-inc.com (for private matters)

### Getting Help

1. **Check documentation** - README, API docs, Architecture docs
2. **Search issues** - Someone might have asked already
3. **Ask in Slack** - #claude-dev channel
4. **Create discussion** - For open-ended questions
5. **Create issue** - For bugs or feature requests

### Reporting Bugs

Use the bug report template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS 12.0]
 - Browser: [e.g. Chrome 96]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other relevant information.
```

---

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Monthly team meetings
- Annual performance reviews

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (Proprietary - Internal use only for INT Inc).

---

## Questions?

If you have questions about contributing, please:
- Ask in #claude-dev Slack channel
- Create a GitHub Discussion
- Email dev@int-inc.com

---

**Thank you for contributing to Claude Profile Builder! 🎉**

---

**Document Version**: 1.0.0  
**Last Updated**: December 11, 2025  
**Maintained By**: INT Inc Engineering Team
