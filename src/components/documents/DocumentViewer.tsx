import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ChevronRight, ChevronDown, FileText, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DownloadButton } from './DownloadButton';
import { DocumentResource } from '../../types';

interface DocumentViewerProps {
  document: DocumentResource;
  onBack?: () => void;
  showTableOfContents?: boolean;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function DocumentViewer({
  document,
  onBack,
  showTableOfContents = true,
}: DocumentViewerProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [tocOpen, setTocOpen] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(document.downloadPath);
        if (!response.ok) {
          throw new Error('Failed to load document');
        }
        const text = await response.text();
        setContent(text);

        // Extract table of contents from markdown headings
        const headings = text.match(/^#{1,3}\s+.+$/gm) || [];
        const tocItems: TOCItem[] = headings.map((heading, index) => {
          const level = heading.match(/^#+/)?.[0].length || 1;
          const text = heading.replace(/^#+\s+/, '');
          const id = `heading-${index}`;
          return { id, text, level };
        });
        setToc(tocItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [document.downloadPath]);

  const scrollToHeading = (id: string) => {
    const element = window.document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderMarkdown = (markdown: string) => {
    // Simple markdown rendering (for production, consider using react-markdown)
    let html = markdown
      // Headers
      .replace(/^### (.+)$/gm, (_, text, offset) => {
        const index = markdown.substring(0, offset).match(/^#{1,3}\s+.+$/gm)?.length || 0;
        return `<h3 id="heading-${index}" class="text-lg font-semibold text-[var(--int-gray-900)] mt-6 mb-3">${text}</h3>`;
      })
      .replace(/^## (.+)$/gm, (_, text, offset) => {
        const index = markdown.substring(0, offset).match(/^#{1,3}\s+.+$/gm)?.length || 0;
        return `<h2 id="heading-${index}" class="text-xl font-bold text-[var(--int-gray-900)] mt-8 mb-4 pb-2 border-b border-[var(--int-gray-200)]">${text}</h2>`;
      })
      .replace(/^# (.+)$/gm, (_, text, offset) => {
        const index = markdown.substring(0, offset).match(/^#{1,3}\s+.+$/gm)?.length || 0;
        return `<h1 id="heading-${index}" class="text-2xl font-bold text-[var(--int-gray-900)] mt-8 mb-4">${text}</h1>`;
      })
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-[var(--int-gray-900)] text-[var(--int-gray-50)] p-4 rounded-[var(--int-radius-lg)] overflow-x-auto my-4 text-sm"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-[var(--int-gray-100)] px-1.5 py-0.5 rounded text-sm text-[var(--int-error)]">$1</code>')
      // Lists
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-[var(--int-gray-700)]">$1</li>')
      .replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc text-[var(--int-gray-700)]">$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-[var(--int-gray-700)]">$1</li>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--int-info)] hover:text-[var(--int-info-dark)] underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[var(--int-primary)] pl-4 italic text-[var(--int-gray-600)] my-4">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="border-t border-[var(--int-gray-200)] my-6" />')
      // Tables (basic support)
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.every(c => c.trim().match(/^[-:]+$/))) {
          return ''; // Table separator row
        }
        return `<tr class="border-b border-[var(--int-gray-200)]">${cells.map(c => `<td class="px-4 py-2 text-sm">${c.trim()}</td>`).join('')}</tr>`;
      })
      // Paragraphs (add spacing between non-element lines)
      .replace(/^(?![<\s])(.+)$/gm, '<p class="text-[var(--int-gray-700)] leading-relaxed mb-4">$1</p>');

    return html;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[var(--int-primary)] animate-spin" />
          <p className="text-[var(--int-gray-600)]">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="int" padding="int" className="text-center py-12">
        <FileText className="w-12 h-12 text-[var(--int-gray-400)] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[var(--int-gray-900)] mb-2">
          Failed to Load Document
        </h3>
        <p className="text-[var(--int-gray-600)] mb-4">{error}</p>
        {onBack && (
          <Button variant="intSecondary" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Table of Contents Sidebar */}
      {showTableOfContents && toc.length > 0 && (
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Card variant="int" padding="none" className="sticky top-4">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="flex items-center justify-between w-full p-4 text-left hover:bg-[var(--int-gray-50)]"
            >
              <span className="font-semibold text-sm text-[var(--int-gray-900)]">
                Table of Contents
              </span>
              {tocOpen ? (
                <ChevronDown className="w-4 h-4 text-[var(--int-gray-500)]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[var(--int-gray-500)]" />
              )}
            </button>
            {tocOpen && (
              <nav className="p-4 pt-0 max-h-[60vh] overflow-y-auto">
                <ul className="space-y-1">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToHeading(item.id)}
                        className={`
                          text-left text-sm w-full px-2 py-1.5 rounded-[var(--int-radius-sm)]
                          hover:bg-[var(--int-gray-50)] hover:text-[var(--int-primary)]
                          text-[var(--int-gray-600)] transition-colors
                          ${item.level === 1 ? 'font-semibold' : ''}
                          ${item.level === 2 ? 'pl-4' : ''}
                          ${item.level === 3 ? 'pl-6 text-xs' : ''}
                        `}
                      >
                        {item.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </Card>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="mt-1">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-[var(--int-gray-900)]">
                {document.title}
              </h1>
              <p className="text-[var(--int-gray-600)] mt-1">
                {document.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="intPrimary">{document.category}</Badge>
                {document.lastUpdated && (
                  <span className="text-xs text-[var(--int-gray-500)]">
                    Updated: {document.lastUpdated}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DownloadButton
            fileName={document.fileName}
            downloadPath={document.downloadPath}
            variant="intPrimary"
            size="intMd"
          />
        </div>

        {/* Document Content */}
        <Card variant="int" padding="int">
          <article
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </Card>
      </div>
    </div>
  );
}
