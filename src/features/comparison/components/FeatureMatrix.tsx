import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ScrollArea, ScrollBar } from '../../../components/ui/scroll-area';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  MinusCircle, 
  HelpCircle,
  Download
} from 'lucide-react';
import { CAPABILITIES, PLATFORMS, Capability } from '../data/matrixData';

export function FeatureMatrix() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');

  // Filter Capabilities based on Category
  const filteredCapabilities = useMemo(() => {
    if (selectedCategory === 'ALL') return CAPABILITIES;
    return CAPABILITIES.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  // Filter Platforms based on Search
  const filteredPlatforms = useMemo(() => {
    if (!searchQuery) return PLATFORMS;
    return PLATFORMS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const categories = useMemo(() => 
    Array.from(new Set(CAPABILITIES.map(c => c.category))), 
  []);

  // Helper for Score Rendering
  const renderScore = (score: number) => {
    switch (score) {
      case 3:
        return (
          <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
            <span>High</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center gap-1.5 text-amber-600 font-medium">
            <Circle className="w-4 h-4 fill-amber-100" />
            <span>Mid</span>
          </div>
        );
      case 1:
        return (
          <div className="flex items-center justify-center gap-1.5 text-slate-400 font-medium">
            <MinusCircle className="w-4 h-4" />
            <span>Low</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center gap-1.5 text-slate-300">
            <span className="text-xs">N/A</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search platforms..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
             <Button 
                variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('ALL')}
                className="whitespace-nowrap"
              >
                All
              </Button>
            {categories.map(cat => (
              <Button 
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" className="ml-auto shrink-0">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 border rounded-lg bg-white overflow-hidden relative shadow-sm">
        <ScrollArea className="h-full w-full">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-20 shadow-sm">
                <TableRow>
                  <TableHead className="w-[200px] sticky left-0 z-30 bg-slate-50 border-r shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] font-bold text-slate-900">
                    Platform / Model
                  </TableHead>
                  {filteredCapabilities.map(cap => (
                    <TableHead key={cap.id} className="text-center min-w-[140px] border-l border-slate-100 font-semibold text-slate-700">
                      <div className="flex flex-col items-center py-2">
                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">{cap.category}</span>
                        {cap.name}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlatforms.map((platform, idx) => (
                  <TableRow key={platform.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <TableCell className="sticky left-0 z-10 bg-inherit border-r font-medium text-slate-900 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                      <div className="flex flex-col">
                        <span>{platform.name}</span>
                        <span className="text-xs text-slate-500 font-normal">{platform.provider}</span>
                      </div>
                    </TableCell>
                    {filteredCapabilities.map(cap => (
                      <TableCell key={cap.id} className="text-center border-l border-slate-100 p-2">
                        {renderScore(platform.scores[cap.id] || 0)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
