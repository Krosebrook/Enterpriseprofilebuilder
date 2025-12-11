import { SearchResult, Section } from '../types';
import { FileText, ArrowRight } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultClick: (section: Section) => void;
  onClose: () => void;
}

export function SearchResults({ results, query, onResultClick, onClose }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-6 z-50">
        <p className="text-slate-600 text-center">No results found for "{query}"</p>
        <p className="text-slate-500 text-center mt-2">Try different keywords or browse sections</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      <div className="p-2">
        <div className="text-slate-600 px-3 py-2">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </div>
        <div className="space-y-1">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                onResultClick(result.section);
                onClose();
              }}
              className="w-full text-left px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-slate-900 truncate">{result.title}</h4>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                  <div className="text-slate-600 text-sm mb-1 line-clamp-2">
                    {result.content}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {result.path.map((item, index) => (
                      <span key={index} className="flex items-center gap-1">
                        {index > 0 && <span>›</span>}
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
