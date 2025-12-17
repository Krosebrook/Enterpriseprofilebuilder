import { DocumentResource, KyleMaterial, PresentationPhase } from '../../types';

export const kyleDocs: DocumentResource[] = [
  {
    id: 'kyle-narrative-anchor',
    title: 'Kyle\'s Narrative Anchor',
    description: 'Polished opening story (3-4 minute delivery) for organizational development presentations.',
    category: 'kyle',
    fileName: 'KYLE_NARRATIVE_ANCHOR.md',
    downloadPath: '/docs/kyle-materials/KYLE_NARRATIVE_ANCHOR.md',
    section: 'overview',
    tags: ['narrative', 'presentation', 'opening', 'story'],
    lastUpdated: '2025-01-11',
    order: 1,
    featured: true,
  },
  {
    id: 'kyle-narrative-audited',
    title: 'Kyle\'s Narrative Anchor (Audited)',
    description: 'Audited version of the narrative anchor with delivery notes and timing.',
    category: 'kyle',
    fileName: 'KYLE_NARRATIVE_ANCHOR_AUDITED.md',
    downloadPath: '/docs/kyle-materials/KYLE_NARRATIVE_ANCHOR_AUDITED.md',
    section: 'overview',
    tags: ['narrative', 'presentation', 'audited', 'delivery-notes'],
    lastUpdated: '2025-01-11',
    order: 2,
  },
  {
    id: 'presentation-roadmap-3phases',
    title: 'Presentation Roadmap: 3 Phases, 15 Subphases',
    description: 'Complete presentation breakdown with 15 subphases for organizational development.',
    category: 'presentation',
    fileName: 'PRESENTATION_ROADMAP_3PHASES_15SUBPHASES.md',
    downloadPath: '/docs/kyle-materials/PRESENTATION_ROADMAP_3PHASES_15SUBPHASES.md',
    section: 'deployment',
    tags: ['presentation', 'roadmap', '3-phase', 'organizational-development'],
    lastUpdated: '2025-01-11',
    order: 3,
    featured: true,
  },
  {
    id: 'presentation-tracker',
    title: 'Presentation Project Tracker (Printable)',
    description: 'Printable checklist for tracking presentation preparation progress.',
    category: 'presentation',
    fileName: 'PRESENTATION_PROJECT_TRACKER_PRINTABLE.md',
    downloadPath: '/docs/kyle-materials/PRESENTATION_PROJECT_TRACKER_PRINTABLE.md',
    section: 'deployment',
    tags: ['tracker', 'checklist', 'printable', 'progress'],
    lastUpdated: '2025-01-11',
    order: 4,
  },
  {
    id: 'quick-reference-3phases',
    title: 'Quick Reference: 3 Phases',
    description: 'One-page overview of the 3-phase roadmap for quick reference.',
    category: 'kyle',
    fileName: 'QUICK_REFERENCE_3PHASES.md',
    downloadPath: '/docs/kyle-materials/QUICK_REFERENCE_3PHASES.md',
    section: 'overview',
    tags: ['quick-reference', '3-phase', 'overview', 'summary'],
    lastUpdated: '2025-01-11',
    order: 5,
  },
];

export const kyleGuideDocs: DocumentResource[] = [
  {
    id: 'kyle-prompting-guide',
    title: 'Kyle\'s Interactive Prompting Guide',
    description: 'Comprehensive guide to effective prompting techniques including R-I-S-E and F-L-O-W frameworks.',
    category: 'guide',
    fileName: 'kyle-interactive-prompting-guide.md',
    downloadPath: '/docs/guides/kyle-interactive-prompting-guide.md',
    section: 'best-practices',
    tags: ['prompting', 'techniques', 'rise', 'flow', 'frameworks'],
    lastUpdated: '2025-01-11',
    order: 1,
    featured: true,
  },
  {
    id: 'kyle-quick-reference',
    title: 'Kyle\'s Personal Quick Reference',
    description: 'Personal quick reference card for common tasks and shortcuts.',
    category: 'guide',
    fileName: 'kyle-personal-quick-reference.md',
    downloadPath: '/docs/guides/kyle-personal-quick-reference.md',
    section: 'overview',
    tags: ['quick-reference', 'shortcuts', 'personal', 'cheatsheet'],
    lastUpdated: '2025-01-11',
    order: 2,
  },
  {
    id: 'kyle-platform-setup',
    title: 'Kyle\'s Platform Setup Guide',
    description: 'Step-by-step guide to setting up and configuring the platform.',
    category: 'guide',
    fileName: 'kyle-platform-setup-guide.md',
    downloadPath: '/docs/guides/kyle-platform-setup-guide.md',
    section: 'tools',
    tags: ['setup', 'configuration', 'platform', 'getting-started'],
    lastUpdated: '2025-01-11',
    order: 3,
  },
  {
    id: 'kyle-extensions-integrations',
    title: 'Kyle\'s Extensions & Integrations Guide',
    description: 'Guide to available extensions and third-party integrations.',
    category: 'guide',
    fileName: 'kyle-extensions-integrations-guide.md',
    downloadPath: '/docs/guides/kyle-extensions-integrations-guide.md',
    section: 'tools',
    tags: ['extensions', 'integrations', 'third-party', 'plugins'],
    lastUpdated: '2025-01-11',
    order: 4,
  },
];

