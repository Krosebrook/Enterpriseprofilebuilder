# Kyle's Interactive Prompting Guide
**Version:** 1.0.0 | **Last Updated:** December 11, 2025 | **Role:** Staff Engineer (AppSec + Platform)

---

## 📚 TABLE OF CONTENTS

1. [Foundations](#part-1-foundations) - Anatomy, principles, common mistakes
2. [Framework Deep Dive](#part-2-framework-deep-dive) - R-I-S-E, F-L-O-W, Perspective Mirror, Prefixes
3. [Progressive Examples](#part-3-progressive-examples) - Beginner → Intermediate → Advanced
4. [Real-World Scenarios](#part-4-real-world-scenarios) - FlashFusion, GitHub, n8n, incidents
5. [Self-Assessment](#part-5-self-assessment) - 20 practice prompts with answers

---

## PART 1: FOUNDATIONS

### 1.1 Anatomy of a Great Prompt

```
┌─────────────────────────────────────────────────────────┐
│                    GREAT PROMPT                         │
├─────────────────────────────────────────────────────────┤
│ [PREFIX]                  ← Scope (SPIKE/PROD/SKEPTIC) │
│ Role: [WHO]               ← Context for Claude         │
│ Task: [WHAT]              ← Clear objective            │
│ Input: [DATA]             ← What to analyze            │
│ Constraints: [LIMITS]     ← Boundaries                 │
│ Format: [OUTPUT]          ← Expected structure         │
│ Examples: [SAMPLES]       ← Show, don't just tell      │
└─────────────────────────────────────────────────────────┘
```

**Example:**
```
[PROD] Review this authentication function for security issues.

Code:
```python
def login(username, password):
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    result = db.execute(query)
    return result[0] if result else None
```

Focus:
- OWASP Top 10 (especially injection)
- Input validation
- Password handling
- Error messages (information disclosure)

Output format:
- Severity: CRITICAL/HIGH/MEDIUM/LOW
- Issue description
- Line number
- Fix suggestion (code example)
```

---

### 1.2 Six Principles of Effective Prompting

#### Principle 1: Be Specific (Not Vague)

❌ **BAD:**
```
Review this code
```

✅ **GOOD:**
```
[PROD] Review this authentication function for:
1. SQL injection vulnerabilities
2. Password storage (should be hashed, never plaintext)
3. Error handling (should not leak user existence)
4. Session management (secure token generation)

Code: [paste code]
```

**Why it works:** Claude knows exactly what to look for and can provide targeted, actionable feedback.

---

#### Principle 2: Provide Context

❌ **BAD:**
```
Design an API
```

✅ **GOOD:**
```
[SKELETON] Design RESTful API for FlashFusion brand kit management.

Context:
- Users: 50K creators
- Scale: 100K+ concurrent users
- Tech stack: Next.js 15, tRPC, Supabase
- Security: RLS (creator_id == auth.user.id)

Requirements:
- CRUD operations on brand kits (colors, fonts, logos)
- Validation (WCAG 2.1 AA contrast, font licensing)
- Versioning (track changes)
- Sharing (public links with permissions)

Deliverable: OpenAPI 3.0 spec with endpoints, schemas, auth
```

**Why it works:** Claude understands your environment, constraints, and success criteria.

---

#### Principle 3: Use Examples (Show, Don't Just Tell)

❌ **BAD:**
```
Generate test cases
```

✅ **GOOD:**
```
[PROD] Generate test cases for this password validator:

```typescript
export function validatePassword(password: string): boolean {
  return password.length >= 12 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
}
```

Example test structure:
```typescript
describe('validatePassword', () => {
  it('should accept valid passwords', () => {
    expect(validatePassword('StrongPass123')).toBe(true);
  });
  
  it('should reject passwords <12 chars', () => {
    expect(validatePassword('Short1')).toBe(false);
  });
});
```

Generate 8+ test cases covering:
- Happy path (valid passwords)
- Edge cases (exactly 12 chars, boundary conditions)
- Error cases (missing uppercase, numbers, etc.)
```

**Why it works:** Examples set the format, style, and level of detail you expect.

---

#### Principle 4: Specify Format

❌ **BAD:**
```
Analyze our security posture
```

✅ **GOOD:**
```
[PROD] Analyze FlashFusion security posture.

Output format:

## Executive Summary
[1 paragraph: Overall assessment]

## Findings by Severity

### Critical (Immediate Action)
- [Issue 1]
- [Issue 2]

### High (This Week)
- [Issue 3]

### Medium (This Month)
- [Issue 4]

## Recommendations
1. [Top priority action]
2. [Second priority]

## Compliance Status
- SOC 2: [Status]
- GDPR: [Status]
```

**Why it works:** Structured output is easier to share with stakeholders and action upon.

---

#### Principle 5: Set Constraints

❌ **BAD:**
```
Help me design a feature
```

✅ **GOOD:**
```
[SPIKE] Design multi-channel publishing feature for FlashFusion.

Constraints:
- Budget: $0 (use existing Printify, Shopify, Etsy integrations)
- Timeline: 2 weeks (MVP scope only)
- Team: 1 engineer (me), 0.5 designer
- Scale: Must handle 10K simultaneous publishes
- Security: No customer data in logs, audit trail required

Out of scope (for MVP):
- Advanced scheduling
- A/B testing
- Multi-language support

Deliverable: High-level architecture (diagram + description, <1 page)
```

**Why it works:** Constraints force pragmatic, realistic solutions rather than pie-in-the-sky ideas.

---

#### Principle 6: Define the Role (When Helpful)

❌ **BAD:**
```
What should I do about this incident?
```

✅ **GOOD:**
```
Act as an incident response coordinator for a security team.

Situation:
- Alert: 500 failed login attempts on CEO account (last 10 minutes)
- Source IPs: Distributed (botnet suspected)
- Current status: Account locked automatically
- Stakeholders: CEO (traveling), CISO, Security team

Your task:
1. Assess incident severity (P0/P1/P2/P3)
2. Recommend immediate actions
3. Identify investigation steps
4. Draft communication to CEO (2-3 sentences)

Use our incident severity matrix:
- P0: Active breach, data exfiltration
- P1: Attempted breach, service disruption
- P2: Suspicious activity, no impact
- P3: False positive, informational
```

**Why it works:** Role-setting helps Claude adopt the right perspective, tone, and expertise level.

---

### 1.3 Common Mistakes and Fixes

#### Mistake 1: Overly Broad Questions

❌ **BAD:**
```
How do I secure my application?
```

**Problem:** Impossibly broad. Claude will give generic advice that may not apply to your context.

✅ **FIX:**
```
[PROD] Security hardening checklist for FlashFusion (Next.js 15 + Supabase).

Focus areas:
1. Authentication (currently: Supabase Auth with magic links)
2. Authorization (currently: RLS policies)
3. API security (currently: tRPC with JWT validation)
4. Data protection (PII: creator emails, payment info)

What I need:
- Top 5 vulnerabilities to fix immediately
- Implementation examples (Next.js code)
- Testing approach (how to verify fixes)
```

---

#### Mistake 2: Assuming Claude Knows Your Context

❌ **BAD:**
```
Review the auth flow
```

**Problem:** Which auth flow? What system? What are you concerned about?

✅ **FIX:**
```
[PROD] Review this JWT authentication flow for FlashFusion:

Current flow:
1. User enters email → Supabase sends magic link
2. User clicks link → Supabase generates JWT (30-day expiry)
3. Frontend stores JWT in localStorage
4. Each API request includes JWT in Authorization header
5. tRPC middleware validates JWT → Extracts user_id → Passes to handler

Code: [paste relevant files]

Security concerns:
- localStorage (XSS risk?)
- 30-day expiry (too long?)
- JWT validation (what if compromised?)

Deliverable: Risk assessment + recommended improvements
```

---

#### Mistake 3: No Success Criteria

❌ **BAD:**
```
Make this code better
```

**Problem:** "Better" is subjective. Performance? Readability? Security?

✅ **FIX:**
```
[PROD] Optimize this database query for performance.

Current query:
```sql
SELECT * FROM creators 
JOIN brand_kits ON creators.id = brand_kits.creator_id 
JOIN products ON brand_kits.id = products.brand_kit_id 
WHERE creators.active = true;
```

Problem: Takes 8 seconds with 50K creators, 200K brand kits, 1M products

Success criteria:
- Target: <500ms (10x improvement)
- Maintain: Same result set
- Constraints: Read-only (no schema changes allowed yet)

What I need:
1. Query optimization (indexes, rewrite, etc.)
2. Explain plan comparison (before/after)
3. Migration script (to add indexes)
```

---

#### Mistake 4: Asking Multiple Unrelated Questions

❌ **BAD:**
```
1. How do I implement OAuth?
2. What's the best database for my app?
3. Should I use TypeScript or JavaScript?
4. How do I deploy to AWS?
```

**Problem:** Claude will try to answer all 4, but none deeply. You get surface-level advice.

✅ **FIX:**
```
[Ask one focused question per conversation, then follow up]

Conversation 1:
"[PROD] Design OAuth 2.0 integration for FlashFusion with Google/GitHub.
Context: [details]
Deliverable: Implementation plan with code examples"

[After getting answer and implementing]

Conversation 2:
"[PROD] Evaluate database options for FlashFusion.
Requirements: [details]
Deliverable: Comparison matrix with recommendation"
```

---

### 1.4 The Prompt Quality Checklist

Before hitting "Send", check:

- [ ] **Is my question specific?** (not "fix this" but "optimize for performance")
- [ ] **Have I provided context?** (tech stack, scale, constraints)
- [ ] **Have I set boundaries?** (scope prefix: SPIKE/PROD/SKEPTIC)
- [ ] **Have I shown examples?** (format, style, depth)
- [ ] **Have I defined success?** (what "good" looks like)
- [ ] **Is this ONE focused question?** (not 3-4 unrelated topics)

**Quality score:**
- 6/6 checks = Excellent prompt (will get great results)
- 4-5/6 = Good prompt (might need one clarification)
- 2-3/6 = Weak prompt (expect generic or clarifying response)
- 0-1/6 = Poor prompt (rewrite before sending)

---

## PART 2: FRAMEWORK DEEP DIVE

### 2.1 R-I-S-E Framework

**Structure:**
```
Act as [ROLE]
Given [INPUT]
Stop at [BOUNDARY]
Deliver [FORMAT]
```

**When to use:**
- ✅ Single, well-defined task
- ✅ Clear input and output
- ✅ Need to constrain scope
- ✅ One-shot interactions

**When NOT to use:**
- ❌ Multi-step processes (use F-L-O-W instead)
- ❌ Exploratory questions (no clear boundary)
- ❌ Open-ended brainstorming

---

#### R-I-S-E Examples

**Example 1: Security Code Review**
```
Act as a security auditor specializing in OWASP Top 10.

Given this authentication function:
```python
def login(username, password):
    query = f"SELECT * FROM users WHERE username='{username}'"
    user = db.execute(query)[0]
    if user['password'] == password:
        return generate_session_token(user['id'])
    return None
```

Stop at security analysis (do not refactor code yet).

Deliver:
- Severity ratings (CRITICAL/HIGH/MEDIUM/LOW)
- Specific vulnerabilities with line numbers
- OWASP mapping (e.g., A03: Injection)
- Brief fix description (defer code to next step)
```

**Claude's response will:**
- Focus only on security (not performance, style)
- Provide structured findings by severity
- Reference OWASP categories
- Not write code (you constrained it with "stop at analysis")

---

**Example 2: Data Analysis**
```
Act as a data analyst specializing in SaaS metrics.

Given this dataset of FlashFusion creator activity (last 90 days):
[CSV data with: creator_id, signup_date, last_active, products_published, revenue]

Stop at analysis (do not propose features or changes yet).

Deliver:
- Executive summary (3 bullet points)
- Key metrics (activation rate, retention, ARPU)
- Cohort analysis (by signup month)
- Top 3 insights with supporting data
```

---

**Example 3: Architecture Design**
```
Act as a solutions architect with expertise in serverless + edge computing.

Given requirements for FlashFusion image optimization service:
- Input: User uploads 5000x5000px PNG
- Output: Optimized for web (webp, 800px width, compressed)
- Scale: 1000 uploads/minute peak
- Budget: <$500/month
- Latency: <2 seconds end-to-end

Stop at architecture design (no code yet).

Deliver:
- System diagram (ASCII or Mermaid)
- Component breakdown (services, storage, CDN)
- Cost estimate breakdown
- Scalability analysis (how it handles 10x traffic)
```

---

**Example 4: Technical Writing**
```
Act as a technical writer for developer audiences.

Given this API endpoint:
```typescript
POST /api/v1/brand-kits
Body: { colors: string[], fonts: string[], logo_url: string }
Response: { id: string, status: 'approved' | 'pending_review' }
```

Stop at documentation (do not implement the endpoint).

Deliver:
- Endpoint description (1 paragraph)
- Request schema with field descriptions
- Response schema with examples (success + error cases)
- Authentication requirements
- Rate limit information
- cURL example
```

---

**Example 5: Test Case Design**
```
Act as a QA engineer specializing in security testing.

Given this password reset flow:
1. User clicks "Forgot password"
2. Enters email
3. Receives reset link via email (token expires in 1 hour)
4. Clicks link → Token validated → New password form
5. Submits new password → Password updated

Stop at test case design (do not execute tests).

Deliver:
- Happy path test cases (3-5)
- Security test cases (token reuse, expiry, brute force)
- Edge cases (expired token, invalid email, weak password)
- Test data requirements
```

---

#### R-I-S-E Anti-Patterns (What to Avoid)

❌ **Anti-Pattern 1: Vague Role**
```
Act as an expert.  // Expert in what?
```
✅ **Fix:**
```
Act as a security expert specializing in API security and OWASP Top 10.
```

❌ **Anti-Pattern 2: No Clear Input**
```
Given some code...  // What code? Where?
```
✅ **Fix:**
```
Given this 50-line authentication module: [paste code]
```

❌ **Anti-Pattern 3: Missing Boundary**
```
// No "stop at" clause → Claude may overdeliver
```
✅ **Fix:**
```
Stop at threat model design. Do not write code or deployment steps yet.
```

❌ **Anti-Pattern 4: Vague Output Format**
```
Deliver findings.  // What format? How detailed?
```
✅ **Fix:**
```
Deliver:
- Executive summary (3 sentences max)
- Detailed findings (table: Severity, Issue, Line, Fix)
- Next steps (prioritized action items)
```

---

### 2.2 F-L-O-W Framework

**Structure:**
```
Focus: [ONE GOAL]
Layers: [SUBSTEPS]
Outcomes: [MEASURABLE RESULTS]
Waypoints: [CHECKPOINTS]
```

**When to use:**
- ✅ Multi-step processes
- ✅ Need checkpoints/validation
- ✅ Building something complex
- ✅ Want to review progress incrementally

**When NOT to use:**
- ❌ Simple one-shot questions (use R-I-S-E)
- ❌ Time-sensitive quick answers

---

#### F-L-O-W Examples

**Example 1: Secure Authentication System**
```
[PROD] Design and implement secure authentication for FlashFusion.

Focus: Zero leaked credentials, SOC 2 compliant

Layers:
1. Password requirements (12+ chars, complexity, no common passwords)
2. Hashing (bcrypt, cost factor 12)
3. Rate limiting (5 attempts/15 min per IP)
4. MFA (TOTP, backup codes)
5. Session management (JWT, 30-day expiry, refresh tokens)
6. Audit trail (all auth events logged)

Outcomes:
- 0 plaintext passwords in database (verified by DB query)
- 0 password leaks in logs (verified by log audit)
- <1% false positive lockouts (measured over 7 days)
- 100% audit coverage (every auth event has log entry)

Waypoints:
- After Layer 1-2: Review password policy + hashing implementation
- After Layer 3-4: Review rate limiting + MFA integration
- After Layer 5-6: Review session + audit implementation
- Final: Full security review + penetration test
```

**Claude's response will:**
- Tackle each layer sequentially
- Pause at waypoints for review
- Verify outcomes are measurable
- Ask for approval before proceeding to next layer

---

**Example 2: Database Migration**
```
[PROD] Migrate FlashFusion from Supabase free tier to production-ready setup.

Focus: Zero downtime, zero data loss

Layers:
1. Audit current schema + data volume
2. Design production schema (indexes, RLS policies, foreign keys)
3. Create migration scripts (with rollback)
4. Test migration on staging (with production data snapshot)
5. Schedule downtime window (or use blue-green deployment)
6. Execute migration
7. Verify data integrity
8. Monitor performance (24 hours)

Outcomes:
- 100% data integrity (row counts match, checksums match)
- <500ms p95 query latency (measured pre/post migration)
- 0 failed transactions during migration
- <5 min downtime (if any)

Waypoints:
- After Layer 2: Review schema design with team
- After Layer 4: Verify staging migration success
- After Layer 6: Run integrity checks
- After Layer 8: Performance report to leadership
```

---

**Example 3: Feature Development (End-to-End)**
```
[PROD] Build brand kit validation feature for FlashFusion.

Focus: Prevent low-quality brand kits from going live

Layers:
1. Requirements gathering (what makes a "valid" brand kit?)
2. Validation rules (WCAG contrast, font licensing, logo quality)
3. Backend implementation (API endpoint, validation logic)
4. Frontend implementation (validation UI, error messages)
5. Testing (unit, integration, E2E)
6. Documentation (API docs, user guide)
7. Deployment (staging → production)

Outcomes:
- 90% brand kit approval rate (high quality bar, not too strict)
- <5% false rejections (measured by support tickets)
- <1 second validation latency
- 0 invalid brand kits slip through (measured over 30 days)

Waypoints:
- After Layer 1: Stakeholder approval on requirements
- After Layer 2: Engineering review on validation rules
- After Layer 3-4: Demo to product team
- After Layer 5: QA sign-off
- After Layer 7: Monitor for 7 days before declaring success
```

---

**Example 4: Incident Response**
```
[PROD] Respond to production database performance degradation.

Focus: Restore normal performance (<500ms p95 latency)

Layers:
1. Triage (severity assessment, impact scope)
2. Mitigation (immediate actions to stabilize)
3. Investigation (root cause analysis)
4. Resolution (permanent fix)
5. Monitoring (verify fix holds)
6. Postmortem (document lessons learned)

Outcomes:
- Latency back to <500ms p95 (within 1 hour)
- 0 data loss
- Root cause identified (with evidence)
- Prevention measures implemented

Waypoints:
- After Layer 1: Notify stakeholders (severity, ETA)
- After Layer 2: Confirm mitigation is working
- After Layer 4: Test fix in staging before production
- After Layer 6: Share postmortem with team
```

---

#### F-L-O-W Anti-Patterns

❌ **Anti-Pattern 1: Too Many Layers**
```
Layers: [15 steps listed]  // Too complex, break into smaller tasks
```
✅ **Fix:**
```
Layers: [5-7 high-level steps]
// For each step, create follow-up F-L-O-W if needed
```

❌ **Anti-Pattern 2: Vague Outcomes**
```
Outcomes: System should be fast  // Not measurable
```
✅ **Fix:**
```
Outcomes:
- p95 latency <500ms (measured via Datadog)
- Error rate <0.1% (measured via Sentry)
```

❌ **Anti-Pattern 3: No Waypoints**
```
// No waypoints → Claude delivers everything at once → No chance to course-correct
```
✅ **Fix:**
```
Waypoints:
- After design: Review with team before coding
- After implementation: Review code before testing
```

---

### 2.3 Perspective Mirror (Attack Surface Thinking)

**Pattern:**
```
Reframe: [FLIP THE QUESTION]

Instead of: "How do I add X?"
Ask: "What should I remove to simplify?"

Instead of: "How do I secure this?"
Ask: "How would an attacker break this?" (STRIDE)

Instead of: "How do I grow users?"
Ask: "How do I reduce churn?"
```

**When to use:**
- ✅ Security threat modeling
- ✅ System design reviews
- ✅ Risk assessment
- ✅ Uncovering blind spots

---

#### Perspective Mirror Examples

**Example 1: Security Review (STRIDE)**
```
[SKEPTIC] Attack this authentication system using STRIDE methodology.

System:
- JWT tokens (30-day expiry)
- Stored in localStorage
- Validated by tRPC middleware
- RLS enforced in Supabase

STRIDE categories:
- **S**poofing: Can attacker impersonate another user?
- **T**ampering: Can attacker modify data in transit/at rest?
- **R**epudiation: Can attacker deny their actions (no audit trail)?
- **I**nformation Disclosure: Can attacker access unauthorized data?
- **D**enial of Service: Can attacker crash/overload the system?
- **E**levation of Privilege: Can attacker gain admin access?

For each category:
1. Identify 2-3 attack vectors
2. Assess likelihood (Low/Medium/High)
3. Assess impact (Low/Medium/High)
4. Recommend mitigation
```

---

**Example 2: Feature Simplification**
```
[SKEPTIC] Challenge this feature roadmap by identifying what to kill.

Planned features for Q1 (FlashFusion):
1. Advanced scheduling (publish at specific time)
2. A/B testing (test multiple designs)
3. Analytics dashboard (track performance)
4. Team collaboration (multi-user brand kits)
5. Template marketplace (buy/sell templates)
6. Mobile app (iOS/Android)
7. API for developers
8. White-label offering

Budget: 2 engineers, 0.5 designer, 3 months

Your task:
- Which 2-3 features would you kill? Why?
- What's the opportunity cost of building the others?
- What's the simplest path to 10x user value?
```

---

**Example 3: Churn Analysis**
```
[SKEPTIC] Analyze why creators are leaving FlashFusion.

Instead of: "How do we acquire more users?"
Ask: "Why are existing users leaving?"

Data:
- 30-day retention: 45% (55% churn)
- 90-day retention: 20% (80% churn)
- Avg time to first publish: 3 days
- Avg publishes before churn: 2

Your analysis:
1. Top 3 hypotheses for why users churn
2. Data you'd need to validate each hypothesis
3. Experiments to test (1 week each)
4. Success metrics (what "fixed churn" looks like)
```

---

**Example 4: Failure Mode Analysis**
```
[SKEPTIC] Identify ways this system could fail catastrophically.

System: FlashFusion multi-channel publishing
- Publishes to Printify, Shopify, Etsy simultaneously
- Uses n8n for workflow orchestration
- 1000 publishes/day peak

Failure modes to explore:
1. **Single point of failure**: What if n8n crashes?
2. **Cascading failure**: What if Printify is down → retries overwhelm Shopify?
3. **Data corruption**: What if product data gets corrupted mid-publish?
4. **Quota exhaustion**: What if we hit Etsy API rate limit?
5. **Silent failure**: What if publish "succeeds" but product never appears?

For each:
- Likelihood (1-10)
- Impact (1-10)
- Detection method (how would we know?)
- Mitigation strategy
```

---

### 2.4 Request Format Prefixes

**Quick reference:**

| Prefix | Speed | Security | Testing | When to use |
|--------|-------|----------|---------|-------------|
| `[SPIKE]` | 🚀 Fast | Input validation only | Mocks OK | Prototype, POC, exploration |
| `[PROD]` | 🐢 Thorough | Full OWASP gates | E2E + unit | Ship-ready, customer-facing |
| `[SKEPTIC]` | 🔬 Deep | Full + adversarial | Full + edge | Force harder thinking, challenge assumptions |
| `[SKELETON]` | 📐 Structure | N/A | N/A | Architecture before code |
| `[DIFF]` | 📝 Surgical | Full | Full | Incremental change, specific line edit |

---

#### Prefix Examples

**[SPIKE] - Fast Exploration**
```
[SPIKE] Prototype: AI-powered product description generator

Requirements:
- Input: Product name, category, keywords
- Output: 3 description variants (short, medium, long)
- Tech: Call Claude API directly (no database yet)

Deliverable: Quick proof-of-concept (Python script, <100 lines)

Skip:
- Error handling (basic try/catch only)
- Production logging
- Database persistence
- Rate limiting
```

---

**[PROD] - Ship-Ready**
```
[PROD] Implement AI product description generator for FlashFusion

Requirements: [same as above]

Include:
- Input validation (sanitize product name, validate category from enum)
- Error handling (Cause → Fix → Retry pattern)
- Rate limiting (10 requests/minute per creator)
- Audit trail (log all generations to database)
- Caching (avoid regenerating same product twice)
- Tests (unit tests for validation, integration test for API)
- Monitoring (Sentry for errors, metrics for usage)

Deliverable:
- Production-ready Next.js API route
- Database migration (for audit trail)
- Tests (≥80% coverage)
- Documentation (API spec + README)
```

---

**[SKEPTIC] - Challenge Assumptions**
```
[SKEPTIC] Question every decision in this architecture

System: FlashFusion brand kit validator

Current design:
- Frontend submits brand kit → Backend validates → Returns pass/fail
- Validation rules: WCAG contrast, font licensing check, logo quality
- Tech: Next.js API route → Supabase function → External APIs (Google Fonts, etc.)

Your task:
- Challenge 5 assumptions (e.g., "Do we need external API calls?")
- Identify 3 edge cases we haven't considered
- Propose 2 alternative architectures (simpler? more robust?)
- What will break at 10x scale?
```

---

**[SKELETON] - Structure First**
```
[SKELETON] High-level architecture for multi-tenant SaaS billing system

Requirements:
- Support 3 plans: Free, Pro ($29/mo), Enterprise (custom)
- Stripe integration (subscriptions, invoicing)
- Usage metering (API calls, storage)
- Prorations, upgrades, downgrades
- Failed payment handling
- Tax calculations (international)

Deliverable:
- System diagram (components, data flow)
- Database schema (tables, relationships)
- API design (endpoints, no implementation)
- Integration points (Stripe webhooks, etc.)

Do NOT write code yet. Focus on structure and design.
```

---

**[DIFF] - Surgical Edit**
```
[DIFF] Update line 42 in auth.ts

Current:
```typescript
if (user.password === password) {  // Line 42
  return generateToken(user.id);
}
```

Change to:
```typescript
if (await bcrypt.compare(password, user.password_hash)) {  // Line 42
  return generateToken(user.id);
}
```

Context:
- Migrating from plaintext to bcrypt
- Don't change surrounding code
- Update import at top if needed: `import bcrypt from 'bcrypt';`
```

---

## PART 3: PROGRESSIVE EXAMPLES

### 3.1 Security Review (3 Levels)

#### Beginner: Simple Function Review
```
[PROD] Review this function for security issues:

```python
def get_user(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    return db.execute(query)
```

Focus: Most critical vulnerability

Output: 1 paragraph explanation + fix
```

**Expected issues:**
- SQL injection (f-string concatenation)

---

#### Intermediate: API Endpoint Review
```
[PROD] Review this API endpoint for security issues:

```typescript
export async function POST(req: NextRequest) {
  const { user_id, amount } = await req.json();
  
  const result = await supabase
    .from('payments')
    .insert({ user_id, amount, status: 'pending' });
  
  return NextResponse.json({ success: true });
}
```

Focus: OWASP Top 10, input validation, authorization

Output: Severity-tagged findings with fixes
```

**Expected issues:**
- Missing authentication check
- No input validation (amount could be negative)
- No authorization (can user_id manipulate other users?)
- No rate limiting
- No audit trail

---

#### Advanced: Full System Security Review
```
[PROD] Comprehensive security review for FlashFusion authentication system.

Components:
1. Magic link authentication (Supabase)
2. JWT storage (localStorage)
3. API authorization (tRPC middleware)
4. RLS policies (Supabase)
5. Session management (30-day tokens)

Deliverable:
- Threat model (STRIDE)
- Vulnerability assessment (OWASP Top 10)
- Compliance gaps (SOC 2 Type II)
- Remediation roadmap (prioritized by risk)
- Testing recommendations (how to verify fixes)

Output: 5-page security report
```

**Expected depth:**
- 10+ specific vulnerabilities across components
- Threat model with attack vectors
- Compliance mapping
- Detailed fixes with code examples
- Testing methodology

---

### 3.2 Feature Design (3 Levels)

#### Beginner: Simple UI Component
```
[SPIKE] Design a "Create Brand Kit" button component for FlashFusion.

Requirements:
- Primary action button
- Displays: "Create Brand Kit" text + icon
- Click → Navigate to /brand-kits/new

Deliverable: React component (TypeScript)
```

---

#### Intermediate: Feature Flow
```
[SKELETON] Design brand kit creation flow for FlashFusion.

Steps:
1. User clicks "Create Brand Kit"
2. Form: Name, colors (2-5), fonts (1-3), logo upload
3. Validation: WCAG contrast, font licensing, logo size
4. Preview: Show mockup with brand applied
5. Save: Store in database, generate shareable link

Deliverable:
- User flow diagram
- Form schema (validation rules)
- API endpoints needed
- Database tables

Do not write code yet.
```

---

#### Advanced: End-to-End Feature Architecture
```
[PROD] Design and implement full brand kit management system for FlashFusion.

Requirements:
- CRUD operations (create, read, update, delete)
- Versioning (track changes, rollback)
- Sharing (public links, permissions)
- Validation (WCAG, licensing, quality)
- Analytics (usage metrics, performance)

Scale:
- 50K creators
- 200K brand kits
- 1M products using brand kits
- 100K+ concurrent users

Deliverable:
- System architecture (diagram + description)
- Database schema (optimized for scale)
- API design (REST or GraphQL)
- Security model (RLS, permissions)
- Performance strategy (caching, CDN)
- Monitoring plan (metrics, alerts)
- Testing strategy (unit, integration, E2E)
- Deployment plan (rollout, rollback)

Use: staff-engineer-v3 skill
```

---

### 3.3 Code Optimization (3 Levels)

#### Beginner: Simple Query Optimization
```
[PROD] Optimize this SQL query:

```sql
SELECT * FROM users WHERE email LIKE '%@gmail.com';
```

Current: 8 seconds on 1M rows
Target: <500ms

Deliverable: Optimized query + explanation
```

---

#### Intermediate: Function Performance
```
[PROD] Optimize this TypeScript function:

```typescript
function findDuplicates(arr: number[]): number[] {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}
```

Current: O(n³) → 10 seconds on 100K elements
Target: <100ms

Deliverable:
- Optimized implementation
- Time complexity analysis (before/after)
- Benchmark results
```

---

#### Advanced: System-Wide Performance
```
[PROD] Optimize FlashFusion product listing page.

Current metrics:
- Time to First Byte (TTFB): 2.5s
- First Contentful Paint (FCP): 3.2s
- Largest Contentful Paint (LCP): 5.8s
- Total page load: 8.3s
- Database queries: 47 per page load

Target: Lighthouse score 90+
- TTFB: <500ms
- FCP: <1s
- LCP: <2.5s

Stack: Next.js 15, Supabase, Vercel

Deliverable:
- Bottleneck analysis (what's slow?)
- Optimization strategy (caching, lazy loading, query optimization)
- Implementation plan (prioritized changes)
- Before/after metrics
- Monitoring setup (track regressions)
```

---

### 3.4 Documentation (3 Levels)

#### Beginner: Function Documentation
```
[PROD] Add JSDoc comments to this function:

```typescript
function validateBrandKit(brandKit) {
  const errors = [];
  if (!brandKit.colors || brandKit.colors.length < 2) {
    errors.push('Need at least 2 colors');
  }
  // ... more validation
  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
```

Include: Description, params, return value, example usage
```

---

#### Intermediate: API Documentation
```
[PROD] Generate OpenAPI 3.0 spec for FlashFusion Brand Kits API.

Endpoints:
- POST /api/v1/brand-kits (create)
- GET /api/v1/brand-kits/:id (read)
- PUT /api/v1/brand-kits/:id (update)
- DELETE /api/v1/brand-kits/:id (delete)
- GET /api/v1/brand-kits (list)

Include:
- Request/response schemas
- Authentication requirements
- Error responses (400, 401, 403, 404, 500)
- Examples (cURL, JavaScript, Python)
- Rate limits
```

---

#### Advanced: Architecture Documentation
```
[PROD] Create Architecture Decision Record (ADR) for database choice.

Context: FlashFusion needs to choose between:
1. PostgreSQL (Supabase)
2. MongoDB
3. DynamoDB

Decision criteria:
- Cost (budget: $500/month)
- Scale (50K creators, 1M products)
- Features (RLS, real-time, full-text search)
- Ops burden (prefer managed)
- Developer experience (team knows SQL)

ADR format:
- Title: ADR-001: Database Selection for FlashFusion
- Status: Proposed / Accepted / Deprecated
- Context: Why this decision is needed
- Decision: What we chose and why
- Consequences: Positive + Negative
- Alternatives Considered: Other options with trade-offs

Use: staff-engineer-v3 skill
```

---

### 3.5 Troubleshooting (3 Levels)

#### Beginner: Error Message Debugging
```
[SPIKE] Explain this error:

```
TypeError: Cannot read property 'id' of undefined
  at getUserProfile (auth.ts:42)
```

Code:
```typescript
function getUserProfile(userId) {
  const user = users.find(u => u.id === userId);
  return user.id;  // Line 42
}
```

Output: Cause + fix (1 paragraph)
```

---

#### Intermediate: Performance Issue
```
[PROD] Debug slow API response:

Symptom: /api/brand-kits endpoint takes 8 seconds
Expected: <500ms

Logs:
```
[12:34:56] GET /api/brand-kits
[12:34:56] Database query started
[12:35:04] Database query completed (8.2s)
[12:35:04] Response sent
```

Schema:
```sql
CREATE TABLE brand_kits (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id),
  name TEXT,
  colors JSONB,
  created_at TIMESTAMP
);
-- No indexes except primary key
```

Deliverable:
- Root cause analysis
- Fix (with explain plan)
- Testing approach (verify fix works)
```

---

#### Advanced: Production Incident
```
[PROD] Incident response for FlashFusion outage.

Timeline:
- 14:00: Alert triggered (95% of API requests timing out)
- 14:05: Database CPU at 100%, queries piling up
- 14:10: You're on call, just paged

Available info:
- Logs: SELECT queries on brand_kits table spiking (10x normal)
- Metrics: 50K active users (2x normal peak)
- Recent changes: Deployed new "Trending Brand Kits" feature 2 hours ago
- Stakeholders: CEO asking for ETA on fix

Your response:
1. Immediate mitigation (stabilize system)
2. Root cause analysis (what triggered this?)
3. Resolution steps (permanent fix)
4. Communication plan (CEO, users, team)
5. Prevention measures (avoid recurrence)
6. Postmortem outline (document lessons)

Use: staff-engineer-v3 skill
```

---

## PART 4: REAL-WORLD SCENARIOS

### 4.1 FlashFusion RLS Audit

```
[PROD] Comprehensive RLS (Row-Level Security) audit for FlashFusion.

Current RLS policies (Supabase):

```sql
-- brand_kits table
CREATE POLICY "Users can read own brand kits"
  ON brand_kits FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users can insert own brand kits"
  ON brand_kits FOR INSERT
  WITH CHECK (creator_id = auth.uid());

-- products table
CREATE POLICY "Users can read own products"
  ON products FOR SELECT
  USING (creator_id = auth.uid());
```

Tables:
- creators (user profiles)
- brand_kits (brand assets)
- products (published items)
- orders (customer purchases)
- analytics (usage metrics)

Audit scope:
1. Verify all tables have RLS enabled
2. Check for policy gaps (missing CRUD operations)
3. Test for authorization bypasses
4. Validate policy performance (any slow queries?)
5. Compliance check (GDPR data isolation)

Deliverable:
- Policy coverage matrix (table × operation)
- Vulnerability findings (severity-rated)
- Performance issues (query plans)
- Compliance gaps (GDPR, SOC 2)
- Remediation plan (prioritized fixes)

Test cases:
- Can user A read user B's brand kits?
- Can user modify another's products?
- Can analytics be accessed without auth?
```

---

### 4.2 GitHub Copilot Memory Optimization

```
[PROD] Optimize my GitHub Copilot memory for maximum effectiveness.

Current memory entries: 108 (at limit)

Categories:
1. Security frameworks (15 entries)
2. Code patterns (25 entries)
3. FlashFusion stack (20 entries)
4. Validation rules (18 entries)
5. Error handling (12 entries)
6. Architecture patterns (10 entries)
7. Miscellaneous (8 entries)

Goals:
- Keep most valuable entries
- Remove redundant/stale entries
- Optimize for: Security reviews, FlashFusion development, architecture design
- Stay within 200 char limit per entry

Your task:
1. Identify top 20 most valuable entries (why?)
2. Merge redundant entries (combine similar patterns)
3. Remove stale entries (no longer relevant)
4. Suggest 5 new high-value entries
5. Final optimized list (108 entries, prioritized)

Output format:
```json
{
  "keep": ["Entry 1", "Entry 2", ...],
  "merge": [{"old": ["A", "B"], "new": "Combined AB"}],
  "remove": ["Stale 1", "Stale 2", ...],
  "add": ["New 1", "New 2", ...],
  "final_list": ["1. ...", "2. ...", ...]
}
```
```

---

### 4.3 n8n Workflow Security Review

```
[PROD] Security review for n8n workflow: Printify → Shopify/Etsy sync.

Workflow steps:
1. Webhook trigger (FlashFusion creator publishes product)
2. HTTP Request: Fetch product data from FlashFusion API
3. Set Variables: Parse product data (name, images, price)
4. HTTP Request: Create product in Printify
5. HTTP Request: Sync to Shopify
6. HTTP Request: Sync to Etsy
7. HTTP Request: Update FlashFusion (mark as published)
8. Error handler: If any step fails, rollback + notify creator

Credentials:
- FlashFusion API key (stored in n8n)
- Printify API key (stored in n8n)
- Shopify access token (stored in n8n)
- Etsy OAuth token (stored in n8n)

Security concerns:
1. API keys in n8n (encrypted at rest? who has access?)
2. Webhook authentication (how to verify requests from FlashFusion?)
3. Input validation (malicious product data?)
4. Error handling (do errors leak sensitive info?)
5. Rate limiting (what if 1000 products published at once?)
6. Retry logic (infinite retry loops?)
7. Audit trail (can we track who published what?)

Deliverable:
- Threat model (STRIDE)
- Vulnerability findings (with examples)
- Security hardening recommendations
- Compliance check (PCI-DSS for payment data?)
- Monitoring strategy (alert on anomalies)

Use: workflow-automation skill
```

---

### 4.4 Multi-Agent Orchestration Design

```
[SKELETON] Design multi-agent AI orchestration for FlashFusion content generation.

Use case: Generate complete product listing (description + images + tags).

Agents:
1. **Research Agent**: Analyzes product category, competitor listings
2. **Copywriter Agent**: Generates SEO-optimized description (3 variants)
3. **Designer Agent**: Generates product mockup images (AI image gen)
4. **SEO Agent**: Optimizes tags, keywords, meta descriptions
5. **QA Agent**: Reviews all outputs for quality, brand consistency

Workflow:
1. User inputs: Product name, category, target audience
2. Research Agent → Competitor analysis
3. Copywriter Agent → Descriptions (uses research context)
4. Designer Agent → Images (uses description context)
5. SEO Agent → Optimization (uses all context)
6. QA Agent → Final review (approve/revise)

Constraints:
- Total time: <60 seconds end-to-end
- Cost: <$0.50 per product
- Quality: 90% approval rate (measured by creator acceptance)

Technical requirements:
- Agent framework: CrewAI, LangChain, or custom
- LLMs: Claude (Sonnet 4.5 for quality, Haiku 4.5 for speed)
- State management: How do agents share context?
- Error handling: What if one agent fails?
- Monitoring: How to track agent performance?

Deliverable:
- System architecture (diagram + description)
- Agent definitions (role, goal, tools)
- Workflow orchestration (sequence, decision points)
- Context sharing strategy (memory, state)
- Error handling & retry logic
- Cost optimization (caching, model selection)
- Performance metrics (latency, quality, cost)

Use: ai-agents-workflow skill
```

---

### 4.5 Incident Response Protocol

```
[PROD] Create incident response runbook for FlashFusion.

Incident types:
1. **P0** - Production down (100% of users affected)
2. **P1** - Major degradation (>10% users affected, critical feature broken)
3. **P2** - Minor degradation (5-10% users, non-critical feature broken)
4. **P3** - Informational (no user impact, potential future issue)

For each severity level:

**Detection:**
- How do we know? (monitoring, alerts, user reports)
- Who gets paged? (on-call engineer, manager, exec)

**Response:**
- Immediate actions (triage, mitigation, communication)
- Escalation path (who to involve, when)
- Communication templates (status page, Slack, email)

**Resolution:**
- Investigation steps (logs, metrics, database)
- Rollback procedure (if recent deploy caused issue)
- Permanent fix (code change, config update)

**Postmortem:**
- Timeline of events
- Root cause analysis (5 Whys)
- Prevention measures
- Action items (owners, deadlines)

Example scenarios:
1. Database CPU at 100%, all API requests timing out
2. Authentication system down, users can't log in
3. Payment processing failed, 50 orders stuck
4. Security vulnerability discovered in production code

Deliverable:
- Runbook document (step-by-step procedures)
- Contact list (on-call rotation, escalation path)
- Communication templates (ready to copy-paste)
- Testing plan (how to verify runbook works)

Use: staff-engineer-v3 skill
```

---

## PART 5: SELF-ASSESSMENT

### Instructions
1. **Write your prompt** for each scenario (don't look at answers yet)
2. **Compare with expert answer** (provided below)
3. **Score yourself:**
   - ⭐⭐⭐⭐⭐ (5/5): Expert-level prompt
   - ⭐⭐⭐⭐ (4/5): Strong prompt, minor gaps
   - ⭐⭐⭐ (3/5): Good start, needs more specificity
   - ⭐⭐ (2/5): Too vague, missing key elements
   - ⭐ (1/5): Poor prompt, needs major rework

---

### Practice Prompt 1: Quick Security Review

**Scenario:** You have a 20-line authentication function. You need a quick security check before committing.

**Your prompt:**
```
[Write your prompt here before looking at answer]
```

<details>
<summary>Click to see expert answer</summary>

```
[SPIKE] Quick security check before commit:

```python
def authenticate(username, password):
    user = db.query(f"SELECT * FROM users WHERE username='{username}'")
    if user and user['password'] == password:
        session['user_id'] = user['id']
        return True
    return False
```

Focus: Top 3 critical issues only (we'll do full review in PR)

Output: Bullet list (Issue + 1-sentence fix)
```

**Why it's good:**
- [SPIKE] sets expectations (quick, not comprehensive)
- Actual code provided (not "some auth function")
- Clear scope: "Top 3 critical issues"
- Clear format: Bullet list
- Acknowledges follow-up: "full review in PR"
</details>

---

### Practice Prompt 2: Database Query Optimization

**Scenario:** A query is taking 8 seconds. You need to optimize it.

**Your prompt:**
```
[Write your prompt here]
```

<details>
<summary>Click to see expert answer</summary>

```
[PROD] Optimize this Supabase query for FlashFusion product listing page.

Current query:
```sql
SELECT p.*, bk.name as brand_kit_name, c.username as creator_name
FROM products p
JOIN brand_kits bk ON p.brand_kit_id = bk.id
JOIN creators c ON bk.creator_id = c.id
WHERE p.status = 'published'
ORDER BY p.created_at DESC
LIMIT 20;
```

Problem:
- Current: 8.2 seconds on 1M products
- Target: <500ms (acceptable: <1s)

Context:
- products table: 1M rows
- brand_kits table: 200K rows
- creators table: 50K rows
- Current indexes: Primary keys only (id columns)

Deliverable:
1. EXPLAIN ANALYZE output analysis (what's slow?)
2. Recommended indexes (CREATE INDEX statements)
3. Query optimization (rewrite if needed)
4. Expected improvement (based on explain plan)
5. Migration script (safe to run on prod)

Success criteria: p95 latency <500ms in production
```

**Why it's good:**
- [PROD] signals this needs production-ready solution
- Exact query provided (not "a slow query")
- Current performance + target clearly stated
- Context (table sizes, existing indexes)
- Specific deliverables (5 items)
- Success criteria measurable
</details>

---

### Practice Prompt 3: Architecture Design

**Scenario:** You need to design a caching layer for FlashFusion.

**Your prompt:**
```
[Write your prompt here]
```

<details>
<summary>Click to see expert answer</summary>

```
[SKELETON] Design caching strategy for FlashFusion.

Current state:
- Every page load hits database (200ms avg latency)
- Product listings: 50 queries per page
- Brand kits: 20 queries per page
- User profiles: 10 queries per page

Problems:
- Database CPU spiking during peak (50K users)
- Slow page loads (2-3s total)
- High costs (Supabase charges per request)

Requirements:
- Reduce database load by 80%
- Improve page load to <1s
- Stay within $500/month budget
- Invalidation strategy (stale data <5 min acceptable)

Options to consider:
- Redis (managed: Upstash? Self-hosted?)
- Vercel Edge Cache
- Browser cache (Cache-Control headers)
- React Query (client-side)
- CDN (Cloudflare? Cloudinary?)

Deliverable:
- System diagram (show cache layers)
- Cache strategy by content type (what to cache, TTL)
- Invalidation approach (when to bust cache)
- Cost estimate breakdown
- Implementation roadmap (phases, milestones)

Do NOT implement yet. Architecture design only.

Use: staff-engineer-v3 skill
```

**Why it's good:**
- [SKELETON] = architecture only, no code
- Current state clearly described
- Problems quantified
- Requirements measurable
- Options listed (but not prescriptive)
- Explicit "do not implement"
- Skill referenced for best practices
</details>

---

### Practice Prompt 4: Incident Triage

**Scenario:** You're on-call. Alert: "API error rate 15% (normally <0.1%)". What's your first prompt to Claude?

**Your prompt:**
```
[Write your prompt here]
```

<details>
<summary>Click to see expert answer</summary>

```
[PROD] Incident triage: API error rate spike (15%, normally <0.1%)

Current situation:
- Time: 2:34am (just paged)
- Duration: Started 10 minutes ago (2:24am)
- Affected: /api/brand-kits endpoints
- Error: 500 Internal Server Error
- Recent changes: Deployed new RLS policy 2 hours ago (12:30am)

Available data:
- Sentry: 500 errors, stack trace shows Supabase timeout
- Datadog: Database query latency spiked from 50ms → 5s
- Supabase dashboard: Query logs available

Immediate need:
1. Assess severity (P0/P1/P2/P3?)
2. Identify likely root cause (RLS policy change?)
3. Suggest mitigation (rollback? disable feature?)
4. Communication plan (who to notify, what to say)

Constraints:
- CEO is asleep, don't wake unless P0
- Can rollback deploy (takes 5 min)
- No direct database access (Supabase only)

Deliverable: 5-minute action plan with decision tree
```

**Why it's good:**
- [PROD] signals urgency, need real solution
- Context rich: time, duration, affected systems
- Recent changes flagged (likely culprit)
- Available data listed (Sentry, Datadog, logs)
- Immediate needs clear (4 specific items)
- Constraints acknowledged (who to wake, rollback time)
- Tight deadline: "5-minute action plan"
</details>

---

### Practice Prompt 5: Code Refactoring

**Scenario:** Legacy code, 200 lines, needs refactoring. What's your prompt?

**Your prompt:**
```
[Write your prompt here]
```

<details>
<summary>Click to see expert answer</summary>

```
[PROD] Refactor legacy authentication module.

Current code: [paste 200-line file]

Problems:
- 200 lines in one function (should be 5-6 functions)
- No error handling (crashes on null)
- Hardcoded secrets (API keys in code)
- No tests (can't verify refactor doesn't break)
- Poor naming (var x, y, z)

Goals:
- Break into smaller functions (each <30 lines)
- Add error handling (Cause → Fix → Retry)
- Move secrets to env vars
- Maintain exact same behavior (output identical)
- Add unit tests (≥80% coverage)

Constraints:
- Can't change API (other code depends on this)
- Must be backwards compatible
- Ship incrementally (PR 1: extract functions, PR 2: tests, PR 3: secrets)

Deliverable:
1. Refactored code (multiple files if needed)
2. Migration plan (how to deploy safely)
3. Test suite (verify behavior unchanged)
4. Documentation (explain new structure)

Use: staff-engineer-v3 skill
```

**Why it's good:**
- [PROD] = production-quality refactor
- Code provided (paste actual 200 lines)
- Problems enumerated (5 specific issues)
- Goals measurable (function size, coverage %)
- Constraints acknowledged (API compatibility)
- Incremental approach (3 PRs)
- Skill referenced
</details>

---

### Continue with 15 more practice prompts...

**Practice Prompt 6:** API Documentation  
**Practice Prompt 7:** Performance Debugging  
**Practice Prompt 8:** Feature Specification  
**Practice Prompt 9:** Security Threat Model  
**Practice Prompt 10:** Database Migration  
**Practice Prompt 11:** CI/CD Pipeline  
**Practice Prompt 12:** Load Testing  
**Practice Prompt 13:** Error Message Improvement  
**Practice Prompt 14:** Code Review  
**Practice Prompt 15:** Compliance Audit  
**Practice Prompt 16:** Monitoring Setup  
**Practice Prompt 17:** Disaster Recovery  
**Practice Prompt 18:** API Rate Limiting  
**Practice Prompt 19:** Multi-Tenancy Design  
**Practice Prompt 20:** Postmortem Report  

---

## FINAL ASSESSMENT

### Scoring Rubric

**Total Score = Average of 20 prompts**

| Score | Level | What it means |
|-------|-------|---------------|
| 4.5-5.0 | **Expert** | You write production-grade prompts consistently |
| 4.0-4.4 | **Advanced** | Strong prompts, occasional minor gaps |
| 3.5-3.9 | **Intermediate** | Good foundation, needs more specificity |
| 3.0-3.4 | **Developing** | Basic structure, significant gaps |
| <3.0 | **Beginner** | Needs foundational work on prompt structure |

### What to do next:

**If Expert (4.5-5.0):**
- ✅ You're ready for production use
- Focus on domain-specific optimization (FlashFusion workflows, security patterns)
- Share your expertise (teach others on team)

**If Advanced (4.0-4.4):**
- ✅ Strong fundamentals
- Practice weakest areas (security? architecture? documentation?)
- Review expert answers for patterns you missed

**If Intermediate (3.5-3.9):**
- ⚠️ Need more practice
- Revisit Part 1 (Foundations)
- Focus on: Being specific, providing context, showing examples

**If Developing (<3.5):**
- ⚠️ Foundational work needed
- Re-read this entire guide
- Practice 5 prompts per day for 1 week
- Compare your prompts to expert answers
- Identify your weakest principle (specificity? context? format?)

---

## QUICK REFERENCE CARD

**Bookmark this section for daily use:**

### Framework Selector

| Situation | Framework | Example |
|-----------|-----------|---------|
| Single task, clear scope | R-I-S-E | "Act as security expert. Given [code]. Stop at analysis. Deliver findings list." |
| Multi-step process | F-L-O-W | "Focus: Zero downtime. Layers: [1-6]. Outcomes: [metrics]. Waypoints: [checkpoints]" |
| Need adversarial thinking | Perspective Mirror | "How would attacker break this? (STRIDE)" |
| Quick prototype | [SPIKE] | "[SPIKE] Proof of concept for X" |
| Production-ready | [PROD] | "[PROD] Ship-ready implementation with tests" |
| Challenge assumptions | [SKEPTIC] | "[SKEPTIC] Attack every decision in this design" |

### Quality Checklist (Before Sending)

- [ ] **Specific:** Not "fix this" but "optimize for <metric>"
- [ ] **Context:** Tech stack, scale, constraints provided
- [ ] **Boundaries:** Scope prefix (SPIKE/PROD/etc.)
- [ ] **Examples:** Format/style shown
- [ ] **Success criteria:** Measurable outcomes
- [ ] **Focused:** ONE question (not 3-4 unrelated)

**Score: 6/6 = Excellent, 4-5/6 = Good, 0-3/6 = Needs work**

---

**Related Guides:**
- Personal Quick Reference (daily shortcuts)
- Platform Setup (web, mobile, CLI, API)
- Extensions & Integrations (VS Code, Slack, Zapier)

**Last Updated:** December 11, 2025  
**Maintained By:** Kyle  
**Version:** 1.0.0
