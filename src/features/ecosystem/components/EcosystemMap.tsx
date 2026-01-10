import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { platforms, models } from '../../../data/ecosystem';

export function EcosystemMap() {
  return (
    <div className="relative w-full h-[600px] bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8">
      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] opacity-[0.05] pointer-events-none">
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="border border-slate-900 dark:border-white" />
        ))}
      </div>

      {/* Central Hub: Claude Models */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white dark:bg-slate-800 rounded-full shadow-2xl border-4 border-amber-500/20 flex items-center justify-center z-20">
        <div className="text-center">
          <div className="text-4xl mb-2">🤖</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Claude Models</h3>
          <div className="flex gap-2 justify-center mt-2">
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-bold">Haiku</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-bold">Sonnet</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-bold">Opus</span>
          </div>
        </div>
      </div>

      {/* Orbit 1: Platforms */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 pointer-events-none z-10" />
      
      {/* Platform Nodes */}
      {platforms.map((platform, i) => {
        const angle = (i / platforms.length) * 2 * Math.PI - Math.PI / 2; // Start from top
        const radius = 225; // Half of 450
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div 
            key={platform.id}
            className="absolute top-1/2 left-1/2 w-32 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer z-20"
            style={{ 
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` 
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded flex items-center justify-center text-xs text-white" style={{ backgroundColor: platform.color }}>
                {platform.iconChar}
              </div>
              <span className="text-xs font-bold truncate">{platform.name}</span>
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
              {platform.category}
            </div>
          </div>
        );
      })}

      {/* Connections (Visual Lines) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
         {/* Lines from Center to Platforms */}
         {platforms.map((platform, i) => {
            const angle = (i / platforms.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 225;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Center of container is 50%, 50%
            // SVG uses absolute coordinates. We need to map relative 0,0 center to svg center.
            // Let's assume the container is roughly fixed or we use % based lines? 
            // Better to just draw lines radiating from center 50% 50%
            
            return (
              <line 
                key={i}
                x1="50%" 
                y1="50%" 
                x2={`calc(50% + ${x*0.9}px)`} // Stop slightly before the card
                y2={`calc(50% + ${y*0.9}px)`} 
                stroke="#CBD5E1" 
                strokeWidth="1" 
                strokeDasharray="4 4"
                className="dark:stroke-slate-700"
              />
            );
         })}
      </svg>
      
      {/* Legend / Controls */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm z-30">
        <div className="text-xs font-bold mb-2 uppercase text-slate-500">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-xs">Core Models</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-slate-400 border-dashed"></div>
            <span className="text-xs">Platform Integration</span>
          </div>
        </div>
      </div>

    </div>
  );
}
