'use client';

import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'bg-error/10 text-error',
      button: 'btn-error'
    },
    warning: {
      icon: 'bg-warning/10 text-warning',
      button: 'btn-warning'
    },
    info: {
      icon: 'bg-info/10 text-info',
      button: 'btn-info'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${styles.icon}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-base-content">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="btn btn-ghost btn-circle btn-sm"
            disabled={isLoading}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-base-content/70 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 pb-5">
          <button className="btn btn-ghost btn-sm" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </button>
          <button
            className={`btn btn-sm ${styles.button}`}
            onClick={onConfirm}
            disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
