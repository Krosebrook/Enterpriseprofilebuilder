import React, { useState } from 'react';
import { AgentConfiguration } from './components/AgentConfiguration';
import { ToolSelector } from './components/ToolSelector';
import { TestPlayground } from './components/TestPlayground';
import { AgentLibrary } from './components/AgentLibrary';
import { useAgentStore } from './hooks/useAgentStore';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Save, ArrowLeft } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

type ViewMode = 'library' | 'builder';

export function AgentBuilder() {
  const { 
    name, 
    activeTab, 
    setActiveTab, 
    selectedToolIds,
    saveCurrentAgent,
    createNewAgent,
    loadAgent,
    currentAgentId
  } = useAgentStore();
  
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('library');

  const handleSave = () => {
    if (!name || name.trim() === '') {
      addToast({
        title: "Validation Error",
        description: "Agent Name is required.",
        type: "error"
      });
      return;
    }

    try {
      saveCurrentAgent();
      addToast({
        title: "Agent Saved",
        description: `${name} has been saved to your library.`,
        type: "success"
      });
    } catch (error) {
      console.error("Failed to save agent:", error);
      addToast({
        title: "Save Failed",
        description: "An error occurred while saving the agent.",
        type: "error"
      });
    }
  };

  const handleCreateNew = () => {
    createNewAgent();
    setViewMode('builder');
  };

  const handleEdit = (agentId: string) => {
    loadAgent(agentId);
    setViewMode('builder');
  };

  const handleBackToLibrary = () => {
    setViewMode('library');
  };

  if (viewMode === 'library') {
    return (
      <div className="space-y-6 pb-20">
        <SectionHeader 
          title="Autonomous Agent Library" 
          description="Manage your fleet of AI agents."
          badge="Phase 11"
        />
        <AgentLibrary onCreate={handleCreateNew} onEdit={handleEdit} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader 
        title={currentAgentId ? `Edit Agent: ${name}` : "Create New Agent"}
        description="Design, configure, and test custom AI agents powered by Claude."
        badge="Builder"
      />

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)] min-h-[600px]">
        
        {/* Left Column: Configuration & Tools */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Configuration</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleBackToLibrary}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Library
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Agent
              </Button>
            </div>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v)} 
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">Identity & Model</TabsTrigger>
              <TabsTrigger value="tools">Tools & Skills</TabsTrigger>
            </TabsList>

            <div className="mt-4 flex-1 overflow-y-auto pr-2">
              <TabsContent value="config" className="mt-0">
                <AgentConfiguration />
              </TabsContent>
              <TabsContent value="tools" className="mt-0">
                <ToolSelector />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Column: Test Playground */}
        <div className="lg:w-[450px] flex flex-col border-t lg:border-t-0 lg:border-l pl-0 lg:pl-6 pt-6 lg:pt-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
            <span>Test Playground</span>
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Live Preview
            </span>
          </h2>
          <div className="flex-1 min-h-[400px]">
            <TestPlayground />
          </div>
        </div>
      </div>
    </div>
  );
}
