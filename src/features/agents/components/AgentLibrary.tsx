import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAgentStore, SavedAgent } from '../hooks/useAgentStore';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Plus, Edit, Trash2, Bot, Calendar, Wrench, Search } from 'lucide-react';
import { format } from 'date-fns';

interface AgentLibraryProps {
  onEdit: (agentId: string) => void;
  onCreate: () => void;
}

export function AgentLibrary({ onEdit, onCreate }: AgentLibraryProps) {
  const { savedAgents, deleteAgent } = useAgentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');

  // Filter and sort agents
  const filteredAgents = useMemo(() => {
    const filtered = savedAgents.filter(agent => 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.goal.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.updatedAt - a.updatedAt;
    });

    return filtered;
  }, [savedAgents, searchQuery, sortBy]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this agent?')) {
      deleteAgent(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">My Agents</h2>
          <p className="text-sm text-gray-500 mt-1">
            {savedAgents.length} {savedAgents.length === 1 ? 'agent' : 'agents'} total
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          Create New Agent
        </Button>
      </div>

      {savedAgents.length === 0 ? (
        <EmptyState onCreate={onCreate} />
      ) : (
        <>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search agents by name, role, or goal"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'date' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('date')}
                aria-pressed={sortBy === 'date'}
              >
                Sort by Date
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
                aria-pressed={sortBy === 'name'}
              >
                Sort by Name
              </Button>
            </div>
          </div>

          {/* Agent Grid with Virtual Scrolling for large lists */}
          {filteredAgents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No agents match your search.</p>
            </div>
          ) : (
            <VirtualizedAgentGrid
              agents={filteredAgents}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <Bot className="w-12 h-12 mx-auto text-gray-300 mb-4" aria-hidden="true" />
      <h3 className="text-lg font-medium text-gray-900">No agents yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Create your first autonomous agent to automate tasks and workflows.
      </p>
      <Button onClick={onCreate}>
        <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
        Create Your First Agent
      </Button>
    </div>
  );
}

/**
 * Virtual scrolling implementation for large agent lists
 * Only renders visible items + buffer for smooth scrolling
 */
function VirtualizedAgentGrid({
  agents,
  onEdit,
  onDelete
}: {
  agents: SavedAgent[];
  onEdit: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  // For small lists, don't bother with virtualization
  if (agents.length < 50) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        {agents.map((agent) => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onEdit={() => onEdit(agent.id)}
            onDelete={(e) => onDelete(e, agent.id)}
          />
        ))}
      </div>
    );
  }

  // For large lists, implement virtual scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = 280; // Approximate card height
      const viewportHeight = container.clientHeight;
      const buffer = 5; // Render 5 items above and below viewport

      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
      const visibleCount = Math.ceil(viewportHeight / itemHeight) + buffer * 2;
      const end = Math.min(agents.length, start + visibleCount);

      setVisibleRange({ start, end });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => container.removeEventListener('scroll', handleScroll);
  }, [agents.length]);

  const visibleAgents = agents.slice(visibleRange.start, visibleRange.end);
  const offsetTop = visibleRange.start * 280; // Approximate card height
  const totalHeight = agents.length * 280;

  return (
    <div 
      ref={containerRef} 
      className="overflow-y-auto max-h-[calc(100vh-300px)]"
      role="list"
      aria-label="Agent list"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${offsetTop}px)`,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {visibleAgents.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onEdit={() => onEdit(agent.id)}
              onDelete={(e) => onDelete(e, agent.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent, onEdit, onDelete }: { 
  agent: SavedAgent; 
  onEdit: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <Card 
      className="group hover:shadow-md transition-all cursor-pointer border-gray-200 hover:border-primary/50"
      onClick={onEdit}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit();
        }
      }}
      aria-label={`Agent: ${agent.name}. Role: ${agent.role}. Click to edit.`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3" aria-hidden="true">
            <Bot className="w-6 h-6" />
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {agent.model.split('-')[2] || 'Sonnet'}
          </Badge>
        </div>
        <CardTitle className="text-lg">{agent.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {agent.role}
        </CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-4">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Wrench className="w-3 h-3" aria-hidden="true" />
            <span aria-label={`${agent.selectedToolIds.length} tools configured`}>
              {agent.selectedToolIds.length} Tools
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <time dateTime={new Date(agent.updatedAt).toISOString()}>
              {format(agent.updatedAt, 'MMM d, yyyy')}
            </time>
          </div>
        </div>
      </div>

      <CardFooter className="pt-0 flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDelete} 
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          aria-label={`Delete agent ${agent.name}`}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          aria-label={`Edit agent ${agent.name}`}
        >
          <Edit className="w-4 h-4 mr-2" aria-hidden="true" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
