import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ConfirmDialogProps {
  type: 'success' | 'warning' | 'error';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  type,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const icons = {
    success: <CheckCircle className="w-16 h-16 text-success" />,
    warning: <AlertCircle className="w-16 h-16 text-warning" />,
    error: <XCircle className="w-16 h-16 text-destructive" />,
  };

  const colors = {
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4">{icons[type]}</div>
          <h2 className="text-lg font-medium mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${colors[type]} text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
