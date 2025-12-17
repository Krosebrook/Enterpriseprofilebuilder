# Kyle's Personal Claude Quick Reference Guide
**Version:** 1.0.0 | **Last Updated:** December 11, 2025 | **Role:** Staff Engineer (AppSec + Platform)

---

## 🚨 EMERGENCY COMMANDS (COPY-PASTE READY)

### System Health Check
```
What's my current system prompt version and role configuration?
```
**Expected Response:** "v4.1 - Staff Engineer (AppSec + Platform) at Intinc"

### Memory Verification
```
memory_user_edits command="view"
```
**Expected Response:** List of your current memories (work context, FlashFusion, tools, etc.)

### Security Incident Protocol
```
[PROD] Security incident detected: [DESCRIBE ISSUE]
Required: Immediate threat assessment, containment steps, escalation path, incident response checklist
Framework: OWASP + SOC 2 Type II
```

### Reset Conversation (If Claude Seems "Off")
```
Please acknowledge: You are Claude v4.1, assisting Kyle (Staff Engineer, AppSec + Platform at Intinc). Confirm you have access to my memory, skills, and MCP connectors.
```

### Escalate to Human Review
```
This decision requires human review because: [REASON]
Please provide:
1. Decision summary (1 paragraph)
2. Options with trade-offs
3. Risk assessment
4. Recommended escalation path (CSO/CTO/CFO)
```

---

## ⚡ DAILY WORKFLOW SHORTCUTS

### Morning Standup (GitHub/Linear Integration)
```
[SPIKE] Morning standup prep:
1. Check my open GitHub PRs (status, comments, CI/CD)
2. List my Linear issues (in-progress, blocked)
3. Identify priority 1 tasks for today
4. Flag any blockers requiring escalation

Use: GitHub MCP, Linear MCP
```

### Security Code Review
```
[PROD] Review this code for security issues:
[PASTE CODE]

Checklist:
- OWASP Top 10 (especially A01, A03, A05)
- Input validation (whitelist, type-check, bounds)
- Secrets management (env vars only)
- Error handling (Cause → Fix → Retry)
- RLS compliance (creator_id == auth.user.id for FlashFusion)

Output: Severity-tagged findings + proposed fixes
```

### Architecture Design Session
```
[SKELETON] Design architecture for: [FEATURE/SYSTEM]

Requirements:
- Scale: [USER COUNT] concurrent users
- Security: [COMPLIANCE REQUIREMENTS]
- Integration: [EXTERNAL SERVICES]

Deliverables:
1. System diagram (ASCII or artifact)
2. Component breakdown
3. Data flow
4. Security considerations
5. Scalability analysis
6. Trade-offs (3 alternatives with pros/cons)
```

### FlashFusion RLS Audit
```
[PROD] Audit this Supabase query for RLS compliance:
[PASTE QUERY]

Baseline: creator_id == auth.user.id
Scale: 50K creators, 10K transactions/month
Flag: Any violations, performance issues, injection risks
```

### n8n Workflow Security Review
```
[PROD] Review this n8n workflow for security issues:
[DESCRIBE WORKFLOW OR PASTE JSON]

Check:
- API key handling (env vars only)
- Input validation (webhook payloads)
- Error handling (Cause → Fix → Retry)
- Rate limiting
- Data exposure risks
- Retry logic (exponential backoff)

Output: Security report + hardening recommendations
```

### GitHub Copilot Memory Optimization
```
[PROD] Review my GitHub Copilot memory entries:
[PASTE CURRENT ENTRIES]

Optimize for:
- Security frameworks (SOC 2, HIPAA, PCI-DSS)
- Code patterns (validation, error handling, RLS)
- FlashFusion stack (Next.js 15, tRPC, Supabase)
- Remove stale/redundant entries

Target: 108 entries, max 200 chars each
```

### Incident Postmortem
```
[PROD] Create incident postmortem:

Incident: [DESCRIPTION]
Timeline: [START - END]
Impact: [USERS/SYSTEMS AFFECTED]

Required sections:
1. Executive Summary
2. Timeline of Events
3. Root Cause Analysis (5 Whys)
4. Resolution Steps
5. Prevention Measures
6. Action Items (owners + deadlines)

Use: staff-engineer-v3 skill
```

---

