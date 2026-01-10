import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Bookmark as BookmarkIcon, Link as LinkIcon, HelpCircle } from 'lucide-react';
import { FAQLevel } from '../../types';
import { faqData } from '../../data/faq';
import { Badge } from '../ui/Badge';
import { BookmarkButton } from '../BookmarkButton';
import { CopyToClipboard } from '../CopyToClipboard';
import { SectionHeader } from '../common/SectionHeader';

interface FAQProps {
  searchQuery?: string;
}

export function FAQ({ searchQuery = '' }: FAQProps) {
  const [activeLevel, setActiveLevel] = useState<FAQLevel | 'all'>('all');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Filter FAQs based on level and search query
  const filteredFaqs = useMemo(() => {
    let faqs = activeLevel === 'all' 
      ? faqData 
      : faqData.filter(faq => faq.level === activeLevel);

    if (searchQuery && searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase();
      faqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return faqs;
  }, [activeLevel, searchQuery]);

  const levels: Array<{ id: FAQLevel | 'all'; label: string }> = [
    { id: 'all', label: 'All Questions' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const levelColors = {
    beginner: { bg: 'bg-green-50', border: 'border-green-200', badge: 'success' as const },
    intermediate: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'info' as const },
    advanced: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'warning' as const }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Frequently Asked Questions"
        description={`${faqData.length} curated questions and answers covering everything from basic access to advanced prompting techniques.`}
        icon={HelpCircle}
      />

      {/* Level Filter */}
      <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setActiveLevel(level.id)}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
              activeLevel === level.id
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-600'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedIds.includes(faq.id);
          const colors = levelColors[faq.level];

          return (
            <div
              key={faq.id}
              id={faq.id}
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'} ${colors.bg} ${colors.border}`}
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Badge variant={colors.badge} size="sm" className="flex-shrink-0">
                    {faq.level}
                  </Badge>
                  <span className="text-slate-900 font-medium text-lg">{faq.question}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="h-px w-full bg-black/5 mb-4" />
                  
                  {/* Answer */}
                  <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base">
                    {faq.answer}
                  </div>

                  {/* Tags & Actions */}
                  <div className="mt-6 pt-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-4">
                     {faq.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                           {faq.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-white rounded border border-slate-200 text-xs text-slate-500">
                                 #{tag}
                              </span>
                           ))}
                        </div>
                     )}
                     
                     <div className="flex items-center gap-3">
                        <BookmarkButton id={faq.id} label="" />
                        <div className="h-4 w-px bg-slate-300" />
                        <CopyToClipboard 
                           text={`Q: ${faq.question}\n\nA: ${faq.answer}`}
                           label="Copy Answer"
                        />
                     </div>
                  </div>

                  {/* Related Questions */}
                  {faq.relatedQuestions && faq.relatedQuestions.length > 0 && (
                    <div className="mt-4 bg-white/50 rounded-lg p-3 border border-black/5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Related Questions</p>
                      <div className="space-y-1">
                        {faq.relatedQuestions.map((relatedId) => {
                          const relatedFaq = faqData.find(f => f.id === relatedId);
                          if (!relatedFaq) return null;
                          
                          return (
                            <button
                              key={relatedId}
                              onClick={() => {
                                if (!expandedIds.includes(relatedId)) {
                                  setExpandedIds(prev => [...prev, relatedId]);
                                }
                                // Scroll to the related question
                                setTimeout(() => {
                                  const element = document.getElementById(relatedId);
                                  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 100);
                              }}
                              className="block text-left text-sm text-amber-700 hover:text-amber-800 hover:underline"
                            >
                              → {relatedFaq.question}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No results found</h3>
          <p className="text-slate-600">
            {searchQuery ? `We couldn't find any questions matching "${searchQuery}"` : 'No questions found for this category.'}
          </p>
          {searchQuery && (
             <button onClick={() => window.location.reload()} className="mt-4 text-amber-600 hover:text-amber-700 font-medium">
                Clear search
             </button>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200">
        {[
           { label: 'Total Questions', value: faqData.length, color: 'text-slate-900' },
           { label: 'Beginner', value: faqData.filter(f => f.level === 'beginner').length, color: 'text-emerald-600' },
           { label: 'Intermediate', value: faqData.filter(f => f.level === 'intermediate').length, color: 'text-blue-600' },
           { label: 'Advanced', value: faqData.filter(f => f.level === 'advanced').length, color: 'text-purple-600' }
        ].map((stat, i) => (
           <div key={i} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
           </div>
        ))}
      </div>
    </div>
  );
}
