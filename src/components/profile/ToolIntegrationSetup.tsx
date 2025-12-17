import { useState } from 'react';
import { Github, Trello, Slack, Figma, Database, CreditCard, FileSpreadsheet, Cloud, Check, X, ExternalLink, Search } from 'lucide-react';
import { useProfileStore } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'development' | 'productivity' | 'communication' | 'design' | 'data' | 'finance';
  roles: string[];
  authType: 'oauth' | 'api-key' | 'none';
}

const tools: Tool[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Access repositories, issues, and pull requests',
    icon: Github,
    category: 'development',
    roles: ['Engineering', 'QA / Testing', 'Data Science'],
    authType: 'oauth',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Search messages and access channel history',
    icon: Slack,
    category: 'communication',
    roles: ['All'],
    authType: 'oauth',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Access workspace pages and databases',
    icon: Database,
    category: 'productivity',
    roles: ['All'],
    authType: 'api-key',
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'View designs and export assets',
    icon: Figma,
    category: 'design',
    roles: ['Marketing', 'Product Management', 'Engineering'],
    authType: 'api-key',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Access payment data and analytics',
    icon: CreditCard,
    category: 'finance',
    roles: ['Finance', 'Sales', 'Executive / Leadership'],
    authType: 'api-key',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Access CRM data and contacts',
    icon: Cloud,
    category: 'productivity',
    roles: ['Sales', 'Marketing', 'Customer Support'],
    authType: 'api-key',
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Manage issues and project tracking',
    icon: Trello,
    category: 'development',
    roles: ['Engineering', 'Product Management', 'QA / Testing'],
    authType: 'api-key',
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    description: 'Read and write spreadsheet data',
    icon: FileSpreadsheet,
    category: 'data',
    roles: ['Finance', 'Operations', 'Data Science'],
    authType: 'oauth',
  },
];

const categoryLabels: Record<string, string> = {
  development: 'Development',
  productivity: 'Productivity',
  communication: 'Communication',
  design: 'Design',
  data: 'Data',
  finance: 'Finance',
};

export function ToolIntegrationSetup() {
  const { currentProfile, connectTool, disconnectTool } = useProfileStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const connectedTools = currentProfile.connectedTools || [];
  const isConnected = (toolId: string) => connectedTools.some(t => t.id === toolId && t.connected);

  // Filter tools based on search and category
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group tools by category
  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  // Get recommended tools based on role
  const recommendedTools = tools.filter(tool =>
    tool.roles.includes('All') || tool.roles.includes(currentProfile.role || '')
  );

  const categories = ['development', 'productivity', 'communication', 'design', 'data', 'finance'];

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-intNeutral-400" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>
      </div>

      {/* Connection Summary */}
      <div className="flex items-center gap-4">
        <Badge variant="success">
          {connectedTools.filter(t => t.connected).length} Connected
        </Badge>
        <span className="text-sm text-intNeutral-500">
          {recommendedTools.length} tools recommended for {currentProfile.role || 'your role'}
        </span>
      </div>

      {/* Tools Grid */}
      <div className="space-y-6">
        {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-intNeutral-700 mb-3">
              {categoryLabels[category]}
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {categoryTools.map(tool => {
                const connected = isConnected(tool.id);
                const isRecommended = recommendedTools.some(t => t.id === tool.id);
                const Icon = tool.icon;

                return (
                  <Card
                    key={tool.id}
                    className={`p-4 transition-all ${
                      connected
                        ? 'border-intSuccess-300 bg-intSuccess-50/50'
                        : 'border-intNeutral-200 hover:border-intNeutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${connected ? 'bg-intSuccess-100' : 'bg-intNeutral-100'}`}>
                          <Icon className={`w-5 h-5 ${connected ? 'text-intSuccess-600' : 'text-intNeutral-500'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-intNeutral-900">{tool.name}</h5>
                            {isRecommended && !connected && (
                              <Badge variant="info" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                          <p className="text-xs text-intNeutral-500 mt-0.5">{tool.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="neutral" className="text-xs">
                              {tool.authType === 'oauth' ? 'OAuth' : tool.authType === 'api-key' ? 'API Key' : 'No Auth'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant={connected ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => connected ? disconnectTool(tool.id) : connectTool(tool.id)}
                        className={connected ? 'text-intError-600 border-intError-300 hover:bg-intError-50' : ''}
                      >
                        {connected ? (
                          <>
                            <X className="w-4 h-4 mr-1" />
                            Disconnect
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* MCP Servers Note */}
      <Card className="p-4 bg-intInfo-50 border-intInfo-200">
        <h4 className="font-medium text-intInfo-900 mb-2">MCP Server Integration</h4>
        <p className="text-sm text-intInfo-700 mb-3">
          For advanced integrations, you can configure MCP (Model Context Protocol) servers.
          These provide deeper integration capabilities with your tools and services.
        </p>
        <Button variant="outline" size="sm" className="text-intInfo-700 border-intInfo-300">
          <ExternalLink className="w-4 h-4 mr-2" />
          Configure MCP Servers
        </Button>
      </Card>
    </div>
  );
}
