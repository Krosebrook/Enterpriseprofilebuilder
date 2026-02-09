# Custom GitHub Copilot Agents

This directory contains 16 specialized coding agents designed specifically for the Enterprise Profile Builder repository. Each agent is an expert in a particular aspect of the codebase and follows the established patterns and conventions.

## Quick Reference

| Agent | Use For | Key Capabilities |
|-------|---------|------------------|
| [Radix UI Component Builder](./radix-ui-component-builder.agent.md) | Building new UI components | Creates Radix UI components with shadcn patterns, Tailwind styling, proper TypeScript types |
| [TypeScript Type Strengthener](./typescript-type-strengthener.agent.md) | Improving type safety | Removes `any` types, adds strict types, fixes type errors |
| [Code Style Enforcer](./code-style-enforcer.agent.md) | Maintaining code consistency | Enforces Tailwind CSS, React, and TypeScript conventions |
| [Vitest Unit Test Writer](./vitest-unit-test-writer.agent.md) | Writing unit tests | Creates Vitest tests for components, hooks, and utilities |
| [Playwright E2E Test Writer](./playwright-e2e-test-writer.agent.md) | Writing end-to-end tests | Creates Playwright tests for critical user journeys |
| [Test Debugger](./test-debugger.agent.md) | Fixing test failures | Diagnoses and fixes Vitest and Playwright test issues |
| [React Feature Builder](./react-feature-builder.agent.md) | Building new features | Creates complete features following the feature-based architecture |
| [Zustand State Manager](./zustand-state-manager.agent.md) | Managing state | Creates and modifies Zustand stores with persistence |
| [React Hook Creator](./react-hook-creator.agent.md) | Creating custom hooks | Builds reusable React hooks following best practices |
| [Form Builder](./form-builder.agent.md) | Building forms | Creates forms with react-hook-form and Radix UI validation |
| [CI/CD Workflow Manager](./ci-cd-workflow-manager.agent.md) | Managing CI/CD | Modifies GitHub Actions workflows, fixes pipeline issues |
| [Vite Config Optimizer](./vite-config-optimizer.agent.md) | Optimizing builds | Optimizes Vite configuration for better performance |
| [Documentation Writer](./documentation-writer.agent.md) | Writing documentation | Creates and updates markdown documentation |
| [AI Agent Workflow Builder](./ai-agent-workflow-builder.agent.md) | Building AI agents | Creates AI agent configurations for the Agent Builder feature |
| [Integration Connector](./integration-connector.agent.md) | Creating integrations | Builds integration connectors for the Integration Marketplace |
| [PR Description Generator](./pr-description-generator.agent.md) | Writing PR descriptions | Generates comprehensive pull request descriptions |

## How to Use These Agents

### Method 1: Direct Reference
When working on a specific task, reference the appropriate agent in your GitHub Copilot conversation:

```
@workspace Using the Radix UI Component Builder agent, create a new Select component
```

### Method 2: Agent-Specific Requests
Start your request by mentioning the task type, and Copilot will automatically use the relevant agent:

```
Create a new form for agent configuration with validation
→ Form Builder agent will be used

Write unit tests for the useAgentStore hook
→ Vitest Unit Test Writer agent will be used

Add a new GitHub Actions workflow for security scanning
→ CI/CD Workflow Manager agent will be used
```

## Agent Categories

### 🎨 Code Quality & Type Safety
These agents help maintain high code quality and type safety:
- **Radix UI Component Builder** - Build consistent UI components
- **TypeScript Type Strengthener** - Improve type safety
- **Code Style Enforcer** - Enforce conventions

### 🧪 Testing
These agents help you write and debug tests:
- **Vitest Unit Test Writer** - Unit tests
- **Playwright E2E Test Writer** - End-to-end tests
- **Test Debugger** - Fix test failures

### ⚛️ Feature Development
These agents accelerate feature development:
- **React Feature Builder** - Complete feature modules
- **Zustand State Manager** - State management
- **React Hook Creator** - Custom hooks
- **Form Builder** - Forms with validation

