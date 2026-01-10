import React from 'react';
import { useAgentStore } from '../hooks/useAgentStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';

export function AgentConfiguration() {
  const { 
    name, role, goal, model, temperature, 
    updateConfig 
  } = useAgentStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Identity</CardTitle>
          <CardDescription>
            Define who your agent is and what motivates it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => updateConfig({ name: e.target.value })}
              placeholder="e.g., Code Reviewer Bot"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role / Persona</Label>
            <div className="flex gap-2">
              <Input 
                id="role" 
                value={role} 
                onChange={(e) => updateConfig({ role: e.target.value })}
                placeholder="e.g., Senior Software Engineer"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-gray-400 mt-2.5 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-60">
                      Defines the tone and expertise of the agent. This is injected into the system prompt.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Primary Goal</Label>
            <Textarea 
              id="goal" 
              value={goal} 
              onChange={(e) => updateConfig({ goal: e.target.value })}
              placeholder="What specific outcome is this agent trying to achieve?"
              className="h-24"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Model Selection</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${model === 'claude-3-5-sonnet-20241022' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                onClick={() => updateConfig({ model: 'claude-3-5-sonnet-20241022' })}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Claude 3.5 Sonnet</span>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Best balance of intelligence and speed. Ideal for complex tasks.
                </p>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${model === 'claude-3-opus-20240229' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                onClick={() => updateConfig({ model: 'claude-3-opus-20240229' })}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Claude 3 Opus</span>
                </div>
                <p className="text-sm text-gray-500">
                  Maximum capability for highly nuanced tasks. Slower inference.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <Label>Creativity (Temperature): {temperature}</Label>
              <span className="text-sm text-gray-500">
                {temperature < 0.3 ? 'Precise' : temperature > 0.7 ? 'Creative' : 'Balanced'}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={temperature}
              onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
