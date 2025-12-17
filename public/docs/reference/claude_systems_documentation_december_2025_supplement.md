# Claude Systems Documentation – December 2025 Supplement
## Full Stack Insight Guide: Latest Updates & Deep Dives

**Version:** 2.0.0 (December 12, 2025)  
**Status:** Production-Ready  
**Scope:** Comprehensive supplement to the existing Claude Systems Documentation

---

## TL;DR: What's New Since Your Base Documentation

This supplement covers the major developments and deep technical details from November-December 2025:

1. **Claude Opus 4.5** (Released November 24, 2025) - New flagship model with effort parameter
2. **Claude Code 2.0** - Checkpoints, VS Code extension, Slack integration (beta)
3. **Claude Agent SDK** - Rebranded from Claude Code SDK for general-purpose agents
4. **Context Management APIs** - Memory tool, context editing, tool search
5. **Skills System GA** - Now available across all platforms with API support
6. **Remote MCP Servers** - Expanded connector ecosystem with enterprise controls
7. **Enterprise Features** - Enhanced security, compliance certifications, Microsoft Azure integration

---

## Part 1: Claude 4.5 Model Family (Deep Dive)

### 1.1 Claude Opus 4.5 (Released November 24, 2025)

**TL;DR:** Most intelligent model with 66% price reduction. New effort parameter lets you balance cost vs. capability.

**Think of it like:** A senior consultant who can either give you a quick answer (low effort) or conduct thorough due diligence (high effort) - you decide based on the task.

#### Technical Specifications

| Attribute | Value |
|-----------|-------|
| Model String | `claude-opus-4-5-20251101` |
| Context Window | 200K tokens |
| Max Output | 64K tokens |
| Knowledge Cutoff | March 2025 |
| Pricing | $5/$25 per MTok (input/output) |
| Safety Level | ASL-3 |
| Prompt Caching | Up to 90% savings |
| Batch Processing | Up to 50% savings |

#### Key Benchmarks

```
SWE-bench Verified:     80.9% (state-of-the-art)
OSWorld (computer use): 66.3% (best in class)
Terminal-bench:         15% improvement over Sonnet 4.5
SWE-bench Multilingual: Leads 7/8 languages
```

#### Effort Parameter (Unique to Opus 4.5)

The effort parameter controls how liberally the model spends tokens across thinking, tool calls, and responses:

```python
# Example: Using effort parameter in API
request_body = {
    "anthropic_version": "bedrock-2023-05-31",
    "anthropic_beta": ["effort-2025-11-24"],
    "max_tokens": 4096,
    "output_config": {
        "effort": "medium"  # Options: "low", "medium", "high"
    },
    "messages": [
        {"role": "user", "content": "Analyze this codebase for security issues"}
    ]
}
```

**Effort Level Impact:**

| Effort | Token Usage | Performance | Best For |
|--------|-------------|-------------|----------|
| Low | Most conservative | Baseline | Routine queries, quick answers |
| Medium | 76% fewer than Sonnet 4.5 | Matches Sonnet 4.5 best | Balanced tasks, daily coding |
| High (default) | 48% fewer than Sonnet 4.5 | Exceeds Sonnet 4.5 by 4.3% | Complex reasoning, architecture |

**Real-World Improvements:**
- 50-75% reduction in tool calling errors vs. Sonnet 4.5
- 50-75% reduction in build/lint errors
- Uses 65% fewer tokens overall for equivalent tasks

#### Enhanced Computer Use

Opus 4.5 includes a **zoom tool** for computer use scenarios:

```python
# Zoom tool allows inspecting specific screen regions
tools = [
    {
        "type": "computer_20241022",
        "name": "computer",
        "display_width_px": 1920,
        "display_height_px": 1080
    },
    {
        "type": "zoom_20251101",
        "name": "zoom"
    }
]
```

#### Prompt Injection Resistance

Opus 4.5 is the most resistant to prompt injection attacks of any frontier model:
- Single attempt success rate: ~5% (1 in 20)
- Ten different attacks: ~33% success rate
- **Important:** Still design applications assuming motivated attackers will succeed

---

### 1.2 Claude Sonnet 4.5 (September 29, 2025)

**TL;DR:** Best coding model, best for agents. Now supports 1M token context (beta).

#### Technical Specifications

| Attribute | Value |
|-----------|-------|
| Model String | `claude-sonnet-4-5-20250929` |
| Context Window | 200K standard, 1M beta |
| Max Output | 64K tokens |
| Knowledge Cutoff | January 2025 |
| Pricing | $3/$15 per MTok |
| Safety Level | ASL-3 |

#### 1M Token Context (Beta)

```python
# Enable 1M context via beta header
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    extra_headers={
        "anthropic-beta": "context-1m-2025-08-07"
    },
    messages=[{"role": "user", "content": "..."}]
)
```

