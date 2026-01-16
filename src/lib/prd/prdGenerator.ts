/**
 * PRD Generator Service
 * Uses Claude AI to generate comprehensive Product Requirements Documents
 */

import { PRDDocument, createEmptyPRD } from './prdTemplate';

const PRD_SYSTEM_PROMPT = `You are an expert technical product manager and senior full-stack developer with extensive experience in creating comprehensive, production-grade Product Requirements Documents (PRDs).

Your role is to analyze feature ideas and generate complete, spec-driven PRDs that adhere to current best practices in software engineering and technical product management.

When generating PRDs, you must:
1. Be thorough and comprehensive in all sections
2. Use proper technical terminology and industry-standard practices
3. Include specific, actionable requirements
4. Consider edge cases and potential issues
5. Use Gherkin-style format (Given/When/Then) for user stories
6. Provide realistic technical architecture recommendations
7. Consider security, compliance, and scalability from the start
8. Be specific about testing strategies and deployment approaches
9. Identify risks and assumptions clearly

Your output should be detailed, professional, and ready for engineering teams to use as a blueprint for implementation.`;

interface GenerationProgress {
  currentSection: string;
  progress: number;
  completed: boolean;
}

export class PRDGeneratorService {
  private apiEndpoint: string;
  private apiKey?: string;

  constructor(apiEndpoint?: string, apiKey?: string) {
    this.apiEndpoint = apiEndpoint || '/api/claude';
    this.apiKey = apiKey;
  }

