import { FAQItem } from '../types';

export const faqData: FAQItem[] = [
  {
    id: 'faq-001',
    level: 'beginner',
    question: 'What exactly is Claude?',
    answer: `Claude is an AI assistant created by Anthropic. Think of it as an expert colleague who:
• Answers questions across any domain
• Generates text, code, and documents
• Analyzes documents you upload
• Searches the web for current information
• Remembers facts about you
• Never stores your data after conversations (ZDR enabled)

**Note:** Claude is NOT a replacement for human judgment, especially for decisions >$10K.`,
    tags: ['basics', 'introduction', 'zdr', 'security'],
    relatedQuestions: ['faq-002', 'faq-003']
  },
  {
    id: 'faq-002',
    level: 'beginner',
    question: 'How do I know Claude isn\'t making things up?',
    answer: `Claude sometimes hallucinates (invents plausible-sounding facts). Protect yourself:
• Ask Claude: "What are you uncertain about?"
• Verify important facts (cross-check with web search)
• Request citations for claims
• Test code before relying on it
• Use for acceleration, not final answers

**Remember:** Claude is a productivity tool, not a source of truth.`,
    tags: ['hallucination', 'accuracy', 'verification', 'safety'],
    relatedQuestions: ['faq-001', 'faq-005']
  },
  {
    id: 'faq-003',
    level: 'beginner',
    question: 'Can I trust Claude with confidential data?',
    answer: `With INT Inc's ZDR settings:
✅ **Safe:** General work questions, internal processes
⚠️ **Careful:** Anonymize customer data (use "Customer X" not real names)
❌ **Never:** API keys, credentials, raw customer contracts, SSNs

**Rule of thumb:** If it's confidential, redact or anonymize before pasting.`,
    tags: ['security', 'confidentiality', 'zdr', 'data-protection'],
    relatedQuestions: ['faq-001', 'faq-010']
  },
  {
    id: 'faq-004',
    level: 'beginner',
    question: 'How does memory work? Will Claude remember me forever?',
    answer: `Memory timeline:
• Day 1: You create memory ("I work in Sales")
• Days 2-30: Claude remembers across conversations
• Day 31: Memory auto-deletes (compliance with ZDR)
• You can manually delete anytime

Memory is isolated per role (Sales Claude ≠ Finance Claude).`,
    tags: ['memory', 'privacy', 'retention', 'rbac'],
    relatedQuestions: ['faq-003', 'faq-007']
  },
  {
    id: 'faq-005',
    level: 'intermediate',
    question: 'How do I use web search without hallucinating?',
    answer: `Best practices:
1. Enable web search explicitly
2. Ask specific questions with date ranges: "Search for SaaS trends Q4 2025"
3. Evaluate sources (Reuters > Medium)
4. Cross-check conflicting results
5. Use for current data; for static facts, rely on knowledge

**Example:** "Search for latest GDPR enforcement actions 2024-2025. Exclude opinion pieces."`,
    tags: ['web-search', 'accuracy', 'sources', 'verification'],
    relatedQuestions: ['faq-002', 'faq-006']
  },
  {
    id: 'faq-006',
    level: 'intermediate',
    question: 'What\'s the difference between artifacts and regular output?',
    answer: `**Use artifacts when:**
• Code is >20 lines
• You want to download/version
• You want to edit and iterate
• You'll share with others

**Use regular output for:**
• Quick answers
• Snippets
• Explanations
• One-off analysis`,
    tags: ['artifacts', 'output', 'workflow', 'efficiency'],
    relatedQuestions: ['faq-007', 'faq-008']
  },
  {
    id: 'faq-007',
    level: 'intermediate',
    question: 'I uploaded a file. What can Claude see?',
    answer: `Claude analyzes file content based on type:
• **PDF:** Extracts text and images
• **DOCX:** Reads content, formatting, comments
• **CSV/Excel:** Parses data into table format
• **Code files:** Reads source code
• **Images:** Analyzes visual content

Files are NOT stored permanently (ZDR); temporary for analysis only.`,
    tags: ['files', 'upload', 'privacy', 'analysis'],
    relatedQuestions: ['faq-003', 'faq-006']
  },
  {
    id: 'faq-008',
    level: 'intermediate',
    question: 'Can Claude help me learn to code?',
    answer: `Yes, excellent for learning:
• Write code snippets; Claude explains each line
• Ask "Why does this work?"
• Request variations: "Show me 3 ways to solve this"
• Build incrementally: Start simple, add complexity
• Use code execution to see results

**Example:** "Show me a Python function that validates email addresses. Explain the regex pattern step-by-step."`,
    tags: ['learning', 'code', 'education', 'programming'],
    relatedQuestions: ['faq-009', 'faq-012']
  },
  {
    id: 'faq-009',
    level: 'advanced',
    question: 'How do I optimize token usage to save costs?',
    answer: `Token usage strategies:
1. **Be specific:** Vague questions use more tokens
2. **Summarize files:** "Summarize this PDF, then answer" (vs pasting all content)
3. **Batch requests:** Ask multiple related questions at once
4. **Use artifacts:** Iterate in artifact instead of re-pasting
5. **Cache context:** If uploading same file repeatedly, use API caching
6. **Reuse memory:** Store preferences; don't repeat explanations

**Budget:** 1 token ≈ 4 characters. INT Inc limit: ~50K tokens/conversation.`,
    tags: ['cost', 'optimization', 'tokens', 'efficiency'],
    relatedQuestions: ['faq-011', 'faq-006']
  },
  {
    id: 'faq-010',
    level: 'advanced',
    question: 'How do I prevent Claude from being used maliciously?',
    answer: `Security layers:
• **RBAC:** Only authorized users can access features
• **Rate limiting:** 20 req/min prevents abuse
• **DLP monitoring:** Sensitive data flagged
• **Audit logging:** All interactions logged for review
• **Memory isolation:** Users can't see others' conversations
• **Escalation gates:** High-risk decisions require human approval

**Your responsibility:** Don't share your API key; don't use Claude for unauthorized purposes.`,
    tags: ['security', 'compliance', 'rbac', 'audit'],
    relatedQuestions: ['faq-003', 'faq-012']
  },
  {
    id: 'faq-011',
    level: 'advanced',
    question: 'What\'s the maximum context window for Claude?',
    answer: `Claude supports large context:
• **Sonnet 4.5:** 200K tokens (≈150,000 words)
• **Opus 4.1:** 200K tokens
• **Haiku 4.5:** 200K tokens

Practical limit for INT Inc: Keep conversations <50K tokens (to stay under cost budget).

**Use case:** Upload entire codebase (100K+ lines) + ask questions. Claude can analyze it all at once.`,
    tags: ['tokens', 'context', 'limits', 'capacity'],
    relatedQuestions: ['faq-009', 'faq-007']
  },
  {
    id: 'faq-012',
    level: 'advanced',
    question: 'How do I handle Claude hallucinations in production systems?',
    answer: `Hallucination mitigation:
1. **Human review:** For all critical outputs
2. **Deterministic validation:** Check outputs against known facts
3. **Source attribution:** Require Claude to cite sources
4. **Confidence scoring:** Ask Claude to rate confidence (0-100%)
5. **Fallback logic:** If Claude says "I'm not sure", use alternative
6. **Monitoring:** Track false positives; retrain if needed

**Example (financial system):** Claude generates expense categorization → System validates against company GL → If mismatch, escalate to human.`,
    tags: ['hallucination', 'production', 'validation', 'accuracy'],
    relatedQuestions: ['faq-002', 'faq-010']
  }
];