## 🎯 FLASHFUSION-SPECIFIC SHORTCUTS

### Brand Kit Validator
```
[PROD] Design brand kit validator for FlashFusion:

Input: User-submitted brand (colors, fonts, logos)
Validation:
- Color accessibility (WCAG 2.1 AA contrast)
- Font licensing (commercial use approved?)
- Logo quality (min resolution, file size)
- Brand consistency checks

Output: Validation report + improvement suggestions
Use: frontend-design skill, accessibility-core skill
```

### Multi-Channel Publishing Security
```
[PROD] Review this publishing workflow:
[DESCRIBE OR PASTE CODE]

Channels: Printify, Shopify, Etsy, [others]
Security checks:
- Input validation (product data, images)
- Rate limiting per channel
- Error handling (channel-specific failures)
- Retry logic with backoff
- Audit trail (who published what, when)

Output: Security assessment + hardening plan
```

### Creator Analytics Dashboard
```
[SKELETON] Design analytics dashboard for FlashFusion creators:

Metrics:
- Active creators (publishing monthly)
- ARPU (Average Revenue Per User)
- Retention (30/60/90 day)
- NPS (Net Promoter Score)
- Top products by channel

Tech: Next.js 15, Supabase, Recharts
Security: RLS (creator sees own data only)
Scale: 50K creators, 100K+ concurrent ready

Use: frontend-design skill, xlsx skill (for exports)
```

### Print-on-Demand Workflow (n8n)
```
[PROD] Design n8n workflow: Printify → Shopify/Etsy sync

Flow:
1. Trigger: New product created in FlashFusion
2. Generate variants (sizes, colors)
3. Upload to Printify (API)
4. Sync to Shopify (API)
5. Sync to Etsy (API)
6. Update FlashFusion status
7. Notify creator

Security:
- API keys in env vars
- Input validation (product data)
- Error handling per channel
- Retry with exponential backoff
- Rate limit compliance

Use: workflow-automation skill, ai-agents-workflow skill
```

---

## 🔧 TOOL-SPECIFIC QUICK COMMANDS

### GitHub MCP
```
Show my open PRs with CI/CD status and recent comments
```
```
Create Linear issue for each failed test in latest GitHub Actions run
```
```
Search codebase for [PATTERN] and identify security risks
```

### Linear MCP
```
List my in-progress issues, group by priority
```
```
Create issue: [TITLE] with description: [DESC], assign to me, label: security
```
```
Generate sprint report: completed vs planned, velocity trend
```

### Vercel MCP
```
Check deployment status for [PROJECT] and show p95 latency last 24 hours
```
```
Compare performance metrics: current deploy vs previous
```
```
Trigger redeploy for [PROJECT] with environment: [staging/production]
```

### Stripe MCP
```
Show FlashFusion MRR trend (last 90 days)
```
```
List customers with failed payments (requires action)
```
```
Calculate churn rate by cohort (monthly)
```

### n8n MCP
```
List active workflows, show last execution status
```
```
Debug workflow [NAME]: show failed steps, error messages
```
```
Suggest optimization for workflow [NAME] (performance, cost)
```

### Notion MCP
```
Search company wiki for: [TOPIC]
```
```
Create meeting note: [TITLE] with template: [engineering-standup/1-on-1/incident]
```
```
Find all ADRs (Architecture Decision Records) related to [TOPIC]
```

---

## 🛡️ SECURITY FRAMEWORK QUICK CHECKS

### OWASP Top 10 (2021) - Quick Checklist
```
[PROD] OWASP audit for: [COMPONENT/FEATURE]

A01: Broken Access Control → RLS verified?
A02: Cryptographic Failures → Secrets in env? TLS enforced?
A03: Injection → Queries parameterized? Input validated?
A04: Insecure Design → Threat model complete?
A05: Security Misconfiguration → Defaults overridden? Buckets private?
A06: Vulnerable Components → Dependencies scanned?
A07: Authentication Failures → MFA? Session management?
A08: Software/Data Integrity → Supply chain validated?
A09: Logging Failures → Audit trail? 90-day retention?
A10: SSRF → URL validation? Allowlist?

Output: Compliance report with gaps + remediation
```