**Use Cases for 1M Context:**
- Processing entire codebases (100+ files)
- Long research pipelines with hundreds of documents
- Multi-session agent workflows
- Complete project history analysis

#### Behavioral Changes (Claude 4+)

The Claude 4 family communicates differently:

| Old Behavior | New Behavior |
|--------------|--------------|
| Verbose explanations | Concise and direct |
| Machine-like tone | More conversational |
| Detailed post-action summaries | Skips unnecessary summaries |
| Suggestive language ("Can you suggest...") | Requires explicit direction ("Make these changes") |

**Prompting Adjustment Required:**
```
❌ "Can you suggest changes to improve this code?"
✅ "Make these changes to improve this code: [specific changes]"
```

---

### 1.3 Claude Haiku 4.5 (October 2025)

**TL;DR:** Near-frontier performance at 1/3 cost. 4-5x faster than Sonnet. Safest model yet.

#### Technical Specifications

| Attribute | Value |
|-----------|-------|
| Model String | `claude-haiku-4-5-20251001` |
| Context Window | 200K tokens |
| Max Output | 32K tokens |
| Knowledge Cutoff | February 2025 |
| Pricing | $1/$5 per MTok |
| Safety Level | ASL-2 |

**Performance Highlights:**
- 73.3% SWE-bench Verified (matches Sonnet 4)
- 90% of Sonnet 4.5's performance in agentic coding
- First Haiku with context awareness and extended thinking
- Lower misaligned behaviors than Sonnet 4.5 and Opus 4.1

**Ideal Use Cases:**
- Real-time chat assistants
- Customer service automation
- Pair programming sessions
- Rapid prototyping
- Parallel subtask execution in multi-agent systems

---

### 1.4 Model Orchestration Strategy

Anthropic's competitive advantage is the tiered, interconnected family designed for orchestrated agentic work:

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION PATTERN                     │
├─────────────────────────────────────────────────────────────┤
│  PLANNING (Sonnet 4.5)                                      │
│  ├── Understand requirements                                │
│  ├── Plan architecture                                      │
│  └── Break down into subtasks                               │
├─────────────────────────────────────────────────────────────┤
│  EXECUTION (Haiku 4.5 - Parallel)                           │
│  ├── Scaffolding                                            │
│  ├── Component implementation                               │
│  ├── API integration                                        │
│  └── Test generation                                        │
├─────────────────────────────────────────────────────────────┤
│  REVIEW (Opus 4.1/4.5)                                      │
│  ├── Deep code review                                       │
│  ├── Security audit                                         │
│  └── Catch subtle bugs (async, memory leaks, logic errors)  │
└─────────────────────────────────────────────────────────────┘
```

**Cost Optimization Example:**
```python
# Route by task complexity
def select_model(task_complexity: str) -> str:
    models = {
        "simple": "claude-haiku-4-5-20251001",      # $1/$5
        "standard": "claude-sonnet-4-5-20250929",   # $3/$15
        "complex": "claude-opus-4-5-20251101",       # $5/$25
        "review": "claude-opus-4-1-20250805"         # Deep analysis
    }
    return models.get(task_complexity, "claude-sonnet-4-5-20250929")
```

---

## Part 2: Claude Code 2.0 (Deep Dive)

### 2.1 Overview & Revenue

**TL;DR:** Claude Code hit $1B run-rate revenue in November 2025 - 6 months after public launch. Now includes checkpoints, VS Code extension, and Slack integration.

**Think of it like:** A junior engineer who never sleeps, can work on 30+ hour tasks, and has instant rollback capabilities.

### 2.2 Checkpoint System

Checkpoints automatically save code state before each change, enabling instant rollback.

#### How Checkpoints Work

```
┌─────────────────────────────────────────────────────────────┐
│                    CHECKPOINT LIFECYCLE                      │
├─────────────────────────────────────────────────────────────┤
│  User Prompt → Checkpoint Created → Claude Edits Files      │
│                                          ↓                  │
│                              Changes Tracked                 │
│                                          ↓                  │
│  User Types /rewind OR Esc+Esc → Checkpoint Menu Opens      │
│                                          ↓                  │
│              Select Restore Mode (see below)                │
└─────────────────────────────────────────────────────────────┘
```

#### Three Restore Modes

| Mode | What's Restored | Use When |
|------|-----------------|----------|
| **Chat only** | Conversation history | Keep code changes, retry different prompt |
| **Code only** | File changes | Keep conversation context, undo bad changes |
| **Both** | Everything | Complete rollback to prior state |

#### Checkpoint Commands

```bash
# Open rewind menu
/rewind

# Keyboard shortcut
Esc + Esc (double escape)

