import React, { useState } from 'react';
import { MessageSquare, X, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { trackEvents } from '../../lib/analytics';
import { useToast } from '../../contexts/ToastContext';

interface FeedbackWidgetProps {
  context?: string; // Where the feedback is coming from (e.g., "agent-builder", "dashboard")
  onSubmit?: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  rating: 'positive' | 'negative' | null;
  message: string;
  context: string;
  url: string;
  timestamp: number;
}

export function FeedbackWidget({ context = 'general', onSubmit }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async () => {
    if (!rating && !message.trim()) {
      addToast({
        type: 'warning',
        message: 'Please provide a rating or message',
      });
      return;
    }

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      rating,
      message: message.trim(),
      context,
      url: window.location.href,
      timestamp: Date.now(),
    };

    try {
      // Track feedback event
      trackEvents.track('feedback_submitted', {
        rating,
        context,
        hasMessage: !!message.trim(),
      });

      // Store locally
      saveFeedbackLocally(feedbackData);

      // Call custom submit handler if provided
      if (onSubmit) {
        await onSubmit(feedbackData);
      }

      addToast({
        type: 'success',
        message: 'Thank you for your feedback!',
      });

      // Reset form
      setRating(null);
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      addToast({
        type: 'error',
        message: 'Failed to submit feedback. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveFeedbackLocally = (feedback: FeedbackData) => {
    try {
      const key = 'user-feedback';
      const stored = localStorage.getItem(key);
      const feedbacks: FeedbackData[] = stored ? JSON.parse(stored) : [];
      
      feedbacks.push(feedback);
      
      // Keep only last 100 feedbacks
      if (feedbacks.length > 100) {
        feedbacks.shift();
      }

      localStorage.setItem(key, JSON.stringify(feedbacks));
    } catch (error) {
      console.error('Failed to save feedback locally:', error);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Send feedback"
      >
        <MessageSquare className="w-6 h-6" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96">
      <Card className="shadow-xl border-primary/20">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Send Feedback</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setRating(null);
                setMessage('');
              }}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close feedback widget"
            >
              <X className="w-5 h-5 text-slate-500" aria-hidden="true" />
            </button>
          </div>

          {/* Rating Buttons */}
          <div>
            <p className="text-sm text-slate-600 mb-2">How is your experience?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setRating('positive')}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  rating === 'positive'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-green-300 text-slate-600'
                }`}
                aria-pressed={rating === 'positive'}
                aria-label="Positive feedback"
              >
                <ThumbsUp className="w-6 h-6 mx-auto" aria-hidden="true" />
                <span className="block text-xs mt-1 font-medium">Good</span>
              </button>
              <button
                onClick={() => setRating('negative')}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  rating === 'negative'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-red-300 text-slate-600'
                }`}
                aria-pressed={rating === 'negative'}
                aria-label="Negative feedback"
              >
                <ThumbsDown className="w-6 h-6 mx-auto" aria-hidden="true" />
                <span className="block text-xs mt-1 font-medium">Bad</span>
              </button>
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="feedback-message" className="text-sm text-slate-600 mb-2 block">
              Tell us more (optional)
            </label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What can we improve?"
              rows={4}
              className="resize-none"
              maxLength={500}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {message.length}/500
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!rating && !message.trim())}
            className="w-full flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            Your feedback helps us improve
          </p>
        </div>
      </Card>
    </div>
  );
}

/**
 * Hook to get stored feedback (for admin dashboard)
 */
export function useStoredFeedback(): FeedbackData[] {
  const [feedback, setFeedback] = React.useState<FeedbackData[]>([]);

  React.useEffect(() => {
    try {
      const key = 'user-feedback';
      const stored = localStorage.getItem(key);
      if (stored) {
        setFeedback(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load stored feedback:', error);
    }
  }, []);

  return feedback;
}