### SOC 2 Type II Quick Audit
```
[PROD] SOC 2 Type II readiness check for: [SYSTEM/PROCESS]

Trust Services Criteria:
- Security: Access controls? Encryption? Monitoring?
- Availability: Uptime SLOs? Disaster recovery?
- Processing Integrity: Data validation? Error handling?
- Confidentiality: Data classification? Need-to-know?
- Privacy: Consent? Retention? GDPR compliance?

Output: Gap analysis + remediation roadmap
```

### HIPAA Compliance Quick Check
```
[PROD] HIPAA compliance audit for: [SYSTEM handling PHI]

Administrative Safeguards:
- Risk assessment? Security policies? Training?

Physical Safeguards:
- Facility access? Workstation security? Device controls?

Technical Safeguards:
- Access controls? Audit trails? Encryption (rest + transit)?
- BAAs with vendors?

Output: Compliance report + required actions
```

---

## 🎨 PROMPTING FRAMEWORK SELECTOR

### When to Use R-I-S-E
✅ **Use when:** Single, well-defined task with clear boundaries  
✅ **Example:** "Act as security auditor. Given this API code, stop at code review (no deployment). Deliver: Severity-tagged findings list."

**Template:**
```
Act as [ROLE].
Given [INPUT],
Stop at [BOUNDARY].
Deliver [FORMAT].
```

### When to Use F-L-O-W
✅ **Use when:** Multi-step process requiring checkpoints  
✅ **Example:** "Design auth system. Focus: Security-first. Layers: (1) Input validation, (2) JWT generation, (3) RLS enforcement. Outcomes: Zero leaked credentials. Waypoints: Review after each layer."

**Template:**
```
[TASK]
Focus: [ONE GOAL]
Layers: [SUBSTEPS]
Outcomes: [MEASURABLE]
Waypoints: [CHECKPOINTS]
```

### When to Use Perspective Mirror
✅ **Use when:** Need to think adversarially (security, risk, failure modes)  
✅ **Example:** "How would an attacker break this auth system? Use STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege."

**Template:**
```
Perspective shift: [REFRAME QUESTION]
- "Add features?" → "What should we kill?"
- "Grow users?" → "Reduce churn how?"
- "Secure this?" → "How would attacker break it?" (STRIDE)
```

### When to Use Request Format Prefixes
✅ **Use when:** Setting scope/speed/quality expectations  

| Prefix | When to Use | Example |
|--------|-------------|---------|
| `[SPIKE]` | Quick prototype, POC, exploration | `[SPIKE] Proof of concept: AI image generation in brand kit` |
| `[PROD]` | Ship-ready, full security, tests | `[PROD] Production RLS policy for creator data` |
| `[SKEPTIC]` | Force deeper thinking, challenge assumptions | `[SKEPTIC] Is our auth system actually secure? Attack it.` |
| `[SKELETON]` | Architecture only, no code yet | `[SKELETON] Multi-tenant SaaS architecture` |
| `[DIFF]` | Incremental change, surgical edit | `[DIFF] Change line 42 to use bcrypt instead of md5` |

---

## 🧪 TESTING & VALIDATION SHORTCUTS

### Unit Test Generation
```
[PROD] Generate unit tests for this function:
[PASTE CODE]

Framework: [Jest/Vitest/Pytest]
Coverage: ≥1 happy path, ≥1 edge case, ≥1 error case
Focus: Security boundaries (injection, overflow, null)

Output: Test file with run command
```

### E2E Test Scenario
```
[PROD] Design E2E test for: [USER FLOW]

User journey:
1. [STEP 1]
2. [STEP 2]
3. [STEP 3]

Framework: Playwright
Assertions: [WHAT TO VERIFY]
Failure modes: [WHAT COULD GO WRONG]

Output: Test spec + run instructions
```

### Load Testing Plan
```
[PROD] Design load test for: [ENDPOINT/SYSTEM]

Target scale: [N] concurrent users
Duration: [MINUTES]
Success criteria: p95 latency <[MS], error rate <[%]

Tools: k6 / Artillery / Locust
Ramp-up: [STRATEGY]
Metrics: [WHAT TO MEASURE]

Output: Test script + analysis framework
```

---

## 📊 REPORTING & DOCUMENTATION SHORTCUTS

