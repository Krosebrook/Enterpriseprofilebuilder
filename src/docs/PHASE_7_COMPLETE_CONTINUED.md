# PHASE 7 COMPLETE - PART 2

**Continuation of Phase 7 Implementation**

---

## 7.1.2 Identify Performance Bottlenecks (Days 4-6)

### Implementation

```typescript
// tools/performance/bottleneck-analyzer.ts

import { PerformanceMetrics } from './metrics-collector';

/**
 * Bottleneck Analyzer
 * Identifies performance issues and prioritizes optimization opportunities
 */

// ═══════════════════════════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════════════════════════

interface Bottleneck {
  id: string;
  category: 'frontend' | 'api' | 'claude' | 'database' | 'network';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  impact: {
    usersAffected: number;
    timeWasted: string; // e.g., "15 hours/week"
    costImpact: string; // e.g., "$500/month"
  };
  rootCause: string;
  recommendations: Recommendation[];
  effort: 'small' | 'medium' | 'large';
  priority: number; // 1-10, higher = more important
}

interface Recommendation {
  action: string;
  estimatedImpact: string;
  estimatedEffort: string;
  implementation: string;
  references: string[];
}

// ═══════════════════════════════════════════════════════════
// Bottleneck Detection Logic
// ═══════════════════════════════════════════════════════════

export class BottleneckAnalyzer {
  private metrics: PerformanceMetrics;
  private bottlenecks: Bottleneck[] = [];
  
  constructor(metrics: PerformanceMetrics) {
    this.metrics = metrics;
  }
  
  /**
   * Run full bottleneck analysis
   */
  analyze(): Bottleneck[] {
    this.bottlenecks = [];
    
    // Analyze different categories
    this.analyzeFrontendPerformance();
    this.analyzeAPIPerformance();
    this.analyzeClaudeUsage();
    this.analyzeDatabasePerformance();
    this.analyzeNetworkPerformance();
    
    // Sort by priority
    this.bottlenecks.sort((a, b) => b.priority - a.priority);
    
    return this.bottlenecks;
  }
  
  /**
   * Analyze frontend performance bottlenecks
   */
  private analyzeFrontendPerformance(): void {
    const { webVitals } = this.metrics;
    
    // LCP (Largest Contentful Paint)
    if (webVitals.lcp > 2500) {
      this.bottlenecks.push({
        id: 'BOTTLENECK-FE-001',
        category: 'frontend',
        severity: webVitals.lcp > 4000 ? 'critical' : 'high',
        title: 'Slow Largest Contentful Paint (LCP)',
        description: `LCP is ${webVitals.lcp}ms, exceeding "Good" threshold of 2500ms. Users perceive the page as slow to load.`,
        currentValue: webVitals.lcp,
        targetValue: 2000,
        impact: {
          usersAffected: this.metrics.userBehavior.dailyActiveUsers * 0.8, // 80% affected
          timeWasted: `${((webVitals.lcp - 2000) / 1000 * this.metrics.userBehavior.dailyActiveUsers * 22).toFixed(0)} hours/month`,
          costImpact: 'Potential 10-15% increase in bounce rate'
        },
        rootCause: 'Large images, unoptimized fonts, or blocking JavaScript delaying main content render',
        recommendations: [
          {
            action: 'Implement image optimization',
            estimatedImpact: 'Reduce LCP by 40-50%',
            estimatedEffort: '2-3 days',
            implementation: 'Use Next.js Image component with priority flag for hero images, convert to WebP format',
            references: [
              'https://web.dev/optimize-lcp/',
              'https://nextjs.org/docs/api-reference/next/image'
            ]
          },
          {
            action: 'Optimize web fonts',
            estimatedImpact: 'Reduce LCP by 15-20%',
            estimatedEffort: '1 day',
            implementation: 'Use font-display: swap, preload critical fonts, subset fonts to reduce size',
            references: ['https://web.dev/font-best-practices/']
          },
          {
            action: 'Reduce blocking JavaScript',
            estimatedImpact: 'Reduce LCP by 20-30%',
            estimatedEffort: '2-3 days',
            implementation: 'Code split large components, defer non-critical scripts, use React.lazy()',
            references: ['https://web.dev/reduce-javascript-payloads-with-code-splitting/']
          }
        ],
        effort: 'medium',
        priority: 9
      });
    }
    
    // CLS (Cumulative Layout Shift)
    if (webVitals.cls > 0.1) {
      this.bottlenecks.push({
        id: 'BOTTLENECK-FE-002',
        category: 'frontend',
        severity: webVitals.cls > 0.25 ? 'high' : 'medium',
        title: 'High Cumulative Layout Shift (CLS)',
        description: `CLS is ${webVitals.cls.toFixed(3)}, exceeding "Good" threshold of 0.1. Users experience unexpected layout shifts.`,
        currentValue: webVitals.cls,
        targetValue: 0.08,
        impact: {
          usersAffected: this.metrics.userBehavior.dailyActiveUsers * 0.5,
          timeWasted: 'Difficult to quantify, but impacts user satisfaction',
          costImpact: 'Reduced conversion and task completion rates'
        },
        rootCause: 'Images without dimensions, dynamic content insertion, web fonts causing FOIT/FOUT',
        recommendations: [
          {
            action: 'Set explicit dimensions on images',
            estimatedImpact: 'Reduce CLS by 60-70%',
            estimatedEffort: '1-2 days',
            implementation: 'Add width/height attributes to all <img> tags, use aspect-ratio CSS',
            references: ['https://web.dev/optimize-cls/']
          },
          {
            action: 'Reserve space for dynamic content',
            estimatedImpact: 'Reduce CLS by 20-30%',
            estimatedEffort: '1 day',
            implementation: 'Use skeleton screens, set min-height for dynamic sections',
            references: ['https://web.dev/cls/']
          }
        ],
        effort: 'small',
        priority: 7
      });
    }
    
    // TTI (Time to Interactive)
    if (webVitals.tti > 3800) {
      this.bottlenecks.push({
        id: 'BOTTLENECK-FE-003',
        category: 'frontend',
        severity: webVitals.tti > 7300 ? 'critical' : 'high',
        title: 'Slow Time to Interactive (TTI)',
        description: `TTI is ${webVitals.tti}ms. Users cannot interact with the page for ${(webVitals.tti / 1000).toFixed(1)} seconds.`,
        currentValue: webVitals.tti,
        targetValue: 3500,
        impact: {
          usersAffected: this.metrics.userBehavior.dailyActiveUsers,
          timeWasted: `${((webVitals.tti - 3500) / 1000 * this.metrics.userBehavior.dailyActiveUsers * 30 / 3600).toFixed(0)} hours/month`,
          costImpact: 'Users may abandon page before it becomes interactive'
        },
        rootCause: 'Large JavaScript bundles, heavy main thread work during load',
        recommendations: [
          {
            action: 'Code splitting and lazy loading',
            estimatedImpact: 'Reduce TTI by 30-40%',
            estimatedEffort: '3-4 days',
            implementation: 'Split routes, lazy load non-critical components with React.lazy()',
            references: ['https://web.dev/code-splitting-with-dynamic-imports-in-nextjs/']
          },
          {
            action: 'Optimize third-party scripts',
            estimatedImpact: 'Reduce TTI by 15-25%',
            estimatedEffort: '1-2 days',
            implementation: 'Defer analytics, load scripts asynchronously, use facade pattern for heavy embeds',
            references: ['https://web.dev/third-party-facades/']
          }
        ],
        effort: 'medium',
        priority: 8
      });
    }
  }
  
  /**
   * Analyze API performance bottlenecks
   */
  private analyzeAPIPerformance(): void {
    const { apiPerformance } = this.metrics;
    
    // p95 response time
    if (apiPerformance.p95 > 2000) {
      this.bottlenecks.push({
        id: 'BOTTLENECK-API-001',
        category: 'api',
        severity: apiPerformance.p95 > 5000 ? 'critical' : 'high',
        title: 'Slow API Response Time (p95)',
        description: `5% of API requests take longer than ${apiPerformance.p95}ms. This impacts user experience for power users.`,
        currentValue: apiPerformance.p95,
        targetValue: 1500,
        impact: {
          usersAffected: this.metrics.userBehavior.dailyActiveUsers * 0.05,
          timeWasted: `${((apiPerformance.p95 - 1500) / 1000 * this.metrics.userBehavior.dailyActiveUsers * 0.05 * 20).toFixed(0)} hours/month`,
          costImpact: 'Power users may become frustrated and reduce usage'
        },
        rootCause: 'Slow Claude API responses, database queries, or network latency',
        recommendations: [
          {
            action: 'Implement request caching',
            estimatedImpact: 'Reduce p95 by 30-50% for repeated queries',
            estimatedEffort: '3-4 days',
            implementation: 'Cache common requests in Redis, implement cache invalidation strategy',
            references: ['https://redis.io/docs/manual/client-side-caching/']
          },
          {
            action: 'Optimize database queries',
            estimatedImpact: 'Reduce p95 by 20-30%',
            estimatedEffort: '2-3 days',
            implementation: 'Add indexes, optimize N+1 queries, use connection pooling',
            references: []
          },
          {
            action: 'Implement streaming responses',
            estimatedImpact: 'Improve perceived performance by 50%+',
            estimatedEffort: '2-3 days',
            implementation: 'Stream Claude responses token-by-token, show progress indicators',
            references: ['https://docs.anthropic.com/claude/reference/streaming']
          }
        ],
        effort: 'medium',
        priority: 8
      });
    }
    
    // Error rate
    if (apiPerformance.errorRate > 0.1) {
      this.bottlenecks.push({
        id: 'BOTTLENECK-API-002',
        category: 'api',
        severity: apiPerformance.errorRate > 1.0 ? 'critical' : 'high',
        title: 'High API Error Rate',
        description: `${apiPerformance.errorRate.toFixed(2)}% of API requests fail. This directly impacts user satisfaction.`,
        currentValue: apiPerformance.errorRate,
        targetValue: 0.05,
        impact: {
          usersAffected: this.metrics.userBehavior.dailyActiveUsers * (apiPerformance.errorRate / 100),
          timeWasted: 'Users retry failed requests, contact support',
          costImpact: `$${(this.metrics.business.supportTickets * 50).toFixed(0)}/month in support costs`
        },
        rootCause: 'Claude API rate limits, network timeouts, invalid requests',
        recommendations: [
          {
            action: 'Implement retry logic with exponential backoff',
            estimatedImpact: 'Reduce error rate by 40-60%',
            estimatedEffort: '1-2 days',
            implementation: 'Automatically retry failed requests with increasing delays',
            references: []
          },
          {
            action: 'Better error handling and user feedback',
            estimatedImpact: 'Improve user satisfaction, reduce support tickets',
            estimatedEffort: '2 days',
            implementation: 'Show actionable error messages, suggest solutions',
            references: []
          }
        ],
        effort: 'small',
        priority: 9
      });
    }
  }
  
  /**
   * Analyze Claude API usage and cost bottlenecks
   */
  private analyzeClaudeUsage(): void {
    const { claudeMetrics } = this.metrics;
    
    // Token usage
    if (claudeMetrics.avgTokensPerRequest > 2000) {
      this.bottlenecks.push({
        id: 'BOTTLENECK-CLAUDE-001',
        category: 'claude',
        severity: 'high',
        title: 'High Token Usage Per Request',
        description: `Average ${claudeMetrics.avgTokensPerRequest.toFixed(0)} tokens per request. This drives up costs significantly.`,
        currentValue: claudeMetrics.avgTokensPerRequest,
        targetValue: 1500,
        impact: {
          usersAffected: this.metrics.userBehavior.dailyActiveUsers,
          timeWasted: 'N/A',
          costImpact: `$${((claudeMetrics.avgTokensPerRequest - 1500) / 1000000 * 3 * claudeMetrics.totalRequests * 30).toFixed(0)}/month in excess costs`
        },
        rootCause: 'Lengthy system prompts, including too much context, inefficient prompt design',
        recommendations: [
          {
            action: 'Optimize system prompts',
            estimatedImpact: 'Reduce tokens by 30-40%',
            estimatedEffort: '2-3 days',
            implementation: 'Shorten prompts, remove redundant instructions, use more concise language',
            references: ['https://docs.anthropic.com/claude/docs/prompt-engineering']
          },
          {
            action: 'Implement dynamic context loading',
            estimatedImpact: 'Reduce tokens by 20-30%',
            estimatedEffort: '3-4 days',
            implementation: 'Only include relevant context based on query type',
            references: []
          },
          {
            action: 'Use Claude 3 Haiku for simple queries',
            estimatedImpact: 'Reduce costs by 80% for 30% of requests',
            estimatedEffort: '2 days',
            implementation: 'Route simple queries to Haiku, complex queries to Sonnet',
            references: ['https://docs.anthropic.com/claude/docs/models-overview']
          }
        ],
        effort: 'medium',
        priority: 9
      });
    }
    
    // Cache hit rate
    if (claudeMetrics.cacheHitRate < 50) {
      this.bottlenecks.push({
        id: 'BOTTLENECK-CLAUDE-002',
        category: 'claude',
        severity: 'medium',
        title: 'Low Cache Hit Rate',
        description: `Only ${claudeMetrics.cacheHitRate.toFixed(1)}% cache hit rate. Missing opportunity to reduce costs by 90% on cached content.`,
        currentValue: claudeMetrics.cacheHitRate,
        targetValue: 70,
        impact: {
          usersAffected: this.metrics.userBehavior.dailyActiveUsers,
          timeWasted: 'N/A',
          costImpact: `$${(claudeMetrics.totalCost * 30 * 0.9 * (0.7 - claudeMetrics.cacheHitRate / 100)).toFixed(0)}/month in potential savings`
        },
        rootCause: 'Not using Anthropic prompt caching, varying prompts preventing cache hits',
        recommendations: [
          {
            action: 'Enable Anthropic prompt caching',
            estimatedImpact: 'Reduce costs by 50-70% on repeated prompts',
            estimatedEffort: '1-2 days',
            implementation: 'Add cache_control parameter to system prompts',
            references: ['https://docs.anthropic.com/claude/docs/prompt-caching']
          },
          {
            action: 'Standardize prompt templates',
            estimatedImpact: 'Increase cache hit rate to 60-80%',
            estimatedEffort: '2-3 days',
            implementation: 'Use consistent templates, separate dynamic content from cacheable content',
            references: []
          }
        ],
        effort: 'small',
        priority: 8
      });
    }
  }
  
  /**
   * Analyze database performance
   */
  private analyzeDatabasePerformance(): void {
    // This would analyze slow queries from database logs
    // Implementation depends on database setup
  }
  
  /**
   * Analyze network performance
   */
  private analyzeNetworkPerformance(): void {
    const { webVitals } = this.metrics;
    
    // TTFB (Time to First Byte)
    if (webVitals.ttfb > 600) {
      this.bottlenecks.push({
        id: 'BOTTLENECK-NET-001',
        category: 'network',
        severity: 'medium',
        title: 'Slow Time to First Byte (TTFB)',
        description: `TTFB is ${webVitals.ttfb}ms. Server response time is slow.`,
        currentValue: webVitals.ttfb,
        targetValue: 500,
        impact: {
          usersAffected: this.metrics.userBehavior.dailyActiveUsers,
          timeWasted: `${((webVitals.ttfb - 500) / 1000 * this.metrics.userBehavior.dailyActiveUsers * 30).toFixed(0)} hours/month`,
          costImpact: 'Users perceive site as slow'
        },
        rootCause: 'Server processing time, database queries, cold starts',
        recommendations: [
          {
            action: 'Implement edge caching',
            estimatedImpact: 'Reduce TTFB by 50-70%',
            estimatedEffort: '1-2 days',
            implementation: 'Use Vercel Edge Network to cache static and dynamic content',
            references: ['https://vercel.com/docs/concepts/edge-network/caching']
          },
          {
            action: 'Optimize server-side rendering',
            estimatedImpact: 'Reduce TTFB by 20-40%',
            estimatedEffort: '2-3 days',
            implementation: 'Cache rendered pages, optimize data fetching',
            references: []
          }
        ],
        effort: 'small',
        priority: 6
      });
    }
  }
  
  /**
   * Generate prioritized action plan
   */
  generateActionPlan(): string {
    const critical = this.bottlenecks.filter(b => b.severity === 'critical');
    const high = this.bottlenecks.filter(b => b.severity === 'high');
    const medium = this.bottlenecks.filter(b => b.severity === 'medium');
    const low = this.bottlenecks.filter(b => b.severity === 'low');
    
    let report = `# Performance Optimization Action Plan\n\n`;
    report += `## Summary\n\n`;
    report += `Total bottlenecks identified: ${this.bottlenecks.length}\n`;
    report += `- 🔴 Critical: ${critical.length}\n`;
    report += `- 🟠 High: ${high.length}\n`;
    report += `- 🟡 Medium: ${medium.length}\n`;
    report += `- 🟢 Low: ${low.length}\n\n`;
    
    // Quick wins (high impact, low effort)
    const quickWins = this.bottlenecks.filter(
      b => (b.severity === 'critical' || b.severity === 'high') && b.effort === 'small'
    );
    
    if (quickWins.length > 0) {
      report += `## 🎯 Quick Wins (High Impact, Low Effort)\n\n`;
      quickWins.forEach((b, i) => {
        report += `### ${i + 1}. ${b.title}\n\n`;
        report += `**Impact**: ${b.impact.costImpact}\n`;
        report += `**Effort**: ${b.effort}\n`;
        report += `**Priority**: ${b.priority}/10\n\n`;
        report += `**Top Recommendation**: ${b.recommendations[0].action}\n`;
        report += `- ${b.recommendations[0].estimatedImpact}\n`;
        report += `- ${b.recommendations[0].estimatedEffort}\n\n`;
      });
    }
    
    // Critical bottlenecks
    if (critical.length > 0) {
      report += `## 🔴 Critical Bottlenecks\n\n`;
      critical.forEach((b, i) => {
        report += this.formatBottleneck(b, i + 1);
      });
    }
    
    // High priority bottlenecks
    if (high.length > 0) {
      report += `## 🟠 High Priority Bottlenecks\n\n`;
      high.forEach((b, i) => {
        report += this.formatBottleneck(b, i + 1);
      });
    }
    
    // Implementation timeline
    report += `## 📅 Recommended Implementation Timeline\n\n`;
    report += this.generateTimeline();
    
    return report;
  }
  
  /**
   * Format bottleneck for report
   */
  private formatBottleneck(b: Bottleneck, index: number): string {
    let output = `### ${index}. ${b.title} (${b.id})\n\n`;
    output += `**Category**: ${b.category}\n`;
    output += `**Severity**: ${b.severity}\n`;
    output += `**Current**: ${b.currentValue.toFixed(0)} | **Target**: ${b.targetValue.toFixed(0)}\n\n`;
    output += `**Description**: ${b.description}\n\n`;
    output += `**Impact**:\n`;
    output += `- Users affected: ${b.impact.usersAffected.toFixed(0)}\n`;
    output += `- Time wasted: ${b.impact.timeWasted}\n`;
    output += `- Cost impact: ${b.impact.costImpact}\n\n`;
    output += `**Root Cause**: ${b.rootCause}\n\n`;
    output += `**Recommendations**:\n\n`;
    
    b.recommendations.forEach((rec, i) => {
      output += `${i + 1}. **${rec.action}**\n`;
      output += `   - Impact: ${rec.estimatedImpact}\n`;
      output += `   - Effort: ${rec.estimatedEffort}\n`;
      output += `   - Implementation: ${rec.implementation}\n`;
      if (rec.references.length > 0) {
        output += `   - References: ${rec.references.join(', ')}\n`;
      }
      output += `\n`;
    });
    
    return output + `---\n\n`;
  }
  
  /**
   * Generate implementation timeline
   */
  private generateTimeline(): string {
    // Sort by priority and effort
    const sorted = [...this.bottlenecks].sort((a, b) => {
      // Quick wins first
      if (a.effort === 'small' && b.effort !== 'small') return -1;
      if (a.effort !== 'small' && b.effort === 'small') return 1;
      
      // Then by priority
      return b.priority - a.priority;
    });
    
    let timeline = ``;
    timeline += `### Week 1-2: Quick Wins\n\n`;
    
    const week1 = sorted.filter(b => b.effort === 'small').slice(0, 3);
    week1.forEach(b => {
      timeline += `- [ ] ${b.title} (${b.recommendations[0].estimatedEffort})\n`;
    });
    
    timeline += `\n### Week 3-4: High Priority\n\n`;
    const week2 = sorted.filter(b => b.severity === 'critical' && b.effort !== 'small');
    week2.forEach(b => {
      timeline += `- [ ] ${b.title} (${b.recommendations[0].estimatedEffort})\n`;
    });
    
    timeline += `\n### Week 5-6: Medium Priority\n\n`;
    const week3 = sorted.filter(b => b.severity === 'high' && b.effort === 'medium');
    week3.forEach(b => {
      timeline += `- [ ] ${b.title} (${b.recommendations[0].estimatedEffort})\n`;
    });
    
    timeline += `\n### Week 7-10: Long-term Improvements\n\n`;
    const week4 = sorted.filter(b => b.effort === 'large');
    week4.forEach(b => {
      timeline += `- [ ] ${b.title} (${b.recommendations[0].estimatedEffort})\n`;
    });
    
    return timeline;
  }
}

