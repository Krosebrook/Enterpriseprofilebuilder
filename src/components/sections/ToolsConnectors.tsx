import { useState, useMemo } from 'react';
import { Database, Cloud, GitBranch, MessageSquare, FileText, Palette, Users as UsersIcon, Image as ImageIcon, Sparkles, Workflow, Zap, FolderKanban, CreditCard, Bot, Code2, PenTool, BookOpen, Mail, BarChart3, Filter, ChevronDown, Lock, Globe, Server, Download } from 'lucide-react';
import { mcpServersData } from '../../data/mcp-servers';
import { mcpServersExtended, mcpCategoryLabels, mcpDocs } from '../../data/documents/mcp-catalog';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SectionHeader } from '../common/SectionHeader';
import { DocumentViewer } from '../documents/DocumentViewer';
import { DocumentResource } from '../../types';

export function ToolsConnectors() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showExtendedCatalog, setShowExtendedCatalog] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentResource | null>(null);

  // Icon mapping for categories
  const categoryIcons: Record<string, any> = {
    'project-management': FolderKanban,
    'crm': UsersIcon,
    'payments': CreditCard,
    'automation': Bot,
    'developer': Code2,
    'design': PenTool,
    'knowledge': BookOpen,
    'communication': Mail,
    'data': BarChart3,
  };

  const iconMap: Record<string, any> = {
    'stripe': Database,
    'vercel': Cloud,
    'linear': FileText,
    'github': GitBranch,
    'slack': MessageSquare,
    'figma': Palette,
    'notion': FileText,
    'hubspot': UsersIcon,
    'cloudinary': ImageIcon,
    'linear-mcp': FolderKanban,
    'jira-mcp': FolderKanban,
    'asana-mcp': FolderKanban,
    'notion-mcp': BookOpen,
    'salesforce-mcp': UsersIcon,
    'hubspot-mcp': UsersIcon,
    'stripe-mcp': CreditCard,
    'zapier-mcp': Bot,
    'make-mcp': Bot,
    'github-mcp': GitBranch,
    'gitlab-mcp': GitBranch,
    'vercel-mcp': Cloud,
    'sentry-mcp': Code2,
    'figma-mcp': PenTool,
    'confluence-mcp': BookOpen,
    'google-drive-mcp': FileText,
    'dropbox-mcp': FileText,
    'slack-mcp': MessageSquare,
    'teams-mcp': MessageSquare,
    'gmail-mcp': Mail,
    'snowflake-mcp': BarChart3,
    'bigquery-mcp': BarChart3,
    'airtable-mcp': Database,
    'monday-mcp': FolderKanban,
    'zendesk-mcp': UsersIcon,
    'intercom-mcp': MessageSquare,
    'datadog-mcp': BarChart3,
    'pagerduty-mcp': Code2,
    'aws-mcp': Cloud,
    'gcp-mcp': Cloud,
  };

  const categoryColors: Record<string, string> = {
    data: 'intInfo',
    development: 'intSuccess',
    communication: 'intWarning',
    design: 'intNeutral',
    other: 'intNeutral',
    'project-management': 'intPrimary',
    'crm': 'intSuccess',
    'payments': 'intWarning',
    'automation': 'intInfo',
    'developer': 'intSuccess',
    'knowledge': 'intInfo',
  };

  // Filter extended servers by category
  const filteredServers = useMemo(() => {
    if (selectedCategory === 'all') return mcpServersExtended;
    return mcpServersExtended.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  // Get unique categories with counts
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    mcpServersExtended.forEach(s => {
      stats[s.category] = (stats[s.category] || 0) + 1;
    });
    return stats;
  }, []);

  // If viewing a document, show the viewer
  if (selectedDocument) {
    return (
      <div className="animate-in fade-in duration-300">
        <DocumentViewer
          document={selectedDocument}
          onBack={() => setSelectedDocument(null)}
          showTableOfContents={true}
        />
      </div>
    );
  }

  const skills = [
    { name: 'docx', description: 'Create/edit Word documents', roles: 'Sales, HR, Ops' },
    { name: 'pdf', description: 'Generate PDFs, extract text', roles: 'Finance, Legal, Ops' },
    { name: 'pptx', description: 'Create presentations', roles: 'Marketing, Sales, Leadership' },
    { name: 'xlsx', description: 'Create/analyze spreadsheets', roles: 'Finance, Ops, Sales' },
    { name: 'frontend-design', description: 'Design web UIs', roles: 'Product, Engineering, Marketing' },
    { name: 'accessibility-core', description: 'Ensure WCAG compliance', roles: 'Engineering, Product' },
    { name: 'workflow-automation', description: 'Design n8n/Zapier workflows', roles: 'Operations, Finance, Sales' },
    { name: 'ai-agents-workflow', description: 'Build AI agent orchestrations', roles: 'Engineering, Product' },
    { name: 'staff-engineer-v3', description: 'Architecture/security reviews', roles: 'CTO, Senior Eng' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Tools & Connectors" 
        description="Integrate Claude with your enterprise data stack. Use MCP servers for real-time data access and specialized skills for complex workflows."
        icon={Database}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content (Left 2 cols) */}
         <div className="lg:col-span-2 space-y-8">
            <section>
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                     <Workflow className="w-6 h-6 text-amber-500" />
                     MCP Server Catalog
                     <Badge variant="intPrimary" size="sm">{mcpServersExtended.length} servers</Badge>
                  </h3>
                  {mcpDocs[0] && (
                     <button
                        onClick={() => setSelectedDocument(mcpDocs[0])}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--int-primary)] hover:bg-[var(--int-primary-light)] rounded-lg transition-colors"
                     >
                        <FileText className="w-4 h-4" />
                        View Full Catalog
                     </button>
                  )}
               </div>

               {/* Category Filters */}
               <div className="flex flex-wrap gap-2 mb-6">
                  <button
                     onClick={() => setSelectedCategory('all')}
                     className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        selectedCategory === 'all'
                           ? 'bg-[var(--int-primary)] text-white'
                           : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                     }`}
                  >
                     <Filter className="w-3.5 h-3.5" />
                     All ({mcpServersExtended.length})
                  </button>
                  {Object.entries(categoryStats).map(([category, count]) => {
                     const CategoryIcon = categoryIcons[category] || Sparkles;
                     return (
                        <button
                           key={category}
                           onClick={() => setSelectedCategory(category)}
                           className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              selectedCategory === category
                                 ? 'bg-[var(--int-primary)] text-white'
                                 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                           }`}
                        >
                           <CategoryIcon className="w-3.5 h-3.5" />
                           {mcpCategoryLabels[category] || category} ({count})
                        </button>
                     );
                  })}
               </div>

               {/* Extended MCP Server Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredServers.map((server) => {
                     const Icon = iconMap[server.id] || Sparkles;
                     const colorVariant = categoryColors[server.category] || 'intNeutral';
                     return (
                        <Card key={server.id} variant="int" padding="int" className="h-full flex flex-col hover:shadow-md transition-all">
                           <div className="flex items-start gap-4 mb-4">
                              <div className="w-10 h-10 bg-[var(--int-primary-light)] rounded-lg flex items-center justify-center flex-shrink-0 border border-[var(--int-gray-200)]">
                                 <Icon className="w-5 h-5 text-[var(--int-primary)]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h4 className="font-bold text-[var(--int-gray-900)]">{server.name}</h4>
                                    <Badge variant={colorVariant as any} size="sm">
                                       {mcpCategoryLabels[server.category] || server.category}
                                    </Badge>
                                 </div>
                                 <p className="text-[var(--int-gray-600)] text-xs mb-2 line-clamp-2">{server.description}</p>
                              </div>
                           </div>

                           {/* Auth & Platforms */}
                           <div className="flex items-center gap-3 mb-3 text-xs">
                              {server.authType && (
                                 <span className="flex items-center gap-1 text-slate-500">
                                    <Lock className="w-3 h-3" />
                                    {server.authType}
                                 </span>
                              )}
                              {server.platforms && (
                                 <span className="flex items-center gap-1 text-slate-500">
                                    <Globe className="w-3 h-3" />
                                    {server.platforms.join(', ')}
                                 </span>
                              )}
                           </div>

                           {/* Capabilities */}
                           {server.capabilities && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                 {server.capabilities.map((cap, i) => (
                                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                       {cap}
                                    </span>
                                 ))}
                              </div>
                           )}

                           <div className="mt-auto pt-3 border-t border-[var(--int-gray-100)]">
                              <p className="text-xs font-bold text-[var(--int-gray-400)] uppercase tracking-wider mb-2">Use Cases</p>
                              <ul className="space-y-1">
                                 {server.useCases.slice(0, 3).map((useCase, i) => (
                                    <li key={i} className="text-xs text-[var(--int-gray-600)] flex items-start gap-1.5">
                                       <span className="text-[var(--int-primary)] mt-0.5">•</span>
                                       {useCase}
                                    </li>
                                 ))}
                              </ul>
                           </div>

                           {/* Security Notes */}
                           {server.securityNotes && (
                              <div className="mt-3 p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-700">
                                 ⚠️ {server.securityNotes}
                              </div>
                           )}
                        </Card>
                     );
                  })}
               </div>
            </section>

            <section>
               <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-indigo-500" />
                  Specialized Skills
               </h3>
               <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                     <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                           <th className="px-6 py-3 text-left font-bold text-slate-600">Skill Name</th>
                           <th className="px-6 py-3 text-left font-bold text-slate-600">Description</th>
                           <th className="px-6 py-3 text-left font-bold text-slate-600">Roles</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {skills.map((skill) => (
                           <tr key={skill.name} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 font-mono text-indigo-600 font-medium">{skill.name}</td>
                              <td className="px-6 py-4 text-slate-600">{skill.description}</td>
                              <td className="px-6 py-4 text-slate-500 text-xs">{skill.roles}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </section>
         </div>

         {/* Sidebar (Right 1 col) */}
         <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
               <h3 className="font-bold text-blue-900 mb-3 text-lg">What is MCP?</h3>
               <p className="text-blue-800 text-sm leading-relaxed mb-4">
                  The Model Context Protocol (MCP) securely connects Claude to your enterprise data.
                  It enables real-time fetching, action execution, and context-aware responses without storing data.
               </p>
               <div className="text-xs text-blue-600 bg-blue-100/50 p-3 rounded border border-blue-200">
                  🔒 All connections are RBAC-enforced and audit-logged.
               </div>
            </div>

            <Card className="border-amber-200 bg-amber-50/30">
               <h3 className="font-bold text-slate-900 mb-4">Best Practices</h3>
               <ul className="space-y-4">
                  {[
                     { title: "Verify Permissions", text: "Ensure you have access to the data in the source tool first." },
                     { title: "Chain Tools", text: "Combine tools like 'HubSpot + Stripe' for richer insights." },
                     { title: "Review Actions", text: "Always double-check write operations before confirming." }
                  ].map((item, i) => (
                     <li key={i} className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-amber-200 text-amber-600 font-bold text-xs shadow-sm flex-shrink-0">
                           {i + 1}
                        </span>
                        <div>
                           <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                           <p className="text-slate-600 text-xs">{item.text}</p>
                        </div>
                     </li>
                  ))}
               </ul>
            </Card>
            
            <Card className="bg-slate-900 text-slate-300 border-slate-800">
               <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Prompting Tip
               </h3>
               <p className="text-xs mb-3 text-slate-400">Explicitly invoke skills for better results:</p>
               <div className="bg-black/50 p-3 rounded border border-white/10 font-mono text-xs text-emerald-400">
                  "Analyze this Q4 data using the <span className="text-amber-300">xlsx</span> skill and create a summary deck with <span className="text-amber-300">pptx</span>."
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
