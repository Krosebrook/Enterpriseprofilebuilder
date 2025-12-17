# Claude Enterprise Quick-Start Guides
## Role-Specific Reference Cards | INT Inc | December 2025

---

# GUIDE 1: SALES TEAM

## 🎯 Your 5-Minute Setup

1. **Access:** https://claude.ai → Login with company SSO
2. **Project:** Create "Sales" project → Add custom instructions from template below
3. **Connectors:** Enable HubSpot, Stripe, Notion (Settings → Connectors)
4. **Memory:** Enable "Generate memory from chat history" (Settings → Memory)

## 📋 Custom Instructions Template (Copy This)

```
Role: B2B Sales Professional
Focus: Deal analysis, competitive research, proposal generation

Preferences:
- Cite sources for all competitive claims
- Use customer anonymization ("Customer X") not real names
- Include pricing comparisons when available
- Flag high-confidence vs speculative insights

Tools I use: HubSpot, Stripe, Notion, Google Drive
```

## 🛠️ Daily Use Cases

| Task | How to Ask | Example Output |
|------|------------|----------------|
| **RFP Response** | "Draft RFP response for [product] focusing on [requirements]" | Structured proposal with technical specs, pricing, timeline |
| **Battle Card** | "Create competitive battle card: us vs [competitor]" | Feature comparison, objection handling, win themes |
| **Deal Analysis** | "Analyze this opportunity for risk factors" | Risk score, red flags, recommended actions |
| **Pricing Research** | "Find pricing tiers for [competitor]" | Structured pricing table with source citations |
| **Email Draft** | "Write follow-up email after demo, mention [key points]" | Professional email with personalized hooks |

## ⚠️ Do's & Don'ts

**DO:**
- ✅ Use web search for competitor updates
- ✅ Request citations for factual claims
- ✅ Anonymize customer data ("Customer X")
- ✅ Ask for multiple options on proposals

**DON'T:**
- ❌ Input customer names or pricing
- ❌ Share contract details without redacting
- ❌ Rely on Claude for final contract approval
- ❌ Skip legal review for outbound contracts

## 🚨 Escalation Triggers
- Financial transactions >$10k → Finance Director
- Contract modifications → Legal review
- Customer PII detected → Redact and re-submit

---

# GUIDE 2: ENGINEERING TEAM

## 🎯 Your 5-Minute Setup

1. **Access:** Claude Desktop app (for MCP servers) + claude.ai
2. **Project:** Create "Engineering" project with tech stack context
3. **Connectors:** Enable GitHub, Linear, Sentry, Vercel
4. **MCP Config:** Add local servers in `claude_desktop_config.json`

## 📋 Custom Instructions Template

```
Role: Staff Engineer (AppSec + Platform focus)
Tech Stack: Next.js 15, TypeScript, Supabase, tRPC, Vercel

Preferences:
- Security-first: OWASP Top 10 validation on all code
- Include error handling and input validation
- Add tests (unit + edge cases) with code
- Use .env.example for secrets (never hardcode)
- Explain trade-offs in architectural decisions

Response Format:
[SPIKE] = Fast prototype, minimal validation
[PROD] = Production-ready with full tests
[SKEPTIC] = Challenge assumptions, find edge cases
```

## 🛠️ Daily Use Cases

| Task | Prefix | How to Ask |
|------|--------|------------|
| **Quick Prototype** | `[SPIKE]` | "[SPIKE] Build a REST API for user authentication" |
| **Production Code** | `[PROD]` | "[PROD] Create POST /api/users endpoint with validation, tests, error handling" |
| **Code Review** | - | "Review this code for security issues (OWASP Top 10)" |
| **Architecture** | `[SKELETON]` | "[SKELETON] Design multi-tenant SaaS with RLS" |
| **Debug Help** | - | "This function throws TypeError on line 42, here's the stack trace..." |
| **Documentation** | - | "Write API docs for this endpoint, audience: backend devs" |

