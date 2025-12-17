import React from 'react';
import { FileText, ExternalLink, Calendar, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DownloadButton } from './DownloadButton';
import { DocumentResource } from '../../types';

interface DocumentCardProps {
  document: DocumentResource;
  onView?: (document: DocumentResource) => void;
  showDownload?: boolean;
  compact?: boolean;
}

export function DocumentCard({
  document,
  onView,
  showDownload = true,
  compact = false,
}: DocumentCardProps) {
  const categoryColors: Record<string, string> = {
    deployment: 'intInfo',
    compliance: 'intWarning',
    guide: 'intSuccess',
    kyle: 'intPrimary',
    mcp: 'intNeutral',
    roles: 'intInfo',
    reference: 'intNeutral',
    presentation: 'intPrimary',
  };

  const categoryLabels: Record<string, string> = {
    deployment: 'Deployment',
    compliance: 'Compliance',
    guide: 'Guide',
    kyle: 'Kyle Materials',
    mcp: 'MCP',
    roles: 'Roles',
    reference: 'Reference',
    presentation: 'Presentation',
  };

  if (compact) {
    return (
      <Card
        variant="intInteractive"
        padding="int"
        className="hover:border-[var(--int-primary)]"
        onClick={() => onView?.(document)}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[var(--int-gray-50)] rounded-[var(--int-radius-md)]">
            <FileText className="w-5 h-5 text-[var(--int-primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-[var(--int-gray-900)] truncate">
              {document.title}
            </h4>
            <p className="text-xs text-[var(--int-gray-600)] line-clamp-1 mt-0.5">
              {document.description}
            </p>
          </div>
          <Badge variant={categoryColors[document.category] as any} size="sm">
            {categoryLabels[document.category]}
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="intInteractive" padding="none" className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[var(--int-gray-50)] rounded-[var(--int-radius-md)]">
              <FileText className="w-5 h-5 text-[var(--int-primary)]" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-[var(--int-gray-900)]">
                {document.title}
              </CardTitle>
              {document.lastUpdated && (
                <div className="flex items-center gap-1 text-xs text-[var(--int-gray-500)] mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {document.lastUpdated}
                </div>
              )}
            </div>
          </div>
          <Badge variant={categoryColors[document.category] as any}>
            {categoryLabels[document.category]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <CardDescription className="text-sm text-[var(--int-gray-600)] line-clamp-2">
          {document.description}
        </CardDescription>

        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {document.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="intNeutral" size="sm">
                <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
            {document.tags.length > 3 && (
              <Badge variant="intNeutral" size="sm">
                +{document.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-2 flex gap-2 border-t border-[var(--int-gray-100)]">
        <Button
          variant="intPrimary"
          size="intSm"
          onClick={() => onView?.(document)}
          className="flex-1"
        >
          <ExternalLink className="w-4 h-4" />
          View Document
        </Button>
        {showDownload && (
          <DownloadButton
            fileName={document.fileName}
            downloadPath={document.downloadPath}
            variant="intSecondary"
            size="intSm"
          />
        )}
      </CardFooter>
    </Card>
  );
}
