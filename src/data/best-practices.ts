export const bestPracticesData = {
  prompting: [
    {
      id: 'prompt-bp-1',
      title: 'Be Explicit & Specific',
      description: 'Provide clear, detailed instructions rather than vague requests.',
      examples: [
        {
          bad: '"Tell me about sales"',
          good: '"Analyze our Q4 sales pipeline. Show: Deal stage breakdown, won/lost reasons, avg deal size"'
        },
        {
          bad: '"Help me with the code"',
          good: '"Review this authentication function for security issues: [code]. Check for: injection, weak crypto, session handling"'
        }
      ]
    },
    {
      id: 'prompt-bp-2',
      title: 'Provide Context',
      description: 'Give Claude the background information needed to provide relevant answers.',
      examples: [
        {
          bad: '"Should we invest in X?"',
          good: '"We have $500K annual tech budget. Should we invest in tool X ($50K/year, expected ROI 3:1 in 6 months)? Consider: our current tooling, team bandwidth, compliance needs"'
        }
      ]
    },
    {
      id: 'prompt-bp-3',
      title: 'Show What You Want',
      description: 'Specify the exact format and structure you need.',
      examples: [
        {
          bad: '"Create a report"',
          good: `"Create a report with sections:
1. Executive Summary (1 paragraph)
2. Key Findings (3-5 bullet points)
3. Recommendations (with evidence)
4. Timeline (implement in next 30 days)"`
        }
      ]
    },
    {
      id: 'prompt-bp-4',
      title: 'Ask Follow-Ups, Not New Chats',
      description: 'Continue conversations to maintain context and efficiency.',
      examples: [
        {
          bad: 'Starting new chat for each related question',
          good: 'Using follow-ups in the same conversation to build on previous context'
        }
      ]
    }
  ],
  security: [
    {
      id: 'security-bp-1',
      title: 'Never Paste Secrets',
      description: 'Always use environment variables for credentials.',
      examples: [
        {
          bad: 'db = connect(url="postgresql://user:password@prod.int-inc.com")',
          good: 'db = connect(url=os.getenv("DATABASE_URL"))'
        }
      ]
    },
    {
      id: 'security-bp-2',
      title: 'Redact Customer Data',
      description: 'Anonymize customer information in prompts.',
      examples: [
        {
          bad: '"Analyze this deal: Acme Corp, $250K, contact john@acme.com, closes Jan 15"',
          good: '"Analyze this deal: Enterprise customer, $250K mid-market, concern: budget uncertainty, timeline: 30 days"'
        }
      ]
    },
    {
      id: 'security-bp-3',
      title: 'Verify Web Search Results',
      description: 'Always validate information from web searches.',
      tips: [
        'Check source credibility (official sites > blogs > social media)',
        'Cross-reference multiple sources for important claims',
        'Flag if sources contradict',
        'Distinguish between news/opinion/analysis'
      ]
    }
  ],
  workflow: [
    {
      id: 'workflow-bp-1',
      title: 'Time Management',
      description: 'Structure long processes with clear steps.',
      approach: [
        'Initial summary: "I\'ll analyze this in 3 steps: (1) extract data, (2) identify trends, (3) recommend actions"',
        'Show progress: "Step 1 complete. Here\'s what I found..."',
        'Confirm before continuing: "Is this direction correct? Should I continue with step 2?"'
      ]
    },
    {
      id: 'workflow-bp-2',
      title: 'Leverage Artifacts for Iteration',
      description: 'Use artifacts to iterate efficiently.',
      process: [
        'Ask Claude to create artifact',
        'Claude shows code; you review',
        'Request changes: "Update line 5 to use X instead of Y"',
        'Claude updates artifact',
        'Download when done'
      ]
    },
    {
      id: 'workflow-bp-3',
      title: 'Use Memory for Workflows',
      description: 'Save repeatable processes in memory.',
      example: `"Remember: When I ask for RFP analysis, provide:
1. Executive summary (1 page)
2. Risks (with mitigation)
3. Pricing concerns
4. Recommended responses"

Claude: ✅ Saved. I'll use this format for all future RFP analyses.`
    }
  ]
};
