export interface Question {
  id: string;
  category: 'Technical' | 'Data' | 'Organizational' | 'Governance';
  text: string;
  options: {
    value: number; // 1-5 score
    label: string;
  }[];
}

export const ASSESSMENT_QUESTIONS: Question[] = [
  // Technical Readiness
  {
    id: 'tech_1',
    category: 'Technical',
    text: 'Do you have existing cloud infrastructure for hosting LLMs or vector databases?',
    options: [
      { value: 1, label: 'No, strictly on-prem legacy systems' },
      { value: 3, label: 'Partial cloud adoption (Hybrid)' },
      { value: 5, label: 'Fully cloud-native (AWS/Azure/GCP)' }
    ]
  },
  {
    id: 'tech_2',
    category: 'Technical',
    text: 'What is your current API management capability?',
    options: [
      { value: 1, label: 'Ad-hoc API keys shared via email' },
      { value: 3, label: 'Basic API Gateway' },
      { value: 5, label: 'Enterprise Gateway with rate limiting & monitoring' }
    ]
  },
  // Data Maturity
  {
    id: 'data_1',
    category: 'Data',
    text: 'How structured is your internal knowledge base?',
    options: [
      { value: 1, label: 'Scattered PDFs and emails' },
      { value: 3, label: 'Centralized wiki (Confluence/SharePoint) but messy' },
      { value: 5, label: 'Clean, tagged, and API-accessible knowledge graph' }
    ]
  },
  // Organizational
  {
    id: 'org_1',
    category: 'Organizational',
    text: 'Do you have executive sponsorship for AI initiatives?',
    options: [
      { value: 1, label: 'No, grassroots only' },
      { value: 3, label: 'VP-level interest but no budget' },
      { value: 5, label: 'C-Suite mandates and dedicated budget' }
    ]
  },
  // Governance
  {
    id: 'gov_1',
    category: 'Governance',
    text: 'Do you have an AI Acceptable Use Policy?',
    options: [
      { value: 1, label: 'No' },
      { value: 3, label: 'Drafted but not communicated' },
      { value: 5, label: 'Published and acknowledged by all employees' }
    ]
  }
  // (Shortened for brevity in this implementation, usually 20)
];
