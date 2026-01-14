/**
 * @fileoverview EU AI Act Compliance Tracking System
 * @module compliance/eu-ai-act-tracker
 * @description Track compliance with EU AI Act requirements
 * 
 * Key Deadlines:
 * - February 2025: Prohibited AI systems banned (✅ PASSED)
 * - August 2025: GPAI transparency requirements (✅ PASSED)
 * - August 2026: High-risk AI system requirements
 * 
 * References:
 * - EU AI Act (Regulation (EU) 2024/1689)
 * - GPAI Code of Practice
 * - EU AI Office Guidance
 * 
 * @author INT Inc Compliance Team
 * @version 1.0.0
 * @since 2025-12-11
 */

/**
 * AI Act risk classification
 */
export enum AIRiskLevel {
  PROHIBITED = 'prohibited',
  HIGH_RISK = 'high-risk',
  LIMITED_RISK = 'limited-risk',
  MINIMAL_RISK = 'minimal-risk'
}

/**
 * Compliance status
 */
export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  IN_PROGRESS = 'in-progress',
  NON_COMPLIANT = 'non-compliant',
  NOT_APPLICABLE = 'not-applicable'
}

/**
 * AI system classification
 */
export interface AISystem {
  id: string;
  name: string;
  description: string;
  purpose: string;
  owner: string;
  riskLevel: AIRiskLevel;
  useCases: string[];
  deploymentDate: Date;
  status: 'active' | 'development' | 'deprecated';
}

/**
 * Compliance obligation
 */
export interface ComplianceObligation {
  id: string;
  title: string;
  description: string;
  article: string;
  applicableRiskLevels: AIRiskLevel[];
  deadline: Date;
  status: ComplianceStatus;
  evidence: string[];
  assignee: string;
  notes?: string;
}

/**
 * Transparency disclosure
 */
export interface TransparencyDisclosure {
  systemId: string;
  disclosureText: string;
  locations: string[];
  lastUpdated: Date;
  language: string;
  approvedBy: string;
}

/**
 * EU AI Act Compliance Tracker
 */
export class EUAIActTracker {
  private systems: Map<string, AISystem> = new Map();
  private obligations: Map<string, ComplianceObligation> = new Map();
  private disclosures: Map<string, TransparencyDisclosure> = new Map();

  /**
   * Register AI system
   */
  public registerSystem(system: AISystem): void {
    // Validate system
    this.validateSystem(system);
    
    // Check for prohibited use cases
    if (system.riskLevel === AIRiskLevel.PROHIBITED) {
      throw new Error(`Prohibited AI system detected: ${system.name}. Deployment is illegal under EU AI Act.`);
    }
    
    this.systems.set(system.id, system);
    
    // Auto-generate compliance obligations
    this.generateObligations(system);
  }

  /**
   * Classify AI system risk level
   */
  public classifySystem(
    purpose: string,
    useCase: string,
    impactArea: 'employment' | 'education' | 'law-enforcement' | 'critical-infrastructure' | 'other'
  ): AIRiskLevel {
    // Prohibited AI systems (Article 5)
    const prohibitedPatterns = [
      'social scoring',
      'subliminal manipulation',
      'exploitation of vulnerabilities',
      'biometric categorization for sensitive attributes',
      'real-time remote biometric identification in public'
    ];

    for (const pattern of prohibitedPatterns) {
      if (purpose.toLowerCase().includes(pattern) || useCase.toLowerCase().includes(pattern)) {
        return AIRiskLevel.PROHIBITED;
      }
    }

    // High-risk AI systems (Annex III)
    const highRiskAreas = [
      'employment',
      'education',
      'law-enforcement',
      'critical-infrastructure'
    ];

    if (highRiskAreas.includes(impactArea)) {
      return AIRiskLevel.HIGH_RISK;
    }

    // Check for limited risk (chatbots, deepfakes, emotion recognition)
    const limitedRiskPatterns = [
      'chatbot',
      'conversational ai',
      'deepfake',
      'emotion recognition',
      'biometric categorization'
    ];

    for (const pattern of limitedRiskPatterns) {
      if (purpose.toLowerCase().includes(pattern) || useCase.toLowerCase().includes(pattern)) {
        return AIRiskLevel.LIMITED_RISK;
      }
    }

    return AIRiskLevel.MINIMAL_RISK;
  }

