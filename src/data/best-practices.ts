import { GlobalBestPractices } from '../types';

export const bestPracticesData: GlobalBestPractices = {
  prompting: [
    {
      id: 'be-specific',
      title: 'Be Specific & Contextual',
      roles: ['All'],
      description: "Claude cannot read your mind. Provide background, format requirements, and audience.",
      examples: [
        {
          bad: "Write an email about the update.",
          good: "Write a polite email to the engineering team announcing the deployment of v2.4.0. Mention the downtime window (2am-3am EST) and thank them for their hard work."
        }
      ]
    },
    {
      id: 'chain-of-thought',
      title: 'Chain of Thought',
      roles: ['Engineering', 'Data Science', 'Product Management'],
      description: "Ask Claude to 'think step-by-step' for complex logic. This improves accuracy.",
      examples: [
        {
          good: "Before giving the final answer, please think step-by-step about the potential edge cases in this code."
        }
      ]
    }
  ],
  advanced_techniques: [
    {
      id: 'few-shot',
      title: 'Few-Shot Prompting',
      description: "Provide examples of input and desired output to guide Claude's format.",
      examples: [
        {
          good: "Convert these dates to ISO format:\nInput: Jan 1, 2023 -> Output: 2023-01-01\nInput: 05/12/24 -> Output: 2024-05-12\nInput: March 4th, 2022 -> Output:"
        }
      ]
    },
    {
      id: 'xml-tags',
      title: 'Use XML Tags for Structure',
      description: "Use tags like <context>, <instructions>, <data> to separate parts of your prompt.",
      examples: [
         {
            good: "<context>You are a financial analyst.</context>\n<data>...</data>\n<instructions>Summarize the data.</instructions>"
         }
      ]
    }
  ],
  security: [
    {
      id: 'no-pii',
      title: 'Zero PII Rule',
      roles: ['Legal', 'HR', 'Customer Support', 'Finance', 'Executive / Leadership'],
      description: "Never input Personally Identifiable Information (SSN, home address) into prompts.",
      examples: [
        {
          bad: "Analyze expenses for John Doe, 123 Main St, SSN: 000-00-0000",
          good: "Analyze expenses for User_A (ID: 59201)"
        }
      ],
      tips: ["Use dummy data for testing", "Redact sensitive info before pasting"]
    }
  ],
  workflow: [
    {
      id: 'iterative-refinement',
      title: 'Iterative Refinement',
      description: "Don't expect perfection in shot one. Treat Claude as a junior colleague who needs feedback.",
      approach: [
        "Draft initial request",
        "Review output",
        "Provide specific feedback ('Make it shorter', 'Fix the bug on line 10')",
        "Final polish"
      ]
    }
  ],
  troubleshooting: [
    {
      id: 'hallucination',
      title: 'Handling Hallucinations',
      description: "If Claude invents facts, ask for citations or sources. If it can't find them, assume it's false.",
      actions: ["Check 'Web Search' is enabled", "Ask 'Are you sure?'", "Ask for a direct quote"]
    }
  ]
};