  /**
   * Generate a complete PRD from a feature idea
   */
  async generatePRD(
    featureIdea: string,
    onProgress?: (progress: GenerationProgress) => void
  ): Promise<PRDDocument> {
    if (!featureIdea || featureIdea.trim().length === 0) {
      throw new Error('Feature idea cannot be empty');
    }

    const prd = createEmptyPRD(featureIdea);
    
    try {
      // Generate all sections sequentially to maintain context and coherence
      const sections = [
        { id: 'executiveSummary', name: 'Executive Summary' },
        { id: 'problemStatement', name: 'Problem Statement' },
        { id: 'targetAudience', name: 'Target Audience / User Personas' },
        { id: 'functionalRequirements', name: 'Functional Requirements' },
        { id: 'nonFunctionalRequirements', name: 'Non-Functional Requirements' },
        { id: 'userStories', name: 'User Stories & Acceptance Criteria' },
        { id: 'technicalArchitecture', name: 'Technical Architecture Overview' },
        { id: 'apiDesign', name: 'API Design' },
        { id: 'uiUxConsiderations', name: 'UI/UX Considerations' },
        { id: 'securityCompliance', name: 'Security & Compliance' },
        { id: 'testingStrategy', name: 'Testing Strategy' },
        { id: 'deploymentPlan', name: 'Deployment & DevOps Plan' },
        { id: 'risksAndAssumptions', name: 'Assumptions, Risks & Open Questions' },
      ];

      // Generate the complete PRD in one go for better coherence
      const content = await this.generateCompleteContent(featureIdea, sections, onProgress);
      
      // Parse the generated content into sections
      this.parseContentIntoSections(content, prd);
      
      prd.metadata.lastUpdated = new Date().toISOString();
      prd.metadata.status = 'Generated';
      
      return prd;
    } catch (error) {
      console.error('Error generating PRD:', error);
      throw new Error(`Failed to generate PRD: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate complete PRD content in one call for better coherence
   */
  private async generateCompleteContent(
    featureIdea: string,
    sections: Array<{ id: string; name: string }>,
    onProgress?: (progress: GenerationProgress) => void
  ): Promise<string> {
    const sectionsList = sections.map((s, i) => `${i + 1}. ${s.name}`).join('\n');
    
    const prompt = `Generate a complete, production-grade Product Requirements Document (PRD) for the following feature idea:

FEATURE IDEA:
${featureIdea}

Generate a comprehensive PRD with the following sections:

${sectionsList}

For each section, provide detailed, specific, and actionable content following these guidelines:

1. Executive Summary: Provide a high-level overview, business case, and key goals (2-3 paragraphs)

2. Problem Statement: Clearly articulate the problem, who experiences it, and why it's critical (2-3 paragraphs)

3. Target Audience / User Personas: Define 2-3 primary user personas with their roles, pain points, and goals (detailed profiles)

4. Functional Requirements: List all core features with clear scoping and edge cases (bulleted list with FR-001, FR-002, etc.)

5. Non-Functional Requirements: Specify performance, scalability, accessibility, localization needs (bulleted list with NFR-001, NFR-002, etc.)

6. User Stories & Acceptance Criteria: Write user stories in Gherkin format (Given/When/Then) for each persona and major use case (at least 5-7 stories)

7. Technical Architecture Overview: Describe the high-level system design, including frontend, backend, databases, APIs, and key services. Include a text-based architecture diagram if helpful.

8. API Design: If the feature requires APIs, provide REST or GraphQL endpoint specifications with request/response schemas and authentication notes. If no APIs are needed, write "Not applicable for this feature."

9. UI/UX Considerations: Describe the user interface layout, key interactions, and mobile responsiveness requirements

10. Security & Compliance: Detail data handling policies, RBAC requirements, encryption needs, and relevant compliance standards (GDPR, SOC2, HIPAA)

11. Testing Strategy: Define unit, integration, and E2E testing approaches with specific coverage goals and tooling recommendations

12. Deployment & DevOps Plan: Outline environments (dev, staging, prod), CI/CD strategy, monitoring, and rollback procedures

13. Assumptions, Risks & Open Questions: List known assumptions, potential risks with mitigation strategies, and open questions that need resolution

Format each section with clear headings. Make the content specific, actionable, and production-ready. Be comprehensive but focused.`;

    onProgress?.({
      currentSection: 'Generating complete PRD',
      progress: 0,
      completed: false,
    });

    const response = await this.callClaudeAPI(prompt);
    
    onProgress?.({
      currentSection: 'Complete',
      progress: 100,
      completed: true,
    });

    return response;
  }

  /**
   * Parse generated content into PRD sections
   */
  private parseContentIntoSections(content: string, prd: PRDDocument): void {
    const sectionPatterns = [
      { id: 'executiveSummary', patterns: ['1. Executive Summary', '## 1. Executive Summary', 'Executive Summary'] },
      { id: 'problemStatement', patterns: ['2. Problem Statement', '## 2. Problem Statement', 'Problem Statement'] },
      { id: 'targetAudience', patterns: ['3. Target Audience', '## 3. Target Audience', 'Target Audience / User Personas', 'User Personas'] },
      { id: 'functionalRequirements', patterns: ['4. Functional Requirements', '## 4. Functional Requirements', 'Functional Requirements'] },
      { id: 'nonFunctionalRequirements', patterns: ['5. Non-Functional Requirements', '## 5. Non-Functional Requirements', 'Non-Functional Requirements'] },
      { id: 'userStories', patterns: ['6. User Stories', '## 6. User Stories', 'User Stories & Acceptance Criteria', 'User Stories and Acceptance Criteria'] },
      { id: 'technicalArchitecture', patterns: ['7. Technical Architecture', '## 7. Technical Architecture', 'Technical Architecture Overview'] },
      { id: 'apiDesign', patterns: ['8. API Design', '## 8. API Design', 'API Design'] },
      { id: 'uiUxConsiderations', patterns: ['9. UI/UX', '## 9. UI/UX', 'UI/UX Considerations'] },
      { id: 'securityCompliance', patterns: ['10. Security', '## 10. Security', 'Security & Compliance', 'Security and Compliance'] },
      { id: 'testingStrategy', patterns: ['11. Testing', '## 11. Testing', 'Testing Strategy'] },
      { id: 'deploymentPlan', patterns: ['12. Deployment', '## 12. Deployment', 'Deployment & DevOps Plan', 'Deployment and DevOps Plan'] },
      { id: 'risksAndAssumptions', patterns: ['13. Assumptions', '## 13. Assumptions', 'Assumptions, Risks & Open Questions', 'Risks and Assumptions'] },
    ];

    // Try to extract each section
    for (let i = 0; i < sectionPatterns.length; i++) {
      const current = sectionPatterns[i];
      const next = sectionPatterns[i + 1];
      
      let sectionContent = '';
      
      // Find the start of this section
      for (const pattern of current.patterns) {
        const startIdx = content.indexOf(pattern);
        if (startIdx !== -1) {
          // Find the end (start of next section or end of content)
          let endIdx = content.length;
          
          if (next) {
            for (const nextPattern of next.patterns) {
              const nextIdx = content.indexOf(nextPattern, startIdx + pattern.length);
              if (nextIdx !== -1 && nextIdx < endIdx) {
                endIdx = nextIdx;
              }
            }
          }
          
          // Extract and clean the content
          sectionContent = content
            .substring(startIdx + pattern.length, endIdx)
            .trim()
            .replace(/^[:\-\s]+/, '') // Remove leading colons, dashes, spaces
            .replace(/^#+\s*/, ''); // Remove markdown headers at the start
          
          break;
        }
      }
      
      // Store the section content
      if (sectionContent) {
        (prd.sections as any)[current.id] = sectionContent;
      }
    }
  }

  /**
   * Call Claude API
   */
  private async callClaudeAPI(prompt: string): Promise<string> {
    try {
      // Check if we're in a browser environment and have fetch available
      if (typeof fetch === 'undefined') {
        throw new Error('Fetch is not available');
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          systemPrompt: PRD_SYSTEM_PROMPT,
          message: prompt,
          model: 'claude-3-5-sonnet-20241022',
          maxTokens: 8000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.content || data.message || '';
    } catch (error) {
      console.error('Claude API call failed:', error);
      throw error;
    }
  }

  /**
   * Regenerate a specific section of the PRD
   */
  async regenerateSection(
    prd: PRDDocument,
    sectionId: keyof PRDDocument['sections']
  ): Promise<string> {
    const sectionNames: Record<string, string> = {
      executiveSummary: 'Executive Summary',
      problemStatement: 'Problem Statement',
      targetAudience: 'Target Audience / User Personas',
      functionalRequirements: 'Functional Requirements',
      nonFunctionalRequirements: 'Non-Functional Requirements',
      userStories: 'User Stories & Acceptance Criteria',
      technicalArchitecture: 'Technical Architecture Overview',
      apiDesign: 'API Design',
      uiUxConsiderations: 'UI/UX Considerations',
      securityCompliance: 'Security & Compliance',
      testingStrategy: 'Testing Strategy',
      deploymentPlan: 'Deployment & DevOps Plan',
      risksAndAssumptions: 'Assumptions, Risks & Open Questions',
    };

    const sectionName = sectionNames[sectionId];
    if (!sectionName) {
      throw new Error(`Invalid section ID: ${sectionId}`);
    }

    const prompt = `Given this feature idea: "${prd.featureIdea}"

Please regenerate the "${sectionName}" section of the PRD. Be comprehensive, specific, and actionable.

Context from other sections:
- Problem: ${prd.sections.problemStatement.substring(0, 200)}...
- Target Audience: ${prd.sections.targetAudience.substring(0, 200)}...

Generate detailed content for the ${sectionName} section:`;

    const content = await this.callClaudeAPI(prompt);
    
    return content;
  }
}

// Export singleton instance
export const prdGenerator = new PRDGeneratorService();
