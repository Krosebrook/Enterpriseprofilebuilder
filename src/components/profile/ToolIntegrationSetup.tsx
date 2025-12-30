import { useState } from 'react';
import { Github, MessageSquare, Figma, Database, CreditCard, FileSpreadsheet, Cloud, Check, X, ExternalLink, Search } from 'lucide-react';
import { useProfileStore, ToolConnection } from '../../stores/profileStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'development' | 'communication' | 'design' | 'data' | 'finance' | 'productivity';
  authType: 'oauth' | 'api-key' | 'none';
  popular?: boolean;
}

const TOOLS: Tool[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repositories, issues, and pull requests',
    icon: Github,
    category: 'development',
    authType: 'oauth',
    popular: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team messaging and notifications',
    icon: MessageSquare,
    category: 'communication',
    authType: 'oauth',
    popular: true,
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Design files and prototypes',
    icon: Figma,
    category: 'design',
    authType: 'oauth',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Database queries and analysis',
    icon: Database,
    category: 'data',
    authType: 'api-key',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment and billing data',
    icon: CreditCard,
    category: 'finance',
    authType: 'api-key',
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    description: 'Spreadsheets and data',
    icon: FileSpreadsheet,
    category: 'productivity',
    authType: 'oauth',
    popular: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Docs, wikis, and databases',
    icon: Cloud,
    category: 'productivity',
    authType: 'oauth',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM and marketing automation',
    icon: Cloud,
    category: 'data',
    authType: 'api-key',
    popular: true,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Tools' },
  { id: 'development', label: 'Development' },
  { id: 'communication', label: 'Communication' },
  { id: 'design', label: 'Design' },
  { id: 'data', label: 'Data' },
  { id: 'finance', label: 'Finance' },
  { id: 'productivity', label: 'Productivity' },
];

export function ToolIntegrationSetup() {
  const { currentProfile, updateToolConnection } = useProfileStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [configuringTool, setConfiguringTool] = useState<string | null>(null);

  const connectedTools = currentProfile.connectedTools;

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getConnectionStatus = (toolId: string): ToolConnection | undefined => {
    return connectedTools.find((t) => t.id === toolId);
  };

  const handleConnect = (tool: Tool) => {
    const newConnection: ToolConnection = {
      id: tool.id,
      name: tool.name,
      category: tool.category,
      connected: true,
      apiKeyConfigured: tool.authType === 'api-key',
      lastSynced: new Date(),
    };
    updateToolConnection(newConnection);
    setConfiguringTool(null);
  };

  const handleDisconnect = (toolId: string) => {
    const existing = getConnectionStatus(toolId);
    if (existing) {
      updateToolConnection({ ...existing, connected: false });
    }
  };

  const connectedCount = connectedTools.filter((t) => t.connected).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Connect Your Tools</h2>
        <p className="text-slate-600 mt-2">
          Integrate Claude with your existing tools for seamless workflows
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? 'bg-amber-500 hover:bg-amber-600' : ''}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Badge variant="default">
            {connectedCount} tool{connectedCount !== 1 ? 's' : ''} connected
          </Badge>
        </div>
        {connectedCount > 0 && (
          <span className="text-sm text-emerald-600 flex items-center gap-1">
            <Check className="w-4 h-4" />
            Ready to sync
          </span>
        )}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          const connection = getConnectionStatus(tool.id);
          const isConnected = connection?.connected || false;
          const isConfiguring = configuringTool === tool.id;

          return (
            <Card
              key={tool.id}
              className={`p-5 transition-all duration-200 ${
                isConnected ? 'bg-emerald-50 border-emerald-200' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isConnected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{tool.name}</h3>
                      {tool.popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{tool.description}</p>

                    {isConnected && connection?.lastSynced && (
                      <p className="text-xs text-emerald-600 mt-2">
                        Last synced: {new Date(connection.lastSynced).toLocaleDateString()}
                      </p>
                    )}

                    <Badge variant="outline" className="mt-2 text-xs">
                      {tool.authType === 'oauth' ? 'OAuth' : tool.authType === 'api-key' ? 'API Key' : 'No Auth'}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {isConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(tool.id)}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Disconnect
                    </Button>
                  ) : isConfiguring ? (
                    <div className="space-y-2">
                      <Input
                        placeholder={tool.authType === 'api-key' ? 'API Key' : 'Connecting...'}
                        className="text-sm w-40"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConnect(tool)}
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          Connect
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfiguringTool(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfiguringTool(tool.id)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <p className="text-slate-500">No tools found matching your search.</p>
          <Button
            variant="link"
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