# List all checkpoints
/checkpoints
```

#### Checkpoint Limitations

**NOT Tracked:**
- Files modified by bash commands (`rm`, `mv`, `cp`)
- Manual edits outside Claude Code
- Edits from concurrent sessions

**Retention:**
- Checkpoints retained for 30 days
- Session-level only (not permanent history)
- Use Git for permanent version control

#### Best Practice Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  SAFE DEVELOPMENT WORKFLOW                                   │
├─────────────────────────────────────────────────────────────┤
│  1. Start task: "Refactor auth module"                      │
│  2. Claude creates checkpoint #1                            │
│  3. Claude makes changes                                    │
│  4. Changes look wrong? → /rewind → Select "code only"      │
│  5. Refine prompt: "Only modify auth.ts, not other files"   │
│  6. Claude creates checkpoint #2                            │
│  7. Changes look good? → Continue OR git commit             │
│  8. Periodically: git commit (permanent history)            │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.3 VS Code Extension (Beta)

The native VS Code extension brings Claude Code into your IDE with real-time diffs.

#### Installation

1. Open VS Code Extension Marketplace
2. Search "Claude Code"
3. Install Anthropic's official extension
4. Authenticate with Claude account

#### Features

| Feature | Description |
|---------|-------------|
| Sidebar Panel | Dedicated Claude Code interface |
| Inline Diffs | See changes in real-time |
| File Tree Integration | Visual representation of modified files |
| Native Notifications | System-level alerts for task completion |

---

### 2.4 Slack Integration (Beta - December 8, 2025)

**TL;DR:** Tag @Claude in Slack channels to spin up Claude Code sessions. Bug report → Fix → PR in one thread.

#### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  SLACK → CLAUDE CODE WORKFLOW                                │
├─────────────────────────────────────────────────────────────┤
│  1. Developer posts bug report in #engineering channel       │
│  2. Developer tags @Claude: "Fix the failing payment tests" │
│  3. Claude analyzes thread context                          │
│  4. Claude auto-selects repository (from authenticated repos)│
│  5. Claude Code session spins up on web                     │
│  6. Progress updates posted to Slack thread                 │
│  7. Completion: Link to session + PR creation link          │
└─────────────────────────────────────────────────────────────┘
```

#### Context Gathering

- **From threads:** All messages in the thread
- **From channels:** Recent channel messages
- **Repository selection:** Based on authenticated repos and context

#### Example Usage

```
# In #engineering channel:
@Claude fix the failing payment tests

# Claude responds:
"I'll investigate and fix the payment test failures. Creating a Claude 
Code session now..."

# [Progress updates in thread]

# Final response:
"Done! Fixed 3 failing tests in payment.test.ts. 
View session: [link]
Create PR: [link]"
```

#### Requirements

- Claude for Slack app installed
- Access to Claude Code on the web
- Repositories authenticated to Claude Code
- Works in channels only (not DMs)

#### Security Considerations

- Respects Slack permission structure
- Cannot access unauthorized conversations/repos
- All actions auditable
- Workspace admin controls installation

---

### 2.5 Advanced Agentic Features

#### Subagents

Delegate specialized tasks to run in parallel:

```markdown
<!-- .claude/agents/backend-api.md -->
---
name: backend-api
description: Build and test backend API endpoints
tools: Read, Write, Bash, Grep
model: sonnet
---

You are a backend API specialist. Focus on:
- RESTful endpoint design
- Input validation
- Error handling
- Test coverage
```

**Usage:**
```
"Use the backend-api subagent to build the user authentication endpoints 
while I work on the frontend"
```

#### Hooks

Automatically trigger actions at specific points:

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "toolName": "Write",
        "command": "npm test"
      }
    ],
    "PreCommit": [
      {
        "command": "npm run lint"
      }
    ]
  }
}
```

**Hook Events:**
- `PreToolUse`: Before tool execution
- `PostToolUse`: After tool execution
- `SubagentStop`: When subagent completes
- `Stop`: When Claude stops
- `SessionEnd`: Cleanup operations

#### Background Tasks

Keep processes active without blocking:

```bash
# Start dev server in background
Ctrl+b npm run dev

# Claude continues working while server runs
# Server output available but doesn't block main workflow
```

---

### 2.6 Essential CLI Commands

#### Core Commands

```bash
# Start interactive session
claude

# Headless mode (direct output)
claude -p "prompt"

# Auto-approve all actions (DANGEROUS - dev only)
claude --dangerously-skip-permissions

# Debug mode
claude --verbose

# MCP debug mode
claude --mcp-debug

# JSON output for scripting
claude --output-format json
```

#### Session Management

```bash
/clear           # Clear context, start fresh
/resume          # Resume last session
/sessions        # List past sessions
/export          # Export conversation
/rewind          # Open rewind menu
/compact         # Manually compact context
/model           # Switch models (sonnet/opus/haiku)
/usage           # Show usage statistics
/memory          # Edit memory files
/todos           # List current todo items
/mcp enable/disable [server-name]  # Toggle MCP servers
```

#### MCP Management

```bash
# Add MCP server
claude mcp add --transport [http|sse|stdio] <name> <url/command>

