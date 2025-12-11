import { Bookmark } from 'lucide-react';
import { isBookmarked, addBookmark, removeBookmark } from '../utils/storage';
import { trackBookmark } from '../utils/analytics';
import { useState } from 'react';

interface BookmarkButtonProps {
  id: string;
  label?: string;
}

export function BookmarkButton({ id, label = 'Bookmark' }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked(id));

  const handleToggle = () => {
    if (bookmarked) {
      removeBookmark(id);
      trackBookmark('remove', id);
    } else {
      addBookmark(id);
      trackBookmark('add', id);
    }
    setBookmarked(!bookmarked);
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
        bookmarked
          ? 'bg-amber-50 border-amber-300 text-amber-700'
          : 'bg-white border-slate-300 text-slate-700 hover:border-amber-500'
      }`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      {label && <span>{bookmarked ? 'Bookmarked' : label}</span>}
    </button>
  );
}
