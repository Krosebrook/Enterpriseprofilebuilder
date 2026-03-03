/**
 * Basic tests for PRD template functionality
 */

import { describe, it, expect } from 'vitest';
import { createEmptyPRD, formatPRDAsMarkdown, PRD_SECTIONS } from '../../lib/prd/prdTemplate';

describe('PRD Template', () => {
  it('should create an empty PRD with correct structure', () => {
    const featureIdea = 'A new collaborative whiteboard feature';
    const prd = createEmptyPRD(featureIdea);

    expect(prd).toBeDefined();
    expect(prd.featureIdea).toBe(featureIdea);
    expect(prd.metadata).toBeDefined();
    expect(prd.metadata.title).toBe('Product Requirements Document');
    expect(prd.metadata.version).toBe('1.0.0');
    expect(prd.metadata.status).toBe('Draft');
    expect(prd.sections).toBeDefined();
  });

  it('should have all 13 required sections', () => {
    expect(PRD_SECTIONS).toHaveLength(13);
    
    const sectionIds = PRD_SECTIONS.map(s => s.id);
    expect(sectionIds).toContain('executiveSummary');
    expect(sectionIds).toContain('problemStatement');
    expect(sectionIds).toContain('targetAudience');
    expect(sectionIds).toContain('functionalRequirements');
    expect(sectionIds).toContain('nonFunctionalRequirements');
    expect(sectionIds).toContain('userStories');
    expect(sectionIds).toContain('technicalArchitecture');
    expect(sectionIds).toContain('apiDesign');
    expect(sectionIds).toContain('uiUxConsiderations');
    expect(sectionIds).toContain('securityCompliance');
    expect(sectionIds).toContain('testingStrategy');
    expect(sectionIds).toContain('deploymentPlan');
    expect(sectionIds).toContain('risksAndAssumptions');
  });

  it('should format PRD as markdown correctly', () => {
    const prd = createEmptyPRD('Test feature');
    prd.sections.executiveSummary = 'This is a test summary';
    prd.sections.problemStatement = 'This is a test problem';
    
    const markdown = formatPRDAsMarkdown(prd);
    
    expect(markdown).toContain('# Product Requirements Document');
    expect(markdown).toContain('**Feature**: Test feature');
    expect(markdown).toContain('## 1. Executive Summary');
    expect(markdown).toContain('This is a test summary');
    expect(markdown).toContain('## 2. Problem Statement');
    expect(markdown).toContain('This is a test problem');
  });

  it('should handle empty sections in markdown formatting', () => {
    const prd = createEmptyPRD('Test feature');
    const markdown = formatPRDAsMarkdown(prd);
    
    expect(markdown).toContain('## 1. Executive Summary');
    expect(markdown).toContain('## 8. API Design');
    expect(markdown).toContain('_Not applicable for this feature_');
  });

  it('should mark API Design section as not required', () => {
    const apiSection = PRD_SECTIONS.find(s => s.id === 'apiDesign');
    expect(apiSection).toBeDefined();
    expect(apiSection?.required).toBe(false);
  });

  it('should mark all other sections as required', () => {
    const requiredSections = PRD_SECTIONS.filter(s => s.id !== 'apiDesign');
    requiredSections.forEach(section => {
      expect(section.required).toBe(true);
    });
  });
});
