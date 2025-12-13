import React from 'react';
import { platforms, models, features, mcpServers, skills, plans } from '../../../data/ecosystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Monitor, Cpu, Layers, Plug, BookOpen, CreditCard } from 'lucide-react';

export function Catalog() {
  return (
    <div className="space-y-6">
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
            {platforms.map((platform) => (
              <Card key={platform.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{platform.name}</CardTitle>
                    <Badge variant="outline">{platform.type}</Badge>
                  </div>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Best For</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{platform.bestFor}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {platform.features.map(f => (
                          <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="h-full flex flex-col border-t-4 border-t-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{model.name} {model.version}</CardTitle>
                    <Badge variant={model.id.includes('opus') ? 'default' : 'secondary'}>{model.context}</Badge>
                  </div>
                  <CardDescription className="flex gap-2 mt-2">
                    <Badge variant="outline">Speed: {model.speed}</Badge>
                    <Badge variant="outline">Cost: {model.cost}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{model.bestFor}</p>
                  <div className="space-y-2">
                    {model.capabilities.map(cap => (
                      <div key={cap} className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {cap}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                   <div className="flex flex-wrap gap-1">
                     {feature.platforms.map(p => (
                       <Badge key={p} variant="outline" className="text-[10px] uppercase">{p}</Badge>
                     ))}
                   </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="extensions" className="mt-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Official MCP Servers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mcpServers.map((server) => (
                  <Card key={server.id} className="bg-gray-50 dark:bg-gray-900/50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{server.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">{server.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">{server.description}</p>
                    </CardContent>
                  </Card>
                ))}
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
                        <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 hover:bg-indigo-200">{skill.type}</Badge>
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
              <Card key={plan.id} className={`flex flex-col ${plan.id === 'enterprise' ? 'border-primary shadow-lg scale-105' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold mt-2">{plan.price}</div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <button className={`w-full py-2 px-4 rounded-md font-semibold ${
                    plan.id === 'enterprise' 
                      ? 'bg-primary text-white hover:bg-primary-hover' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white'
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
