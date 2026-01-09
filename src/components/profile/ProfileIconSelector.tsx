import { useState, useRef, ChangeEvent, memo, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/Card';

interface ProfileIconSelectorProps {
  currentIcon?: string;
  onIconChange: (icon: string | null) => void;
}

const EMOJI_PRESETS = [
  '🤖',
  '🧠',
  '💼',
  '🎯',
  '⚡',
  '🚀',
  '💡',
  '🔧',
  '📊',
  '🎨',
  '🔒',
  '🌟',
  '📝',
  '🎓',
  '💻',
  '🏢',
  '📈',
  '🔍',
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];

/**
 * Profile Icon Selector - Allows users to upload an image or select an emoji as profile icon
 * Features:
 * - File upload with validation (size and type)
 * - Emoji presets for quick selection
 * - Image preview
 * - Remove icon functionality
 */
export function ProfileIconSelector({ currentIcon, onIconChange }: ProfileIconSelectorProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    currentIcon && !EMOJI_PRESETS.includes(currentIcon) ? currentIcon : null
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(
    currentIcon && EMOJI_PRESETS.includes(currentIcon) ? currentIcon : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Validates uploaded file for size and type
   */
  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Please upload PNG, JPEG, WebP, or SVG images.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than 2MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    return null;
  }, []);

  /**
   * Handles file upload and converts to base64 for preview and storage
   */
  const handleFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setError(null);

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Convert to base64 for preview and storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setSelectedEmoji(null);
        onIconChange(result);
      };
      reader.onerror = () => {
        setError('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    },
    [validateFile, onIconChange]
  );

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      setSelectedEmoji(emoji);
      setUploadedImage(null);
      setError(null);
      onIconChange(emoji);
    },
    [onIconChange]
  );

  const handleRemove = useCallback(() => {
    setUploadedImage(null);
    setSelectedEmoji(null);
    setError(null);
    onIconChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onIconChange]);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Profile Icon</h3>
          {(uploadedImage || selectedEmoji) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          )}
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200 overflow-hidden">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Profile icon" className="w-full h-full object-cover" />
            ) : selectedEmoji ? (
              <span className="text-5xl">{selectedEmoji}</span>
            ) : (
              <ImageIcon className="w-10 h-10 text-slate-400" />
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Max 2MB • PNG, JPEG, WebP, or SVG
          </p>
        </div>

        {/* Emoji Presets */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Or choose an emoji:</p>
          <div className="grid grid-cols-6 gap-2">
            {EMOJI_PRESETS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className={`
                  h-10 rounded-lg border-2 transition-all
                  flex items-center justify-center text-2xl
                  hover:border-amber-400 hover:bg-amber-50
                  ${
                    selectedEmoji === emoji
                      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                      : 'border-slate-200 bg-white'
                  }
                `}
              >
                {emoji}
                {selectedEmoji === emoji && (
                  <Check className="absolute w-4 h-4 text-amber-600 ml-6 mt-6" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Memoize component to prevent unnecessary re-renders
export const MemoizedProfileIconSelector = memo(ProfileIconSelector);
