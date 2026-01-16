/**
 * PRD Template Structure
 * Defines the complete structure for a Product Requirements Document
 */

export interface PRDSection {
  id: string;
  title: string;
  description: string;
  required: boolean;
  order: number;
}

export interface PRDDocument {
  metadata: {
    title: string;
    version: string;
    createdAt: string;
    lastUpdated: string;
    status: string;
    author?: string;
  };
  featureIdea: string;
  sections: {
    executiveSummary: string;
    problemStatement: string;
    targetAudience: string;
    functionalRequirements: string;
    nonFunctionalRequirements: string;
    userStories: string;
    technicalArchitecture: string;
    apiDesign: string;
    uiUxConsiderations: string;
    securityCompliance: string;
    testingStrategy: string;
    deploymentPlan: string;
    risksAndAssumptions: string;
  };
}

export const PRD_SECTIONS: PRDSection[] = [
  {
    id: 'executiveSummary',
    title: '1. Executive Summary',
    description: 'High-level overview of the product/feature, business case and goals',
    required: true,
    order: 1,
  },
  {
    id: 'problemStatement',
    title: '2. Problem Statement',
    description: 'Clear articulation of the problem being solved, who experiences it, and why it\'s critical',
    required: true,
    order: 2,
  },
  {
    id: 'targetAudience',
    title: '3. Target Audience / User Personas',
    description: 'Define primary user roles, their pain points and goals',
    required: true,
    order: 3,
  },
  {
    id: 'functionalRequirements',
    title: '4. Functional Requirements',
    description: 'List of all core features, clearly scoped feature behavior, and edge cases',
    required: true,
    order: 4,
  },
  {
    id: 'nonFunctionalRequirements',
    title: '5. Non-Functional Requirements',
    description: 'Performance, scalability, uptime, localization, accessibility, etc.',
    required: true,
    order: 5,
  },
  {
    id: 'userStories',
    title: '6. User Stories & Acceptance Criteria',
    description: 'Proper Gherkin-style format (Given / When / Then) covering all personas and use cases',
    required: true,
    order: 6,
  },
  {
    id: 'technicalArchitecture',
    title: '7. Technical Architecture Overview',
    description: 'High-level system design, services involved (frontend, backend, APIs, DBs, etc.)',
    required: true,
    order: 7,
  },
  {
    id: 'apiDesign',
    title: '8. API Design',
    description: 'REST or GraphQL endpoint specs, request/response schema, authentication/authorization notes',
    required: false,
    order: 8,
  },
  {
    id: 'uiUxConsiderations',
    title: '9. UI/UX Considerations',
    description: 'Page/component layout, interaction expectations, mobile responsiveness',
    required: true,
    order: 9,
  },
  {
    id: 'securityCompliance',
    title: '10. Security & Compliance',
    description: 'Data handling policies, RBAC, encryption, GDPR / SOC2 / HIPAA if relevant',
    required: true,
    order: 10,
  },
  {
    id: 'testingStrategy',
    title: '11. Testing Strategy',
    description: 'Unit, integration, E2E test coverage, tooling and automation plan',
    required: true,
    order: 11,
  },
  {
    id: 'deploymentPlan',
    title: '12. Deployment & DevOps Plan',
    description: 'Environments (dev, staging, prod), CI/CD strategy, rollback plans',
    required: true,
    order: 12,
  },
  {
    id: 'risksAndAssumptions',
    title: '13. Assumptions, Risks & Open Questions',
    description: 'Known unknowns, external dependencies, risk mitigation strategies',
    required: true,
    order: 13,
  },
];

export const createEmptyPRD = (featureIdea: string): PRDDocument => {
  return {
    metadata: {
      title: 'Product Requirements Document',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'Draft',
    },
    featureIdea,
    sections: {
      executiveSummary: '',
      problemStatement: '',
      targetAudience: '',
      functionalRequirements: '',
      nonFunctionalRequirements: '',
      userStories: '',
      technicalArchitecture: '',
      apiDesign: '',
      uiUxConsiderations: '',
      securityCompliance: '',
      testingStrategy: '',
      deploymentPlan: '',
      risksAndAssumptions: '',
    },
  };
};

export const formatPRDAsMarkdown = (prd: PRDDocument): string => {
  return `# ${prd.metadata.title}

**Feature**: ${prd.featureIdea}
**Version**: ${prd.metadata.version}
**Status**: ${prd.metadata.status}
**Created**: ${new Date(prd.metadata.createdAt).toLocaleDateString()}
**Last Updated**: ${new Date(prd.metadata.lastUpdated).toLocaleDateString()}
${prd.metadata.author ? `**Author**: ${prd.metadata.author}` : ''}

---

## 1. Executive Summary

${prd.sections.executiveSummary}

---

## 2. Problem Statement

${prd.sections.problemStatement}

---

## 3. Target Audience / User Personas

${prd.sections.targetAudience}

---

## 4. Functional Requirements

${prd.sections.functionalRequirements}

---

## 5. Non-Functional Requirements

${prd.sections.nonFunctionalRequirements}

---

## 6. User Stories & Acceptance Criteria

${prd.sections.userStories}

---

## 7. Technical Architecture Overview

${prd.sections.technicalArchitecture}

---

## 8. API Design

${prd.sections.apiDesign || '_Not applicable for this feature_'}

---

## 9. UI/UX Considerations

${prd.sections.uiUxConsiderations}

---

## 10. Security & Compliance

${prd.sections.securityCompliance}

---

## 11. Testing Strategy

${prd.sections.testingStrategy}

---

## 12. Deployment & DevOps Plan

${prd.sections.deploymentPlan}

---

## 13. Assumptions, Risks & Open Questions

${prd.sections.risksAndAssumptions}

---

**Document Control**
- Maintainer: Product Team
- Repository: Auto-generated by Enterprise Profile Builder
`;
};
