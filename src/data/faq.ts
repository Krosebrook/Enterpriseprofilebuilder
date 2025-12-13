import { FaqItem } from '../types';

export const faqData: FaqItem[] = [
  {
    id: 'access-1',
    question: "How do I get access to Claude Enterprise?",
    answer: "Access is provisioned automatically via Okta for all full-time employees. If you cannot log in, please file a ticket with IT Support under 'Software Access'.",
    level: 'beginner',
    tags: ['access', 'login', 'it'],
    relatedQuestions: ['data-retention']
  },
  {
    id: 'data-retention',
    question: "Does Claude store my data?",
    answer: "INT Inc has enabled Zero Data Retention (ZDR) for our enterprise account. This means prompts and completions are NOT stored by Anthropic for training. However, internal audit logs are kept by INT Inc for compliance purposes.",
    level: 'beginner',
    tags: ['privacy', 'security', 'compliance']
  },
  {
    id: 'pii-handling',
    question: "Can I put customer names in Claude?",
    answer: "No. While ZDR is active, our internal policy prohibits PII (Personally Identifiable Information) in prompts to prevent accidental leakage or internal misuse. Use strict role-based aliases (e.g., 'Customer A').",
    level: 'intermediate',
    tags: ['security', 'policy', 'pii'],
    relatedQuestions: ['data-retention']
  },
  {
    id: 'code-sandbox',
    question: "Can the code sandbox access the internet?",
    answer: "No. The code execution environment is sandboxed and air-gapped for security. It cannot make API calls or download external libraries. It has pre-installed standard libraries (pandas, numpy, matplotlib, etc.).",
    level: 'advanced',
    tags: ['technical', 'code', 'limitations']
  },
  {
    id: 'context-window',
    question: "What is the context window limit?",
    answer: "Claude 3.5 Sonnet has a 200k token context window. This is roughly equivalent to 500 pages of text or a medium-sized codebase.",
    level: 'intermediate',
    tags: ['limits', 'tokens', 'technical']
  }
];
