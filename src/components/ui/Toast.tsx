import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ToastNotification } from '../../types';

interface ToastProps {
  toast: ToastNotification;
  onRemove: (id: string) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />,
    info: <Info className="w-5 h-5 text-blue-500" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />,
  };

  const styles = {
    success: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
    warning: "border-amber-200 bg-amber-50",
  };

  const roleMap = {
    success: 'status',
    error: 'alert',
    info: 'status',
    warning: 'alert',
  };

  return (
    <div 
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm w-full animate-in slide-in-from-right fade-in duration-300 ${styles[toast.type]}`}
      role={roleMap[toast.type]}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 text-sm font-medium text-slate-900">
        {toast.message}
      </div>
      <button 
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label={`Dismiss ${toast.type} notification`}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastNotification[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}