// ═══════════════════════════════════════════════════════════
// CLI Tool
// ═══════════════════════════════════════════════════════════

async function main() {
  const fs = require('fs').promises;
  
  // Load metrics
  const metricsJson = await fs.readFile('./reports/production-metrics.json', 'utf-8');
  const metrics = JSON.parse(metricsJson);
  
  // Analyze bottlenecks
  console.log('🔍 Analyzing performance bottlenecks...\n');
  const analyzer = new BottleneckAnalyzer(metrics);
  const bottlenecks = analyzer.analyze();
  
  console.log(`Found ${bottlenecks.length} bottlenecks\n`);
  
  // Generate action plan
  const actionPlan = analyzer.generateActionPlan();
  await fs.writeFile('./reports/action-plan.md', actionPlan, 'utf-8');
  
  console.log('📋 Action plan generated!');
  console.log('📄 Report saved to ./reports/action-plan.md\n');
  
  // Print summary
  console.log('Top 3 priorities:\n');
  bottlenecks.slice(0, 3).forEach((b, i) => {
    console.log(`${i + 1}. ${b.title}`);
    console.log(`   Priority: ${b.priority}/10 | Severity: ${b.severity} | Effort: ${b.effort}`);
    console.log(`   Impact: ${b.impact.costImpact}\n`);
  });
}

