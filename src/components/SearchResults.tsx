import { SearchResult, Section } from '../types';
import { FileText, ArrowRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultClick: (section: Section) => void;
  onClose: () => void;
}

export function SearchResults({ results, query, onResultClick, onClose }: SearchResultsProps) {
  const { setActiveSection } = useNavigation();

  const handleSelect = (section: Section) => {
    setActiveSection(section);
    onResultClick(section); // Optional callback if parent needs it
    onClose();
  };

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-8 z-50 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center">
           <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-slate-300" />
           </div>
           <p className="text-slate-900 font-medium">No results found for "{query}"</p>
           <p className="text-slate-500 text-sm mt-1">Try searching for features, roles, or specific tasks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-[28rem] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center z-10">
         <span>Top Results</span>
         <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">{results.length} found</span>
      </div>
      
      <div className="p-2 space-y-1">
        {results.map((result, index) => (
          <button
            key={`${result.id}-${index}`}
            onClick={() => handleSelect(result.section)}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-all group flex items-start gap-4 focus:outline-none focus:bg-slate-50"
          >
            <div className="mt-1 p-2 bg-white border border-slate-100 rounded-lg shadow-sm group-hover:border-amber-200 group-hover:shadow-md transition-all">
               <FileText className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-slate-900 font-medium truncate group-hover:text-amber-700 transition-colors">
                   {result.title}
                </h4>
                <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
              
              <p className="text-slate-500 text-xs mb-1.5 line-clamp-1">{result.content}</p>
              
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                {result.path.map((item, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-slate-300">/</span>}
                    <span className={i === result.path.length - 1 ? 'text-slate-600 font-medium' : ''}>
                       {item}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400 text-center">
         Press <kbd className="font-sans border border-slate-300 rounded px-1 bg-white mx-1">Enter</kbd> to select
      </div>
    </div>
  );
}
