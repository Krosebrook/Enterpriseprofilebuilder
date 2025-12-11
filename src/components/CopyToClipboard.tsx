import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Tooltip } from './ui/Tooltip';

interface CopyToClipboardProps {
  text: string;
  label?: string;
}

export function CopyToClipboard({ text, label = 'Copy' }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
        aria-label={copied ? 'Copied' : label}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>{label}</span>
          </>
        )}
      </button>
    </Tooltip>
  );
}