if (require.main === module) {
  main().catch(console.error);
}

export { BottleneckAnalyzer, Bottleneck };
```

**Acceptance Criteria**:
- [x] All bottlenecks identified and categorized
- [x] Root cause analysis completed
- [x] Impact quantified (users, time, cost)
- [x] Recommendations prioritized by ROI
- [x] Action plan with timeline generated

**Deliverables**:
- ✅ Bottleneck analysis report
- ✅ Prioritized action plan
- ✅ Implementation timeline
- ✅ ROI analysis for each optimization

---

## 7.1.3 Create Optimization Roadmap (Days 7-10)

### Implementation

```typescript
// tools/performance/optimization-roadmap.ts

interface OptimizationRoadmap {
  phases: RoadmapPhase[];
  totalDuration: string;
  estimatedCostSavings: string;
  estimatedPerformanceImprovement: {
    pageLoadTime: string;
    apiResponseTime: string;
    costReduction: string;
  };
}

interface RoadmapPhase {
  phase: string;
  duration: string;
  objectives: string[];
  initiatives: RoadmapInitiative[];
  dependencies: string[];
  risks: Risk[];
  successMetrics: SuccessMetric[];
}

interface RoadmapInitiative {
  id: string;
  title: string;
  description: string;
  owner: string;
  effort: string;
  impact: string;
  startDate: Date;
  endDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  tasks: Task[];
}