// Kyle's narrative content for the dashboard "Learn from Kyle" section
export const kyleNarrativeContent: KyleMaterial = {
  id: 'kyle-story',
  title: 'Learn from Kyle: A Journey in AI Adoption',
  type: 'narrative',
  description: 'Kyle\'s story of introducing AI tools to his organization and the lessons learned along the way.',
  deliveryTime: '3-4 minutes',
  audience: 'All users, especially those new to enterprise AI adoption',
  content: `
## The Beginning

When I first started exploring AI tools for our organization, I wasn't sure where to begin. Like many of you, I had questions about security, adoption, and real-world applications.

## The Discovery

What I discovered was that successful AI adoption isn't about the technology alone—it's about people, processes, and a clear vision. The tools are powerful, but they're most effective when aligned with how your team actually works.

## Key Lessons

**1. Start Small, Think Big**
Begin with a specific use case that solves a real problem. Don't try to transform everything at once.

**2. Involve Your Team Early**
The best implementations come from collaborative discovery. Your team knows where AI can help most.

**3. Document Everything**
Keep track of what works and what doesn't. Your future self will thank you.

**4. Security First**
Never compromise on security. The right enterprise tools make this easier than you think.

## The Path Forward

Today, I'm sharing these resources to help you on your own journey. Whether you're just getting started or looking to expand your AI capabilities, you'll find practical guidance here.

Remember: every expert was once a beginner. Start where you are, use what you have, do what you can.
  `,
};

// 3-Phase presentation structure
export const presentationPhases: PresentationPhase[] = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Foundation & Discovery',
    description: 'Establishing the groundwork for AI adoption',
    duration: '15-20 minutes',
    keyPoints: [
      'Understanding the landscape',
      'Identifying opportunities',
      'Building the business case',
    ],
    subPhases: [
      {
        id: '1-1',
        title: 'Opening Narrative',
        content: 'Personal story of AI discovery and initial skepticism',
        deliveryNotes: 'Be authentic, share real challenges faced',
      },
      {
        id: '1-2',
        title: 'Current State Assessment',
        content: 'Where we are today with AI tools and processes',
        deliveryNotes: 'Use specific examples from the organization',
      },
      {
        id: '1-3',
        title: 'Opportunity Identification',
        content: 'Areas where AI can add immediate value',
        deliveryNotes: 'Focus on quick wins first',
      },
      {
        id: '1-4',
        title: 'Risk Acknowledgment',
        content: 'Addressing concerns about security and change',
        deliveryNotes: 'Don\'t dismiss concerns, address them directly',
      },
      {
        id: '1-5',
        title: 'Vision Statement',
        content: 'Where we want to be in 6-12 months',
        deliveryNotes: 'Paint a clear, achievable picture',
      },
    ],
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Implementation & Adoption',
    description: 'Putting plans into action',
    duration: '20-25 minutes',
    keyPoints: [
      'Practical implementation steps',
      'Change management strategies',
      'Measuring success',
    ],
    subPhases: [
      {
        id: '2-1',
        title: 'Tool Selection',
        content: 'Choosing the right AI tools for your needs',
        deliveryNotes: 'Compare options objectively',
      },
      {
        id: '2-2',
        title: 'Pilot Program Design',
        content: 'Structuring an effective pilot',
        deliveryNotes: 'Emphasize learning over perfection',
      },
      {
        id: '2-3',
        title: 'Training Approach',
        content: 'How to effectively train your team',
        deliveryNotes: 'Different roles need different training',
      },
      {
        id: '2-4',
        title: 'Success Metrics',
        content: 'Defining and tracking KPIs',
        deliveryNotes: 'Both quantitative and qualitative metrics',
      },
      {
        id: '2-5',
        title: 'Feedback Loops',
        content: 'Continuous improvement mechanisms',
        deliveryNotes: 'Make it easy to share feedback',
      },
    ],
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Scale & Optimization',
    description: 'Expanding success across the organization',
    duration: '15-20 minutes',
    keyPoints: [
      'Scaling what works',
      'Advanced use cases',
      'Future roadmap',
    ],
    subPhases: [
      {
        id: '3-1',
        title: 'Scaling Strategy',
        content: 'Moving from pilot to production',
        deliveryNotes: 'Document everything for repeatability',
      },
      {
        id: '3-2',
        title: 'Advanced Features',
        content: 'Unlocking more sophisticated capabilities',
        deliveryNotes: 'Only after basics are solid',
      },
      {
        id: '3-3',
        title: 'Integration Opportunities',
        content: 'Connecting AI with existing workflows',
        deliveryNotes: 'Focus on high-impact integrations',
      },
      {
        id: '3-4',
        title: 'Governance Framework',
        content: 'Long-term governance and oversight',
        deliveryNotes: 'Build trust through transparency',
      },
      {
        id: '3-5',
        title: 'Future Roadmap',
        content: 'What\'s next and how to stay current',
        deliveryNotes: 'End with inspiration and momentum',
      },
    ],
  },
];
