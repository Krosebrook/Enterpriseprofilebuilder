# Claude Full Stack Insight Guide: Integrated Master Documentation
## INT Inc Enterprise Reference | Version 2.0 | December 2025

---

## Document Control

| Attribute | Value |
|-----------|-------|
| **Version** | 2.0 |
| **Date** | December 15, 2025 |
| **Classification** | Internal Technical Reference |
| **Purpose** | Unified Claude ecosystem reference for INT Inc consulting teams and enterprise clients |
| **Sources Consolidated** | Claude Systems Documentation Full Stack Insight Guide, December 2025 Supplement, Feature Roadmap 2025-2026, Enterprise Profile Builder Site Crawl |
| **Target Audience** | INT Inc consultants, enterprise implementation teams, power users |

---

# EXECUTIVE SUMMARY

**TL;DR:** This document consolidates all Claude ecosystem documentation into a single, authoritative reference covering platforms (Web/Desktop/Mobile), capabilities, enterprise deployment, security protocols, MCP integrations, and 2025-2026 roadmap. Think of it as your complete operator's handbook for Claude implementations.

**Key Metrics (from Enterprise Profile Builder Dashboard):**
- **Active Users:** 116 (+12% WoW)
- **Avg Time Saved:** 4.1 hr/wk per user
- **Deployment Phase:** 18% (Phase 3 active)
- **Projected ROI:** 14.4x (Year 1)

---

# PART 1: CLAUDE PLATFORMS OVERVIEW

## 1.1 Platform Comparison Matrix

| Feature | Web (claude.ai) | Desktop | Mobile |
|---------|-----------------|---------|--------|
| MCP Servers | Limited | **Full** | None |
| Connectors | Most | Most | Limited |
| File Upload Size | Large | **Largest** | Smallest |
| Artifacts | Full | Full | Limited |
| Computer Use | Yes | Yes | No |
| Web Search | Yes | Yes | Yes |
| Projects | Yes | Yes | Yes |
| Voice Input | No | No | **Yes (native)** |
| Camera | No | No | **Yes** |

## 1.2 Claude Web (claude.ai)

**What it is:** Browser-based interface accessible at https://claude.ai

**Core Capabilities:**
- Full conversational AI with file upload support (PDF, images, docs, spreadsheets)
- Artifact creation and rendering (React, HTML, Markdown, SVG, Mermaid)
- Web search integration (real-time information retrieval)
- Multi-modal input (text + images)
- Project-based organization with custom instructions
- Connector integrations (Google Drive, Slack, etc.)
- Persistent storage API for artifacts
- Team collaboration features (Pro/Team plans)

**UX/UI:**
- Left sidebar: conversation history, projects, settings
- Center: chat interface with streaming responses
- Right panel: artifacts render inline
- Settings accessible via gear icon (top-right)

## 1.3 Claude Desktop

**What it is:** Native application for macOS/Windows with extended capabilities

**Core Capabilities:**
- Everything from Claude Web
- **MCP (Model Context Protocol) server support** – deepest integration
- Local file system access
- System-level integrations
- Offline caching (limited)
- Native notifications

**MCP Configuration Location:**
- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

**Example Configuration:**
```json
{
  "mcpServers": {
    "github": {
      "type": "sse",
      "url": "https://mcp.github.com",
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxx"
      }
    },
    "local-database": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "DB_CONNECTION": "postgresql://..."
      }
    }
  }
}
```

## 1.4 Claude Mobile

**What it is:** iOS/Android apps for on-the-go access

**Core Capabilities:**
- Core conversational AI
- Photo/camera integration
- Voice input (platform-dependent)
- Basic file upload
- Conversation sync across devices
- Push notifications

**Limitations:**
- No MCP server support
- Limited connector availability
- Smaller file upload limits
- Artifact creation limited (simpler outputs)
- No bash/computer use tools

---

# PART 2: MODEL FAMILY & CAPABILITIES

## 2.1 Claude 4 Model Tiers

| Model | Best For | Speed | Intelligence | Context |
|-------|----------|-------|--------------|---------|
| **Claude Opus 4.5** | Complex architecture, deep analysis, extended thinking | Slower | **Highest** | 200K |
| **Claude Opus 4.0** | Deep code review, security audits | Slower | Very High | 200K |
| **Claude Sonnet 4.5** | Best balance, coding, agentic workflows | **Fast** | High | 200K |
| **Claude Sonnet 4.0** | General-purpose tasks | Fast | Good | 200K |
| **Claude Haiku 4.5** | Real-time chat, high volume | **Fastest** | Good | 200K |
| **Claude Haiku 4.0** | Simple tasks, rapid prototyping | Fastest | Basic | 200K |

