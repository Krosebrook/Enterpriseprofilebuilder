import { useState, useMemo } from 'react';
import { Section, SearchResult } from '../types';
import { featuresData } from '../data/features';
import { bestPracticesData } from '../data/best-practices';
import { mcpServersData } from '../data/mcp-servers';
import { faqData } from '../data/faq';
import { deploymentData } from '../data/deployment';

export function useSearch(query: string) {
  const [isSearching, setIsSearching] = useState(false);

  const results = useMemo(() => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    setIsSearching(true);
    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Helper to add results
    const addResult = (id: string, title: string, content: string, section: Section, path: string[]) => {
      searchResults.push({ id, title, content, section, path });
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

    // Simulate network delay for realistic feel
    setTimeout(() => setIsSearching(false), 300);

    return searchResults;
  }, [query]);

  return { results, isSearching };
}
