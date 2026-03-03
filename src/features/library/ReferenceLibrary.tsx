import React, { useState, useMemo } from 'react';
import { Library, FileText, Calendar, ChevronRight, Download, Filter } from 'lucide-react';
import { referenceDocs, ReferenceDoc } from '../../data/reference-docs';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useNavigation } from '../../contexts/NavigationContext';
import { Role } from '../../types';

export function ReferenceLibrary() {
  const [selectedDoc, setSelectedDoc] = useState<ReferenceDoc | null>(null);
  const { selectedRole } = useNavigation();

  // Role-based filtering logic
  const filteredDocs = useMemo(() => {
    if (selectedRole === 'All') return referenceDocs;

    return referenceDocs.filter(doc => {
      // Map categories to relevant roles
      const relevantRoles: Record<string, Role[]> = {
        'Executive': ['Executive / Leadership', 'Product Management', 'Finance', 'Strategy' as any],
        'Technical': ['Engineering', 'Data Science', 'Operations / IT', 'QA / Testing'],
        'Strategy': ['Executive / Leadership', 'Product Management', 'Marketing', 'Sales'],
        'Operations': ['Operations / IT', 'HR', 'Customer Support', 'Legal', 'Sales']
      };

      const allowedRoles = relevantRoles[doc.category] || [];
      return allowedRoles.includes(selectedRole);
    });
  }, [selectedRole]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col">
      <SectionHeader 
        title="Reference Library" 
        description="Official internal documentation, executive assessments, and strategic roadmaps for Claude Enterprise."
        icon={Library}
      />

      {selectedRole !== 'All' && (
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-amber-50 px-3 py-2 rounded-lg w-fit border border-amber-100">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>Showing documents relevant to <span className="font-bold text-slate-900">{selectedRole}</span></span>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Document List */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`text-left transition-all duration-200 group ${
                  selectedDoc?.id === doc.id ? 'transform scale-[1.02]' : 'hover:transform hover:scale-[1.01]'
                }`}
              >
                <Card className={`h-full border-l-4 ${
                  selectedDoc?.id === doc.id 
                    ? 'border-l-amber-500 ring-1 ring-amber-500/20 shadow-md' 
                    : 'border-l-transparent hover:border-l-slate-300'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={
                      doc.category === 'Executive' ? 'warning' : 
                      doc.category === 'Technical' ? 'info' : 
                      'default'
                    } className="text-[10px] uppercase tracking-wider">
                      {doc.category}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">{doc.version}</span>
                  </div>
                  
                  <h3 className={`font-bold text-sm mb-2 line-clamp-2 ${
                    selectedDoc?.id === doc.id ? 'text-amber-700' : 'text-slate-900'
                  }`}>
                    {doc.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-3 mb-3">
                    {doc.summary}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-2 mt-auto">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {doc.date}
                    </div>
                    {selectedDoc?.id === doc.id && (
                      <ChevronRight className="w-4 h-4 text-amber-500 ml-auto" />
                    )}
                  </div>
                </Card>
              </button>
            ))
          ) : (
             <div className="text-center p-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
               <p className="text-slate-500 text-sm">No documents found for this role.</p>
             </div>
          )}
        </div>

        {/* Document Viewer */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {selectedDoc ? (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">{selectedDoc.title}</h2>
                  <div className="flex gap-2 mt-1">
                    {selectedDoc.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Download / Copy"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDoc.content);
                  }}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
                <article className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-amber-600">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                    {selectedDoc.content}
                  </pre>
                </article>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-2">Select a Document</h3>
              <p className="max-w-xs mx-auto text-sm">
                Choose a document from the library to view its contents, guidelines, and strategic insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
