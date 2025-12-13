export interface ReferenceDoc {
  id: string;
  title: string;
  version: string;
  date: string;
  category: 'Executive' | 'Technical' | 'Strategy' | 'Operations';
  tags: string[];
  content: string;
  summary: string;
}

export const referenceDocs: ReferenceDoc[] = [
  {
    id: 'opus-4-5-assessment',
    title: 'Claude Opus 4.5 Executive Assessment Supplement',
    version: '2.0',
    date: 'Dec 12, 2025',
    category: 'Executive',
    tags: ['Opus 4.5', 'Pricing', 'Benchmarks', 'Safety', 'Executive'],
    summary: 'Executive-level analysis of Claude Opus 4.5, covering core specifications, benchmarks, pricing economics, and enterprise safety features.',
    content: `# Claude Opus 4.5 Executive Assessment Supplement
## Version 2.0 — Corrected & Verified

**Last Verified:** December 12, 2025  
**Status:** ✅ Production-Ready  
**Audience:** INT Inc. Leadership, Enterprise Decision-Makers

---

## Assumptions & Scope

> **Important:** This document assumes Claude API + Claude Code docs as of December 12, 2025. Token pricing is authoritative for API access. Seat pricing varies by enterprise agreement. Benchmarks vary by workload; treat deltas as directional unless cited with primary source.

---

## Confidence Labels

| Label | Definition | Example |
|-------|------------|---------|
| **✅ Verified** | Cited from Anthropic docs, system card, or engineering post | Model string, pricing, benchmark scores |
| **📊 Directional** | Third-party validation or workload-dependent; partner testimonial | Error reduction percentages from partner quotes |
| **⚠️ Unverified** | Needs primary citation or workload-specific validation | Internal projections without Anthropic source |

---

## Part 1: Claude Opus 4.5 Core Facts

### Model Specifications ✅ Verified

| Specification | Value | Source |
|--------------|-------|--------|
| Model String | \`claude-opus-4-5-20251101\` | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |
| Pricing (Input) | $5 per million tokens | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |
| Pricing (Output) | $25 per million tokens | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |
| Price Reduction | 67% reduction from Opus 4.1 ($15/$75) | [Anthropic Pricing](https://www.anthropic.com/claude/opus) |
| Context Window | 200,000 tokens | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |
| Max Output | 64,000 tokens | [Simon Willison Analysis](https://simonwillison.net/2025/Nov/24/claude-opus/) |
| Knowledge Cutoff | March 2025 (reliable) | [Simon Willison Analysis](https://simonwillison.net/2025/Nov/24/claude-opus/) |
| Release Date | November 24, 2025 | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |

### Benchmark Performance ✅ Verified

| Benchmark | Score | Comparison | Source |
|-----------|-------|------------|--------|
| SWE-bench Verified | 80.9% | vs GPT-5.1 Codex-Max (77.9%), Gemini 3 Pro (76.2%) | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |
| OSWorld (Computer Use) | 66.3% | Best computer-using model | [Anthropic Claude/Opus](https://www.anthropic.com/claude/opus) |
| Terminal Bench | +15% vs Sonnet 4.5 | Long-horizon autonomous tasks | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |
| τ2-bench (Agentic) | 88.9% | vs Gemini 3 Pro (85.3%) | [Analytics India Mag](https://analyticsindiamag.com/ai-news-updates/anthropic-claude-4-5-opus-beats-gemini-3-pro-in-coding-agentic-tasks/) |

### Token Efficiency ✅ Verified

| Configuration | Performance | Token Savings | Source |
|--------------|-------------|---------------|--------|
| Medium Effort | Matches Sonnet 4.5 best SWE-bench | 76% fewer output tokens | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |
| High Effort | +4.3 pp vs Sonnet 4.5 | 48% fewer output tokens | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |
| Long-horizon tasks | Higher pass rates | Up to 65% fewer tokens | [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5) |

---

## Part 2: Safety & Prompt Injection Robustness

### Prompt Injection Resistance ✅ Verified

| Metric | Claude Opus 4.5 | Gemini 3 Pro | GPT-5.1 | Source |
|--------|-----------------|--------------|---------|--------|
| Single Attack Success Rate | 4.7% | 12.5% | 21.9% | [Vellum Benchmarks](https://www.vellum.ai/blog/claude-opus-4-5-benchmarks) |
| 10 Attack Success Rate | 33.6% | 60.7% | — | [BD Tech Talks](https://bdtechtalks.substack.com/p/the-week-the-benchmarks-broke-can) |
| 100 Attack Success Rate | 63.0% | — | — | [AI Native Dev](https://ainativedev.io/news/anthropic-launches-claude-opus-4-5-with-a-focus-on-durable-real-world-coding) |

**Testing Partner:** Gray Swan (external red-team group)

**Key Insight:** While Opus 4.5 demonstrates industry-leading prompt injection resistance, Simon Willison correctly notes: "Single attempts at prompt injection still work 1/20 times, and if an attacker can try ten different attacks that success rate goes up to 1/3." Design agentic systems assuming prompt injection is inevitable and enforce safeguards at the application level.

### Agentic Safety ✅ Verified

| Evaluation | Opus 4.5 | Previous (Opus 4.1) | Source |
|------------|----------|---------------------|--------|
| Harmful Request Refusal | 88.39% | 66.96% | [Anthropic Transparency](https://www.anthropic.com/transparency) |
| Chrome Extension Injection Defense | 1.4% attack success | 10.8% (Sonnet 4.5 prior) | [Anthropic Transparency](https://www.anthropic.com/transparency) |

---

## Part 3: Partner Testimonials 📊 Directional

These claims come from partner quotes in Anthropic\\'s announcement. While published by Anthropic, they represent partner-specific workloads and may vary by use case.

| Partner | Claim | Category |
|---------|-------|----------|
| **Codeium** | "50% to 75% reductions in both tool calling errors and build/lint errors" | 📊 Directional |
| **GitHub Copilot** | "Surpasses internal coding benchmarks while cutting token usage in half" | 📊 Directional |
| **Warp** | "15% improvement [on Terminal Bench] over Sonnet 4.5" | ✅ Verified (Anthropic cited) |
| **JetBrains** | "Requires fewer steps to solve tasks and uses fewer tokens" | 📊 Directional |
| **Zencoder** | "Catches more issues in code reviews without sacrificing precision" | 📊 Directional |

**Source:** [Anthropic Opus 4.5 Announcement](https://www.anthropic.com/news/claude-opus-4-5)

---

## Part 4: Claude Code Checkpointing ✅ Verified

### Rewind Commands

| Method | Action | Source |
|--------|--------|--------|
| \`Esc + Esc\` (double-tap) | Open rewind menu | [Claude Code Docs](https://code.claude.com/docs/en/checkpointing) |
| \`/rewind\` | Open rewind menu | [Claude Code Docs](https://code.claude.com/docs/en/checkpointing) |

### Restore Modes

| Mode | Description | Source |
|------|-------------|--------|
| **Conversation only** | Rewind to a user message while keeping code changes | [Claude Code Docs](https://code.claude.com/docs/en/checkpointing) |
| **Code only** | Revert file changes while keeping the conversation | [Claude Code Docs](https://code.claude.com/docs/en/checkpointing) |
| **Both code and conversation** | Restore both to a prior point in the session | [Claude Code Docs](https://code.claude.com/docs/en/checkpointing) |

### Retention & Limitations ✅ Verified

- **Retention:** 30 days (configurable)
- **Scope:** Only tracks Claude\\'s file edits—not user modifications or bash commands
- **Best Practice:** Use alongside version control (Git), not as replacement

**Source:** [Claude Code Docs - Checkpointing](https://code.claude.com/docs/en/checkpointing)

---

## Part 5: Claude Code Revenue Milestone ✅ Verified

| Metric | Value | Source |
|--------|-------|--------|
| Run-rate Revenue | $1 billion | [Anthropic Bun Acquisition Post](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone) |
| Timeline | 6 months after public GA (May 2025) | [Anthropic Bun Acquisition Post](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone) |
| Milestone Month | November 2025 | [Anthropic Bun Acquisition Post](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone) |
| Announcement Date | December 2, 2025 | [Anthropic Bun Acquisition Post](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone) |

**Enterprise Customers:** Netflix, Spotify, KPMG, L\\'Oréal, Salesforce

---

## Part 6: Agent SDK (formerly Claude Code SDK) ✅ Verified

| Change | Details | Source |
|--------|---------|--------|
| Rebrand | "Claude Agent SDK (formerly the Claude Code SDK)" | [Anthropic Autonomous Claude Code](https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously) |
| Purpose | Access to same core tools powering Claude Code | [Anthropic Autonomous Claude Code](https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously) |
| Features | Context management, permission systems, subagent coordination | [Anthropic Autonomous Claude Code](https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously) |

---

## Part 7: Advanced Tool Use (Tool Search Tool) ✅ Verified

### Token Math — Corrected

**Problem:** Traditional tool use loads all tool definitions upfront, consuming context.

**Solution:** Tool Search Tool discovers tools on-demand; Claude only sees tools needed for current task.

| Scenario | Token Consumption | Source |
|----------|------------------|--------|
| **Without Tool Search** | All definitions loaded (~full context consumed) | [Anthropic Engineering](https://www.anthropic.com/engineering/advanced-tool-use) |
| **With Tool Search** | Only relevant tools loaded (85% context preserved) | [Anthropic Engineering](https://www.anthropic.com/engineering/advanced-tool-use) |

**Concrete Example from Anthropic:**
> "Tool Search Tool preserves 191,300 tokens of context compared to 122,800 with Claude\\'s traditional approach... This represents an 85% reduction in token usage while maintaining access to your full tool library."

**Accuracy Improvements:**
- Opus 4: 49% → 74% on MCP evaluations with Tool Search Tool
- Opus 4.5: 79.5% → 88.1% on MCP evaluations with Tool Search Tool

**Source:** [Anthropic Engineering - Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use)

### API Header Conventions — Standardized

#### Direct Anthropic API (HTTP)

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  --header "x-api-key: $ANTHROPIC_API_KEY" \\
  --header "anthropic-version: 2023-06-01" \\
  --header "anthropic-beta: advanced-tool-use-2025-11-20" \\
  --header "content-type: application/json" \\
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "name": "your_tool",
        "description": "Your tool description",
        "input_schema": {...},
        "defer_loading": true
      }
    ],
    "messages": [...]
  }'
\`\`\`

#### Anthropic Python SDK

\`\`\`python
client.beta.messages.create(
    betas=["advanced-tool-use-2025-11-20"],
    model="claude-sonnet-4-5-20250929",
    max_tokens=2048,
    tools=[
        {"type": "tool_search_tool_regex_20251119", "name": "tool_search_tool_regex"},
        # Your tools with defer_loading: true
    ],
    messages=[...]
)
\`\`\`

#### Amazon Bedrock (Separate Environment)

**Note:** Bedrock uses different header naming conventions.

\`\`\`
Beta Header: tool-search-tool-2025-10-19
Availability: InvokeModel and InvokeModelWithResponseStream APIs only
Model Support: Opus 4.5 only for Tool Search Tool
\`\`\`

**Source:** [Claude Docs - Tool Search Tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool), [AWS Bedrock Docs](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-tool-use.html)

---

## Part 8: MCP Governance — Linux Foundation / AAIF ✅ Verified

### Donation Details

| Fact | Value | Source |
|------|-------|--------|
| Recipient | Agentic AI Foundation (AAIF), directed fund under Linux Foundation | [Linux Foundation Press Release](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) |
| Announcement Date | December 9, 2025 | [Anthropic MCP Donation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) |
| Co-founders | Anthropic, Block, OpenAI | [Linux Foundation Press Release](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) |
| Supporters | Google, Microsoft, AWS, Cloudflare, Bloomberg | [Linux Foundation Press Release](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) |

### MCP Adoption Stats — Updated ✅ Verified

| Metric | Value | Source |
|--------|-------|--------|
| Monthly SDK Downloads | 97 million+ | [MCP Blog](http://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/) |
| Active Servers | 10,000+ | [Linux Foundation Press Release](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) |
| Client Support | ChatGPT, Claude, Cursor, Gemini, Microsoft Copilot, VS Code | [MCP Blog](http://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/) |

**Note:** Previous "8M+ downloads" figure is outdated. Current figure is 97M monthly SDK downloads as of December 9, 2025.

### Founding Projects

| Project | Contributor | Description |
|---------|-------------|-------------|
| MCP | Anthropic | Universal standard for connecting AI models to tools, data, applications |
| goose | Block | Open-source, local-first AI agent framework |
| AGENTS.md | OpenAI | Standard for project-specific agent instructions |

---

## Part 9: INT Inc. Executive Addendum

### Department-to-Platform Mapping

Based on INT Inc.\\'s validated benchmark dataset and department structure:

| Department | Primary Platform | Secondary | Rationale |
|------------|-----------------|-----------|-----------|
| **Information Security** | Claude (Opus 4.5) | — | Best prompt injection resistance, enterprise safety |
| **Sales** | Microsoft 365 Copilot | Claude | CRM integration, existing Microsoft stack |
| **Marketing** | Gemini | ChatGPT | Creative workflows, Google Workspace integration |
| **IT/Development** | GitHub Copilot | Claude Code | 55% productivity gain (GitHub data), IDE integration |
| **Customer Service** | Claude | — | Long-context handling, safety alignment |
| **Operations** | Claude | Copilot | Complex reasoning, document processing |

### ROI Framework Reference

INT Inc.\\'s validated ROI benchmarks (from internal dataset, not Anthropic):

| Metric | Conservative | Optimistic | Source |
|--------|-------------|------------|--------|
| Year 1 Investment | $46,180 | — | INT Inc. internal |
| Year 1 Revenue Potential | $500K | $1.5M | INT Inc. internal |
| 3-Year ROI | 1,200% | 3,000% | INT Inc. internal |
| Productivity Improvement | 15% | 22% | INT Inc. internal |

**Note:** These projections come from INT Inc.\\'s validated benchmark dataset, not Anthropic claims.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Dec 12, 2025 | Fixed token math logic error; added Verified/Directional labels; updated MCP downloads (8M→97M); standardized API headers; added INT Inc. addendum; added source citations throughout |
| 1.0 | Dec 11, 2025 | Initial draft |
`
  },
  {
    id: 'systems-doc-supplement',
    title: 'Claude Systems Documentation Supplement',
    version: '2.0.0',
    date: 'Dec 12, 2025',
    category: 'Technical',
    tags: ['Technical', 'API', 'MCP', 'Agent SDK', 'Code 2.0'],
    summary: 'Comprehensive technical guide covering Claude Code 2.0, Agent SDK, Context Management APIs, Skills System, and Enterprise Security.',
    content: `# Claude Systems Documentation – December 2025 Supplement
## Full Stack Insight Guide: Latest Updates & Deep Dives

**Version:** 2.0.0 (December 12, 2025)  
**Status:** Production-Ready  
**Scope:** Comprehensive supplement to the existing Claude Systems Documentation

---

## TL;DR: What\\'s New Since Your Base Documentation

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
| Model String | \`claude-opus-4-5-20251101\` |
| Context Window | 200K tokens |
| Max Output | 64K tokens |
| Knowledge Cutoff | March 2025 |
| Pricing | $5/$25 per MTok (input/output) |
| Safety Level | ASL-3 |
| Prompt Caching | Up to 90% savings |
| Batch Processing | Up to 50% savings |

#### Key Benchmarks

\`\`\`
SWE-bench Verified:     80.9% (state-of-the-art)
OSWorld (computer use): 66.3% (best in class)
Terminal-bench:         15% improvement over Sonnet 4.5
SWE-bench Multilingual: Leads 7/8 languages
\`\`\`

#### Effort Parameter (Unique to Opus 4.5)

The effort parameter controls how liberally the model spends tokens across thinking, tool calls, and responses:

\`\`\`python
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
\`\`\`

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

\`\`\`python
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
\`\`\`

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
| Model String | \`claude-sonnet-4-5-20250929\` |
| Context Window | 200K standard, 1M beta |
| Max Output | 64K tokens |
| Knowledge Cutoff | January 2025 |
| Pricing | $3/$15 per MTok |
| Safety Level | ASL-3 |

#### 1M Token Context (Beta)

\`\`\`python
# Enable 1M context via beta header
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    extra_headers={
        "anthropic-beta": "context-1m-2025-08-07"
    },
    messages=[{"role": "user", "content": "..."}]
)
\`\`\`

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
\`\`\`
❌ "Can you suggest changes to improve this code?"
✅ "Make these changes to improve this code: [specific changes]"
\`\`\`

---

### 1.3 Claude Haiku 4.5 (October 2025)

**TL;DR:** Near-frontier performance at 1/3 cost. 4-5x faster than Sonnet. Safest model yet.

#### Technical Specifications

| Attribute | Value |
|-----------|-------|
| Model String | \`claude-haiku-4-5-20251001\` |
| Context Window | 200K tokens |
| Max Output | 32K tokens |
| Knowledge Cutoff | February 2025 |
| Pricing | $1/$5 per MTok |
| Safety Level | ASL-2 |

**Performance Highlights:**
- 73.3% SWE-bench Verified (matches Sonnet 4)
- 90% of Sonnet 4.5\\'s performance in agentic coding
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

Anthropic\\'s competitive advantage is the tiered, interconnected family designed for orchestrated agentic work:

\`\`\`
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
\`\`\`

**Cost Optimization Example:**
\`\`\`python
# Route by task complexity
def select_model(task_complexity: str) -> str:
    models = {
        "simple": "claude-haiku-4-5-20251001",      # $1/$5
        "standard": "claude-sonnet-4-5-20250929",   # $3/$15
        "complex": "claude-opus-4-5-20251101",       # $5/$25
        "review": "claude-opus-4-1-20250805"         # Deep analysis
    }
    return models.get(task_complexity, "claude-sonnet-4-5-20250929")
\`\`\`

---

## Part 2: Claude Code 2.0 (Deep Dive)

### 2.1 Overview & Revenue

**TL;DR:** Claude Code hit $1B run-rate revenue in November 2025 - 6 months after public launch. Now includes checkpoints, VS Code extension, and Slack integration.

**Think of it like:** A junior engineer who never sleeps, can work on 30+ hour tasks, and has instant rollback capabilities.

### 2.2 Checkpoint System

Checkpoints automatically save code state before each change, enabling instant rollback.

#### How Checkpoints Work

\`\`\`
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
\`\`\`

#### Three Restore Modes

| Mode | What\\'s Restored | Use When |
|------|-----------------|----------|
| **Chat only** | Conversation history | Keep code changes, retry different prompt |
| **Code only** | File changes | Keep conversation context, undo bad changes |
| **Both** | Everything | Complete rollback to prior state |

#### Checkpoint Commands

\`\`\`bash
# Open rewind menu
/rewind

# Keyboard shortcut
Esc + Esc (double escape)

# List all checkpoints
/checkpoints
\`\`\`

#### Checkpoint Limitations

**NOT Tracked:**
- Files modified by bash commands (\`rm\`, \`mv\`, \`cp\`)
- Manual edits outside Claude Code
- Edits from concurrent sessions

**Retention:**
- Checkpoints retained for 30 days
- Session-level only (not permanent history)
- Use Git for permanent version control

#### Best Practice Pattern

\`\`\`
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
\`\`\`

---

### 2.3 VS Code Extension (Beta)

The native VS Code extension brings Claude Code into your IDE with real-time diffs.

#### Installation

1. Open VS Code Extension Marketplace
2. Search "Claude Code"
3. Install Anthropic\\'s official extension
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

\`\`\`
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
\`\`\`

#### Context Gathering

- **From threads:** All messages in the thread
- **From channels:** Recent channel messages
- **Repository selection:** Based on authenticated repos and context

#### Example Usage

\`\`\`
# In #engineering channel:
@Claude fix the failing payment tests

# Claude responds:
"I\\'ll investigate and fix the payment test failures. Creating a Claude 
Code session now..."

# [Progress updates in thread]

# Final response:
"Done! Fixed 3 failing tests in payment.test.ts. 
View session: [link]
Create PR: [link]"
\`\`\`

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

\`\`\`markdown
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
\`\`\`

**Usage:**
\`\`\`
"Use the backend-api subagent to build the user authentication endpoints 
while I work on the frontend"
\`\`\`

#### Hooks

Automatically trigger actions at specific points:

\`\`\`json
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
\`\`\`

**Hook Events:**
- \`PreToolUse\`: Before tool execution
- \`PostToolUse\`: After tool execution
- \`SubagentStop\`: When subagent completes
- \`Stop\`: When Claude stops
- \`SessionEnd\`: Cleanup operations

#### Background Tasks

Keep processes active without blocking:

\`\`\`bash
# Start dev server in background
Ctrl+b npm run dev

# Claude continues working while server runs
# Server output available but doesn\\'t block main workflow
\`\`\`

---

### 2.6 Essential CLI Commands

#### Core Commands

\`\`\`bash
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
\`\`\`

#### Session Management

\`\`\`bash
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
\`\`\`

#### MCP Management

\`\`\`bash
# Add MCP server
claude mcp add --transport [http|sse|stdio] <name> <url/command>

# Enable/disable servers
claude mcp enable [server-name]
claude mcp disable [server-name]
\`\`\`

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Esc\` | Stop Claude |
| \`Esc + Esc\` | Open rewind menu |
| \`Ctrl+r\` | Search prompt history |
| \`Ctrl+b\` | Run command in background |
| \`Ctrl+Z\` | Suspend Claude Code |
| \`Tab\` | Toggle thinking mode |
| \`Enter\` | Queue additional messages |
| \`Ctrl+U\` | Undo prompt input |

---

## Part 3: Claude Agent SDK (Deep Dive)

### 3.1 Rebranding & Purpose

**TL;DR:** Claude Code SDK renamed to Claude Agent SDK. Same infrastructure, broader scope. Build agents for any domain, not just coding.

**Think of it like:** The chassis and engine that powers Claude Code, now available for building any type of agent.

### 3.2 Installation

\`\`\`bash
# TypeScript/JavaScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install anthropic-agent-sdk

# Prerequisite: Claude Code CLI
npm install -g @anthropic-ai/claude-code
\`\`\`

### 3.3 Core Components

\`\`\`python
from claude_agent_sdk import Agent, query

# Simple agent
async def main():
    async for message in query(prompt="What is 2 + 2?"):
        print(message)
\`\`\`

#### Five Essential Components

1. **Tools:** File I/O, Bash, web fetch, code execution
2. **MCP Extensions:** External servers via \`create_sdk_mcp_server()\`
3. **Subagents:** Specialized agents in \`.claude/agents/\`
4. **Memory & Context:** \`CLAUDE.md\` scratchpad, session management
5. **Hooks:** Lifecycle callbacks for safety and logging

### 3.4 Subagent Architecture

\`\`\`markdown
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
\`\`\`

### 3.5 Hook Patterns

\`\`\`python
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
\`\`\`

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

**Beta Header:** \`context-management-2025-06-27\`

#### How It Works

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY TOOL FLOW                          │
├─────────────────────────────────────────────────────────────┤
│  1. Claude receives task                                    │
│  2. Claude checks /memories directory automatically         │
│  3. Claude creates/reads/updates/deletes memory files       │
│  4. Files persist between conversations                     │
│  5. Your infrastructure stores the data (client-side)       │
└─────────────────────────────────────────────────────────────┘
\`\`\`

#### API Usage

\`\`\`python
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
\`\`\`

#### Memory File Structure

\`\`\`
/memories/
├── project_context.md
├── user_preferences.json
├── refactoring_progress.xml
└── decision_log.md
\`\`\`

### 4.2 Context Editing

**TL;DR:** Automatically clear stale tool results when approaching context limits.

**Beta Header:** \`context-management-2025-06-27\`

#### Strategies

| Strategy | What It Clears | When to Use |
|----------|----------------|-------------|
| \`clear_tool_uses_20250919\` | Old tool results | Long agent workflows |
| \`clear_thinking_20251015\` | Thinking blocks | Extended thinking sessions |

#### API Usage

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: context-management-2025-06-27" \\
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
\`\`\`

### 4.3 Memory + Context Editing Combined

**Performance Impact:**
- Memory + Context Editing: **39% improvement** on agentic search
- Context Editing alone: **29% improvement**
- 100-turn evaluation: **84% token consumption reduction**

\`\`\`python
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
\`\`\`

**Workflow:**
1. Claude works on long task
2. Context approaches threshold
3. Claude receives warning notification
4. Claude saves critical info to memory files
5. Context editing clears old tool results
6. Claude continues, referencing memory as needed

### 4.4 Tool Search Tool

**TL;DR:** Work with hundreds/thousands of tools by dynamically discovering them.

**Beta Header:** \`advanced-tool-use-2025-11-20\`

#### Problem Solved

Without tool search: Load all 500 tool definitions → Consume ~122,800 tokens
With tool search: Load on-demand → Consume ~191,300 preserved (85% reduction)

#### Two Variants

| Variant | Model String | Search Method |
|---------|--------------|---------------|
| Regex | \`tool_search_tool_regex_20251119\` | Pattern matching |
| BM25 | \`tool_search_tool_bm25_20251119\` | Natural language |

#### API Usage

\`\`\`python
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
\`\`\`

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

\`\`\`bash
# Claude Code manual compact
/compact

# With preservation instructions
/compact only keep the names of files we modified

# Check context usage first
/context
\`\`\`

**Best Practice:** Manually compact at 70% capacity instead of waiting for 95% auto-trigger.

---

## Part 5: Skills System (Deep Dive)

### 5.1 Architecture Overview

**TL;DR:** Skills are prompt templates that inject domain-specific instructions. Not executable code - they modify Claude\\'s behavior through context.

**Think of it like:** Giving Claude a specialized training manual that loads only when relevant.

### 5.2 How Skills Work

\`\`\`
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
\`\`\`

### 5.3 SKILL.md Structure

\`\`\`yaml
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
\`\`\`python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`

## Capabilities
- Text extraction (including tables)
- Form filling
- Document merging/splitting

## When to Use
- User mentions PDF files
- Document processing tasks
- Form automation
\`\`\`

### 5.4 Pre-built Skills (Anthropic)

| Skill ID | Purpose | File Types |
|----------|---------|------------|
| \`pptx\` | Create presentations | .pptx |
| \`xlsx\` | Spreadsheets with formulas | .xlsx |
| \`docx\` | Word documents | .docx |
| \`pdf\` | Fillable PDFs | .pdf |

### 5.5 Skills API

**Beta Headers:**
- \`code-execution-2025-08-25\`
- \`skills-2025-10-02\`
- \`files-api-2025-04-14\`

#### List Skills

\`\`\`python
client.beta.skills.list(source="anthropic", betas=["skills-2025-10-02"])
\`\`\`

#### Use Skills in Messages

\`\`\`python
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
\`\`\`

#### Create Custom Skill

\`\`\`python
from anthropic.lib.helpers import files_from_dir

skill = client.beta.skills.create(
    files=files_from_dir("/path/to/my-skill/"),
    betas=["skills-2025-10-02"]
)
\`\`\`

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
| Atlassian | Productivity | \`https://mcp.atlassian.com/v1/sse\` |
| Cloudflare | Cloud | \`https://bindings.mcp.cloudflare.com/mcp\` |
| Stripe | Payments | \`https://mcp.stripe.com\` |
| Canva | Design | \`https://mcp.canva.com/mcp\` |
| Notion | Productivity | \`https://mcp.notion.com/mcp\` |
| Sentry | Monitoring | \`https://mcp.sentry.dev/mcp\` |
| Vercel | Cloud | \`https://mcp.vercel.com\` |
| HubSpot | CRM | \`https://mcp.hubspot.com/anthropic\` |
| Linear | Project Management | \`https://mcp.linear.app/mcp\` |
| Figma | Design | \`https://mcp.figma.com/mcp\` |
| Zapier | Automation | User-specific URL at \`mcp.zapier.com\` |

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

\`\`\`python
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
\`\`\`

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

\`\`\`
Customer VPC → Bedrock Endpoint → Claude
(No data leaves VPC)
\`\`\`

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
| MCP Connector | \`mcp-client-2025-04-04\` | Direct MCP integration |
| Skills | \`skills-2025-10-02\` | Agent skills system |
| Code Execution | \`code-execution-2025-08-25\` | Sandbox code execution |
| Files API | \`files-api-2025-04-14\` | Upload/download files |
| Context Management | \`context-management-2025-06-27\` | Memory + context editing |
| Advanced Tool Use | \`advanced-tool-use-2025-11-20\` | Tool search, memory tool |
| Structured Outputs | \`structured-outputs-2025-11-13\` | Guaranteed schema conformance |
| Interleaved Thinking | \`interleaved-thinking-2025-05-14\` | Extended thinking in stream |
| Effort Parameter | \`effort-2025-11-24\` | Opus 4.5 effort control |

### 8.2 Structured Outputs (Beta)

Guaranteed schema conformance for responses:

\`\`\`python
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
\`\`\`

### 8.3 Extended Prompt Caching (GA)

Now generally available - no beta header required:
- Cache duration: Up to 1 hour
- Cost savings: Up to 90%
- Use for: System prompts, repeated context, templates

### 8.4 Usage & Cost API

Programmatic monitoring for organizations:

\`\`\`python
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
\`\`\`

---

## Part 9: Quick Reference Cards

### 9.1 Model Selection Decision Tree

\`\`\`
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
\`\`\`

### 9.2 Context Management Decision Tree

\`\`\`
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
\`\`\`

### 9.3 Claude Code Command Cheat Sheet

\`\`\`bash
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
\`\`\`

### 9.4 Skills Quick Reference

\`\`\`yaml
# Minimum SKILL.md template
---
name: my-skill
description: When and how to use this skill
---

# Instructions
[Your instructions here]
\`\`\`

\`\`\`python
# API usage
container={"skills": [{"type": "anthropic", "skill_id": "pptx"}]}
betas=["code-execution-2025-08-25", "skills-2025-10-02"]
tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
\`\`\`

---

## Part 10: Troubleshooting Guide

### 10.1 Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Checkpoint won\\'t restore | Bash command modified file | Use git for those changes |
| Skills not invoking | Description too vague | Make description specific with trigger words |
| Context exhausted | No compaction enabled | Enable code execution for auto-compact |
| MCP server not connecting | JSON syntax error | Validate config with \`--mcp-debug\` |
| Memory not persisting | Beta header missing | Add \`context-management-2025-06-27\` |

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
`
  },
  {
    id: 'feature-roadmap',
    title: 'Claude Feature Roadmap: 2025-2026',
    version: '1.0.0',
    date: 'Dec 12, 2025',
    category: 'Strategy',
    tags: ['Roadmap', 'Infrastructure', 'Predictions', 'Strategy'],
    summary: 'Strategic outlook on Anthropic infrastructure investments ($50B+), multicloud strategy, and predicted feature rollouts through 2026.',
    content: `# Claude Feature Roadmap: 2025-2026
## Strategic Infrastructure & Capability Outlook

**Version:** 1.0.0 (December 12, 2025)  
**Status:** Research-Informed Predictions  
**Scope:** Infrastructure investments, upcoming features, and strategic direction

---

## TL;DR: Where Anthropic Is Heading

**Think of it like:** Anthropic is building the "AWS of AI" - not just models, but end-to-end infrastructure, tools, and ecosystem. They\\'re betting on enterprise adoption through multicloud resilience, vertical integrations, and agentic workflows.

**The Numbers:**
- $50B data center investment (Texas, New York, more sites coming)
- 1M+ Google TPUs coming online 2026 (tens of billions of dollars)
- 1M+ Amazon Trainium chips (Project Rainier)
- 300,000+ business customers (7x growth in large accounts YoY)
- $1B revenue run-rate (November 2025, 6 months post-launch)
- Projected $70B revenue by 2028 (break-even target)

---

## Part 1: Infrastructure Buildout (Confirmed)

### 1.1 $50 Billion Data Center Investment

**Announced:** November 12, 2025  
**Partner:** Fluidstack  
**Locations:** Texas and New York (initial), more sites to follow  
**Timeline:** Sites coming online throughout 2026

**Job Creation:**
- 800 permanent positions
- 2,400 construction jobs

**Strategic Context:**
- First major effort to build custom infrastructure
- Optimized specifically for Anthropic\\'s AI workloads
- Aligns with Trump administration\\'s AI Action Plan
- Positions Anthropic as domestic infrastructure player

**How This Compares:**
| Company | Investment | Timeline |
|---------|------------|----------|
| Anthropic | $50B | 2026+ |
| Meta | $600B | 3 years |
| OpenAI/SoftBank "Stargate" | $500B | Multi-year |
| OpenAI Total Commitments | $1.4T | Multi-year |

### 1.2 Google Cloud TPU Expansion

**Announced:** October 23, 2025  
**Value:** Tens of billions of dollars  
**Scale:** Up to 1 million TPUs (seventh-generation "Ironwood")  
**Capacity:** Well over 1 gigawatt coming online 2026

**What This Enables:**
- Training next-gen Claude models
- Massive inference scaling
- Multimodal model development (vision, voice, video)
- Regional deployment for latency reduction

**Cost Estimate:**
- ~$50,000 per TPU (hardware, installation, maintenance)
- 1M units = ~$50B direct cost
- Total deal value: $70-100B including operations

### 1.3 Amazon Project Rainier

**Status:** Active  
**Location:** 1,200-acre campus in Indiana  
**Investment:** Up to $11B at full buildout  
**Hardware:** Trainium2 custom chips

**Why This Matters:**
- Amazon remains primary training partner and cloud provider
- Hundreds of thousands of AI chips across multiple U.S. data centers
- Dedicated facility (not shared infrastructure)
- Already operational (ahead of many competitors)

### 1.4 Multi-Cloud Architecture Strategy

Anthropic\\'s competitive advantage is diversification:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│              ANTHROPIC COMPUTE STRATEGY                     │
├─────────────────────────────────────────────────────────────┤
│  GOOGLE TPUs                                                │
│  └─ Training & inference, price-performance optimized       │
│                                                             │
│  AMAZON TRAINIUM                                            │
│  └─ Primary training partner, Project Rainier               │
│                                                             │
│  NVIDIA GPUs                                                │
│  └─ Research workloads, specialized tasks                   │
│                                                             │
│  FLUIDSTACK (Custom)                                        │
│  └─ Anthropic-optimized facilities, maximum efficiency      │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**Resilience Proof:** During Monday\\'s AWS outage, Claude remained operational thanks to multi-cloud architecture.

---

## Part 2: Confirmed 2025-2026 Features

### 2.1 Code with Claude Developer Conference

**Date:** May 22, 2025  
**Location:** The Midway, San Francisco  
**Focus:** Real-world implementations using Anthropic API, CLI tools, MCP

**What Was Covered:**
- Interactive workshops
- Product roadmap discussions
- Networking opportunities

### 2.2 Seoul Office Opening (Asia-Pacific Expansion)

**Announced:** October 23, 2025  
**Opening:** Early 2026  
**Significance:** Third Asia-Pacific office (after Tokyo, Bengaluru)

**Korea Stats:**
- Top 5 globally for Claude usage (total and per-capita)
- 6x growth in Claude Code users over 4 months
- World\\'s top Claude Code user is a Korean software engineer
- 25%+ of Claude Code user base from Asia-Pacific

**Notable Partnerships:**
- Law&Company: AI legal assistance (2x lawyer efficiency)
- SK Telecom: AI customer service blueprint for telco industry

### 2.3 Claude for Chrome (Pilot)

**Status:** Testing with 1,000 trusted users  
**Purpose:** Browser-based AI assistance (calendars, emails, task automation)

**Safety Focus:**
- Addressing prompt injection attacks
- User-controlled permissions
- Confirmation for risky actions
- Feedback loop before wider release

### 2.4 Imagine with Claude (Preview)

**Status:** Preview for Max users  
**Purpose:** Real-time software generation

### 2.5 Memory System Expansion

**Status:** Rolling out to Pro (Max already has it)  
**Scope:** Project-specific and global memory

### 2.6 RBAC Expansion

**Timeline:** Q4 2025  
**Scope:** Expanding to Team Pro plans

---

## Part 3: Predicted 2026 Features

Based on official signals, enterprise trends, and ecosystem momentum:

### 3.1 Native Voice Integration

**Likelihood:** High  
**Signals:** 
- Mobile voice input already supported
- Enterprise demand for hands-free operation
- Competitor feature parity (GPT-4o voice)

**Predicted Capabilities:**
- Real-time dictation
- Document readback for editing
- Voice conversations with desktop file context
- Low-latency ("podcast conversation" speed)

### 3.2 Multi-Agent Orchestration (Native)

**Likelihood:** High  
**Signals:**
- Claude Code subagents already exist
- Agent SDK supports coordination
- Strong market demand

**Predicted Implementation:**
- Role-based agents (Researcher, Outliner, Editor, Integrator)
- Automatic task delegation
- Cross-agent information sharing
- Single prompt → coordinated output

### 3.3 Enhanced MCP Marketplace

**Likelihood:** Very High  
**Signals:**
- MCP donated to Linux Foundation
- 8M+ downloads, ecosystem growth
- One-click installation patterns emerging

**Predicted Features:**
- Curated connector marketplace in Claude Desktop
- Pre-built templates for common stacks (Notion + Drive + Slack)
- Enterprise-managed connector catalogs
- Version pinning and rollback

### 3.4 No-Code Artifact Builder

**Likelihood:** High  
**Signals:**
- Artifacts beta expanding
- Non-technical user growth
- Competitor features (GPT Canvas)

**Predicted Capabilities:**
- Drag-and-drop component assembly
- Pre-built artifact templates
- Visual workflow builder
- One-click deployment to production

### 3.5 Advanced Web Search

**Likelihood:** High  
**Signals:**
- Current web search already capable
- Multi-agent systems enable parallel research
- RAG improvements ongoing

**Predicted Features:**
- Source reliability scoring
- Parallel search with synthesis
- Real-time fact-checking
- Structured research reports

### 3.6 Enhanced File Handling

**Likelihood:** Very High  
**Signals:**
- File creation/editing launched September 2025
- Skills system supports document generation
- Enterprise demand for document workflows

**Predicted Features:**
- Native document collaboration
- Version control for generated files
- Template libraries
- Cross-format conversion

---

## Part 4: Strategic Positioning

### 4.1 Enterprise Focus

Anthropic\\'s trajectory clearly favors enterprise over consumer:

**Evidence:**
- 300,000+ business customers
- 7x growth in large accounts ($100K+ annually)
- SOC 2, ISO 27001, HIPAA certifications
- Zero data retention options
- Network isolation (VPC, PSC)
- Audit logging, SIEM integration

**Prediction:** Enterprise features will continue to lead consumer features by 6-12 months.

### 4.2 Agentic AI Bet

Anthropic is betting the company on agentic workflows:

**Evidence:**
- Claude Code: $1B run-rate in 6 months
- Slack integration: Meeting developers where they work
- Agent SDK: Generalized agent infrastructure
- MCP: Universal protocol for tool integration
- Model optimizations: Long-horizon autonomous tasks

**Prediction:** 2026 will see "agentic-first" product design across all Claude surfaces.

### 4.3 Multimodal Expansion

Next frontier beyond text + images:

**Evidence:**
- Current: Vision, document understanding
- TPU expansion enables 5-10x compute for multimodal training
- Market demand for video, voice, real-time analysis

**Prediction:** Claude with native voice, video understanding, and real-time interaction by mid-2026.

### 4.4 Safety Leadership

Differentiation through responsible AI:

**Evidence:**
- ASL-3 safety levels for frontier models
- Opus 4.5 prompt injection resistance (best in class)
- Chrome pilot prioritizing safety validation
- Red team capabilities improving (CTF, biology)

**Prediction:** Safety features will become a competitive selling point for enterprise customers wary of AI risks.

---

## Part 5: Financial Trajectory

### 5.1 Revenue Projections

| Year | Projected Revenue | Key Drivers |
|------|-------------------|-------------|
| 2025 | $1B+ run-rate | Claude Code, enterprise adoption |
| 2026 | ~$10-20B (estimated) | Infrastructure scaling, multimodal |
| 2027 | ~$30-50B (estimated) | Agentic AI mainstream |
| 2028 | $70B (target) | Break-even, $17B positive cash flow |

### 5.2 Funding History

| Round | Date | Amount | Valuation | Lead Investors |
|-------|------|--------|-----------|----------------|
| Series E | March 2025 | $3.5B | $61.5B | Lightspeed, Bessemer, Cisco, Fidelity |
| Series F | September 2025 | $13B | $183B | ICONIQ |

### 5.3 Path to IPO

**Predicted Timeline:** 2026-2027

**Preconditions:**
- Sustained revenue growth
- Operating profitability trajectory
- Google and Amazon as strategic partners/shareholders
- Regulatory clarity on AI governance

---

## Part 6: Competitive Landscape

### 6.1 Position vs. OpenAI

| Dimension | Anthropic | OpenAI |
|-----------|-----------|--------|
| Revenue (2025) | $1B+ | ~$5B+ |
| Burn Rate | Lower | Higher ($74B losses projected 2028) |
| Break-even | 2028 | Unknown |
| Infrastructure | Multi-cloud, diversified | Azure-dependent |
| Enterprise Focus | Strong | Growing |
| Safety Reputation | Best in class | Mixed |
| Developer Experience | Claude Code, Agent SDK | Codex, GPT-4 |

### 6.2 Position vs. Google

| Dimension | Anthropic | Google |
|-----------|-----------|--------|
| Model Quality | Competitive/leading | Competitive |
| Infrastructure | Partner (TPUs) | Owner (TPUs) |
| Enterprise Tools | Specialized (Claude Code) | Broad (Workspace) |
| Distribution | API, apps, partners | Everywhere |
| Agility | High (startup) | Lower (enterprise) |

### 6.3 Key Differentiators

1. **Multi-cloud resilience** - Not locked to single vendor
2. **Safety reputation** - Enterprise trust factor
3. **Developer experience** - Claude Code, Agent SDK leading
4. **MCP ecosystem** - Open protocol, broad adoption
5. **Efficiency** - More output per token, lower costs

---

## Part 7: Risks & Uncertainties

### 7.1 Known Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Compute cost escalation | High | Medium | Multi-cloud diversification |
| Regulatory changes | Medium | High | Safety-first positioning |
| Talent competition | High | Medium | Strong culture, mission-driven |
| Model commoditization | Medium | High | Agentic differentiation |
| Infrastructure delays | Medium | Medium | Multiple partners |

### 7.2 Unknown Unknowns

- AGI timeline and its implications for product strategy
- Geopolitical disruptions affecting chip supply
- Unexpected model capability breakthroughs (by competitors)
- Enterprise AI budget corrections
- Regulatory classification of AI agents

---

## Part 8: Recommendations for INT Inc

### 8.1 Immediate Actions (Q4 2025)

1. **Evaluate Claude for Chrome pilot** - Apply for early access if browser automation is relevant
2. **Prepare for RBAC expansion** - Document role requirements for Team Pro upgrade
3. **Inventory connector needs** - Identify disconnected services to enable in 2026
4. **Document agentic workflows** - Prepare for multi-agent orchestration features

### 8.2 2026 Planning

1. **Budget for increased Claude usage** - Opus 4.5 pricing makes advanced models accessible
2. **Train team on Agent SDK** - Build custom agents for INT Inc specific workflows
3. **Standardize on MCP** - Invest in MCP servers for frequently used tools
4. **Monitor Seoul office launch** - If Asia-Pacific operations matter, new support options coming

### 8.3 Skills Development

Priority skills for 2026 readiness:
1. Claude Code proficiency (checkpoints, subagents, hooks)
2. MCP server development/configuration
3. Agent SDK for custom workflows
4. Skills creation for repeatable processes
5. Context management strategies

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

### CLAIMS

1. Infrastructure investments are confirmed via official Anthropic announcements
2. Revenue projections are sourced from Wall Street Journal and analyst reports
3. Feature predictions are based on official signals and ecosystem trends
4. Competitive positioning reflects public financial information

### COUNTEREXAMPLES

1. 2026 feature predictions may be delayed or changed based on priorities
2. Revenue projections may be optimistic given AI market uncertainty
3. Multi-cloud strategy may shift based on partner relationships
4. Enterprise focus doesn\\'t preclude consumer feature innovation

### CONTRADICTIONS

1. Anthropic claims lower burn rate, but $50B infrastructure spend suggests significant capital deployment
2. "Break-even by 2028" conflicts with massive infrastructure investments (requires revenue scaling)
3. "Safety leadership" coexists with increasingly autonomous agents (tension to monitor)

### VERIFICATION NEEDED

1. Exact TPU deal pricing (tens of billions is range, not specific)
2. Claude for Chrome general availability timeline
3. Seoul office opening date (early 2026 is vague)
4. Bun acquisition integration roadmap

---

## Appendix: Key Dates & Milestones

### 2025 Timeline

| Date | Event |
|------|-------|
| March 2025 | Series E ($3.5B, $61.5B valuation) |
| May 2025 | Claude 4 launch, Claude Code GA |
| May 22, 2025 | Code with Claude developer conference |
| September 2025 | Series F ($13B, $183B valuation) |
| September 29, 2025 | Claude Sonnet 4.5, Claude Code 2.0 |
| October 2025 | Claude Haiku 4.5 |
| October 23, 2025 | Google TPU expansion announcement |
| October 23, 2025 | Seoul office announcement |
| November 12, 2025 | $50B data center investment |
| November 24, 2025 | Claude Opus 4.5 |
| December 3, 2025 | Bun acquisition |
| December 8, 2025 | Claude Code Slack integration (beta) |

### 2026 Predicted Timeline

| Quarter | Predicted Events |
|---------|------------------|
| Q1 2026 | Seoul office opens, TPU capacity comes online |
| Q2 2026 | Texas/New York data centers operational, voice features |
| Q3 2026 | Multi-agent orchestration GA, MCP marketplace |
| Q4 2026 | Multimodal expansion, potential IPO preparation |

---

*This roadmap document should be reviewed quarterly and updated as Anthropic releases official announcements. Predictions are informed by public information and may change based on market conditions, technical developments, and strategic priorities.*
`
  }
];
