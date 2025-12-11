import { Database, Cloud, GitBranch, MessageSquare, FileText, Palette, Users as UsersIcon, Image as ImageIcon, Sparkles } from 'lucide-react';
import { mcpServersData } from '../../data/mcp-servers';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function ToolsConnectors() {
  const iconMap: Record<string, any> = {
    'stripe': Database,
    'vercel': Cloud,
    'linear': FileText,
    'github': GitBranch,
    'slack': MessageSquare,
    'figma': Palette,
    'notion': FileText,
    'hubspot': UsersIcon,
    'cloudinary': ImageIcon
  };

  const categoryColors = {
    data: 'info',
    development: 'success',
    communication: 'warning',
    design: 'default',
    other: 'default'
  } as const;

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
    <div className="space-y-8">
      <div>
        <h2 className="text-slate-900 mb-4">Tools & Connectors</h2>
        <p className="text-slate-700">
          MCP (Model Context Protocol) servers connect Claude to external tools and data sources in real-time.
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <h3 className="text-slate-900 mb-3">What is MCP?</h3>
        <p className="text-slate-700">
          MCP servers allow Claude to query external systems, retrieve real-time data, and perform actions 
          across your integrated tools. Each connection is secured with role-based permissions and audit logging.
        </p>
      </Card>

      {/* Available MCP Servers */}
      <div>
        <h3 className="text-slate-900 mb-4">Available MCP Servers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mcpServersData.map((server) => {
            const Icon = iconMap[server.id] || Sparkles;
            
            return (
              <Card key={server.id} hoverable>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-slate-900">{server.name}</h4>
                      <Badge variant={categoryColors[server.category]} size="sm">
                        {server.category}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{server.description}</p>
                    <p className="text-slate-500 text-sm">
                      Roles: {server.roles.join(', ')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-slate-900 mb-2">Use Cases:</p>
                  <ul className="space-y-1">
                    {server.useCases.map((useCase, index) => (
                      <li key={index} className="text-slate-700 flex items-start gap-2">
                        <span className="text-amber-600 mt-1 flex-shrink-0">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* MCP Best Practices */}
      <div>
        <h3 className="text-slate-900 mb-4">MCP Best Practices</h3>
        <div className="space-y-3">
          <Card>
            <p className="text-slate-900 mb-2">1. Verify Tool Permissions</p>
            <p className="text-slate-700">
              When Claude uses a tool, verify you have access to requested data and the operation is appropriate.
            </p>
          </Card>

          <Card>
            <p className="text-slate-900 mb-2">2. Combine Multiple Tools</p>
            <p className="text-slate-700 mb-2">
              Example: "Show me our top customers in HubSpot and their Stripe spending"
            </p>
            <p className="text-slate-600 text-sm">
              Claude queries HubSpot for customers, then Stripe for spending, and combines results.
            </p>
          </Card>

          <Card>
            <p className="text-slate-900 mb-2">3. Use for Automation</p>
            <p className="text-slate-700">
              Example: "Create a Linear issue for each failed test in our latest GitHub Actions run"
            </p>
          </Card>

          <Card>
            <p className="text-slate-900 mb-2">4. Review Before Acting</p>
            <p className="text-slate-700">
              If Claude proposes an action, review and approve before execution.
            </p>
          </Card>
        </div>
      </div>

      {/* Available Skills */}
      <div>
        <h3 className="text-slate-900 mb-4">Available Skills</h3>
        <p className="text-slate-700 mb-4">
          Skills are collections of specialized knowledge and workflows for specific tasks.
        </p>
        
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-slate-900">Skill</th>
                <th className="px-6 py-3 text-left text-slate-900">What It Does</th>
                <th className="px-6 py-3 text-left text-slate-900">Who Uses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {skills.map((skill) => (
                <tr key={skill.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <code className="bg-slate-100 px-2 py-1 rounded text-slate-900">{skill.name}</code>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{skill.description}</td>
                  <td className="px-6 py-4 text-slate-600">{skill.roles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How to Use Skills */}
      <Card className="bg-amber-50 border-amber-200">
        <h3 className="text-slate-900 mb-3">How to Use Skills</h3>
        <div className="space-y-3">
          <div>
            <p className="text-slate-900 mb-1"><strong>Request Skill by Name:</strong></p>
            <code className="block bg-white border border-amber-300 rounded p-3 text-slate-700">
              "Help me design an accessible landing page. Use frontend-design skill."
            </code>
          </div>
          
          <div>
            <p className="text-slate-900 mb-1"><strong>Implicit Skill Use:</strong></p>
            <code className="block bg-white border border-amber-300 rounded p-3 text-slate-700 mb-2">
              "Create a detailed presentation on our Q4 results"
            </code>
            <p className="text-slate-600">Claude detects pptx skill is needed and applies it automatically.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
