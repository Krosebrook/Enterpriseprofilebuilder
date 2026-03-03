import { useState, useMemo, useEffect } from 'react';
import { Section, SearchResult } from '../types';
import { featuresData } from '../data/features';
import { bestPracticesData } from '../data/best-practices';
import { mcpServersData } from '../data/mcp-servers';
import { faqData } from '../data/faq';
import { deploymentData } from '../data/deployment';

/**
 * Custom hook for searching across all application content
 * @param query - Search query string
 * @returns Object containing search results and loading state
 */
export function useSearch(query: string) {
  const [isSearching, setIsSearching] = useState(false);

  // Calculate search results without side effects
  const results = useMemo(() => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Helper to add results with relevance scoring
    const addResult = (
      id: string,
      title: string,
      content: string,
      section: Section,
      path: string[]
    ) => {
      // Calculate relevance score based on match quality
      let relevance = 0;
      const lowerTitle = title.toLowerCase();
      const lowerContent = content.toLowerCase();

      // Exact title match gets highest score
      if (lowerTitle === lowerQuery) {
        relevance = 100;
      } else if (lowerTitle.startsWith(lowerQuery)) {
        relevance = 80;
      } else if (lowerTitle.includes(lowerQuery)) {
        relevance = 60;
      } else if (lowerContent.includes(lowerQuery)) {
        relevance = 40;
      }

      searchResults.push({ id, title, content, section, path, relevance });
    };

    // 1. Search Features
    featuresData.forEach(feature => {
      if (feature.name.toLowerCase().includes(lowerQuery) || feature.description.toLowerCase().includes(lowerQuery)) {
        addResult(feature.id, feature.name, feature.description, 'features', ['Feature Guides', feature.name]);
      }
      feature.bestPractices.forEach(bp => {
        if (bp.title.toLowerCase().includes(lowerQuery) || bp.description.toLowerCase().includes(lowerQuery)) {
          addResult(`${feature.id}-${bp.id}`, bp.title, bp.description, 'features', ['Feature Guides', feature.name, 'Best Practices']);
        }
      });
    });

    // 2. Search Best Practices
    bestPracticesData.prompting.forEach(bp => {
      if (bp.title.toLowerCase().includes(lowerQuery) || bp.description.toLowerCase().includes(lowerQuery)) {
        addResult(bp.id, bp.title, bp.description, 'best-practices', ['Best Practices', 'Prompting']);
      }
    });
    bestPracticesData.security.forEach(bp => {
      if (bp.title.toLowerCase().includes(lowerQuery) || bp.description.toLowerCase().includes(lowerQuery)) {
        addResult(bp.id, bp.title, bp.description, 'best-practices', ['Best Practices', 'Security']);
      }
    });

    // 3. Search MCP Servers
    mcpServersData.forEach(server => {
      if (server.name.toLowerCase().includes(lowerQuery) || server.description.toLowerCase().includes(lowerQuery)) {
        addResult(server.id, server.name, server.description, 'tools', ['Tools & Connectors', server.name]);
      }
    });

    // 4. Search FAQ
    faqData.forEach(faq => {
      if (faq.question.toLowerCase().includes(lowerQuery) || faq.answer.toLowerCase().includes(lowerQuery)) {
        addResult(faq.id, faq.question, faq.answer.substring(0, 100) + '...', 'faq', ['FAQ', faq.level]);
      }
    });

    // 5. Search Deployment
    deploymentData.forEach(step => {
       if (step.title.toLowerCase().includes(lowerQuery)) {
          addResult(step.id, step.title, `Week ${step.week} Deployment Step`, 'deployment', ['Deployment', step.title]);
       }
       step.tasks.forEach(task => {
          if (task.description.toLowerCase().includes(lowerQuery)) {
             addResult(task.id, task.description, `Deployment Task in ${step.title}`, 'deployment', ['Deployment', step.title]);
          }
       });
    });

    // Sort by relevance (highest first)
    return searchResults.sort((a, b) => b.relevance - a.relevance);
  }, [query]);

  // Handle loading state changes in useEffect (not useMemo)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate network delay for realistic feel
    const timeoutId = setTimeout(() => setIsSearching(false), 300);

    // Cleanup timeout on unmount or query change
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, isSearching };
}