# Enable/disable servers
claude mcp enable [server-name]
claude mcp disable [server-name]
```

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Stop Claude |
| `Esc + Esc` | Open rewind menu |
| `Ctrl+r` | Search prompt history |
| `Ctrl+b` | Run command in background |
| `Ctrl+Z` | Suspend Claude Code |
| `Tab` | Toggle thinking mode |
| `Enter` | Queue additional messages |
| `Ctrl+U` | Undo prompt input |

---

## Part 3: Claude Agent SDK (Deep Dive)

### 3.1 Rebranding & Purpose

**TL;DR:** Claude Code SDK renamed to Claude Agent SDK. Same infrastructure, broader scope. Build agents for any domain, not just coding.

**Think of it like:** The chassis and engine that powers Claude Code, now available for building any type of agent.

### 3.2 Installation

```bash
# TypeScript/JavaScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install anthropic-agent-sdk

# Prerequisite: Claude Code CLI
npm install -g @anthropic-ai/claude-code
```

### 3.3 Core Components

```python
from claude_agent_sdk import Agent, query

# Simple agent
async def main():
    async for message in query(prompt="What is 2 + 2?"):
        print(message)
```

#### Five Essential Components

1. **Tools:** File I/O, Bash, web fetch, code execution
2. **MCP Extensions:** External servers via `create_sdk_mcp_server()`
3. **Subagents:** Specialized agents in `.claude/agents/`
4. **Memory & Context:** `CLAUDE.md` scratchpad, session management
5. **Hooks:** Lifecycle callbacks for safety and logging

### 3.4 Subagent Architecture

```markdown
<!-- .claude/agents/code-reviewer.md -->
---
name: code-reviewer
description: Use PROACTIVELY after code changes. Perform security, 
             style, and maintainability review on modified files.
tools: Read, Grep, Glob
model: inherit
permissionMode: default
skills: security-audit, style-guide
---

You are a meticulous senior code reviewer. Focus on:
- Security vulnerabilities (OWASP Top 10)
- Code style consistency
- Performance implications
- Test coverage gaps
```

### 3.5 Hook Patterns

```python
from claude_agent_sdk import PreToolUseHook

async def bash_safety_hook(event):
    """Block dangerous bash commands"""
    command = event.arguments.get("command", "")
    dangerous_patterns = ["rm -rf", "sudo", "> /dev/"]
    
    for pattern in dangerous_patterns:
        if pattern in command:
            return {"error": f"Dangerous command blocked: {pattern}"}
    return None

options.hooks = [PreToolUseHook(bash_safety_hook, tool_name="Bash")]
```

### 3.6 Built-in Agents

| Agent | Purpose | Tools | Mode |
|-------|---------|-------|------|
| **Plan** | Research codebase before planning | Read-only | Plan mode only |
| **Explore** | Fast codebase search | Read-only | On-demand |

### 3.7 Agent Types You Can Build

| Agent Type | Example Use Cases |
|------------|-------------------|
| **Finance** | Portfolio analysis, investment evaluation, API integrations |
| **Personal Assistant** | Calendar management, travel booking, briefings |
| **Customer Support** | Ticket handling, user data collection, escalation |
| **SRE** | Production issue diagnosis, incident response |
| **Security Review** | Code auditing, vulnerability scanning |
| **Documentation** | Diagram extraction, PDF/Word generation |

---

## Part 4: Context Management APIs (Deep Dive)

### 4.1 Memory Tool

**TL;DR:** Store and retrieve information outside the context window. Persists across conversations.

**Beta Header:** `context-management-2025-06-27`

#### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY TOOL FLOW                          │
├─────────────────────────────────────────────────────────────┤
│  1. Claude receives task                                    │
│  2. Claude checks /memories directory automatically         │
│  3. Claude creates/reads/updates/deletes memory files       │
│  4. Files persist between conversations                     │
│  5. Your infrastructure stores the data (client-side)       │
└─────────────────────────────────────────────────────────────┘
```

#### API Usage

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=2048,
    betas=["context-management-2025-06-27"],
    tools=[
        {"type": "memory_20250818", "name": "memory"}
    ],
    messages=[
        {"role": "user", "content": "Remember that my project uses PostgreSQL"}
    ]
)
```

#### Memory File Structure

```
/memories/
├── project_context.md
├── user_preferences.json
├── refactoring_progress.xml
└── decision_log.md
```

### 4.2 Context Editing

**TL;DR:** Automatically clear stale tool results when approaching context limits.

**Beta Header:** `context-management-2025-06-27`

#### Strategies

| Strategy | What It Clears | When to Use |
|----------|----------------|-------------|
| `clear_tool_uses_20250919` | Old tool results | Long agent workflows |
| `clear_thinking_20251015` | Thinking blocks | Extended thinking sessions |

#### API Usage

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-management-2025-06-27" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "context_editing": {
      "strategy": "clear_tool_uses_20250919",
      "threshold_tokens": 150000,
      "clear_tool_inputs": true
    },
    "messages": [...]
  }'
```