### Weekly Status Report
```
[PROD] Generate weekly status report:

Completed:
- [ITEM 1]
- [ITEM 2]

In Progress:
- [ITEM 3 with % complete]

Blocked:
- [ITEM 4 with blocker]

Next Week:
- [PLANNED ITEMS]

Format: Concise bullet points, executives can skim in 2 min
Use: internal-comms skill
```

### Architecture Decision Record (ADR)
```
[PROD] Create ADR for: [DECISION]

Template:
- Title: [DECISION]
- Status: Proposed / Accepted / Deprecated
- Context: Why this decision?
- Decision: What did we decide?
- Consequences: Positive + Negative
- Alternatives Considered: [OPTION 1, OPTION 2]

Format: Markdown
Store: Notion ADR database

Use: staff-engineer-v3 skill
```

### API Documentation
```
[PROD] Generate API docs for: [ENDPOINT]

Method: [GET/POST/PUT/DELETE]
Path: [/api/v1/resource]
Auth: [REQUIRED/OPTIONAL]
Request: [PARAMS/BODY SCHEMA]
Response: [SUCCESS/ERROR SCHEMAS]
Examples: [CURL COMMANDS]
Error Codes: [400/401/403/500 scenarios]

Format: OpenAPI 3.0
Use: docx skill (for export)
```

---

## 🔍 TROUBLESHOOTING GUIDE

### Claude Isn't Following My System Preferences
**Problem:** Responses don't match v4.1 behavior  
**Diagnosis:**
```
What's my current system prompt version?
```
**If response ≠ v4.1:**
1. Go to Settings → Profile → Custom Instructions
2. Delete current content
3. Re-paste v4.1 system prompt
4. Save and refresh page
5. Test again

### Memory Seems Stale or Incorrect
**Problem:** Claude references outdated information  
**Diagnosis:**
```
memory_user_edits command="view"
```
**If stale entries found:**
```
memory_user_edits command="remove" line_number=[N]
```
**Or update:**
```
memory_user_edits command="replace" line_number=[N] replacement="[NEW TEXT]"
```

### MCP Server Not Responding
**Problem:** "Unable to connect to [MCP server]"  
**Diagnosis:**
1. Check Settings → Connectors → Verify server is enabled
2. Test connection:
```
List my active MCP servers and their status
```
3. If server down, check MCP provider status page
4. Try disconnecting and reconnecting

### File Upload Failing
**Problem:** "Unable to process file"  
**Diagnosis:**
1. Check file size (<20MB per file)
2. Verify file type (PDF, DOCX, CSV, images, code)
3. Try smaller file or different format
4. If contains sensitive data, redact first

### Code Execution Timeout
**Problem:** "Execution exceeded 10 minute timeout"  
**Diagnosis:**
1. Simplify code (reduce complexity)
2. Use smaller dataset
3. Test locally first, then ask Claude to review
4. Break into smaller steps

### Web Search Returns Irrelevant Results
**Problem:** Search not finding what I need  
**Diagnosis:**
1. Be more specific (add year, domain, keywords)
2. Use quotes for exact phrases (rare, but sometimes helps)
3. Exclude terms if needed
4. Try different query phrasing

---

## ⌨️ KEYBOARD SHORTCUTS & TIPS

### Claude.ai Web Interface
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Quick search (if enabled) |
| `/` | Focus search bar |
| `Ctrl/Cmd + Enter` | Send message |
| `Esc` | Cancel current generation |
| `Ctrl/Cmd + Shift + C` | Copy last response |

