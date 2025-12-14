import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { EcosystemMap } from './components/EcosystemMap';
import { SetupWizard } from './components/SetupWizard';
import { Catalog } from './components/Catalog';
import { Comparison } from './components/Comparison';
import { Map, Wand2, Grid, BarChart3 } from 'lucide-react';

export function EcosystemExplorer() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Claude Ecosystem Explorer</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Navigate the complete landscape of Claude platforms, models, and extensions.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setActiveTab('wizard')} className={activeTab === 'wizard' ? 'bg-primary/10 border-primary text-primary' : ''}>
            <Wand2 className="mr-2 h-4 w-4" />
            Find My Stack
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="map" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
            <Map className="mr-2 h-4 w-4" />
            Ecosystem Map
          </TabsTrigger>
          <TabsTrigger value="catalog" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
            <Grid className="mr-2 h-4 w-4" />
            Component Catalog
          </TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Plan Comparison & ROI
          </TabsTrigger>
          <TabsTrigger value="wizard" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
            <Wand2 className="mr-2 h-4 w-4" />
            Stack Configurator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Interactive Ecosystem Map</CardTitle>
              <CardDescription>Visual overview of all Claude surfaces and capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <EcosystemMap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <Catalog />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Comparison />
        </TabsContent>

        <TabsContent value="wizard" className="space-y-4">
          <SetupWizard onReset={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
