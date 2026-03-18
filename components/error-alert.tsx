import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div role="alert" className="alert alert-error">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
      <button className="btn btn-sm btn-ghost" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}