  /**
   * Generate compliance obligations for a system
   */
  private generateObligations(system: AISystem): void {
    const obligations: ComplianceObligation[] = [];

    // Transparency obligations (Limited Risk+)
    if (system.riskLevel === AIRiskLevel.LIMITED_RISK || 
        system.riskLevel === AIRiskLevel.HIGH_RISK) {
      obligations.push({
        id: `${system.id}-transparency`,
        title: 'Transparency Disclosure',
        description: 'Inform users they are interacting with an AI system',
        article: 'Article 50',
        applicableRiskLevels: [AIRiskLevel.LIMITED_RISK, AIRiskLevel.HIGH_RISK],
        deadline: new Date('2025-08-02'), // Already passed
        status: ComplianceStatus.IN_PROGRESS,
        evidence: [],
        assignee: 'compliance-team'
      });
    }

    // High-risk obligations
    if (system.riskLevel === AIRiskLevel.HIGH_RISK) {
      obligations.push(
        {
          id: `${system.id}-risk-management`,
          title: 'Risk Management System',
          description: 'Establish and maintain a risk management system',
          article: 'Article 9',
          applicableRiskLevels: [AIRiskLevel.HIGH_RISK],
          deadline: new Date('2026-08-02'),
          status: ComplianceStatus.IN_PROGRESS,
          evidence: [],
          assignee: 'risk-manager'
        },
        {
          id: `${system.id}-data-governance`,
          title: 'Data Governance',
          description: 'Ensure training data is relevant, representative, and free from errors',
          article: 'Article 10',
          applicableRiskLevels: [AIRiskLevel.HIGH_RISK],
          deadline: new Date('2026-08-02'),
          status: ComplianceStatus.IN_PROGRESS,
          evidence: [],
          assignee: 'data-team'
        },
        {
          id: `${system.id}-technical-docs`,
          title: 'Technical Documentation',
          description: 'Prepare comprehensive technical documentation',
          article: 'Article 11',
          applicableRiskLevels: [AIRiskLevel.HIGH_RISK],
          deadline: new Date('2026-08-02'),
          status: ComplianceStatus.IN_PROGRESS,
          evidence: [],
          assignee: 'tech-lead'
        },
        {
          id: `${system.id}-record-keeping`,
          title: 'Automatic Record-Keeping',
          description: 'Design system to automatically log events',
          article: 'Article 12',
          applicableRiskLevels: [AIRiskLevel.HIGH_RISK],
          deadline: new Date('2026-08-02'),
          status: ComplianceStatus.IN_PROGRESS,
          evidence: [],
          assignee: 'engineering'
        },
        {
          id: `${system.id}-human-oversight`,
          title: 'Human Oversight',
          description: 'Implement human oversight mechanisms',
          article: 'Article 14',
          applicableRiskLevels: [AIRiskLevel.HIGH_RISK],
          deadline: new Date('2026-08-02'),
          status: ComplianceStatus.IN_PROGRESS,
          evidence: [],
          assignee: 'operations'
        },
        {
          id: `${system.id}-accuracy`,
          title: 'Accuracy and Robustness',
          description: 'Ensure appropriate level of accuracy, robustness, and cybersecurity',
          article: 'Article 15',
          applicableRiskLevels: [AIRiskLevel.HIGH_RISK],
          deadline: new Date('2026-08-02'),
          status: ComplianceStatus.IN_PROGRESS,
          evidence: [],
          assignee: 'qa-team'
        },
        {
          id: `${system.id}-registration`,
          title: 'EU Database Registration',
          description: 'Register system in EU database',
          article: 'Article 49',
          applicableRiskLevels: [AIRiskLevel.HIGH_RISK],
          deadline: new Date('2026-08-02'),
          status: ComplianceStatus.NOT_APPLICABLE, // Will change when deploying
          evidence: [],
          assignee: 'compliance-team'
        }
      );
    }

    // Save obligations
    obligations.forEach(obligation => {
      this.obligations.set(obligation.id, obligation);
    });
  }

