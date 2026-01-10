import React from 'react';
import { useAgentStore, SavedAgent } from '../hooks/useAgentStore';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Plus, Edit, Trash2, Bot, Calendar, Wrench } from 'lucide-react';
import { format } from 'date-fns';

interface AgentLibraryProps {
  onEdit: (agentId: string) => void;
  onCreate: () => void;
}

export function AgentLibrary({ onEdit, onCreate }: AgentLibraryProps) {
  const { savedAgents, deleteAgent } = useAgentStore();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this agent?')) {
      deleteAgent(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">My Agents</h2>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Agent
        </Button>
      </div>

      {savedAgents.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Bot className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No agents yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Create your first autonomous agent to automate tasks and workflows.
          </p>
          <Button onClick={onCreate}>Create Agent</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedAgents.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onEdit={() => onEdit(agent.id)}
              onDelete={(e) => handleDelete(e, agent.id)}
            />
          ))}
        </div>
      )}
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
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
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
            <Wrench className="w-3 h-3" />
            {agent.selectedToolIds.length} Tools
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(agent.updatedAt, 'MMM d, yyyy')}
          </div>
        </div>
      </div>

      <CardFooter className="pt-0 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
