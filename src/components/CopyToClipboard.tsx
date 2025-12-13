import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyToClipboardProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyToClipboard({ text, label = 'Copy', className = '' }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
        copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
      } ${className}`}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
}
