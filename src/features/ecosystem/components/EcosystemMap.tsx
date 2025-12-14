import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Globe, Monitor, Smartphone, Terminal, Cloud, Cpu, Grid, Layers, Zap, Database } from 'lucide-react';
import { platforms, models, features, mcpServers } from '../../../data/ecosystem';

export function EcosystemMap() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');

  // Filtering Logic
  const filteredPlatforms = platforms.filter(p => 
    (!categoryFilter || p.category === categoryFilter) &&
    (!audienceFilter || p.audience.includes(audienceFilter))
  );

  return (
    <div className="flex flex-col gap-8 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-xl min-h-[600px]">
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select 
          className="p-2 rounded-md border text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Consumer">Consumer</option>
          <option value="Professional">Professional</option>
          <option value="Developer">Developer</option>
          <option value="Enterprise">Enterprise</option>
        </select>

        <select 
          className="p-2 rounded-md border text-sm"
          value={audienceFilter}
          onChange={(e) => setAudienceFilter(e.target.value)}
        >
          <option value="">All Audiences</option>
          <option value="executives">Executives</option>
          <option value="it-security">IT/Security</option>
          <option value="developers">Developers</option>
          <option value="end-users">End Users</option>
        </select>
      </div>

      {/* Level 1: Platforms & Surfaces */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
          <Monitor className="w-4 h-4" /> Platforms & Surfaces ({filteredPlatforms.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPlatforms.map(platform => (
             <MapNode 
               key={platform.id}
               icon={platform.iconChar}
               title={platform.name}
               desc={platform.category}
               color={platform.color}
               onClick={() => alert(`${platform.name}\n\n${platform.description}\n\nROI: ${platform.roi}`)}
             />
          ))}
        </div>
      </div>

      {/* Connection Lines (Visual only) */}
      <div className="h-8 border-l-2 border-r-2 border-gray-200 dark:border-gray-700 w-1/2 mx-auto hidden md:block opacity-30" />

      {/* Level 2: Intelligence Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Models */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Model Tiers
          </h3>
          <div className="flex flex-col gap-3">
             {models.map(model => (
                <div key={model.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 transition-transform hover:scale-105 cursor-pointer" style={{ borderLeftColor: model.color }}>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-base">{model.name} {model.version}</div>
                    <div className="text-xl">{model.iconChar}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{model.bestFor}</div>
                </div>
             ))}
          </div>
        </div>

        {/* Core Features */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Core Capabilities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map(feature => (
              <FeatureNode key={feature.id} icon={feature.iconChar} title={feature.name} />
            ))}
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <div className="h-8 border-l-2 border-r-2 border-gray-200 dark:border-gray-700 w-3/4 mx-auto hidden md:block opacity-30" />

      {/* Level 3: Extensions */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
          <Grid className="w-4 h-4" /> Extension Ecosystem
        </h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-indigo-600">
                <Database className="w-4 h-4" /> MCP Servers
              </h4>
              <div className="flex flex-wrap gap-2">
                {mcpServers.slice(0, 10).map(server => (
                  <span key={server.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded text-xs border border-indigo-100 dark:border-indigo-800 cursor-help" title={server.description}>
                    {server.name}
                  </span>
                ))}
                <span className="px-2 py-1 text-gray-400 text-xs">+300 Community Servers</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-emerald-600">
                <Layers className="w-4 h-4" /> Use Cases
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Research', 'Coding', 'Analysis', 'Automation', 'Design', 'Architecture'].map(n => (
                  <span key={n} className="px-2 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded text-xs border border-emerald-100 dark:border-emerald-800">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function MapNode({ icon, title, desc, color, onClick }: { icon: string, title: string, desc: string, color: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }}></div>
      <div className="mb-2 text-3xl group-hover:scale-110 transition-transform duration-200">{icon}</div>
      <div className="font-bold text-sm text-center leading-tight">{title}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{desc}</div>
    </div>
  );
}

function FeatureNode({ icon, title }: { icon: string, title: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow">
      <div className="text-xl">{icon}</div>
      <div className="font-medium text-sm">{title}</div>
    </div>
  );
}