### Efficiency Tips
- **Multi-line input:** Use Shift+Enter for new lines in chat
- **Code blocks:** Wrap code in triple backticks ```
- **Artifacts:** Request explicitly or Claude auto-detects
- **Quick edits:** Use [DIFF] prefix for surgical changes
- **Batch questions:** Ask multiple related questions in one message

---

## 📞 EMERGENCY CONTACTS & ESCALATION

### Security Incidents
**Contact:** CSO (Chief Security Officer)  
**When:** Critical vulnerabilities, data breaches, compliance violations  
**Protocol:** Follow incident response playbook → Notify CSO immediately

### Technical Failures
**Contact:** CTO (Chief Technology Officer)  
**When:** Production outages, architecture questions, platform issues  
**Protocol:** Assess impact → Notify CTO → Follow runbook

### Financial Decisions
**Contact:** CFO (Chief Financial Officer)  
**When:** Budget changes >$50K, ROI questions, cost optimization  
**Protocol:** Prepare analysis → Present options → Request approval

### Compliance/Legal
**Contact:** General Counsel  
**When:** Contract questions, IP issues, regulatory inquiries  
**Protocol:** Document situation → Seek legal guidance → Don't proceed without approval

### FlashFusion Product Decisions
**Contact:** Product Manager / Founder  
**When:** Feature prioritization, roadmap changes, user experience  
**Protocol:** Present data → Discuss trade-offs → Align on decision

---

## 🎯 MONTHLY MAINTENANCE CHECKLIST

### Memory Audit (1st of Month)
- [ ] Run: `memory_user_edits command="view"`
- [ ] Review "Top of mind" → Still accurate?
- [ ] Archive completed projects → Move to "Brief history"
- [ ] Remove stale entries (>90 days old)
- [ ] Add new context (recent projects, tools, learnings)

### Skills Refresh
- [ ] Check for new skills: Ask "What skills are available?"
- [ ] Review skill usage logs (which skills used most?)
- [ ] Identify underutilized skills (opportunities?)
- [ ] Update skill-specific shortcuts in this guide

### MCP Server Health Check
- [ ] Test each server: GitHub, Linear, Vercel, Stripe, n8n, etc.
- [ ] Verify API keys haven't expired
- [ ] Update any changed URLs/endpoints
- [ ] Document new MCP servers added

### System Prompt Verification
- [ ] Test: "What's my current system prompt version?"
- [ ] Expected: "v4.1 - Staff Engineer (AppSec + Platform)"
- [ ] If drift detected, re-paste system preferences
- [ ] Backup current prompt to Notion

---

## 💡 PRO TIPS & HIDDEN FEATURES

### Advanced Memory Usage
```
Remember: When I say "security review", use this checklist:
1. OWASP Top 10
2. Input validation (whitelist, type-check, bounds)
3. Secrets management (env vars only)
4. Error handling (Cause → Fix → Retry)
5. RLS compliance (if FlashFusion)
Output: Severity-tagged findings + fixes
```
**Result:** Claude applies this template automatically for all future security reviews.

### Chaining Skills
```
[PROD] Design brand kit validator (frontend-design skill) 
→ Generate implementation plan (staff-engineer-v3 skill)
→ Create test suite (no specific skill needed)
→ Document in README (docx skill)

Output: Complete deliverable package
```

### Context Preservation
**Problem:** Long conversation loses focus  
**Solution:** Periodically summarize and reset:
```
Summarize our conversation so far (key decisions, action items, open questions).
Then, let's continue with: [NEXT TOPIC]
```

### Artifact Iteration
**Instead of:** Starting new conversation for each version  
**Do this:** Iterate in same artifact:
```
Update the artifact:
- Line 42: Change X to Y
- Add new section: [DESCRIPTION]
- Optimize for performance
```

### Combining Prefixes
```
[PROD] [SKEPTIC] Review this auth system.
```
**Result:** Production-grade output + adversarial thinking (extra thorough)

---

## 🚀 QUICK START CHECKLIST (First 5 Minutes)

- [ ] Verify system prompt: "What's my current system prompt version?"
- [ ] Test memory: `memory_user_edits command="view"`
- [ ] Check MCP servers: "List my active MCP servers"
- [ ] Bookmark this guide (Ctrl/Cmd + D)
- [ ] Try one daily shortcut (pick from above)
- [ ] Enable web search, memory, artifacts in Settings
- [ ] Print this page for desk reference

---

## 📚 RELATED RESOURCES

- **Full System Prompt:** v4.1 (4,500+ words) - In Settings → Custom Instructions
- **Platform Setup Guide:** Web, Mobile, Desktop, Claude Code - See companion guide
- **Extensions & Integrations:** Browser, VS Code, Slack, API - See companion guide
- **Interactive Prompting Guide:** 50+ examples, frameworks, self-assessment - See companion guide
- **INT Inc Profile Builder:** 53,000+ word enterprise guide - See master document

---

**Last Updated:** December 11, 2025  
**Maintained By:** Kyle  
**Version:** 1.0.0  
**Feedback:** Update this guide as you discover new workflows, shortcuts, or tips!

---

**Next:** Review Platform-Specific Setup Guide (Web, Mobile, Desktop, Claude Code) →
