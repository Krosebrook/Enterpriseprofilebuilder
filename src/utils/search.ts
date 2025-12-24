import { SearchResult, Section } from '../types';
import { faqData } from '../data/faq';
import { featuresData } from '../data/features';
import { mcpServersData } from '../data/mcp-servers';
import { roleProfilesData } from '../data/role-profiles';
import { platforms, models, features as ecosystemFeatures, mcpServers as ecosystemServers, skills } from '../data/ecosystem';

/**
 * Performs a fuzzy search across all content
 */
export function searchContent(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search FAQs
  faqData.forEach((faq) => {
    const questionMatch = faq.question.toLowerCase().includes(normalizedQuery);
    const answerMatch = faq.answer.toLowerCase().includes(normalizedQuery);
    const tagMatch = faq.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));

    if (questionMatch || answerMatch || tagMatch) {
      results.push({
        id: faq.id,
        title: faq.question,
        section: 'faq' as Section,
        content: faq.answer.substring(0, 200) + '...',
        relevance: calculateRelevance(normalizedQuery, faq.question, faq.answer, faq.tags),
        path: ['FAQ', faq.level.toUpperCase(), faq.question]
      });
    }
  });

  // Search Features
  featuresData.forEach((feature) => {
    const nameMatch = feature.name.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = feature.description.toLowerCase().includes(normalizedQuery);
    const useCaseMatch = [...feature.whenToUse, ...feature.whenNotToUse].some(
      item => item.toLowerCase().includes(normalizedQuery)
    );

    if (nameMatch || descriptionMatch || useCaseMatch) {
      results.push({
        id: feature.id,
        title: feature.name,
        section: 'features' as Section,
        content: feature.description,
        relevance: calculateRelevance(normalizedQuery, feature.name, feature.description, []),
        path: ['Features', feature.name]
      });
    }
  });

  // Search MCP Servers
  mcpServersData.forEach((server) => {
    const nameMatch = server.name.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = server.description.toLowerCase().includes(normalizedQuery);
    const useCaseMatch = server.useCases.some(
      useCase => useCase.toLowerCase().includes(normalizedQuery)
    );

    if (nameMatch || descriptionMatch || useCaseMatch) {
      results.push({
        id: server.id,
        title: server.name,
        section: 'tools' as Section,
        content: server.description,
        relevance: calculateRelevance(normalizedQuery, server.name, server.description, []),
        path: ['Tools & Connectors', 'MCP Servers', server.name]
      });
    }
  });

  // Search Role Profiles
  roleProfilesData.forEach((profile) => {
    const roleMatch = profile.role.toLowerCase().includes(normalizedQuery);
    const responsibilitiesMatch = profile.responsibilities.toLowerCase().includes(normalizedQuery);
    const capabilitiesMatch = profile.capabilities.some(
      capability => capability.toLowerCase().includes(normalizedQuery)
    );

    if (roleMatch || responsibilitiesMatch || capabilitiesMatch) {
      results.push({
        id: profile.role,
        title: `${profile.role} Role Profile`,
        section: 'roles' as Section,
        content: profile.responsibilities,
        relevance: calculateRelevance(normalizedQuery, profile.role, profile.responsibilities, []),
        path: ['Role Profiles', profile.role]
      });
    }
  });

  // Search Ecosystem Platforms
  platforms.forEach((platform) => {
    if (platform.name.toLowerCase().includes(normalizedQuery) || platform.description.toLowerCase().includes(normalizedQuery)) {
      results.push({
        id: `ecosystem-platform-${platform.id}`,
        title: platform.name,
        section: 'ecosystem',
        content: platform.description,
        relevance: calculateRelevance(normalizedQuery, platform.name, platform.description, []),
        path: ['Ecosystem', 'Platforms', platform.name]
      });
    }
  });

  // Search Ecosystem Models
  models.forEach((model) => {
    if (model.name.toLowerCase().includes(normalizedQuery) || model.bestFor.toLowerCase().includes(normalizedQuery)) {
      results.push({
        id: `ecosystem-model-${model.id}`,
        title: `${model.name} ${model.version}`,
        section: 'ecosystem',
        content: model.bestFor,
        relevance: calculateRelevance(normalizedQuery, model.name, model.bestFor, []),
        path: ['Ecosystem', 'Models', model.name]
      });
    }
  });

  // Search Ecosystem Skills
  skills.forEach((skill) => {
    if (skill.name.toLowerCase().includes(normalizedQuery) || skill.description.toLowerCase().includes(normalizedQuery)) {
      results.push({
        id: `ecosystem-skill-${skill.id}`,
        title: skill.name,
        section: 'ecosystem',
        content: skill.description,
        relevance: calculateRelevance(normalizedQuery, skill.name, skill.description, []),
        path: ['Ecosystem', 'Skills', skill.name]
      });
    }
  });

  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance);
}

/**
 * Calculates relevance score for search results
 */
function calculateRelevance(
  query: string,
  title: string,
  content: string,
  tags: string[]
): number {
  let score = 0;

  // Title exact match
  if (title.toLowerCase() === query) {
    score += 100;
  }
  // Title contains query
  else if (title.toLowerCase().includes(query)) {
    score += 50;
  }

  // Content contains query
  if (content.toLowerCase().includes(query)) {
    score += 20;
  }

  // Tag exact match
  if (tags.some(tag => tag.toLowerCase() === query)) {
    score += 30;
  }
  // Tag contains query
  else if (tags.some(tag => tag.toLowerCase().includes(query))) {
    score += 15;
  }

  // Boost score based on query word count in content
  const queryWords = query.split(' ');
  queryWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    const matches = content.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
  });

  return score;
}

/**
 * Highlights search query in text
 */
export function highlightText(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Extracts relevant snippet from content based on query
 */
export function extractSnippet(content: string, query: string, length: number = 200): string {
  const normalizedQuery = query.toLowerCase();
  const normalizedContent = content.toLowerCase();
  const queryIndex = normalizedContent.indexOf(normalizedQuery);

  if (queryIndex === -1) {
    return content.substring(0, length) + (content.length > length ? '...' : '');
  }

  // Extract text around the query
  const start = Math.max(0, queryIndex - length / 2);
  const end = Math.min(content.length, queryIndex + normalizedQuery.length + length / 2);

  let snippet = content.substring(start, end);
  
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';

  return snippet;
}
