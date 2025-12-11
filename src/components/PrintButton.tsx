import { Printer } from 'lucide-react';
import { trackExport } from '../utils/analytics';
import { Section } from '../types';

interface PrintButtonProps {
  section: Section;
}

export function PrintButton({ section }: PrintButtonProps) {
  const handlePrint = () => {
    trackExport('print', section);
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:border-amber-500 transition-colors"
      aria-label="Print this page"
    >
      <Printer className="w-4 h-4" />
      <span>Print</span>
    </button>
  );
}
