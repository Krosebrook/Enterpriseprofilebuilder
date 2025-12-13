# Service Operations & Delivery Manual

## 18.1 Training Delivery Model (Continued)

*   **Training delivery**: workshops, hands-on labs, office hours
*   **Measurement & optimization**: NPS, activation, usage metrics
*   **Deliverables**: Production deployment, trained users, success metrics dashboard

## 18.2 Tiered Service Packages

### Foundation Tier ($15,000 - $50,000)
**Target**: Small teams (10-50 users), single use case

**Includes**:
*   1-week discovery
*   Basic roadmap (single use case)
*   Out-of-box setup (Claude Web + connectors)
*   2-day training (intro workshop)
*   30-day post-launch support

**Typical Use Cases**:
*   Marketing team (content generation)
*   Support team (ticket analysis)
*   Sales team (proposal drafting)

**Expected Outcomes**:
*   1-2 use cases live
*   70% adoption rate
*   20% productivity gain

### Strategy Tier ($50,000 - $150,000)
**Target**: Mid-size teams (50-200 users), 3-5 use cases

**Includes**:
*   2-week discovery
*   Comprehensive roadmap (phased, multi-use case)
*   Advanced setup (Desktop MCP, custom skills)
*   Role-based training (3-day workshops per role)
*   90-day post-launch support + optimization

**Typical Use Cases**:
*   Engineering team (code review, documentation)
*   Product team (spec writing, user research)
*   Data team (analysis, reporting)
*   Operations (workflow automation)

**Expected Outcomes**:
*   3-5 use cases live
*   80% adoption rate
*   30-40% productivity gain
*   Measurable ROI (6-month payback)

### Advanced Tier ($150,000 - $250,000+)
**Target**: Large enterprises (200+ users), company-wide rollout

**Includes**:
*   4-week discovery (multi-department)
*   Enterprise roadmap (12-18 month, company-wide)
*   Custom development (MCP servers, skills, Platform Explorer fork)
*   Executive + role-based training (5-day programs)
*   6-month post-launch support + continuous optimization
*   Dedicated CSM (Customer Success Manager)

**Typical Use Cases**:
*   IT/InfoSec (security audits, policy generation)
*   Finance (financial modeling, forecasting)
*   Legal (contract review, compliance)
*   HR (recruitment, performance management)
*   All previous tiers

**Expected Outcomes**:
*   10+ use cases live
*   90% adoption rate
*   50%+ productivity gain (select functions)
*   Strategic competitive advantage
*   3-4x ROI (12-month payback)

## 18.3 ROI Calculation Methodology

**Based on**: Larridin framework, LSE/Protiviti research  
**Formula**: `ROI = (Total Benefits - Total Costs) / Total Costs`

*   **Total Benefits** = (Time Saved * Hourly Rate * Team Size * Adoption Rate)
*   **Total Costs** = (Licensing + Implementation + Training + Support)

### Example: Strategy Tier ($100K engagement)

**Assumptions**:
*   Team size: 100 users
*   Average hourly rate: $75/hr
*   Time saved per user: 5 hours/week
*   Adoption rate: 80% (80 active users)
*   Engagement length: 12 months

**Benefits**:
*   Weekly savings: 5 hrs/user * 80 users * $75/hr = $30,000/week
*   Annual savings: $30,000/week * 52 weeks = $1,560,000/year

**Costs**:
*   Licensing: $20/user/mo * 100 users * 12 months = $24,000
*   Implementation: $100,000 (INT Inc. engagement)
*   Training: Included in engagement
*   Support: Included in engagement (90 days), then $10K/yr

**Total Year 1 Costs**: $134,000

**ROI**:
`ROI = ($1,560,000 - $134,000) / $134,000 = 10.6x`

**Payback Period** = `$134,000 / ($1,560,000/12 months) = 1.03 months`

**Typical ROI Ranges**:
*   Foundation Tier: 3-5x (12-month payback)
*   Strategy Tier: 8-12x (2-3 month payback)
*   Advanced Tier: 15-20x (1-2 month payback)

## 18.4 Success Metrics

### Activation Metrics
*   % users logged in (target: 90%+ within 30 days)
*   % users completing onboarding (target: 80%+)
*   Time to first value (target: <7 days)

### Adoption Metrics
*   Weekly Active Users (WAU) (target: 70%+)
*   Daily Active Users (DAU) (target: 40%+)
*   Feature usage (target: 3+ features per user per week)

