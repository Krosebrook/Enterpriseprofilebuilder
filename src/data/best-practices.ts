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
    },
    {
      id: 'prompt-bp-5',
      title: 'Use Persona Adoption',
      description: 'Ask Claude to adopt a specific role to tailor the output tone and expertise.',
      examples: [
        {
          good: '"Act as a Senior React Engineer. Review this code for performance optimizations."'
        },
        {
          good: '"Act as a Marketing Director. Critique this email copy for brand alignment."'
        }
      ]
    }
  ],
  advanced_techniques: [
    {
      id: 'adv-bp-1',
      title: 'Chain-of-Thought Prompting',
      description: 'Ask Claude to "think step-by-step" before answering to improve reasoning accuracy.',
      examples: [
        {
          good: '"Before answering, think step-by-step about the potential edge cases in this logic. Then provide the solution."'
        }
      ]
    },
    {
      id: 'adv-bp-2',
      title: 'Few-Shot Prompting',
      description: 'Provide examples of input and desired output to guide Claude\'s format.',
      examples: [
        {
          good: `User: "Convert these dates:
Input: 2023-01-01 -> Output: Jan 1, 2023
Input: 2023-12-25 -> Output: Dec 25, 2023
Input: 2024-02-14 -> Output: "`
        }
      ]
    },
    {
      id: 'adv-bp-3',
      title: 'XML Tag Structuring',
      description: 'Use XML tags to clearly separate parts of your prompt (instructions, data, examples).',
      examples: [
        {
          good: `<instructions>Analyze this text for sentiment.</instructions>
<text>The product is great, but shipping was slow.</text>`
        }
      ]
    },
    {
      id: 'adv-bp-4',
      title: 'Prefill Claude\'s Response',
      description: 'Start Claude\'s response for it to guide the output format (API only/some interfaces).',
      examples: [
        {
          good: `User: "Write a JSON object with user data."
Assistant: "{"`
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
    },
    {
      id: 'security-bp-4',
      title: 'Least Privilege',
      description: 'Only provide the data necessary for the task, nothing more.',
      examples: [
        {
          bad: 'Uploading the entire database dump',
          good: 'Uploading only the schema and 5 sample rows'
        }
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
    },
    {
      id: 'workflow-bp-4',
      title: 'Batch Processing',
      description: 'Process multiple similar items in one go.',
      example: '"Here are 5 emails. Draft a response for each one based on these criteria: ..."'
    }
  ],
  collaboration: [
    {
      id: 'collab-bp-1',
      title: 'Shared Project Context',
      description: 'Maintain a "Project Context" document that everyone on the team uploads to their Claude chat.',
      examples: [
        {
          good: 'A "Context.md" file with project goals, tech stack, and constraints.'
        }
      ]
    },
    {
      id: 'collab-bp-2',
      title: 'Prompt Library',
      description: 'Share successful prompts with your team in a shared Notion doc or Slack channel.',
    },
    {
      id: 'collab-bp-3',
      title: 'Peer Review with AI',
      description: 'Use Claude to "pre-review" your work before sending it to a human colleague.',
      examples: [
        {
          good: '"Review this PR description. Is it clear enough for a junior engineer to understand?"'
        }
      ]
    }
  ],
  troubleshooting: [
    {
      id: 'trouble-bp-1',
      title: 'When Claude Refuses',
      description: 'If Claude refuses a task due to safety, check if your prompt looked like a jailbreak or sensitive request.',
      actions: [
        'Clarify intent: "I am doing this for a security audit authorized by the CTO."',
        'Rephrase: Remove ambiguous terms that might trigger filters.'
      ]
    },
    {
      id: 'trouble-bp-2',
      title: 'Hallucinations',
      description: 'If Claude invents facts, ask for citations or sources.',
      actions: [
        'Add instruction: "If you don\'t know, say \'I don\'t know\' instead of guessing."',
        'Provide source material: "Answer only based on the attached PDF."'
      ]
    },
    {
      id: 'trouble-bp-3',
      title: 'Getting Stuck in a Loop',
      description: 'If Claude keeps making the same mistake, start a new chat.',
      reason: 'Long context windows can sometimes get "polluted" with bad patterns.'
    }
  ]
};