### 4.3 Memory + Context Editing Combined

**Performance Impact:**
- Memory + Context Editing: **39% improvement** on agentic search
- Context Editing alone: **29% improvement**
- 100-turn evaluation: **84% token consumption reduction**

```python
# Combined usage pattern
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["context-management-2025-06-27"],
    context_editing={
        "strategy": "clear_tool_uses_20250919",
        "threshold_tokens": 150000
    },
    tools=[
        {"type": "memory_20250818", "name": "memory"}
    ],
    messages=[...]
)
```

**Workflow:**
1. Claude works on long task
2. Context approaches threshold
3. Claude receives warning notification
4. Claude saves critical info to memory files
5. Context editing clears old tool results
6. Claude continues, referencing memory as needed

### 4.4 Tool Search Tool

**TL;DR:** Work with hundreds/thousands of tools by dynamically discovering them.

**Beta Header:** `advanced-tool-use-2025-11-20`

#### Problem Solved

Without tool search: Load all 500 tool definitions → Consume ~122,800 tokens
With tool search: Load on-demand → Consume ~191,300 preserved (85% reduction)

#### Two Variants

| Variant | Model String | Search Method |
|---------|--------------|---------------|
| Regex | `tool_search_tool_regex_20251119` | Pattern matching |
| BM25 | `tool_search_tool_bm25_20251119` | Natural language |

#### API Usage

```python
tools = [
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get weather at a location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

#### Performance Results

| Model | Without Tool Search | With Tool Search |
|-------|---------------------|------------------|
| Opus 4 | 49% accuracy | 74% accuracy |
| Opus 4.5 | 79.5% accuracy | 88.1% accuracy |

### 4.5 Auto-Compaction (Claude.ai / Claude Code)

For paid users with code execution enabled:

#### How It Works

1. Conversation approaches ~95% of context limit
2. Claude displays: "Organizing thoughts... (1-2 minutes)"
3. Older messages summarized into compressed format
4. Full history preserved for scrolling (reference only)
5. Working context uses compacted version

#### Tradeoffs

- **Loses granularity** - Technical details get compressed
- **Automatic, not optimal** - Claude decides what to keep
- **Requires code execution** - Must be enabled in settings

#### Manual Compaction Strategy

```bash
# Claude Code manual compact
/compact

# With preservation instructions
/compact only keep the names of files we modified

# Check context usage first
/context
```

**Best Practice:** Manually compact at 70% capacity instead of waiting for 95% auto-trigger.

---

## Part 5: Skills System (Deep Dive)

### 5.1 Architecture Overview

**TL;DR:** Skills are prompt templates that inject domain-specific instructions. Not executable code - they modify Claude's behavior through context.

**Think of it like:** Giving Claude a specialized training manual that loads only when relevant.

### 5.2 How Skills Work

```
┌─────────────────────────────────────────────────────────────┐
│                    SKILL INVOCATION FLOW                     │
├─────────────────────────────────────────────────────────────┤
│  1. User sends request                                      │
│  2. Claude sees skill name + description (lightweight)      │
│  3. Claude decides if skill is relevant (LLM routing)       │
│  4. If relevant: Load full SKILL.md + resources             │
│  5. Execute scripts (output only enters context, not code)  │
│  6. Generate response using loaded instructions             │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 SKILL.md Structure

```yaml
---
name: pdf-processing
description: Extract text, fill forms, merge PDFs. Use when working 
             with PDF files, forms, or document extraction.
dependencies:
  - pypdf
  - pdfplumber
---

# PDF Processing

## Quick Start
Extract text:
```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Capabilities
- Text extraction (including tables)
- Form filling
- Document merging/splitting