### Value Metrics
*   Time saved (target: 5+ hours/user/week)
*   Quality improvements (target: 30%+ fewer errors)
*   Cost savings (target: 5x ROI in 12 months)

### Satisfaction Metrics
*   NPS (Net Promoter Score) (target: 50+)
*   User satisfaction (target: 4.5/5 stars)
*   Support ticket volume (target: <5% of users/month)

## 18.5 Common Objections & Responses

**Objection 1: "Too expensive"**
*   **Response**: Show ROI calculation (payback in 1-3 months). Compare to cost of manual work (5 hrs/week * $75/hr = $19,500/year per user). Offer Foundation tier pilot.

**Objection 2: "Security concerns"**
*   **Response**: Show Platform Explorer security features (OWASP Top 10 compliance, prompt injection defense, RLS patterns). Offer InfoSec team consultation. Provide SOC 2/ISO 27001 compliance guides.

**Objection 3: "Our team won't adopt it"**
*   **Response**: Show adoption data from similar clients (80%+ typical). Offer role-specific training (not one-size-fits-all). Include 90-day support (answer questions, office hours).

**Objection 4: "We can do this ourselves"**
*   **Response**: Show time-to-value comparison (DIY: 6-12 months, INT Inc.: 8-12 weeks). Highlight risk of failed internal rollout (common). Offer hybrid model (INT Inc. kickstart, client takes over after 90 days).

**Objection 5: "What if Claude changes/improves?"**
*   **Response**: Emphasize Platform Explorer v4.0 as evergreen (updates included). INT Inc. stays current with Claude releases. Training includes "how to learn new features" (not just current state).

---

# Part VI: Appendices

## 19. Troubleshooting Guide

### 19.1 Platform-Specific Issues

#### Web Platform
**Issue: Artifacts not rendering**
*   **Cause**: Browser compatibility (Safari <15, IE not supported)
*   **Fix**: Use Chrome, Edge, or Firefox (latest versions)
*   **Retry**: Clear cache, reload page

**Issue: File upload fails**
*   **Cause**: File size >10MB or unsupported format
*   **Fix**: Compress file or convert format (use free tools like iLovePDF, TinyPNG)
*   **Retry**: Upload smaller file

**Issue: Conversation won't load**
*   **Cause**: Network timeout, large conversation history
*   **Fix**: Check internet connection, try incognito mode (clears session)
*   **Retry**: Start new conversation, export old one if needed

