export const STRATEGY_DATA = {
  stats: [
    {
      id: 'adoption',
      label: 'Market Adoption',
      value: '82%',
      subtext: 'of F500 using GenAI in prod',
      trend: '+14% YoY',
      color: 'emerald'
    },
    {
      id: 'productivity',
      label: 'Avg. Productivity',
      value: '2.5h',
      subtext: 'saved per employee / week',
      trend: 'Validated',
      color: 'amber'
    },
    {
      id: 'performance',
      label: 'High Performers',
      value: '3.8x',
      subtext: 'faster at complex tasks',
      trend: 'McKinsey',
      color: 'blue'
    },
    {
      id: 'risk',
      label: 'Risk Assessment',
      value: 'Low',
      subtext: 'for Tier 1 deployment',
      trend: 'ISO 27001',
      color: 'purple'
    }
  ],
  recommendations: [
    {
      tier: 'Tier 1',
      title: 'Enterprise Foundation',
      models: ['Claude 3.5 Sonnet', 'GPT-4o'],
      color: 'bg-[#E97132]',
      description: 'Approved for wide-scale internal deployment. High security, consistent performance, and SLA backing.',
      useCases: [
        "General knowledge assistant",
        "Coding copilot (IDE)",
        "Document summarization"
      ]
    },
    {
      tier: 'Tier 2',
      title: 'Specialized / Pilot',
      models: ['Mistral Large 2', 'Gemini 1.5 Pro'],
      color: 'bg-blue-600',
      description: 'Approved for specific business units or pilot programs. May have unique strengths (context window, pricing).',
      useCases: [
        "Long-context analysis (2M+)",
        "Cost-sensitive batch processing",
        "Specific language support"
      ]
    },
    {
      tier: 'Tier 3',
      title: 'Experimental / R&D',
      models: ['Llama 3 400B (Preview)', 'O1 Reasoning'],
      color: 'bg-slate-600',
      description: 'Restricted to R&D sandbox. Not approved for production or customer data yet.',
      useCases: [
        "Complex reasoning research",
        "Self-hosted model tuning",
        "Future capability testing"
      ]
    }
  ],
  sources: {
    primary: [
      { name: 'McKinsey (2025)', desc: '"The Economic Potential of Generative AI" - Updated Q4 estimates on productivity impact.' },
      { name: 'Gartner Magic Quadrant', desc: 'Enterprise Conversational AI Platforms (2025).' },
      { name: 'Internal Benchmark', desc: 'INT Inc. "Project Velocity" Audit (N=500 users).' }
    ],
    secondary: [
      { name: 'Security Compliance', desc: 'Review against ISO 27001 and SOC 2 Type II controls.' },
      { name: 'Cost Analysis', desc: 'Based on current API pricing per 1M tokens (blended input/output).' }
    ]
  }
};