## When to Use
- User mentions PDF files
- Document processing tasks
- Form automation
```

### 5.4 Pre-built Skills (Anthropic)

| Skill ID | Purpose | File Types |
|----------|---------|------------|
| `pptx` | Create presentations | .pptx |
| `xlsx` | Spreadsheets with formulas | .xlsx |
| `docx` | Word documents | .docx |
| `pdf` | Fillable PDFs | .pdf |

### 5.5 Skills API

**Beta Headers:**
- `code-execution-2025-08-25`
- `skills-2025-10-02`
- `files-api-2025-04-14`

#### List Skills

```python
client.beta.skills.list(source="anthropic", betas=["skills-2025-10-02"])
```

#### Use Skills in Messages

```python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "pptx", "version": "latest"},
            {"type": "custom", "skill_id": "skill_01...", "version": "latest"}
        ]
    },
    messages=[{"role": "user", "content": "Create a presentation about Q4 results"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

#### Create Custom Skill

```python
from anthropic.lib.helpers import files_from_dir

skill = client.beta.skills.create(
    files=files_from_dir("/path/to/my-skill/"),
    betas=["skills-2025-10-02"]
)
```

### 5.6 Skills vs Projects vs Custom Instructions

| Feature | Scope | Persistence | Use For |
|---------|-------|-------------|---------|
| **Skills** | Task-specific | Loads on demand | Repeatable workflows, SOPs |
| **Projects** | Workspace | Accumulates | Long-term efforts, research |
| **Custom Instructions** | Global | Always applied | Tone, style, company voice |

**Mnemonic:** 
- **P** for Project (persistent place)
- **S** for Skill (specific standard)
- **C** for Custom (company voice)

### 5.7 Security Considerations

Skills can:
- Execute code in sandbox
- Install packages from PyPI/npm
- Access bundled resources

**Risks:**
- Prompt injection via malicious skills
- Data exfiltration through package code

**Mitigations:**
- Only install skills from trusted sources
- Audit downloaded skills before enabling
- Review code dependencies in SKILL.md

---

## Part 6: MCP Ecosystem (December 2025 State)

### 6.1 Protocol Status

**TL;DR:** MCP donated to Linux Foundation. OpenAI, Google, Microsoft all adopted. 8M+ downloads.

**Key Stats:**
- November 2024: ~100K downloads
- April 2025: 8M downloads
- Market projection: $2.7B (2025) → $5.6B (2034)
- Remote servers: Up nearly 4x since May 2025

### 6.2 Major Adopters

| Organization | Status | Date |
|--------------|--------|------|
| Anthropic | Creator, donor to foundation | November 2024 |
| OpenAI | Official adoption | March 2025 |
| Google DeepMind | MCP support confirmed | April 2025 |
| Microsoft | Azure integration | November 2025 |
| AWS | Bedrock integration | Ongoing |
| Cloudflare | Remote hosting solution | 2025 |

### 6.3 Remote MCP Servers

Remote servers are now the standard for production deployments:

#### Official Connectors (Partial List)

| Service | Category | URL Pattern |
|---------|----------|-------------|
| Atlassian | Productivity | `https://mcp.atlassian.com/v1/sse` |
| Cloudflare | Cloud | `https://bindings.mcp.cloudflare.com/mcp` |
| Stripe | Payments | `https://mcp.stripe.com` |
| Canva | Design | `https://mcp.canva.com/mcp` |
| Notion | Productivity | `https://mcp.notion.com/mcp` |
| Sentry | Monitoring | `https://mcp.sentry.dev/mcp` |
| Vercel | Cloud | `https://mcp.vercel.com` |
| HubSpot | CRM | `https://mcp.hubspot.com/anthropic` |
| Linear | Project Management | `https://mcp.linear.app/mcp` |
| Figma | Design | `https://mcp.figma.com/mcp` |
| Zapier | Automation | User-specific URL at `mcp.zapier.com` |

### 6.4 Custom Remote MCP Setup

#### For Enterprise/Team Admins

1. Navigate to Admin settings > Connectors
2. Click "Add custom connector"
3. Enter remote MCP server URL
4. (Optional) Configure OAuth Client ID/Secret
5. Click "Add"

#### For Individual Users

1. Settings > Connectors
2. Click "Connect" on desired connector
3. Complete OAuth flow
4. Enable specific tools as needed

### 6.5 MCP API Integration

```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    extra_headers={
        "anthropic-beta": "mcp-client-2025-04-04"
    },
    mcp_servers=[
        {
            "type": "url",
            "url": "https://mcp.notion.com/mcp",
            "name": "notion-mcp"
        }
    ],
    messages=[
        {"role": "user", "content": "Create a task in Notion for Q4 planning"}
    ]
)
```

### 6.6 MCP Security Best Practices

**Known Vulnerabilities (April 2025 - Invariant Labs):**
- Tool poisoning attacks
- Prompt injection via tool descriptions
- Combined tool permission escalation
- Lookalike tool substitution

**Enterprise Mitigations:**

| Control | Implementation |
|---------|----------------|
| Input validation | Sanitize all tool inputs |
| Output sanitization | Filter responses before display |
| Audit logging | Log all tool invocations |
| Network segmentation | Isolate MCP traffic |
| API rate limiting | Prevent abuse |
| Anomaly detection | Monitor for unusual patterns |
| Least privilege | Grant minimal permissions per connector |

### 6.7 Google Managed MCP Servers (December 2025)

Google launched fully managed MCP servers:

- **Services:** Maps, BigQuery, Compute Engine, Kubernetes Engine
- **Coming:** Storage, databases, logging, monitoring, security
- **Feature:** "Agent-ready by design" - paste URL to connect
- **Compatibility:** Works with Claude, Gemini, ChatGPT

---

## Part 7: Enterprise Security & Compliance (Updated)

### 7.1 Certifications

| Certification | Status | Scope |
|---------------|--------|-------|
| SOC 2 Type I | ✅ Complete | Infrastructure |
| SOC 2 Type II | ✅ Complete | Operations |
| ISO 27001:2022 | ✅ Complete | Security management |
| ISO/IEC 42001:2023 | ✅ Complete | AI management |
| HIPAA | ✅ Available | Enterprise with BAA |
| GDPR | ✅ Compliant | Data protection |

### 7.2 Zero Data Retention (ZDR)

For regulated industries:
- No conversation data stored
- Immediate deletion after response
- Available via AWS Bedrock, Google Vertex AI
- Essential for healthcare, finance, government

### 7.3 Network Isolation Options

#### AWS Bedrock

```
Customer VPC → Bedrock Endpoint → Claude
(No data leaves VPC)
```

#### Google Vertex AI (PSC)

Private Service Connect endpoints (GA April 2025):
- Routes all Claude API traffic within customer VPC
- Zero egress from enterprise networks

### 7.4 Audit Logging

**Events Captured:**
- User sign-ins, session starts
- API token usage
- Model calls + metadata
- File operations (upload, download, delete)

**Retention:** 30 days default
**Export:** JSON, CSV
**SIEM Integration:** Splunk, Datadog, Elastic

### 7.5 Microsoft Azure Integration (November 2025)

Claude available in Microsoft ecosystem:

| Platform | Features |
|----------|----------|
| Microsoft Foundry | Serverless deployment, US DataZone |
| GitHub Copilot | Opus 4.5 powers paid plans |
| Copilot Studio | Custom agent development |
| Microsoft 365 Copilot | Researcher agent |
| Excel | Agent Mode preview |

**Authentication:** Microsoft Entra ID
**SDKs:** Python, TypeScript, C#

---

## Part 8: API Updates (December 2025)

### 8.1 New Beta Headers Summary

| Feature | Beta Header | Purpose |
|---------|-------------|---------|
| MCP Connector | `mcp-client-2025-04-04` | Direct MCP integration |
| Skills | `skills-2025-10-02` | Agent skills system |
| Code Execution | `code-execution-2025-08-25` | Sandbox code execution |
| Files API | `files-api-2025-04-14` | Upload/download files |
| Context Management | `context-management-2025-06-27` | Memory + context editing |
| Advanced Tool Use | `advanced-tool-use-2025-11-20` | Tool search, memory tool |
| Structured Outputs | `structured-outputs-2025-11-13` | Guaranteed schema conformance |
| Interleaved Thinking | `interleaved-thinking-2025-05-14` | Extended thinking in stream |
| Effort Parameter | `effort-2025-11-24` | Opus 4.5 effort control |

### 8.2 Structured Outputs (Beta)

Guaranteed schema conformance for responses:

```python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    extra_headers={
        "anthropic-beta": "structured-outputs-2025-11-13"
    },
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "user_analysis",
            "schema": {
                "type": "object",
                "properties": {
                    "sentiment": {"type": "string", "enum": ["positive", "negative", "neutral"]},
                    "confidence": {"type": "number"},
                    "key_points": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["sentiment", "confidence", "key_points"]
            }
        }
    },
    messages=[{"role": "user", "content": "Analyze this customer feedback..."}]
)
```

### 8.3 Extended Prompt Caching (GA)

Now generally available - no beta header required:
- Cache duration: Up to 1 hour
- Cost savings: Up to 90%
- Use for: System prompts, repeated context, templates

### 8.4 Usage & Cost API

Programmatic monitoring for organizations:

```python
# Get usage data
usage = client.usage.get(
    start_date="2025-12-01",
    end_date="2025-12-12"
)

# Get cost data
costs = client.costs.get(
    start_date="2025-12-01",
    end_date="2025-12-12",
    group_by="model"
)
```

---

## Part 9: Quick Reference Cards

### 9.1 Model Selection Decision Tree

```
START
  │
  ├─ Is this a simple/routine query?
  │   └─ YES → Haiku 4.5 ($1/$5)
  │
  ├─ Is this a standard coding/agent task?
  │   └─ YES → Sonnet 4.5 ($3/$15)
  │
  ├─ Is this complex reasoning/architecture?
  │   └─ YES → Opus 4.5 with effort=high ($5/$25)
  │
  ├─ Is this a deep code review/security audit?
  │   └─ YES → Opus 4.1 ($15/$75)
  │
  └─ Need to balance cost/capability?
      └─ Opus 4.5 with effort=medium
```

### 9.2 Context Management Decision Tree

```
START
  │
  ├─ Single conversation, <100K tokens?
  │   └─ No special handling needed
  │
  ├─ Long agent workflow, many tool calls?
  │   └─ Enable context editing (clear_tool_uses)
  │
  ├─ Need to persist info across sessions?
  │   └─ Enable memory tool
  │
  ├─ Have 500+ tools to choose from?
  │   └─ Enable tool search tool
  │
  └─ All of the above?
      └─ Combine all three with Sonnet 4.5
```

### 9.3 Claude Code Command Cheat Sheet

```bash
# Session Management
/clear          # Fresh start
/resume         # Continue last session
/rewind         # Rollback (or Esc+Esc)
/compact        # Compress context

# Models
/model          # Switch model
Tab             # Toggle thinking mode

# Context
/context        # View usage
/memory         # Edit memory files
/todos          # View todos

# MCP
/mcp enable X   # Enable server
/mcp disable X  # Disable server

# Info
/usage          # Usage stats
/sessions       # List sessions
/help           # All commands
```

### 9.4 Skills Quick Reference

```yaml
# Minimum SKILL.md template
---
name: my-skill
description: When and how to use this skill
---

# Instructions
[Your instructions here]
```

```python
# API usage
container={"skills": [{"type": "anthropic", "skill_id": "pptx"}]}
betas=["code-execution-2025-08-25", "skills-2025-10-02"]
tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
```

---

## Part 10: Troubleshooting Guide

### 10.1 Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Checkpoint won't restore | Bash command modified file | Use git for those changes |
| Skills not invoking | Description too vague | Make description specific with trigger words |
| Context exhausted | No compaction enabled | Enable code execution for auto-compact |
| MCP server not connecting | JSON syntax error | Validate config with `--mcp-debug` |
| Memory not persisting | Beta header missing | Add `context-management-2025-06-27` |

### 10.2 Performance Degradation Signs

- Responses become generic/less specific
- Claude "forgets" earlier instructions
- Tool calls become unreliable
- Increased hallucination rate

**Fix:** Manually compact or start fresh conversation with summary.

### 10.3 Cost Optimization

| Strategy | Savings | Implementation |
|----------|---------|----------------|
| Prompt caching | Up to 90% | Use for repeated system prompts |
| Batch processing | Up to 50% | Async batch API |
| Effort parameter | 50-76% | Use medium for standard tasks |
| Model routing | Variable | Haiku for simple, Sonnet for standard |
| Context compaction | Variable | Avoid context exhaustion |

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

### CLAIMS

1. All pricing and model specifications accurate as of December 12, 2025
2. API beta headers verified against official documentation
3. Claude Code 2.0 features confirmed via Anthropic announcements
4. MCP ecosystem stats from market research reports
5. Security certifications verified via Anthropic Trust Portal

### COUNTEREXAMPLES

1. Effort parameter performance gains may vary by task type
2. Context compaction quality depends on conversation content
3. Skill invocation timing not guaranteed (LLM routing)
4. Remote MCP server availability varies by region

### CONTRADICTIONS

1. Some sources report different SWE-bench scores (±2%)
2. Token efficiency claims vary between Anthropic and third-party benchmarks
3. Checkpoint retention period inconsistently documented (30 days vs. "configurable")

### VERIFICATION NEEDED

1. Slack integration general availability timeline
2. Google Managed MCP server pricing
3. Team Pro RBAC expansion timing (Q4 2025)
4. Bun acquisition integration roadmap

---

## Appendix A: INT Inc Connector Status (Current)

### Connected

- ✅ Google Drive
- ✅ Gmail
- ✅ GitHub
- ✅ Canva
- ✅ Cloudflare Developer Platform
- ✅ Cloudinary
- ✅ Figma
- ✅ GoDaddy
- ✅ HubSpot
- ✅ Hugging Face
- ✅ Learning Commons Knowledge Graph
- ✅ Linear
- ✅ n8n
- ✅ Notion
- ✅ Scholar Gateway
- ✅ Sentry
- ✅ Vercel
- ✅ Zapier

### Disconnected (Recommended for Review)

- ❌ Google Calendar (high value for scheduling)
- ❌ Atlassian (Jira/Confluence integration)
- ❌ Stripe (if handling payments)
- ❌ Slack (with new Claude Code integration)
- ❌ Plaid (financial data)
- ❌ Netlify (alternative to Vercel)

### Recommended Additions

- Secureframe (SOC 2, ISO 27001 compliance monitoring)
- Semgrep (security code scanning)
- Playwright MCP (web automation/testing)
- Sequential Thinking (structured problem-solving)
- Context7 (real-time documentation retrieval)

---

## Appendix B: Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2025-12-12 | Initial supplement with December 2025 updates |

---

*This supplement is designed to be used alongside the existing Claude Systems Documentation – Full Stack Insight Guide. For questions or updates, reference the official Anthropic documentation at docs.claude.com.*
