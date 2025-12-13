import React from 'react';
import { Card } from '../../../components/ui/card';
import { Globe, Monitor, Smartphone, Terminal, Cloud, Cpu, Grid, Layers, Shield, Code, Database, Zap } from 'lucide-react';

export function EcosystemMap() {
  return (
    <div className="flex flex-col gap-8 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-xl min-h-[600px]">
      
      {/* Level 1: Platforms & Surfaces */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
          <Monitor className="w-4 h-4" /> Platforms & Surfaces
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MapNode icon={<Globe className="text-blue-500" />} title="Web" desc="claude.ai" />
          <MapNode icon={<Monitor className="text-purple-500" />} title="Desktop" desc="Native App" />
          <MapNode icon={<Smartphone className="text-green-500" />} title="Mobile" desc="iOS / Android" />
          <MapNode icon={<Terminal className="text-gray-500" />} title="CLI" desc="Automation" />
          <MapNode icon={<Cloud className="text-orange-500" />} title="API" desc="Integration" />
        </div>
      </div>

      {/* Connection Lines (Visual only) */}
      <div className="h-4 border-l-2 border-r-2 border-gray-200 dark:border-gray-700 w-1/2 mx-auto hidden md:block" />

      {/* Level 2: Intelligence Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Models */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Model Tiers
          </h3>
          <div className="flex flex-col gap-3">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 border-l-purple-600">
              <div className="font-bold text-lg">Opus</div>
              <div className="text-xs text-gray-500">Complex Reasoning</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 border-l-red-500">
              <div className="font-bold text-lg">Sonnet</div>
              <div className="text-xs text-gray-500">Balanced Performance</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 border-l-yellow-400">
              <div className="font-bold text-lg">Haiku</div>
              <div className="text-xs text-gray-500">Speed & Efficiency</div>
            </div>
          </div>
        </div>

        {/* Core Features */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Core Capabilities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <FeatureNode title="Projects" icon="📂" />
            <FeatureNode title="Artifacts" icon="🎨" />
            <FeatureNode title="Memory" icon="🧠" />
            <FeatureNode title="Voice" icon="🎙️" />
            <FeatureNode title="Analysis" icon="📊" />
            <FeatureNode title="Extended Thinking" icon="🤔" />
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <div className="h-4 border-l-2 border-r-2 border-gray-200 dark:border-gray-700 w-3/4 mx-auto hidden md:block" />

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
                {['Google Drive', 'GitHub', 'Slack', 'Postgres', 'Notion', 'Figma', 'Linear', 'Sentry'].map(n => (
                  <span key={n} className="px-2 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded text-xs border border-indigo-100 dark:border-indigo-800">
                    {n}
                  </span>
                ))}
                <span className="px-2 py-1 text-gray-400 text-xs">+300 Community Servers</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-emerald-600">
                <Code className="w-4 h-4" /> Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Frontend Design', 'Accessibility', 'Data Viz', 'Staff Engineer', 'React Patterns'].map(n => (
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

function MapNode({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
      <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-full">{icon}</div>
      <div className="font-bold text-sm">{title}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{desc}</div>
    </div>
  );
}

function FeatureNode({ icon, title }: { icon: string, title: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-xl">{icon}</div>
      <div className="font-medium text-sm">{title}</div>
    </div>
  );
}
