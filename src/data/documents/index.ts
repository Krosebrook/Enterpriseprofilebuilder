// Document data exports
export { deploymentDocs } from './deployment-docs';
export { complianceDocs, complianceChecklistData } from './compliance-docs';
export { kyleDocs, kyleGuideDocs, kyleNarrativeContent, presentationPhases } from './kyle-materials';
export { mcpDocs, mcpServersExtended, mcpCategoryLabels } from './mcp-catalog';
export { roleGuideDocs, roleQuickstartContent } from './role-guides';
export { referenceDocs, promptingFrameworks, bestPracticesContent } from './reference-docs';

// Combined document collections
import { deploymentDocs } from './deployment-docs';
import { complianceDocs } from './compliance-docs';
import { kyleDocs, kyleGuideDocs } from './kyle-materials';
import { mcpDocs } from './mcp-catalog';
import { roleGuideDocs } from './role-guides';
import { referenceDocs } from './reference-docs';
import { DocumentResource } from '../../types';

// All documents combined for search and listing
export const allDocuments: DocumentResource[] = [
  ...deploymentDocs,
  ...complianceDocs,
  ...kyleDocs,
  ...kyleGuideDocs,
  ...mcpDocs,
  ...roleGuideDocs,
  ...referenceDocs,
];

// Documents by section
export const documentsBySection: Record<string, DocumentResource[]> = {
  deployment: [...deploymentDocs, ...kyleDocs.filter(d => d.section === 'deployment')],
  governance: complianceDocs,
  'best-practices': kyleGuideDocs.filter(d => d.section === 'best-practices'),
  tools: [
    ...mcpDocs,
    ...kyleGuideDocs.filter(d => d.section === 'tools'),
  ],
  overview: [
    ...kyleDocs.filter(d => d.section === 'overview'),
    ...kyleGuideDocs.filter(d => d.section === 'overview'),
  ],
  roles: roleGuideDocs,
  features: referenceDocs.filter(d => d.section === 'features'),
  reference: referenceDocs.filter(d => d.section === 'reference'),
};

// Featured documents
export const featuredDocuments = allDocuments.filter(d => d.featured);

// Get documents by category
export function getDocumentsByCategory(category: string): DocumentResource[] {
  return allDocuments.filter(d => d.category === category);
}

// Search documents
export function searchDocuments(query: string): DocumentResource[] {
  const lowerQuery = query.toLowerCase();
  return allDocuments.filter(d =>
    d.title.toLowerCase().includes(lowerQuery) ||
    d.description.toLowerCase().includes(lowerQuery) ||
    d.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
}