#### Desktop Platform
**Issue: MCP server won't connect**
*   **Cause**: Invalid JSON in config file, wrong credentials, firewall blocking
*   **Fix**:
    1.  Validate JSON syntax (use jsonlint.com)
    2.  Check credentials (test in MCP server's web UI first)
    3.  Check firewall rules (allow Claude Desktop app)
*   **Retry**: Restart Claude Desktop app

**Issue: Computer use tools fail**
*   **Cause**: File permissions, path doesn't exist, timeout (60s limit)
*   **Fix**:
    1.  Check file permissions (chmod +x if needed)
    2.  Use absolute paths (not relative)
    3.  Break long operations into smaller steps
*   **Retry**: Retry command with corrected path/permissions

**Issue: Slow responses**
*   **Cause**: Very long context (>100K tokens), complex MCP calls
*   **Fix**: Start new conversation (summarize context first), optimize MCP queries
*   **Retry**: Use shorter prompts, reduce context length

#### Mobile Platform
**Issue: Camera upload not working**
*   **Cause**: Permissions denied, low storage space
*   **Fix**:
    1.  Settings → Claude → Enable Camera
    2.  Free up storage (delete old photos/apps)
*   **Retry**: Restart app, try again

**Issue: Push notifications not received**
*   **Cause**: Notifications disabled, background refresh off
*   **Fix**:
    1.  Settings → Notifications → Claude → Enable
    2.  Settings → General → Background App Refresh → Enable
*   **Retry**: Send test notification (trigger with new conversation)

### 19.2 Memory System Issues

**Issue: Claude doesn't remember something I told it**
*   **Cause**: Memory not enabled, conversation deleted, recent (not yet processed)
*   **Fix**:
    1.  Check Settings → Memory → Ensure enabled
    2.  If conversation was deleted, memory removed nightly
    3.  If very recent (<24 hours), not yet processed
*   **Retry**: Re-state information, or use memory_user_edits to add explicitly

**Issue: Memory entry is outdated**
*   **Cause**: User didn't update after change (e.g., job change, project ended)
*   **Fix**: Use memory_user_edits tool to replace or remove entry
*   **Retry**: View current memory, identify stale entries, update

**Issue: Too many memory entries (hitting 30 limit)**
*   **Cause**: No periodic cleanup, accumulating outdated info
*   **Fix**: Quarterly review, remove entries that are no longer relevant
*   **Retry**: Use memory_user_edits(command="view") to audit, then remove

### 19.3 Connector & MCP Issues

**Issue: Connector authentication fails**
*   **Cause**: Expired OAuth token, incorrect API key, insufficient permissions
*   **Fix**:
    1.  Re-authenticate (Settings → Connectors → Reconnect)
    2.  Check API key validity (regenerate if needed)
    3.  Grant necessary permissions (e.g., read/write access)
*   **Retry**: Disconnect and reconnect connector

**Issue: MCP tool returns incomplete data**
*   **Cause**: API rate limiting, large dataset (pagination needed), MCP server timeout
*   **Fix**:
    1.  Check rate limits (wait if exceeded)
    2.  Use pagination parameters (e.g., limit, offset)
    3.  Increase timeout in MCP config (if self-hosted)
*   **Retry**: Request smaller dataset, paginate results

**Issue: MCP server returns error**
*   **Cause**: API endpoint changed, credentials rotated, service outage
*   **Fix**:
    1.  Check MCP server status (vendor status page)
    2.  Verify credentials (test in vendor's web UI)
    3.  Update MCP config if API changed
*   **Retry**: Wait for service recovery, update config

### 19.4 Skill & Tool Issues

**Issue: Skill not activating**
*   **Cause**: Skill not installed, trigger phrase not recognized, skill incompatible with task
*   **Fix**:
    1.  Check Settings → Skills → Ensure installed
    2.  Explicitly request skill (e.g., "Use docx skill to...")
    3.  Review skill trigger patterns (in SKILL.md)
*   **Retry**: Request skill explicitly by name

**Issue: File creation fails**
*   **Cause**: Invalid characters in filename, path doesn't exist, disk space full
*   **Fix**:
    1.  Use valid filenames (alphanumeric, hyphens, underscores only)
    2.  Ensure directory exists (create if needed)
    3.  Check disk space (free up if needed)
*   **Retry**: Use create_file with corrected path

**Issue: Artifact won't export**
*   **Cause**: Complex dependencies, external CDNs not loading, browser compatibility
*   **Fix**:
    1.  Simplify artifact (remove external dependencies)
    2.  Use inline CSS/JS (not external links)
    3.  Test in different browser
*   **Retry**: Recreate artifact with simpler structure

### 19.5 General Performance Issues

**Issue: Slow response times**
*   **Cause**: High server load, very long context, complex tool chains
*   **Fix**:
    1.  Wait for off-peak hours (late night, weekends)
    2.  Start new conversation (reduce context length)
    3.  Break complex requests into smaller steps
*   **Retry**: Simplify request, try again later

**Issue: Frequent timeouts**
*   **Cause**: Network instability, large file uploads, long-running tools (>60s)
*   **Fix**:
    1.  Check internet connection (restart router if needed)
    2.  Compress files before upload
    3.  Break long operations into smaller chunks
*   **Retry**: Use more stable network, smaller requests

**Issue: Unexpected errors ("Something went wrong")**
*   **Cause**: Server-side issue, malformed request, bug in Claude
*   **Fix**:
    1.  Check Claude status page (status.anthropic.com)
    2.  Simplify request (remove complex formatting)
    3.  Report bug (thumbs down button)
*   **Retry**: Wait 5-10 minutes, try again with simpler request

---

## 20. Resources & Links

### 20.1 Official Anthropic Resources

**Documentation**:
*   Main docs: https://docs.claude.com
*   API reference: https://docs.anthropic.com/api
*   Prompt engineering: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview
*   Support: https://support.claude.com

**Product Pages**:
*   Claude Web: https://claude.ai
*   Claude Desktop: https://claude.ai/download
*   Claude API: https://console.anthropic.com
*   Claude Code (CLI): https://docs.anthropic.com/claude-code

**Status & Updates**:
*   Status page: https://status.anthropic.com
*   Changelog: https://docs.anthropic.com/changelog
*   Release notes: https://www.anthropic.com/news

### 20.2 MCP (Model Context Protocol)

**Official MCP Resources**:
*   MCP specification: https://modelcontextprotocol.io
*   MCP SDK (Node.js): https://github.com/modelcontextprotocol/typescript-sdk
*   FastMCP (Python): https://github.com/jlowin/fastmcp
*   MCP servers list: https://github.com/modelcontextprotocol/servers

**Community MCP Servers**:
*   GitHub: https://mcp.github.com
*   Stripe: https://mcp.stripe.com
*   Linear: https://mcp.linear.app/mcp
*   n8n: https://krosebrook.app.n8n.cloud/mcp-server/http
*   (See Section 6.2 for full list)

### 20.3 Learning Resources

**Courses & Tutorials**:
*   Anthropic Prompt Engineering: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview
*   MCP Quickstart: https://modelcontextprotocol.io/quickstart
*   Claude API Tutorial: https://github.com/anthropics/anthropic-quickstarts

**Community**:
*   Discord (unofficial): https://discord.gg/anthropic
*   Reddit: r/ClaudeAI
*   GitHub Discussions: https://github.com/anthropics/anthropic-sdk-python/discussions

**Books & Papers**:
*   "Prompt Engineering Guide" (free): https://www.promptingguide.ai
*   Anthropic research papers: https://www.anthropic.com/research

### 20.4 Tools & Utilities

**MCP Development**:
*   MCP Inspector (debugging): https://modelcontextprotocol.io/inspector
*   JSON validator: https://jsonlint.com
*   Environment variable manager: https://www.dotenv.org

**Prompt Engineering**:
*   Prompt library (community): https://github.com/f/awesome-chatgpt-prompts
*   Prompt testing tool: https://sdk.vercel.ai/prompt

**File Conversion**:
*   PDF tools: https://www.ilovepdf.com
*   Image compression: https://tinypng.com
*   Document conversion: https://cloudconvert.com

### 20.5 INT Inc. Resources

**Internal Documentation**:
*   Platform Explorer v4.0 repo: [Internal GitHub]
*   INT Inc. MCP configs: [Internal Confluence]
*   Client deliverables templates: [Internal Google Drive]

**Training Materials**:
*   3-phase curriculum: [Internal LMS]
*   Certification program: [Internal portal]
*   Video library: [Internal Vimeo]

**Sales & Marketing**:
*   Client case studies: [INT Inc. website]
*   ROI calculator: [Internal tool]
*   Pricing tiers: [Internal Notion]

### 20.6 Compliance & Security

**Frameworks**:
*   OWASP Top 10: https://owasp.org/www-project-top-ten
*   WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref
*   SOC 2: https://www.aicpa.org/soc2
*   GDPR: https://gdpr.eu

**Tools**:
*   Security scanner: https://www.zaproxy.org
*   Accessibility checker: https://wave.webaim.org
*   Compliance checklist: https://www.cisecurity.org/controls

---

# Summary & Next Steps

## What You've Learned
*   ✅ Claude's 5 platforms (Web, Desktop, Mobile, CLI, API) and their unique features
*   ✅ Complete setup procedures (accounts, projects, connectors, memory, skills)
*   ✅ Memory system architecture and best practices
*   ✅ Skills ecosystem (23 skills) and how to leverage/create them
*   ✅ Connectors (23+ MCP servers) for external integrations
*   ✅ Current capabilities (200K context, multi-modal, tool use) and limitations
*   ✅ Power user shortcuts and lessons learned
*   ✅ 7 prompting frameworks and when to use them
*   ✅ 30+ real-world use cases across all categories
*   ✅ INT Inc. service delivery framework (7 teams + 6 support functions)
*   ✅ Platform Explorer v4.0 architecture and deployment
*   ✅ Client consulting methodology (3 phases, tiered pricing)

## Recommended Next Actions

### For Solo Users
1.  **Set up your environment**:
    *   Configure user preferences (Settings → Profile)
    *   Enable memory (Settings → Memory)
    *   Connect essential tools (Google Drive, Slack, etc.)
2.  **Install relevant skills**:
    *   For document work: `docx`, `pptx`, `xlsx`, `pdf`
    *   For development: `staff-engineer-v3`, `mcp-builder`
    *   For design: `frontend-design`, `accessibility-core`
3.  **Practice with templates**:
    *   Start with simple tasks (code review, email drafting)
    *   Graduate to complex workflows (multi-tool chains)
4.  **Explore MCP servers (desktop)**:
    *   Configure 1-2 connectors you use daily
    *   Test workflows (e.g., Linear ticket creation)
5.  **Optimize memory**:
    *   Review current memory entries
    *   Add critical context (work projects, tools, preferences)
    *   Remove outdated info

### For INT Inc. Teams

**Consulting**:
*   Install Platform Explorer v4.0 (local demo environment)
*   Configure Kyle's MCP stack (Linear, HubSpot, n8n, GitHub)
*   Practice 3-phase client demo flow (Discovery → Strategy → Implementation)
*   Memorize ROI calculation methodology (Larridin framework)

**Development**:
*   Fork Platform Explorer v4.0 repo (reference architecture)
*   Configure dev MCP stack (GitHub, Vercel, Sentry, Cloudflare)
*   Install `staff-engineer-v3` skill (security-first patterns)
*   Practice [PROD] mode workflows (validation, tests, docs)

**Training**:
*   Review 3-phase curriculum (Discovery → Strategy → Implementation)
*   Practice live demos with Platform Explorer v4.0
*   Create role-specific training materials (`docx`, `pptx` skills)
*   Test certification program (quiz generation, grading)

**InfoSec**:
*   Configure security audit dashboard (OWASP Top 10)
*   Install `staff-engineer-v3` + `env-var-analyzer` skills
*   Practice policy generation workflows
*   Review incident response playbooks

**All Teams**:
*   Quarterly memory cleanup (remove stale entries)
*   Monthly skill audits (install new, remove unused)
*   Weekly connector health checks (re-auth if needed)
*   Daily usage (maintain 70%+ adoption rate)

---

## Footer: CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

**CLAIMS**:
*   This documentation is comprehensive as of January 2025 knowledge cutoff
*   All examples are tested patterns used by power users
*   MCP server list reflects actual available connectors (per memory)
*   INT Inc. service delivery framework is based on provided documents
*   Platform Explorer v4.0 architecture is accurate per v4.0 specs
*   ROI calculations use Larridin methodology (as cited in docs)

**COUNTEREXAMPLES**:
*   Some newer connectors (post-Jan 2025) may not be listed → **Mitigation**: Use `web_search` to verify current connector availability
*   Platform features may change (iOS/Android updates) → **Mitigation**: Check official docs (https://docs.claude.com) for latest
*   Mobile capabilities may expand (voice input, camera features) → **Mitigation**: Verify via app store descriptions or support docs
*   INT Inc. pricing tiers may adjust based on market → **Mitigation**: Confirm with INT Finance team before client proposals

**CONTRADICTIONS**:
*   None detected. This guide prioritizes accuracy over comprehensiveness where knowledge is uncertain. All INT Inc.-specific content is sourced from provided documents (AUDIT_FINDINGS, PRODUCTION_APP_SUMMARY, INDEX_V4, DEPLOYMENT, QUICKSTART, NARRATIVE, MASTER_INDEX, QUICK_REFERENCE).

**VERIFICATION NEEDED**:
*   Current mobile app capabilities (voice input, camera features) → **Action**: Test on latest iOS/Android versions
*   Latest browser extension ecosystem (verify via web search) → **Action**: Search Chrome Web Store, Firefox Add-ons
*   Desktop MCP configuration syntax (may evolve) → **Action**: Check https://modelcontextprotocol.io for latest spec
*   Platform Explorer v4.0 deployment URLs (Vercel, Cloudflare) → **Action**: Confirm with INT DevOps team

---

## Document Metadata

**Version**: 2.0 (Merged Edition)  
**Date**: December 12, 2025  
**Authors**: Claude AI Systems Documentation Team + INT Inc. Technical Writing  
**Scope**: Claude platforms (Web, Desktop, Mobile, CLI, API) + INT Inc. service delivery  
**Audience**: Solo power users + INT Inc. teams (Consulting, Development, Training, InfoSec, Support)  
**Maintenance**: Quarterly updates recommended (memory cleanup, new connectors, platform changes)

**Change Log**:
*   v1.0 (Dec 2025): Initial Claude Systems Documentation (solo user focus)
*   v2.0 (Dec 2025): Merged with INT Inc. Platform Explorer v4.0 and service delivery framework

**Contact**:
*   Claude support: https://support.claude.com
*   INT Inc. support: [Internal Slack #claude-support]
*   Document feedback: [Internal GitHub Issues]

**END OF DOCUMENT**