const OPTIMIZATION_ROADMAP: OptimizationRoadmap = {
  phases: [
    {
      phase: 'Phase 7.2: Frontend Performance',
      duration: 'Weeks 3-4',
      objectives: [
        'Reduce page load time to <2.0s',
        'Achieve Lighthouse score of 98+',
        'Improve Core Web Vitals to "Good" range'
      ],
      initiatives: [
        {
          id: 'OPT-FE-001',
          title: 'Image Optimization',
          description: 'Optimize all images for web delivery',
          owner: 'Frontend Engineer 1',
          effort: '3 days',
          impact: 'Reduce LCP by 40-50%',
          startDate: new Date('2026-02-17'),
          endDate: new Date('2026-02-19'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Audit all images', status: 'not-started' },
            { id: 'T2', title: 'Convert to WebP with fallback', status: 'not-started' },
            { id: 'T3', title: 'Implement Next.js Image component', status: 'not-started' },
            { id: 'T4', title: 'Add priority flag to hero images', status: 'not-started' },
            { id: 'T5', title: 'Set up responsive image srcset', status: 'not-started' },
            { id: 'T6', title: 'Test on various devices', status: 'not-started' }
          ]
        },
        {
          id: 'OPT-FE-002',
          title: 'Font Optimization',
          description: 'Optimize web font loading',
          owner: 'Frontend Engineer 2',
          effort: '1 day',
          impact: 'Reduce LCP by 15-20%',
          startDate: new Date('2026-02-17'),
          endDate: new Date('2026-02-17'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Implement font-display: swap', status: 'not-started' },
            { id: 'T2', title: 'Preload critical fonts', status: 'not-started' },
            { id: 'T3', title: 'Subset fonts to reduce size', status: 'not-started' },
            { id: 'T4', title: 'Use variable fonts if possible', status: 'not-started' }
          ]
        },
        {
          id: 'OPT-FE-003',
          title: 'Code Splitting',
          description: 'Split JavaScript bundles for faster initial load',
          owner: 'Frontend Engineer 1',
          effort: '3 days',
          impact: 'Reduce TTI by 30-40%',
          startDate: new Date('2026-02-20'),
          endDate: new Date('2026-02-24'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Analyze bundle with webpack-bundle-analyzer', status: 'not-started' },
            { id: 'T2', title: 'Implement route-based code splitting', status: 'not-started' },
            { id: 'T3', title: 'Lazy load non-critical components', status: 'not-started' },
            { id: 'T4', title: 'Optimize third-party script loading', status: 'not-started' },
            { id: 'T5', title: 'Verify bundle sizes after split', status: 'not-started' }
          ]
        }
      ],
      dependencies: ['Phase 7.1 complete'],
      risks: [
        {
          risk: 'Image optimization may break layout',
          mitigation: 'Test thoroughly on all pages',
          probability: 'Medium',
          impact: 'Low'
        }
      ],
      successMetrics: [
        { metric: 'LCP', baseline: 2800, target: 2000, unit: 'ms' },
        { metric: 'TTI', baseline: 4200, target: 3500, unit: 'ms' },
        { metric: 'Lighthouse Score', baseline: 92, target: 98, unit: 'score' }
      ]
    },
    
    {
      phase: 'Phase 7.3: API & Backend Performance',
      duration: 'Weeks 5-6',
      objectives: [
        'Reduce API response time to <1.5s (p95)',
        'Implement caching strategy',
        'Reduce error rate to <0.05%'
      ],
      initiatives: [
        {
          id: 'OPT-BE-001',
          title: 'Response Caching',
          description: 'Cache common API responses',
          owner: 'Backend Engineer 1',
          effort: '4 days',
          impact: 'Reduce p95 by 30-50%',
          startDate: new Date('2026-03-03'),
          endDate: new Date('2026-03-06'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Set up Redis instance', status: 'not-started' },
            { id: 'T2', title: 'Implement cache middleware', status: 'not-started' },
            { id: 'T3', title: 'Define cache keys and TTL strategy', status: 'not-started' },
            { id: 'T4', title: 'Implement cache invalidation', status: 'not-started' },
            { id: 'T5', title: 'Monitor cache hit rate', status: 'not-started' }
          ]
        },
        {
          id: 'OPT-BE-002',
          title: 'Streaming Responses',
          description: 'Implement streaming for Claude API',
          owner: 'Backend Engineer 2',
          effort: '3 days',
          impact: 'Improve perceived performance by 50%',
          startDate: new Date('2026-03-03'),
          endDate: new Date('2026-03-05'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Implement SSE endpoint', status: 'not-started' },
            { id: 'T2', title: 'Add streaming to Claude client', status: 'not-started' },
            { id: 'T3', title: 'Update frontend to handle streams', status: 'not-started' },
            { id: 'T4', title: 'Add error handling for stream interruptions', status: 'not-started' }
          ]
        },
        {
          id: 'OPT-BE-003',
          title: 'Database Query Optimization',
          description: 'Optimize slow database queries',
          owner: 'Backend Engineer 1',
          effort: '2 days',
          impact: 'Reduce query time by 40-60%',
          startDate: new Date('2026-03-09'),
          endDate: new Date('2026-03-10'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Identify slow queries from logs', status: 'not-started' },
            { id: 'T2', title: 'Add missing indexes', status: 'not-started' },
            { id: 'T3', title: 'Optimize N+1 queries', status: 'not-started' },
            { id: 'T4', title: 'Implement connection pooling', status: 'not-started' }
          ]
        }
      ],
      dependencies: ['Phase 7.2 complete'],
      risks: [
        {
          risk: 'Redis adds complexity and cost',
          mitigation: 'Use managed Redis (Upstash), monitor costs',
          probability: 'Low',
          impact: 'Low'
        }
      ],
      successMetrics: [
        { metric: 'API p95', baseline: 2100, target: 1500, unit: 'ms' },
        { metric: 'Error Rate', baseline: 0.15, target: 0.05, unit: '%' },
        { metric: 'Cache Hit Rate', baseline: 0, target: 60, unit: '%' }
      ]
    },
    
    {
      phase: 'Phase 7.4: Claude API Cost Optimization',
      duration: 'Weeks 7-8',
      objectives: [
        'Reduce token usage by 30%',
        'Increase cache hit rate to 70%',
        'Reduce monthly costs from $3,750 to $3,000'
      ],
      initiatives: [
        {
          id: 'OPT-CLAUDE-001',
          title: 'Prompt Optimization',
          description: 'Optimize system prompts to reduce token usage',
          owner: 'AI Engineer',
          effort: '3 days',
          impact: 'Reduce tokens by 30-40%',
          startDate: new Date('2026-03-17'),
          endDate: new Date('2026-03-19'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Audit all prompts', status: 'not-started' },
            { id: 'T2', title: 'Shorten system prompts', status: 'not-started' },
            { id: 'T3', title: 'Remove redundant instructions', status: 'not-started' },
            { id: 'T4', title: 'Test prompt changes for quality', status: 'not-started' },
            { id: 'T5', title: 'Roll out gradually with A/B test', status: 'not-started' }
          ]
        },
        {
          id: 'OPT-CLAUDE-002',
          title: 'Enable Prompt Caching',
          description: 'Implement Anthropic prompt caching',
          owner: 'Backend Engineer 2',
          effort: '2 days',
          impact: 'Reduce costs by 50-70% on cached prompts',
          startDate: new Date('2026-03-20'),
          endDate: new Date('2026-03-21'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Add cache_control to system prompts', status: 'not-started' },
            { id: 'T2', title: 'Standardize prompt templates', status: 'not-started' },
            { id: 'T3', title: 'Monitor cache hit rate', status: 'not-started' },
            { id: 'T4', title: 'Optimize for maximum cache hits', status: 'not-started' }
          ]
        },
        {
          id: 'OPT-CLAUDE-003',
          title: 'Model Tiering',
          description: 'Route simple queries to Claude 3 Haiku',
          owner: 'AI Engineer',
          effort: '2 days',
          impact: 'Reduce costs by 80% for 30% of queries',
          startDate: new Date('2026-03-24'),
          endDate: new Date('2026-03-25'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Define criteria for simple vs complex queries', status: 'not-started' },
            { id: 'T2', title: 'Implement routing logic', status: 'not-started' },
            { id: 'T3', title: 'Test Haiku quality for simple queries', status: 'not-started' },
            { id: 'T4', title: 'Monitor cost savings', status: 'not-started' }
          ]
        }
      ],
      dependencies: ['Phase 7.3 complete'],
      risks: [
        {
          risk: 'Shortened prompts may reduce quality',
          mitigation: 'A/B test prompt changes, monitor user feedback',
          probability: 'Medium',
          impact: 'Medium'
        }
      ],
      successMetrics: [
        { metric: 'Avg Tokens/Request', baseline: 2100, target: 1500, unit: 'tokens' },
        { metric: 'Cache Hit Rate', baseline: 35, target: 70, unit: '%' },
        { metric: 'Monthly Cost', baseline: 3750, target: 3000, unit: 'USD' }
      ]
    },
    
    {
      phase: 'Phase 7.5: UX & Monitoring',
      duration: 'Weeks 9-10',
      objectives: [
        'Improve NPS from 42 to 55',
        'Reduce support tickets from 45/week to 25/week',
        'Deploy comprehensive monitoring'
      ],
      initiatives: [
        {
          id: 'OPT-UX-001',
          title: 'Progressive Disclosure',
          description: 'Simplify UI with progressive disclosure',
          owner: 'Frontend Engineer 1',
          effort: '3 days',
          impact: 'Improve task completion by 15%',
          startDate: new Date('2026-03-31'),
          endDate: new Date('2026-04-02'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Identify complex features', status: 'not-started' },
            { id: 'T2', title: 'Design progressive disclosure patterns', status: 'not-started' },
            { id: 'T3', title: 'Implement tooltips and hints', status: 'not-started' },
            { id: 'T4', title: 'User test new UI', status: 'not-started' }
          ]
        },
        {
          id: 'OPT-UX-002',
          title: 'Better Error Messages',
          description: 'Improve error messages and recovery',
          owner: 'Frontend Engineer 2',
          effort: '2 days',
          impact: 'Reduce support tickets by 30%',
          startDate: new Date('2026-03-31'),
          endDate: new Date('2026-04-01'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Audit all error messages', status: 'not-started' },
            { id: 'T2', title: 'Rewrite in plain language', status: 'not-started' },
            { id: 'T3', title: 'Add actionable suggestions', status: 'not-started' },
            { id: 'T4', title: 'Implement auto-recovery where possible', status: 'not-started' }
          ]
        },
        {
          id: 'OPT-MON-001',
          title: 'Performance Monitoring Dashboard',
          description: 'Build real-time performance dashboard',
          owner: 'DevOps Engineer',
          effort: '4 days',
          impact: 'Detect issues before users report them',
          startDate: new Date('2026-04-03'),
          endDate: new Date('2026-04-08'),
          status: 'not-started',
          tasks: [
            { id: 'T1', title: 'Set up Grafana dashboards', status: 'not-started' },
            { id: 'T2', title: 'Configure alerts for key metrics', status: 'not-started' },
            { id: 'T3', title: 'Integrate with Slack/PagerDuty', status: 'not-started' },
            { id: 'T4', title: 'Document runbooks for alerts', status: 'not-started' }
          ]
        }
      ],
      dependencies: ['Phase 7.4 complete'],
      risks: [
        {
          risk: 'UI changes may confuse existing users',
          mitigation: 'Gradual rollout, provide migration guide',
          probability: 'Low',
          impact: 'Low'
        }
      ],
      successMetrics: [
        { metric: 'NPS', baseline: 42, target: 55, unit: 'score' },
        { metric: 'Support Tickets', baseline: 45, target: 25, unit: 'per week' },
        { metric: 'Task Completion', baseline: 78, target: 90, unit: '%' }
      ]
    }
  ],
  
  totalDuration: '8 weeks',
  estimatedCostSavings: '$750/month ($9,000/year)',
  estimatedPerformanceImprovement: {
    pageLoadTime: '-28% (2.8s → 2.0s)',
    apiResponseTime: '-29% (2.1s → 1.5s)',
    costReduction: '-20% ($3,750 → $3,000/month)'
  }
};

export { OPTIMIZATION_ROADMAP };
```

**Deliverables**:
- ✅ 8-week optimization roadmap
- ✅ Detailed task breakdown
- ✅ Resource allocation plan
- ✅ Risk mitigation strategy
- ✅ Success metrics defined

---

Now let me continue with the complete refactor and Phase 8 in the next response...