  /**
   * Create transparency disclosure
   */
  public createDisclosure(
    systemId: string,
    locations: string[],
    language: string = 'en'
  ): TransparencyDisclosure {
    const system = this.systems.get(systemId);
    if (!system) {
      throw new Error(`System not found: ${systemId}`);
    }

    const disclosureTemplates: Record<string, string> = {
      en: `This content is generated by AI (Claude by Anthropic). While we strive for accuracy, AI-generated responses may contain errors or biases. Please verify important information independently.`,
      de: `Dieser Inhalt wird von KI (Claude von Anthropic) generiert. Obwohl wir uns um Genauigkeit bemühen, können KI-generierte Antworten Fehler oder Verzerrungen enthalten. Bitte überprüfen Sie wichtige Informationen unabhängig.`,
      fr: `Ce contenu est généré par l'IA (Claude d'Anthropic). Bien que nous visions l'exactitude, les réponses générées par l'IA peuvent contenir des erreurs ou des biais. Veuillez vérifier les informations importantes de manière indépendante.`,
      es: `Este contenido es generado por IA (Claude de Anthropic). Si bien nos esforzamos por la precisión, las respuestas generadas por IA pueden contener errores o sesgos. Por favor, verifique la información importante de forma independiente.`
    };

    const disclosure: TransparencyDisclosure = {
      systemId,
      disclosureText: disclosureTemplates[language] || disclosureTemplates.en,
      locations,
      lastUpdated: new Date(),
      language,
      approvedBy: 'compliance-team'
    };

    this.disclosures.set(systemId, disclosure);
    
    // Update obligation status
    const obligationId = `${systemId}-transparency`;
    const obligation = this.obligations.get(obligationId);
    if (obligation) {
      obligation.status = ComplianceStatus.COMPLIANT;
      obligation.evidence.push(`Disclosure created: ${new Date().toISOString()}`);
    }

    return disclosure;
  }

  /**
   * Get compliance status for a system
   */
  public getComplianceStatus(systemId: string): {
    system: AISystem;
    obligations: ComplianceObligation[];
    overallStatus: ComplianceStatus;
    nextDeadline?: Date;
    criticalGaps: string[];
  } {
    const system = this.systems.get(systemId);
    if (!system) {
      throw new Error(`System not found: ${systemId}`);
    }

    const obligations = Array.from(this.obligations.values()).filter(
      o => o.id.startsWith(systemId)
    );

    // Determine overall status
    const statuses = obligations.map(o => o.status);
    let overallStatus: ComplianceStatus;

    if (statuses.includes(ComplianceStatus.NON_COMPLIANT)) {
      overallStatus = ComplianceStatus.NON_COMPLIANT;
    } else if (statuses.includes(ComplianceStatus.IN_PROGRESS)) {
      overallStatus = ComplianceStatus.IN_PROGRESS;
    } else {
      overallStatus = ComplianceStatus.COMPLIANT;
    }

    // Find next deadline
    const upcomingDeadlines = obligations
      .filter(o => o.deadline > new Date())
      .map(o => o.deadline)
      .sort((a, b) => a.getTime() - b.getTime());
    
    const nextDeadline = upcomingDeadlines[0];

    // Identify critical gaps
    const criticalGaps = obligations
      .filter(o => o.status === ComplianceStatus.NON_COMPLIANT || 
                   (o.status === ComplianceStatus.IN_PROGRESS && 
                    o.deadline < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))) // 30 days
      .map(o => o.title);