## 2.2 Core Capabilities

**1. Natural Language Understanding**
- Context windows: 200K tokens
- Multilingual (100+ languages)
- Nuanced instruction following
- Ambiguity resolution

**2. Code Generation & Analysis**
- Multi-language support (Python, JavaScript, TypeScript, Rust, Go, etc.)
- Full-stack applications
- Code review and debugging
- Test generation
- Documentation writing

**3. Data Analysis**
- CSV/Excel processing
- Statistical analysis
- Visualization recommendations
- Pattern recognition

**4. Tool Use (Function Calling)**
- Web search
- File operations
- API calls
- Custom tools via MCP

**5. Artifact Creation**
- React components (interactive UIs)
- HTML/CSS (landing pages)
- SVG (diagrams, illustrations)
- Mermaid (flowcharts, diagrams)
- Markdown (documents)

---

# PART 3: ENTERPRISE SECURITY & COMPLIANCE

## 3.1 Security Behavior Protocols (from Enterprise Profile Builder)

### PII Redaction
- Detect patterns like SSN, Credit Cards, Phone Numbers
- Redact with `[REDACTED <TYPE>]`
- Warn user if they uploaded unencrypted PII

**Example Response:**
> User: "Process data for John Doe, SSN 123-45-6789"
> Claude: "I can process the data for John Doe, [REDACTED SSN]. Please ensure PII is removed before upload."

### Code Security
- Never hardcode credentials in generated code
- Use environment variables for secrets
- Validate all inputs in generated functions

**Example Response:**
> User: "Write a script to connect to DB with password 'admin123'"
> Claude: "I will write the script using environment variables for the password. I cannot include the hardcoded password in the output."

## 3.2 Escalation Matrix

| Trigger Event | Required Action |
|---------------|-----------------|
| User asks to bypass safety filters | Refuse politely, log attempt, do not notify user of log |
| Request involves >$10k financial transaction approval | State: "I cannot approve transactions. Please forward this analysis to a Finance Director." |

## 3.3 Communication Standards (ID: standard-v1)
- Be professional and concise
- Cite sources for all factual claims
- Use Markdown for readability
- Acknowledge uncertainty

## 3.4 Enterprise Security Certifications

| Certification | Status | Notes |
|---------------|--------|-------|
| SOC 2 Type II | ✅ Active | Audit trails, access logs, incident response |
| HIPAA Ready | ✅ Available | BAA required, encryption at rest/transit |
| GDPR Compliant | ✅ Active | Data subject rights, breach notification 72h |
| FedRAMP | 🔄 In Progress | Government cloud offering |

## 3.5 LLM Safety Layers (5-Layer Defense)

1. **Input validation** — Sanitize, check length, reject injection patterns
2. **Prompt structure** — Separate instructions from data; never concatenate raw user input
3. **Output filtering** — Rule-based (not LLM-as-judge), no secrets, whitelist patterns
4. **External monitoring** — Log interactions, detect anomalies (>10 generations/hour/user = alert)
5. **Human oversight** — Require approval for high-risk ops

---

# PART 4: MCP ECOSYSTEM & CONNECTORS

## 4.1 What is MCP?

> "The Model Context Protocol (MCP) securely connects Claude to your enterprise data. It enables real-time fetching, action execution, and context-aware responses without storing data."

**Key Properties:**
- ⚠️ All connections are RBAC-enforced and audit-logged
- SSE (Server-Sent Events) for cloud-hosted servers
- stdio for local process communication

## 4.2 Available MCP Connectors (INT Inc Verified)

| Connector | Category | Use Case |
|-----------|----------|----------|
| Atlassian | Project Management | Jira tickets, Confluence docs |
| Stripe | Payments | Customer subscriptions, MRR data |
| Canva | Design | Asset creation, templates |
| Notion | Knowledge Base | Documentation, wikis |
| Sentry | Monitoring | Error tracking, performance |
| HubSpot | CRM | Deal pipeline, contacts |
| Linear | Project Management | Issues, roadmap |
| Figma | Design | Design files, components |
| Vercel | Deployment | Deployments, logs |
| Zapier | Automation | Workflow triggers |
| n8n | Automation | Complex workflow orchestration |
| GitHub | Code | Repositories, PRs, issues |
| Google Drive | Storage | Documents, spreadsheets |
| Slack | Communication | Messages, channels |
| Cloudinary | Media | Image/video management |

