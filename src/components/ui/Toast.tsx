import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore, type ToastType } from '../../store/useToastStore';

const toastStyles: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
  error: 'bg-rose-50 border-rose-100 text-rose-800',
  info: 'bg-blue-50 border-blue-100 text-blue-800',
  warning: 'bg-amber-50 border-amber-100 text-amber-800',
};

const toastIcons: Record<ToastType, any> = {
  success: <CheckCircle className="text-emerald-500" size={20} />,
  error: <XCircle className="text-rose-500" size={20} />,
  info: <Info className="text-blue-500" size={20} />,
  warning: <AlertCircle className="text-amber-500" size={20} />,
};

interface ToastItemProps {
  id: string;
  message: string;
  type: ToastType;
}

function ToastItem({ id, message, type }: ToastItemProps) {
  const removeToast = useToastStore((state) => state.removeToast);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation slightly before removal
    const timer = setTimeout(() => setIsExiting(true), 2700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-md w-full
        animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto
        ${isExiting ? 'animate-out fade-out slide-out-to-right-4 duration-300 pointer-events-none' : ''}
        ${toastStyles[type]}
      `}
    >
      <div className="shrink-0">{toastIcons[type]}</div>
      <p className="font-primary text-[14px] font-semibold flex-1 leading-tight">
        {message}
      </p>
      <button
        onClick={() => removeToast(id)}
        className="p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X size={16} className="opacity-50 hover:opacity-100" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full pointer-events-none items-end px-6 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}
