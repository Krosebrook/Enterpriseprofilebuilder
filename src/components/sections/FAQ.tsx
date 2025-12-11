import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Bookmark as BookmarkIcon, Link as LinkIcon } from 'lucide-react';
import { FAQLevel } from '../../types';
import { faqData } from '../../data/faq';
import { Badge } from '../ui/Badge';
import { BookmarkButton } from '../BookmarkButton';
import { CopyToClipboard } from '../CopyToClipboard';

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
    <div className="space-y-8">
      <div>
        <h2 className="text-slate-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-slate-700">
          {faqData.length} questions from beginner to advanced users, answered comprehensively.
        </p>
      </div>

      {/* Level Filter */}
      <div className="flex flex-wrap gap-2">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setActiveLevel(level.id)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              activeLevel === level.id
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-white text-slate-700 border-slate-300 hover:border-amber-500'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedIds.includes(faq.id);
          const colors = levelColors[faq.level];

          return (
            <div
              key={faq.id}
              className={`border rounded-lg overflow-hidden ${colors.bg} ${colors.border}`}
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge variant={colors.badge} size="sm">
                    {faq.level}
                  </Badge>
                  <span className="text-slate-900">{faq.question}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600 flex-shrink-0" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Answer */}
                  <div className="text-slate-700 whitespace-pre-line">
                    {faq.answer}
                  </div>

                  {/* Tags */}
                  {faq.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-600">Tags:</span>
                      {faq.tags.map((tag, index) => (
                        <Badge key={index} variant="default" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-300">
                    <BookmarkButton id={faq.id} label="" />
                    <CopyToClipboard 
                      text={`Q: ${faq.question}\n\nA: ${faq.answer}`}
                      label="Copy"
                    />
                  </div>

                  {/* Related Questions */}
                  {faq.relatedQuestions && faq.relatedQuestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-300">
                      <p className="text-slate-700 mb-2">Related Questions:</p>
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
                              className="block text-left text-sm text-amber-600 hover:text-amber-700 hover:underline"
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
        <div className="bg-slate-100 border border-slate-300 rounded-lg p-8 text-center">
          <p className="text-slate-600">
            {searchQuery ? `No questions found matching "${searchQuery}"` : 'No questions found for this level.'}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-3">FAQ Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl text-slate-900">{faqData.length}</div>
            <div className="text-slate-600">Total Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-green-600">
              {faqData.filter(f => f.level === 'beginner').length}
            </div>
            <div className="text-slate-600">Beginner</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-blue-600">
              {faqData.filter(f => f.level === 'intermediate').length}
            </div>
            <div className="text-slate-600">Intermediate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-purple-600">
              {faqData.filter(f => f.level === 'advanced').length}
            </div>
            <div className="text-slate-600">Advanced</div>
          </div>
        </div>
      </div>
    </div>
  );
}