## 4.3 MCP Best Practices

**Do:**
- ✅ Verify Permissions: Ensure you have access to data in source tool first
- ✅ Chain Tools: Combine tools like 'HubSpot + Stripe' for richer insights
- ✅ Grant minimal necessary permissions
- ✅ Rotate credentials quarterly

**Don't:**
- ❌ Share connector credentials
- ❌ Use admin accounts for connectors
- ❌ Grant "full access" unless required
- ❌ Leave test connectors active in prod

---

# PART 5: SKILLS ECOSYSTEM

## 5.1 Specialized Skills Matrix (from Enterprise Profile Builder)

| Skill Name | Description | Target Roles |
|------------|-------------|--------------|
| `docx` | Create/edit Word documents | Sales, HR, Ops |
| `pdf` | Generate PDFs, extract text | Finance, Legal, Ops |
| `pptx` | Create presentations | Marketing, Sales, Leadership |
| `xlsx` | Create/analyze spreadsheets | Finance, Ops, Sales |
| `frontend-design` | Design web UIs | Product, Engineering, Marketing |
| `accessibility-core` | Ensure WCAG compliance | Engineering, Product |
| `workflow-automation` | Design n8n/Zapier workflows | Operations, Finance, Sales |
| `ai-agents-workflow` | Build AI agent orchestrations | Engineering, Product |
| `staff-engineer-v3` | Architecture/security reviews | CTO, Senior Eng |

## 5.2 Skill Lifecycle

**Installation:**
1. Settings → Skills
2. Browse/Search
3. Click "Install"
4. Skill available immediately

**Activation:**
- Automatic when relevant task detected
- Claude reads SKILL.md before executing
- Multi-skill combination possible

**Best Practice:** Always read skill documentation BEFORE executing tasks. Claude should use `view` tool on `/mnt/skills/public/[skill]/SKILL.md` before any document creation.

---

# PART 6: ROLE-BASED DEPLOYMENT

## 6.1 Sales Role Profile

**Focus:** Deal analysis, proposal generation, competitive research, pipeline management

**Key Capabilities:**
- RFP analysis and response generation
- Proposal templates and customization
- Competitive intelligence (battle cards)
- Deal stage prediction and risk assessment
- Sales playbook documentation

**Permissions & Access:**
- ENABLED: Web search, Memory, Artifacts, Files
- RESTRICTED: Code execution (not needed for sales)

**Standard Tools:** Stripe (customer subscription, MRR), HubSpot (deal pipeline), Notion

**⚠️ Mandatory Escalation Triggers:**
- No customer pricing in prompts (use "customer X" instead)
- Contracts need legal review before sending

## 6.2 Engineering Role Profile

**Focus:** Code generation, architecture review, security analysis, documentation

**Key Capabilities:**
- Full-stack application development
- Code review with security focus
- Infrastructure as Code (Terraform, CloudFormation)
- API design and implementation
- Test generation (unit, integration, e2e)

**Permissions & Access:**
- ENABLED: All features including Code execution
- RESTRICTED: None

**Standard Tools:** GitHub, Linear, Sentry, Vercel

## 6.3 Leadership/Executive Role Profile

**Focus:** Strategic analysis, reporting, presentation preparation

**Key Capabilities:**
- Executive summaries and briefings
- Competitive analysis
- KPI/OKR tracking
- Board presentation preparation

**Permissions & Access:**
- ENABLED: Web search, Memory, Artifacts, Files
- RESTRICTED: Code execution

---

# PART 7: MEMORY & PERSONALIZATION

## 7.1 How Claude Memory Works

**Architecture:**
- Memories derived from past conversations
- Periodic background updates (not real-time)
- Stored as key facts/preferences
- Scoped to Projects vs Global

**Memory Types:**
- Work context – job, role, tools, processes
- Personal context – interests, background
- Top of mind – current projects, active work
- Brief history – past conversations, decisions
- Instructions – user-specified preferences

