import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { isBookmarked, toggleBookmark } from '../utils/storage';
import { useToast } from '../contexts/ToastContext';

interface BookmarkButtonProps {
  id: string;
  label?: string;
  className?: string;
}

export function BookmarkButton({ id, label = 'Save', className = '' }: BookmarkButtonProps) {
  const [marked, setMarked] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setMarked(isBookmarked(id));
  }, [id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggleBookmark(id);
    setMarked(newState);
    
    addToast({
      type: 'info',
      message: newState ? 'Added to bookmarks' : 'Removed from bookmarks',
      duration: 2000
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
        marked ? 'text-amber-600 hover:text-amber-700' : 'text-slate-500 hover:text-slate-700'
      } ${className}`}
      aria-label={marked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {marked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      {label && <span>{label}</span>}
    </button>
  );
}
