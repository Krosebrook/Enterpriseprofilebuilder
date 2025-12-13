import { FeatureGuide } from '../types';

export const featuresData: FeatureGuide[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: "Real-time access to the internet to fetch up-to-date information, citations, and market data.",
    whenToUse: [
      "Researching latest competitor pricing",
      "Finding recent news about a client",
      "Looking up documentation for a new library",
      "Verifying facts or statistics"
    ],
    whenNotToUse: [
      "Searching for internal INT Inc confidential data",
      "When you need historical data older than 2023 (use memory/knowledge)",
      "When precision is critical (always verify sources)"
    ],
    bestPractices: [
      {
        id: 'specific-queries',
        title: 'Be Specific with Queries',
        description: "Claude searches better with specific questions than broad topics.",
        examples: {
          bad: "Tell me about AI news",
          good: "What are the latest regulatory updates for AI in the EU from the last month?"
        }
      }
    ],
    examples: [
      {
        id: 'competitor-analysis',
        title: 'Competitor Pricing Research',
        description: "Finding pricing tiers for a competitor.",
        output: "Based on the search results from [Source A] and [Source B], Competitor X's pricing is:\n- Starter: $10/mo\n- Pro: $29/mo\n- Enterprise: Contact Sales\n\nNote: They recently raised prices in Jan 2025."
      }
    ]
  },
  {
    id: 'artifacts',
    name: 'Artifacts',
    description: "Dedicated window for generating and editing substantial content like code, documents, and diagrams.",
    whenToUse: [
      "Writing a long blog post or email draft",
      "Generating a React component",
      "Creating a mermaid.js diagram",
      "Drafting a legal contract"
    ],
    whenNotToUse: [
      "Short answers or conversational replies",
      "When you just need a quick fact"
    ],
    bestPractices: [
      {
        id: 'iterate-artifacts',
        title: 'Iterate on Artifacts',
        description: "Ask Claude to update the existing artifact rather than creating a new one.",
        examples: {
          good: "Update the React component artifact to include a loading state."
        }
      }
    ],
    examples: [
      {
        id: 'react-component',
        title: 'React Component Generation',
        description: "Creating a button component.",
        code: "export function Button({ label }) { return <button>{label}</button>; }",
        output: "(Displays a rendered Button component in the Artifact panel)"
      }
    ]
  },
  {
    id: 'memory',
    name: 'Project Memory',
    description: "Persistent context storage for a project or role. Remembers preferences, docs, and style guides.",
    whenToUse: [
      "Storing brand voice guidelines",
      "Keeping track of project dependencies",
      "Remembering user-specific acronyms"
    ],
    whenNotToUse: [
      "Storing passwords or PII (never!)",
      "Storing massive datasets (use files instead)"
    ],
    bestPractices: [
      {
        id: 'update-memory',
        title: 'Explicitly Manage Memory',
        description: "Tell Claude what to remember and what to forget.",
        examples: {
          good: "Remember that for this project, we always use Tailwind CSS."
        }
      }
    ],
    examples: []
  },
  {
    id: 'code-execution',
    name: 'Code Execution (Analysis)',
    description: "A secure sandbox where Claude can write and run Python code to analyze data or solve math problems.",
    whenToUse: [
      "Analyzing a CSV file uploaded by the user",
      "Calculating complex financial projections",
      "Creating data visualizations (matplotlib)"
    ],
    whenNotToUse: [
      "Running production application code",
      "Network requests (sandbox has no internet)"
    ],
    bestPractices: [
       {
          id: 'inspect-code',
          title: 'Inspect the Code',
          description: "Always review the Python code Claude wrote to ensure logic is sound.",
          examples: { good: "Can you explain how the linear regression was calculated in the code?" }
       }
    ],
    examples: [
       {
          id: 'csv-analysis',
          title: 'Analyze Sales Data',
          description: "Upload sales.csv and find average order value.",
          code: "import pandas as pd\ndf = pd.read_csv('sales.csv')\nprint(df['amount'].mean())",
          output: "145.20"
       }
    ],
    limitations: ["No internet access", "Libraries limited to standard data science stack (pandas, numpy, etc)"]
  }
];
