import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface DownloadButtonProps {
  fileName: string;
  downloadPath: string;
  variant?: 'default' | 'intPrimary' | 'intSecondary' | 'intTertiary';
  size?: 'default' | 'sm' | 'lg' | 'intSm' | 'intMd' | 'intLg';
  className?: string;
}

export function DownloadButton({
  fileName,
  downloadPath,
  variant = 'intSecondary',
  size = 'intSm',
  className = '',
}: DownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadPath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      className={className}
    >
      <Download className="w-4 h-4" />
      Download
    </Button>
  );
}