### 🔧 Infrastructure & DevOps
These agents manage build and deployment:
- **CI/CD Workflow Manager** - GitHub Actions workflows
- **Vite Config Optimizer** - Build optimization

### 📚 Documentation
This agent helps with documentation:
- **Documentation Writer** - Markdown documentation

### 🤖 Domain-Specific
These agents understand the business domain:
- **AI Agent Workflow Builder** - AI agent configurations
- **Integration Connector** - External service integrations
- **PR Description Generator** - Pull request descriptions

## What Makes These Agents Special

1. **Repository-Specific**: Each agent references actual files, patterns, and conventions from this repository
2. **Actionable**: Provides concrete examples and step-by-step instructions
3. **Comprehensive**: Covers the full development lifecycle
4. **Domain-Aware**: Understands the business logic and architecture
5. **Well-Documented**: Detailed instructions with code examples

## Agent Structure

Each agent file includes:

```markdown
---
name: "Agent Name"
description: "One-line description"
---

# Agent Name

## Your Responsibilities
- What this agent does

## Patterns and Examples
- Specific code patterns from this repo
- Real file paths
- Actual utility functions

## Anti-Patterns to Avoid
- Common mistakes

## Verification Steps
- How to verify the work
```

## Examples

### Example 1: Creating a New UI Component

**Task**: Create a Toast notification component

**Agent**: Radix UI Component Builder

**What it provides**:
- Exact Radix UI import pattern with version aliases
- Tailwind class organization
- TypeScript typing with forwardRef
- Accessibility attributes
- Dark mode support
- Integration with existing toast system

### Example 2: Adding a New Feature

**Task**: Create a new "Templates" feature

**Agent**: React Feature Builder

**What it provides**:
- Complete directory structure
- Zustand store setup
- Main component with sub-components
- Type definitions
- Integration with navigation
- README documentation

### Example 3: Writing Tests

**Task**: Test the AgentBuilder component

**Agent**: Vitest Unit Test Writer

**What it provides**:
- Test file structure
- Mock patterns for Zustand stores
- React Testing Library usage
- Test cases for happy path and edge cases
- Proper cleanup

## Best Practices

### When to Use Custom Agents

✅ **Use custom agents when**:
- Building features following established patterns
- Creating components with specific styling requirements
- Writing tests that match existing test structure
- Need to understand repository-specific conventions
- Working with domain-specific code (AI agents, integrations)

❌ **Don't rely solely on agents for**:
- Architecture decisions (consult with team)
- Breaking changes (need human review)
- Security-critical code (needs security review)
- Novel patterns not yet established in the repo

### Combining Agents

You can use multiple agents together:

```
1. Use React Feature Builder to scaffold the feature
2. Use Form Builder to create the configuration form
3. Use Zustand State Manager to add state management
4. Use Vitest Unit Test Writer to add tests
5. Use Documentation Writer to document the feature
```

## Maintenance

### Updating Agents

As the repository evolves, agents should be updated to reflect:
- New patterns and conventions
- Updated dependencies
- Changed directory structure
- New tools and utilities

### Adding New Agents

When adding a new agent:
1. Identify a frequently performed task
2. Document the established patterns for that task
3. Reference actual code examples from the repository
4. Include anti-patterns and verification steps
5. Add the agent to this README

## Related Documentation

- [Copilot Instructions](../copilot-instructions.md) - Repository-wide instructions
- [Copilot Setup Steps](../copilot-setup-steps.yml) - Environment setup
- [Architecture Documentation](../../src/docs/ARCHITECTURE.md) - System architecture
- [Contributing Guidelines](../../src/CONTRIBUTING.md) - How to contribute

## Feedback

If you find issues with an agent or have suggestions for improvements, please:
1. Open a GitHub issue with the agent name in the title
2. Describe what's not working or could be better
3. Provide examples of the desired behavior

## License

These agents are part of the Enterprise Profile Builder project and follow the same license as the repository.
