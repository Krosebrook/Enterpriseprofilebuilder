import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { EcosystemMap } from './components/EcosystemMap';
import { SetupWizard } from './components/SetupWizard';
import { Catalog } from './components/Catalog';
import { Comparison } from './components/Comparison';
import { Map, Wand2, Grid, BarChart3, Loader2, FileJson } from 'lucide-react';
import { useEcosystemStore } from './hooks/useEcosystemStore';
import { generateArchitecture } from '../../lib/api/architect';
import { useToast } from '../../contexts/ToastContext';

export function EcosystemExplorer() {
  const [activeTab, setActiveTab] = useState('map');
  const { generatedArchitecture, isGenerating, setGenerating } = useEcosystemStore();
  const { addToast } = useToast();
  const [architectResult, setArchitectResult] = useState<any>(null);

  const handleGenerateArchitecture = async () => {
    if (!generatedArchitecture) return;

    setGenerating(true);
    addToast({ title: "Generating Architecture...", type: "info" });
    
    try {
      const result = await generateArchitecture({
        platform: generatedArchitecture.platform,
        model: generatedArchitecture.model,
        features: generatedArchitecture.features,
        useCase: generatedArchitecture.useCaseName
      });
      setArchitectResult(result);
      addToast({ title: "Architecture Generated", type: "success" });
    } catch (error) {
      addToast({ title: "Generation Failed", description: "Using offline fallback.", type: "error" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Claude Ecosystem Explorer</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Navigate the complete landscape of Claude platforms, models, and extensions.
          </p>
        </div>
        <div className="flex space-x-2">
          {generatedArchitecture && activeTab === 'wizard' && (
             <Button 
               onClick={handleGenerateArchitecture} 
               disabled={isGenerating}
               className="bg-purple-600 hover:bg-purple-700 text-white"
             >
               {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileJson className="mr-2 h-4 w-4" />}
               Generate Architecture Doc
             </Button>
          )}
          <Button variant="outline" onClick={() => setActiveTab('wizard')} className={activeTab === 'wizard' ? 'bg-primary/10 border-primary text-primary' : ''}>
            <Wand2 className="mr-2 h-4 w-4" />
            Find My Stack
          </Button>
        </div>
      </div>

      {architectResult && (
        <Card className="bg-slate-50 border-purple-200 dark:bg-slate-900/50 dark:border-purple-900 mb-6">
           <CardHeader>
             <CardTitle>AI Generated Architecture: {generatedArchitecture.useCaseName}</CardTitle>
             <CardDescription>{architectResult.summary}</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <h4 className="font-bold mb-2">Deployment Steps</h4>
                 <ul className="list-decimal pl-5 space-y-1 text-sm">
                   {architectResult.steps.map((step: string, i: number) => (
                     <li key={i}>{step}</li>
                   ))}
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold mb-2">Security Controls</h4>
                 <ul className="list-disc pl-5 space-y-1 text-sm text-red-600 dark:text-red-400">
                   {architectResult.securityConsiderations.map((sec: string, i: number) => (
                     <li key={i}>{sec}</li>
                   ))}
                 </ul>
               </div>
             </div>
           </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full md:w-auto overflow-x-auto flex justify-start">
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
          <SetupWizard onReset={() => setArchitectResult(null)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
