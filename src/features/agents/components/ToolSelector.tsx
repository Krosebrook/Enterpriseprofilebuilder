import React from 'react';
import { useAgentStore } from '../hooks/useAgentStore';
import { integrations } from '../../../data/integrations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Switch } from '../../../components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { ShieldAlert, Zap } from 'lucide-react';

export function ToolSelector() {
  const { selectedToolIds, toggleTool } = useAgentStore();

  const activeIntegrations = integrations.filter(i => i.status === 'active');
  const betaIntegrations = integrations.filter(i => i.status === 'beta');

  const ToolCard = ({ integration }: { integration: typeof integrations[0] }) => {
    const isSelected = selectedToolIds.includes(integration.id);
    const Icon = integration.icon;

    return (
      <div className={`
        flex items-start space-x-4 p-4 rounded-lg border transition-all
        ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
      `}>
        <div className={`p-2 rounded-md ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{integration.name}</h4>
            <Switch 
              checked={isSelected}
              onCheckedChange={() => toggleTool(integration.id)}
            />
          </div>
          <p className="text-xs text-gray-500 line-clamp-2">
            {integration.description}
          </p>
          {isSelected && (
            <div className="pt-2 flex flex-wrap gap-1">
              {integration.features.slice(0, 3).map(feature => (
                <Badge key={feature} variant="outline" className="text-[10px] px-1 py-0 h-5">
                  {feature}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <ShieldAlert className="h-4 w-4 text-amber-600" />
        <AlertTitle>Security Warning</AlertTitle>
        <AlertDescription className="text-xs">
          Granting tools to an agent allows it to take actions on your behalf. 
          Agents in this environment run in a sandboxed runtime but can still modify data in connected tools.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeIntegrations.map(integration => (
          <ToolCard key={integration.id} integration={integration} />
        ))}
      </div>

      {betaIntegrations.length > 0 && (
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Beta Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {betaIntegrations.map(integration => (
              <ToolCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
