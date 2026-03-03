import { Printer } from 'lucide-react';
import { Button } from './ui/Button';
import { Section } from '../types';

interface PrintButtonProps {
  _section: Section;
}

export function PrintButton({ _section }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handlePrint}
      className="hidden md:flex items-center gap-2"
      aria-label="Print current section"
    >
      <Printer className="w-4 h-4" />
      <span>Print</span>
    </Button>
  );
}
