export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'md' | 'url';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'indexed' | 'processing' | 'error';
  tags: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
}

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'kb-1',
    title: 'Getting Started with Claude Prompting',
    content: 'Learn the fundamentals of effective prompt engineering with Claude. This guide covers basic prompt structure, role assignment, and how to get the best results from your AI assistant.',
    category: 'prompting',
    tags: ['basics', 'getting-started', 'prompts'],
    readTime: '5 min'
  },
  {
    id: 'kb-2',
    title: 'Security Best Practices for Enterprise AI',
    content: 'Comprehensive guide to securing your AI implementations. Covers data privacy, access controls, audit logging, and compliance requirements for enterprise deployments.',
    category: 'security',
    tags: ['security', 'compliance', 'enterprise'],
    readTime: '8 min'
  },
  {
    id: 'kb-3',
    title: 'API Integration Guide',
    content: 'Step-by-step instructions for integrating Claude API into your applications. Includes authentication, request formatting, error handling, and rate limiting strategies.',
    category: 'api',
    tags: ['api', 'integration', 'development'],
    readTime: '10 min'
  },
  {
    id: 'kb-4',
    title: 'Deploying Claude in Production',
    content: 'Best practices for production deployments including scaling strategies, monitoring, performance optimization, and disaster recovery planning.',
    category: 'deployment',
    tags: ['deployment', 'production', 'devops'],
    readTime: '12 min'
  },
  {
    id: 'kb-5',
    title: 'Advanced Prompt Engineering Techniques',
    content: 'Master advanced techniques like chain-of-thought reasoning, few-shot learning, role prompting, and structured output generation for complex use cases.',
    category: 'prompting',
    tags: ['advanced', 'prompts', 'techniques'],
    readTime: '15 min'
  },
  {
    id: 'kb-6',
    title: 'Troubleshooting Common Issues',
    content: 'Solutions to frequently encountered problems including timeout errors, unexpected outputs, token limit issues, and performance bottlenecks.',
    category: 'troubleshooting',
    tags: ['troubleshooting', 'debugging', 'support'],
    readTime: '7 min'
  },
  {
    id: 'kb-7',
    title: 'Data Privacy and Compliance',
    content: 'Understanding data handling, GDPR compliance, data retention policies, and how Claude processes your information in enterprise environments.',
    category: 'security',
    tags: ['privacy', 'gdpr', 'compliance'],
    readTime: '9 min'
  },
  {
    id: 'kb-8',
    title: 'Cost Optimization Strategies',
    content: 'Learn how to optimize your API usage, reduce token consumption, implement caching strategies, and manage costs effectively at scale.',
    category: 'deployment',
    tags: ['cost', 'optimization', 'budget'],
    readTime: '6 min'
  },
  {
    id: 'kb-9',
    title: 'Building Custom Workflows',
    content: 'Create sophisticated multi-step workflows combining Claude with other tools. Includes examples of document processing, data analysis, and automation pipelines.',
    category: 'api',
    tags: ['workflows', 'automation', 'integration'],
    readTime: '11 min'
  }
];

export const documentsData: Document[] = [
  {
    id: 'doc-1',
    title: 'Q4 Financial Report.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedBy: 'Alice Chen',
    uploadedAt: '2 hours ago',
    status: 'indexed',
    tags: ['finance', 'q4', 'confidential']
  },
  {
    id: 'doc-2',
    title: 'Product Roadmap 2026.docx',
    type: 'docx',
    size: '1.1 MB',
    uploadedBy: 'Charlie Kim',
    uploadedAt: '1 day ago',
    status: 'indexed',
    tags: ['product', 'strategy']
  },
  {
    id: 'doc-3',
    title: 'Engineering Onboarding Guide',
    type: 'md',
    size: '45 KB',
    uploadedBy: 'System',
    uploadedAt: '3 days ago',
    status: 'indexed',
    tags: ['hr', 'engineering']
  },
  {
    id: 'doc-4',
    title: 'Competitor Analysis - Deep Dive',
    type: 'url',
    size: '-',
    uploadedBy: 'Bob Smith',
    uploadedAt: '5 mins ago',
    status: 'processing',
    tags: ['market-research']
  }
];