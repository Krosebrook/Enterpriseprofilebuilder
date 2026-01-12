import React from 'react';
import { useAgentStore } from '../hooks/useAgentStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { Info, Shield, Play, TestTube } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';

export function AgentConfiguration() {
  const { 
    name, role, goal, model, temperature, executionMode,
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

      <Card>
        <CardHeader>
          <CardTitle>Execution Mode</CardTitle>
          <CardDescription>
            Control how the agent executes actions and interacts with tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${executionMode === 'simulation' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => updateConfig({ executionMode: 'simulation' })}
            >
              <div className="flex items-start gap-3">
                <TestTube className={`w-5 h-5 mt-0.5 ${executionMode === 'simulation' ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">Simulation Mode</span>
                    <Badge variant="outline" className="text-[10px]">No API Calls</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Mock execution for testing. Tools return simulated data. No real API calls or costs.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${executionMode === 'dry-run' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => updateConfig({ executionMode: 'dry-run' })}
            >
              <div className="flex items-start gap-3">
                <Shield className={`w-5 h-5 mt-0.5 ${executionMode === 'dry-run' ? 'text-amber-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">Dry-Run Mode</span>
                    <Badge variant="outline" className="text-[10px]">Safe Testing</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Uses real Claude API for reasoning but simulates tool execution. Safe for production testing.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${executionMode === 'real' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => updateConfig({ executionMode: 'real' })}
            >
              <div className="flex items-start gap-3">
                <Play className={`w-5 h-5 mt-0.5 ${executionMode === 'real' ? 'text-red-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">Real Execution Mode</span>
                    <Badge variant="destructive" className="text-[10px]">Production</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Full production mode. Real Claude API calls and actual tool execution. Incurs costs and makes real changes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex gap-2 text-xs text-gray-600">
              <Info className="w-4 h-4 shrink-0 text-gray-400" />
              <span>
                {executionMode === 'simulation' && 'Simulation mode is great for initial testing without API costs.'}
                {executionMode === 'dry-run' && 'Dry-run mode lets you test agent reasoning while preventing actual tool execution.'}
                {executionMode === 'real' && '⚠️ Real mode will execute tools and make actual changes. Use with caution.'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}