## 🔧 MCP Server Configuration

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "github": {
      "type": "sse",
      "url": "https://mcp.github.com",
      "env": { "GITHUB_TOKEN": "${GITHUB_PAT}" }
    },
    "linear": {
      "type": "url",
      "url": "https://mcp.linear.app/mcp"
    },
    "sentry": {
      "type": "url", 
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

## ⚠️ Security Checklist (Before PR)

- [ ] A01: Access Control — RLS verified, no data leaks
- [ ] A03: Injection — All queries parameterized
- [ ] A05: Cryptography — TLS enforced, secrets in env vars
- [ ] A09: Supply Chain — `npm audit` clean
- [ ] Input validation — Whitelist, not blacklist
- [ ] Tests included — Unit + edge cases

---

# GUIDE 3: HR / PEOPLE OPERATIONS

## 🎯 Your 5-Minute Setup

1. **Access:** https://claude.ai → Login with company SSO
2. **Project:** Create "HR Operations" project
3. **Connectors:** Enable Google Drive, Notion
4. **Skills:** Install `docx` skill for document creation

## 📋 Custom Instructions Template

```
Role: HR Operations Professional
Focus: Employee communications, policy documentation, onboarding

Preferences:
- Professional, inclusive tone
- Cite legal/compliance requirements when relevant
- Flag content that may need legal review
- Use company templates when available

Sensitivity: Employee names in context OK, but redact SSN, salary, health info
```

## 🛠️ Daily Use Cases

| Task | How to Ask | Notes |
|------|------------|-------|
| **Job Description** | "Write JD for [role], level [X], team [Y]" | Include skills, requirements, growth path |
| **Onboarding Doc** | "Create 30-60-90 day plan for new [role]" | Output as structured document |
| **Policy Draft** | "Draft policy on [topic], align with [regulation]" | Flag for legal review |
| **Performance Review** | "Help structure feedback for [scenario]" | Provide frameworks, not specific ratings |
| **Offer Letter** | "Draft offer letter template for [role level]" | Use company templates if available |

## ⚠️ Do's & Don'ts

**DO:**
- ✅ Use Claude for drafting and structure
- ✅ Request inclusive language review
- ✅ Ask for compliance considerations
- ✅ Create templates for reuse

**DON'T:**
- ❌ Input employee SSN, health info, or salary data
- ❌ Make final termination or compensation decisions via Claude
- ❌ Share confidential employee information
- ❌ Skip legal review for policy changes

---

# GUIDE 4: FINANCE TEAM

## 🎯 Your 5-Minute Setup

1. **Access:** https://claude.ai → Login with company SSO
2. **Project:** Create "Finance" project
3. **Connectors:** Enable Stripe (for revenue data)
4. **Skills:** Install `xlsx` and `pdf` skills

## 📋 Custom Instructions Template

```
Role: Finance Professional
Focus: Financial analysis, reporting, forecasting

Preferences:
- Include formulas and assumptions in models
- Cite data sources for all figures
- Flag estimates vs actuals clearly
- Use conservative assumptions by default
- Never include confidential customer financial data

Output Format: Prefer spreadsheet-ready formats
```

## 🛠️ Daily Use Cases

| Task | How to Ask | Output |
|------|------------|--------|
| **Financial Model** | "Build revenue forecast model for next 4 quarters" | Excel-ready with formulas |
| **Variance Analysis** | "Analyze variance between budget and actuals for Q3" | Table + explanations |
| **Board Deck Data** | "Summarize financial highlights for board presentation" | Key metrics + trends |
| **Expense Analysis** | "Categorize and analyze these expense line items" | Categorized table |
| **Cash Flow** | "Project cash runway based on burn rate of [X]" | Timeline + scenarios |

## ⚠️ Escalation Triggers
- Transactions >$10k → Finance Director approval
- Tax implications → Tax counsel review
- Audit-sensitive data → Controller oversight

---

# GUIDE 5: MARKETING TEAM

## 🎯 Your 5-Minute Setup

1. **Access:** https://claude.ai → Login with company SSO
2. **Project:** Create "Marketing" project
3. **Connectors:** Enable Canva, HubSpot, Notion
4. **Skills:** Install `pptx` and `frontend-design`

## 📋 Custom Instructions Template

```
Role: Marketing Professional
Focus: Content creation, campaign strategy, competitive analysis

Preferences:
- Match brand voice: [describe your brand voice]
- SEO: Include keywords naturally
- CTAs: Always include clear call-to-action
- Metrics: Tie recommendations to measurable outcomes
- Visuals: Suggest imagery and layout when relevant
```

## 🛠️ Daily Use Cases

| Task | How to Ask | Output |
|------|------------|--------|
| **Blog Post** | "Write 1500-word blog on [topic] for [audience]" | SEO-optimized article |
| **Social Copy** | "Create 5 LinkedIn post variations for [campaign]" | Multiple options with CTAs |
| **Email Campaign** | "Write 3-email drip for [user segment]" | Subject + body for each |
| **Landing Page** | "Create landing page copy for [product launch]" | Hero, benefits, CTA |
| **Competitive Intel** | "Research [competitor]'s recent product launches" | Summary with sources |
| **Presentation** | "Create 10-slide deck for [topic]" | Use `pptx` skill |

## ⚠️ Do's & Don'ts

**DO:**
- ✅ Use web search for current trends and competitor updates
- ✅ Request multiple variations for A/B testing
- ✅ Ask for SEO keyword recommendations
- ✅ Include CTAs in all content

**DON'T:**
- ❌ Publish without brand voice review
- ❌ Use competitor trademarks incorrectly
- ❌ Make claims without citation sources
- ❌ Skip legal review for testimonials/case studies

---

# GUIDE 6: LEADERSHIP / EXECUTIVES

## 🎯 Your 5-Minute Setup

1. **Access:** https://claude.ai → Login with company SSO
2. **Project:** Create "Executive" project
3. **Connectors:** Enable Google Drive (for existing docs)
4. **Memory:** Enable for context continuity

## 📋 Custom Instructions Template

```
Role: Executive / Leadership
Focus: Strategic analysis, decision support, communication

Preferences:
- TL;DR first, then details
- Data-driven with sources cited
- Present options with trade-offs
- Flag assumptions and uncertainties
- Time-conscious: prioritize signal over noise
```

## 🛠️ Daily Use Cases

| Task | How to Ask | Output |
|------|------------|--------|
| **Board Prep** | "Summarize Q3 performance for board meeting" | Executive summary + key metrics |
| **Strategic Analysis** | "Analyze market entry options for [market]" | Options matrix with pros/cons |
| **Competitive Intel** | "Brief me on [competitor]'s recent moves" | 3-5 key points with sources |
| **Presentation** | "Create board deck on [strategic initiative]" | 10-15 slides via `pptx` |
| **Email Draft** | "Draft all-hands announcement about [news]" | Leadership-appropriate tone |
| **Decision Support** | "Help me think through [decision] - pros, cons, risks" | Framework with considerations |

## 🚨 Key Boundaries
- Claude provides analysis, not decisions
- Financial approvals require human sign-off
- Legal matters need counsel review
- Personnel decisions need HR partnership

---

# GUIDE 7: OPERATIONS TEAM

## 🎯 Your 5-Minute Setup

1. **Access:** https://claude.ai + Claude Desktop (for automation)
2. **Project:** Create "Operations" project
3. **Connectors:** Enable n8n, Zapier, Notion
4. **Skills:** Install `workflow-automation`

## 📋 Custom Instructions Template

```
Role: Operations Professional
Focus: Process optimization, automation, efficiency

Preferences:
- Quantify impact (time saved, error reduction)
- Include fallback handling in automations
- Document edge cases and exceptions
- Prioritize reliability over speed
- Log all automated actions

Tools: n8n, Zapier, Make, Notion, Google Sheets
```

## 🛠️ Daily Use Cases

| Task | How to Ask | Output |
|------|------------|--------|
| **Process Doc** | "Document SOP for [process]" | Step-by-step with screenshots |
| **Automation Design** | "Design n8n workflow: [trigger] → [actions]" | Workflow diagram + JSON |
| **Efficiency Analysis** | "Analyze this process for bottlenecks" | Recommendations + impact estimates |
| **Data Cleanup** | "Clean and normalize this dataset" | Script or manual steps |
| **Reporting** | "Create weekly operations dashboard" | Metrics + visualizations |

## 🔧 n8n Workflow Template Request

```
"Design an n8n workflow:
- Trigger: New form submission in [tool]
- Actions:
  1. Validate input data
  2. Create record in [database]
  3. Send confirmation email
  4. Post notification to Slack
- Include error handling and retry logic"
```

---

# APPENDIX: UNIVERSAL SHORTCUTS

## Keyboard Reference (All Roles)

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | New conversation |
| `Cmd/Ctrl + Shift + L` | Toggle sidebar |
| `Cmd/Ctrl + /` | Focus chat input |
| `Esc` | Cancel ongoing response |
| `↑` | Edit last message |

## Request Prefix Quick Reference

| Prefix | Use When | Security Level |
|--------|----------|----------------|
| `[SPIKE]` | Prototype, quick draft | Basic validation |
| `[PROD]` | Ship-ready work | Full OWASP |
| `[SKEPTIC]` | Challenge assumptions | Full + questioning |
| `[SKELETON]` | Architecture only | N/A |

## Getting Help

- **Technical Issues:** IT Service Desk
- **Training:** HR / L&D team
- **Best Practices:** INT Inc consulting team
- **Feedback:** Thumbs up/down on any response

---

*INT Inc. Enterprise Quick-Start Guides | v1.0 | December 2025*
