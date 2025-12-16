import React from 'react';
import { platforms, models, features, mcpServers, skills, plans } from '../../../data/ecosystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Monitor, Cpu, Layers, Plug, CreditCard, CheckCircle } from 'lucide-react';
import { useEcosystemStore } from '../hooks/useEcosystemStore';
import { cn } from '../../../lib/utils';

export function Catalog() {
  const { 
    selectedPlatforms, togglePlatform,
    selectedModels, toggleModel,
    selectedServers, toggleServer,
    selectedSkills, toggleSkill
  } = useEcosystemStore();

  const isSelected = (id: string, list: string[]) => list.includes(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Component Library</h3>
        <Badge variant="outline" className="text-muted-foreground">
          {selectedPlatforms.length + selectedModels.length + selectedServers.length} Items Selected
        </Badge>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="platforms"><Monitor className="mr-2 h-4 w-4"/>Platforms</TabsTrigger>
          <TabsTrigger value="models"><Cpu className="mr-2 h-4 w-4"/>Models</TabsTrigger>
          <TabsTrigger value="features"><Layers className="mr-2 h-4 w-4"/>Features</TabsTrigger>
          <TabsTrigger value="extensions"><Plug className="mr-2 h-4 w-4"/>Extensions</TabsTrigger>
          <TabsTrigger value="plans"><CreditCard className="mr-2 h-4 w-4"/>Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const selected = isSelected(platform.id, selectedPlatforms);
              return (
                <Card 
                  key={platform.id} 
                  className={cn(
                    "h-full flex flex-col border-t-4 transition-all cursor-pointer hover:shadow-md",
                    selected ? "ring-2 ring-primary ring-offset-2" : ""
                  )} 
                  style={{ borderTopColor: platform.color }}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl text-white shadow-sm" style={{ backgroundColor: platform.color }}>
                          {platform.iconChar}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{platform.name}</CardTitle>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{platform.category}</div>
                        </div>
                      </div>
                      {selected && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                    <CardDescription className="mt-2 line-clamp-3">{platform.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Best For</h4>
                        <p className="text-sm">{platform.bestFor}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Key Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {platform.features.slice(0, 4).map(f => (
                            <Badge key={f} variant="secondary" className="text-xs capitalize">{f.replace('-', ' ')}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model) => {
              const selected = isSelected(model.id, selectedModels);
              return (
                <Card 
                  key={model.id} 
                  className={cn(
                    "h-full flex flex-col border-t-4 transition-all cursor-pointer hover:shadow-md",
                    selected ? "ring-2 ring-primary ring-offset-2" : ""
                  )}
                  style={{ borderTopColor: model.color }}
                  onClick={() => toggleModel(model.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-3xl mb-2">{model.iconChar}</div>
                        <CardTitle className="text-xl">{model.name} {model.version}</CardTitle>
                        <div className="text-sm font-medium" style={{ color: model.color }}>{model.tier} Tier</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={model.tier === 'Premium' ? 'default' : 'secondary'}>
                          ${model.pricing.input} / ${model.pricing.output}
                        </Badge>
                        {selected && <CheckCircle className="h-5 w-5 text-primary" />}
                      </div>
                    </div>
                    <CardDescription className="mt-2">{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Capabilities</div>
                      <div className="flex flex-wrap gap-1.5">
                        {model.capabilities.map(cap => (
                          <Badge key={cap} variant="outline" className="text-xs capitalize">{cap.replace('-', ' ')}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Context:</span> {model.context}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{feature.iconChar}</div>
                    <div>
                      <CardTitle className="text-base">{feature.name}</CardTitle>
                      <CardDescription className="text-xs">{feature.category}</CardDescription>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardHeader>
                <CardContent>
                   <div className="flex flex-wrap gap-1">
                     {feature.valueProps.map(vp => (
                       <Badge key={vp} variant="secondary" className="text-[10px]">{vp}</Badge>
                     ))}
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="extensions" className="mt-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Official MCP Servers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mcpServers.map((server) => {
                  const selected = isSelected(server.id, selectedServers);
                  return (
                    <Card 
                      key={server.id} 
                      className={cn(
                        "bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100 transition-colors",
                        selected ? "ring-2 ring-primary ring-offset-1 bg-white dark:bg-gray-800" : ""
                      )}
                      onClick={() => toggleServer(server.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm font-bold">{server.name}</CardTitle>
                          {selected ? <CheckCircle className="h-4 w-4 text-primary" /> : <Badge variant="outline" className="text-[10px]">{server.category}</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-500 line-clamp-2">{server.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Recommended Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <Card key={skill.id} className="bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{skill.name}</CardTitle>
                        <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">{skill.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{skill.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`flex flex-col ${plan.id === 'enterprise' ? 'border-primary shadow-lg relative overflow-hidden' : ''}`}>
                {plan.id === 'enterprise' && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] px-2 py-1 rounded-bl">RECOMMENDED</div>}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold mt-2">{plan.price}</div>
                  <CardDescription className="text-xs mt-1">{plan.bestFor}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                        <span className="text-muted-foreground">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <button className={`w-full py-2 px-4 rounded-md font-semibold text-sm ${
                    plan.id === 'enterprise' 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}>
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Select Plan'}
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
