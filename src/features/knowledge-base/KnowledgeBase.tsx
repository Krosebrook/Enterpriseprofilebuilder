import React, { useState } from 'react';
import { Book, Search, FileText, ExternalLink, Tag, Filter } from 'lucide-react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { knowledgeArticles } from './data/knowledgeData';

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'prompting', 'security', 'api', 'deployment', 'troubleshooting'];

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionHeader 
        title="Knowledge Base" 
        description="Comprehensive documentation, guides, and resources for enterprise AI deployment."
        icon={Book}
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search articles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-amber-600 hover:bg-amber-700' : ''}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <FileText className="w-3 h-3" />
                  {article.readTime}
                </div>
              </div>
              
              <h3 className="font-bold text-slate-900 text-lg mb-2">{article.title}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">{article.content}</p>
              
              {article.tags && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <Button variant="ghost" size="sm" className="w-full justify-between">
              Read Article
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <Book className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 mb-2">No articles found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200">
        {[
          { label: 'Total Articles', value: knowledgeArticles.length, color: 'text-slate-900' },
          { label: 'Categories', value: categories.length - 1, color: 'text-blue-600' },
          { label: 'Avg Read Time', value: '5 min', color: 'text-purple-600' },
          { label: 'Updated', value: 'Daily', color: 'text-emerald-600' }
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