    return {
      system,
      obligations,
      overallStatus,
      nextDeadline,
      criticalGaps
    };
  }

  /**
   * Generate compliance report
   */
  public generateComplianceReport(): {
    totalSystems: number;
    byRiskLevel: Record<AIRiskLevel, number>;
    compliantSystems: number;
    systemsNeedingAction: number;
    upcomingDeadlines: Array<{ system: string; obligation: string; deadline: Date }>;
    criticalIssues: string[];
  } {
    const systems = Array.from(this.systems.values());
    
    const byRiskLevel = systems.reduce((acc, system) => {
      acc[system.riskLevel] = (acc[system.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<AIRiskLevel, number>);

    let compliantSystems = 0;
    let systemsNeedingAction = 0;
    const upcomingDeadlines: Array<{ system: string; obligation: string; deadline: Date }> = [];
    const criticalIssues: string[] = [];

    systems.forEach(system => {
      const status = this.getComplianceStatus(system.id);
      
      if (status.overallStatus === ComplianceStatus.COMPLIANT) {
        compliantSystems++;
      } else if (status.overallStatus === ComplianceStatus.NON_COMPLIANT) {
        systemsNeedingAction++;
        criticalIssues.push(`${system.name}: Non-compliant`);
      } else if (status.overallStatus === ComplianceStatus.IN_PROGRESS) {
        systemsNeedingAction++;
      }

      // Collect upcoming deadlines
      status.obligations
        .filter(o => o.deadline > new Date())
        .forEach(o => {
          upcomingDeadlines.push({
            system: system.name,
            obligation: o.title,
            deadline: o.deadline
          });
        });
    });

    // Sort deadlines
    upcomingDeadlines.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

    return {
      totalSystems: systems.length,
      byRiskLevel,
      compliantSystems,
      systemsNeedingAction,
      upcomingDeadlines: upcomingDeadlines.slice(0, 10), // Top 10
      criticalIssues
    };
  }

  /**
   * Validate system registration
   */
  private validateSystem(system: AISystem): void {
    if (!system.id || !system.name || !system.purpose) {
      throw new Error('System must have id, name, and purpose');
    }

    if (!system.owner) {
      throw new Error('System must have an assigned owner');
    }

    if (!Object.values(AIRiskLevel).includes(system.riskLevel)) {
      throw new Error(`Invalid risk level: ${system.riskLevel}`);
    }
  }

  /**
   * Export compliance data for audit
   */
  public exportAuditData(): {
    generatedAt: Date;
    systems: AISystem[];
    obligations: ComplianceObligation[];
    disclosures: TransparencyDisclosure[];
    report: ReturnType<typeof this.generateComplianceReport>;
  } {
    return {
      generatedAt: new Date(),
      systems: Array.from(this.systems.values()),
      obligations: Array.from(this.obligations.values()),
      disclosures: Array.from(this.disclosures.values()),
      report: this.generateComplianceReport()
    };
  }
}

/**
 * INT Inc AI System Inventory
 */
export const INT_INC_AI_SYSTEMS: AISystem[] = [
  {
    id: 'claude-employee-assistant',
    name: 'Claude Employee Assistant',
    description: 'AI assistant for employee productivity and knowledge work',
    purpose: 'Assist employees with writing, coding, analysis, and research tasks',
    owner: 'CTO',
    riskLevel: AIRiskLevel.LIMITED_RISK,
    useCases: [
      'Document drafting',
      'Code review assistance',
      'Data analysis support',
      'Research summarization'
    ],
    deploymentDate: new Date('2025-12-11'),
    status: 'active'
  },
  {
    id: 'hr-resume-screening',
    name: 'HR Resume Screening Assistant',
    description: 'AI-assisted resume screening for hiring',
    purpose: 'Help HR team review resumes and identify qualified candidates',
    owner: 'HR Director',
    riskLevel: AIRiskLevel.HIGH_RISK, // Employment decisions
    useCases: [
      'Resume parsing',
      'Skill matching',
      'Candidate ranking',
      'Interview question generation'
    ],
    deploymentDate: new Date('2026-03-01'), // Future
    status: 'development'
  }
];

/**
 * Singleton tracker instance
 */
export const euAIActTracker = new EUAIActTracker();

// Register INT Inc systems
INT_INC_AI_SYSTEMS.forEach(system => {
  euAIActTracker.registerSystem(system);
});

// Create transparency disclosures
euAIActTracker.createDisclosure(
  'claude-employee-assistant',
  [
    'Claude Profile Builder UI',
    'Employee onboarding materials',
    'Usage guidelines documentation'
  ],
  'en'
);
