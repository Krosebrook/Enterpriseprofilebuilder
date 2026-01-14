import React, { useState } from 'react';
import { Search, Filter, FileText, Download, Shield, Hash, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';

interface EvidenceItem {
  id: string;
  title: string;
  type: 'log' | 'report' | 'export' | 'decision';
  status: 'verified' | 'pending' | 'flagged';
  timestamp: string;
  hash: string;
  owner: string;
  description: string;
}

const MOCK_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-2026-001',
    title: 'Agent "SalesBot" Tool Access Grant',
    type: 'decision',
    status: 'verified',
    timestamp: '2026-01-12T14:30:00Z',
    hash: 'sha256:7f8a...9b2c',
    owner: 'Admin User',
    description: 'Granted access to "Salesforce" integration for Agent ID: agt_12345.'
  },
  {
    id: 'EV-2026-002',
    title: 'Weekly Security Scan Report',
    type: 'report',
    status: 'verified',
    timestamp: '2026-01-12T09:00:00Z',
    hash: 'sha256:3a1b...8c4d',
    owner: 'System',
    description: 'Automated vulnerability scan of agent runtime environment. No critical issues found.'
  },
  {
    id: 'EV-2026-003',
    title: 'Dry-Run Execution Log: Data Analysis',
    type: 'log',
    status: 'pending',
    timestamp: '2026-01-11T16:45:00Z',
    hash: 'sha256:1e2f...5a6b',
    owner: 'Data Analyst',
    description: 'Execution log for "Market Analysis" agent. Flagged for review due to high token usage.'
  },
  {
    id: 'EV-2026-004',
    title: 'GDPR Compliance Export',
    type: 'export',
    status: 'verified',
    timestamp: '2026-01-10T11:20:00Z',
    hash: 'sha256:9c8d...7e6f',
    owner: 'Compliance Officer',
    description: 'Full data export for user request #4421 pursuant to Article 15.'
  }
];

export function EvidenceViewer() {
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(MOCK_EVIDENCE[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvidence = MOCK_EVIDENCE.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-100px)] min-h-[600px] border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Left Navigation / Sidebar */}
      <div className="w-64 bg-slate-50 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#E97132]" />
            Compliance Vault
          </h2>
        </div>
        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            <Button variant="ghost" className="w-full justify-start font-medium bg-white shadow-sm border border-slate-200">
              <FileText className="w-4 h-4 mr-2 text-slate-500" />
              Evidence Packs
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600">
              <Download className="w-4 h-4 mr-2 text-slate-400" />
              Exports
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600">
              <CheckCircle className="w-4 h-4 mr-2 text-slate-400" />
              Decisions Log
            </Button>
          </nav>
        </div>
        <div className="p-4 border-t bg-slate-100/50">
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-mono">Vault Status: SECURE</p>
            <p className="font-mono">Last Sync: Just now</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-16 border-b flex items-center px-6 gap-4 bg-white">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search evidence by ID, title, or hash..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* List View */}
          <div className="w-1/3 border-r bg-slate-50/30 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {filteredEvidence.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedItem?.id === item.id 
                        ? 'bg-white border-[#E97132] shadow-sm ring-1 ring-[#E97132]/10' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-[10px] text-slate-400">{item.id}</span>
                      <Badge variant={
                        item.status === 'verified' ? 'success' : 
                        item.status === 'flagged' ? 'destructive' : 'warning'
                      } className="text-[10px] px-1 h-4">
                        {item.status}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-medium text-slate-900 line-clamp-1 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Detail View */}
          <div className="flex-1 bg-white p-8 overflow-y-auto">
            {selectedItem ? (
              <div className="max-w-2xl mx-auto space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="uppercase tracking-widest text-[10px]">
                      {selectedItem.type}
                    </Badge>
                    <span className="font-mono text-xs text-slate-400">
                      ID: {selectedItem.id}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedItem.title}</h1>
                  <p className="text-slate-600">{selectedItem.description}</p>
                </div>

                <Card className="bg-slate-50 border-slate-200">
                  <div className="p-4 grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Cryptographic Hash
                      </label>
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-700 bg-white p-2 rounded border border-slate-200">
                        <Hash className="w-3 h-3 text-slate-400" />
                        {selectedItem.hash}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Timestamp (UTC)
                      </label>
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-700 bg-white p-2 rounded border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(selectedItem.timestamp).toISOString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Principal / Owner
                      </label>
                      <div className="text-sm font-medium text-slate-700">
                        {selectedItem.owner}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Verification Status
                      </label>
                      <div className="flex items-center gap-2">
                        {selectedItem.status === 'verified' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {selectedItem.status === 'flagged' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <span className="text-sm font-medium capitalize">{selectedItem.status}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2">
                    Metadata & Context
                  </h3>
                  <div className="prose prose-sm text-slate-600">
                    <p>
                      This record is immutable and has been cryptographically signed by the INT Inc. Governance Ledger.
                      Any attempt to modify this record will result in a hash mismatch.
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Source System: Agent Runtime Environment v2.4</li>
                      <li>Compliance Framework: SOC 2 Type II</li>
                      <li>Retention Period: 7 Years</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>Select an evidence item to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