## 7.2 Memory Scope

| Scope | Description |
|-------|-------------|
| **Global Memory** | Conversations outside Projects; available across all non-project chats |
| **Project Memory** | Conversations within a specific Project; isolated from other Projects |

## 7.3 Memory Management Commands

```
# View current memory
memory_user_edits(command="view")

# Add new entry
memory_user_edits(command="add", control="User works at Anthropic as Staff Engineer")

# Replace entry #3
memory_user_edits(command="replace", line_number=3, replacement="User is CEO at Anthropic")

# Remove entry #5
memory_user_edits(command="remove", line_number=5)
```

**Limits:** Max 30 edits, 200 characters per edit

## 7.4 Memory Best Practices

**Do:**
- ✅ Review memory quarterly
- ✅ Update major decisions/constraints immediately
- ✅ Remove outdated info
- ✅ Keep entries concise (under 200 chars)

**Don't:**
- ❌ Store secrets/passwords/PII
- ❌ Store verbatim commands
- ❌ Over-rely on memory for security
- ❌ Assume memory is comprehensive

---

# PART 8: DEPLOYMENT ROADMAP

## 8.1 Phased Deployment Plan (from Enterprise Profile Builder)

| Phase | Name | Duration | Owner | Status |
|-------|------|----------|-------|--------|
| 1-3 | Initial Rollout | - | - | 18% Complete |
| 4 | Training & Change Management | 4 weeks | HR / L&D | 0% Complete |
| 5 | General Availability (GA) | 1 week | CTO | 0% Complete |
| 6 | Advanced Integrations (MCP) | 6 weeks | Engineering Lead | 0% Complete |
| 7+ | Optimization & Expansion | 3+ weeks | - | Pending |

## 8.2 Feature Roadmap 2025-2026

### Confirmed 2025 Features
- Code with Claude conference (May 22, 2025)
- Seoul office opening (early 2026)
- Chrome pilot (1K users)
- "Imagine with Claude" visual generation
- Memory expansion
- RBAC expansion to Team Pro tier

### Predicted 2026 Features
- Native voice integration
- Multi-agent orchestration
- MCP marketplace (Linux Foundation governance)
- No-code artifact builder
- Advanced web search
- Enhanced file handling

---

# PART 9: BEST PRACTICES & WORKFLOWS

## 9.1 Iterative Refinement Workflow

> "Don't expect perfection in shot one. Treat Claude as a junior colleague who needs feedback."

**Process:**
1. Draft initial request
2. Review output
3. Provide specific feedback ('Make it shorter', 'Fix the bug on line 10')
4. Final polish

## 9.2 Handling Hallucinations

> "If Claude invents facts, ask for citations or sources. If it can't find them, assume it's false."

**Protocol:**
- Request verification for factual claims
- Use web search for post-cutoff information
- Cross-reference multiple sources

## 9.3 Prompting Best Practices

**Be Specific with Queries:**
- BAD: "Tell me about AI news"
- GOOD: "What are the latest regulatory updates for AI in the EU from the last month?"

**Use Request Prefixes:**
| Prefix | Speed | Security | Testing | Use When |
|--------|-------|----------|---------|----------|
| `[SPIKE]` | 🚀 Fast | Input validation only | Mocks | Prototype, POC |
| `[PROD]` | 🐢 Thorough | Full OWASP gates | E2E + unit | Ship-ready code |
| `[SKEPTIC]` | 🔬 Deep | Full + questioning | Full + edge | Force harder thinking |

---

# PART 10: FAQ (from Enterprise Profile Builder)

## Beginner Questions

**Q: How do I get access to Claude Enterprise?**
A: Contact your IT administrator or the INT Inc implementation team for enterprise access provisioning.

**Q: Does Claude store my data?**
A: Claude does not train on conversation data. Enterprise conversations are isolated and subject to your organization's data retention policies.

## Intermediate Questions

**Q: Can I put customer names in Claude?**
A: Use anonymized identifiers (e.g., "Customer X") rather than actual customer names. The DLP filter catches most PII, but vigilance is key.

**Q: What is the context window limit?**
A: 200K tokens (~150K words) for all Claude 4 models.

## Advanced Questions

**Q: Can the code sandbox access the internet?**
A: The computer use environment has configurable network access. Default allows web access; this can be restricted via network configuration.

---

# PART 11: QUICK REFERENCE

## 11.1 Keyboard Shortcuts

**Web Interface:**
- `Cmd/Ctrl + K`: New conversation
- `Cmd/Ctrl + Shift + L`: Toggle sidebar
- `Cmd/Ctrl + /`: Focus chat input
- `Esc`: Cancel ongoing response
- `↑`: Edit last message

**Desktop (Additional):**
- `Cmd/Ctrl + ,`: Settings
- `Cmd/Ctrl + N`: New window
- `Cmd/Ctrl + W`: Close conversation

## 11.2 Common Command Reference

**Search Commands:**
```
conversation_search(query="keyword")
recent_chats(n=10, sort_order="desc")
web_search(query="current event")
```

**File Commands:**
```
bash_tool(command="ls -la", description="...")
create_file(description="...", path="...", file_text="...")
str_replace(description="...", path="...", old_str="...", new_str="...")
view(description="...", path="...")
```

## 11.3 Troubleshooting Guide

| Problem | Check | Fix |
|---------|-------|-----|
| Claude won't remember something | Is memory enabled? (Settings → Memory) | Use `memory_user_edits` tool to add explicitly |
| File upload fails | File size (<10MB) and type (supported format) | Compress or convert file |
| Web search not working | Is search enabled? (Settings → Features) | Toggle off/on, or restart conversation |
| Artifact won't render | Browser compatibility (Chrome/Edge best) | Simplify code, remove external CDNs |
| MCP server not connecting (desktop) | `claude_desktop_config.json` syntax | Validate JSON, check credentials, restart app |
| Slow responses | Context length (very long chats slow down) | Start new conversation, summarize history |

---

# APPENDIX A: INFRASTRUCTURE INVESTMENTS 2025-2026

## Anthropic Data Centers & Compute

| Investment | Amount | Location/Provider | Timeline |
|------------|--------|-------------------|----------|
| Fluidstack Data Centers | $50B+ | Texas (2), NY (2+) | 2025-2027 |
| Google Cloud TPUs | $50-100B (projected) | 1M TPU v5/v6 | 2025-2028 |
| Amazon Project Rainier | $11B | AWS infrastructure | 2025-2026 |
| Multi-cloud Resilience | - | AWS + GCP + Azure | Ongoing |

## Financial Trajectory

| Year | Revenue | Customers | Notes |
|------|---------|-----------|-------|
| 2024 | $850M-$1B | 250K+ business | Series F $13B |
| 2025 | $2-4B (projected) | 300K+ business | $183B valuation |
| 2026-2028 | $70B target | - | Break-even target 2028 |

---

# APPENDIX B: INTEGRATION WITH INT Inc METHODOLOGY

## Alignment with 6-Week Pilot Framework

| Week | INT Inc Phase | Claude Integration |
|------|---------------|-------------------|
| 1-2 | Discovery & Baseline | System Baseline configuration, role profiling |
| 3-4 | Implementation | MCP connectors, skill deployment |
| 5 | Training | Certification program, playbook transfer |
| 6 | Validation & Handoff | GA rollout, IP transfer complete |

## ROI Calculation (Larridin Framework)

**Formula:**
```
ROI = (Time Saved × Hourly Rate × Users × Weeks) / Implementation Cost

Example:
ROI = (4.1 hrs × $75/hr × 116 users × 52 weeks) / $50,000
ROI = $1,862,580 / $50,000 = 37.25x (3 year)
Year 1: ~14.4x (as shown in dashboard)
```

---

# Document Footer

## CLAIMS
- This documentation reflects Claude capabilities as of December 2025
- Enterprise Profile Builder metrics are from INT Inc internal deployment
- Roadmap features are based on Anthropic public announcements and verified sources

## COUNTEREXAMPLES
- Some newer connectors (post-December 2025) may not be listed
- Platform features may change (verify via web search for latest)
- Mobile capabilities may expand with iOS/Android updates

## CONTRADICTIONS
- None detected. This guide prioritizes accuracy over comprehensiveness where knowledge is uncertain.

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 12, 2025 | Initial Claude Systems Documentation |
| 2.0 | Dec 15, 2025 | Integrated Enterprise Profile Builder crawl, added December 2025 Supplement, Feature Roadmap, role profiles |

---

*INT Inc. Enterprise Internal | v2.0 | Support: support@intinc.com*
