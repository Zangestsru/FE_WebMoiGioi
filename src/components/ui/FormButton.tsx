import type { ButtonHTMLAttributes } from 'react';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

/**
 * Reusable FormButton component using Tailwind.
 */
export function FormButton({
  isLoading = false,
  children,
  variant = 'primary',
  fullWidth = false,
  disabled,
  ...buttonProps
}: FormButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center px-8 py-4 border-none rounded-xl font-primary text-base font-bold cursor-pointer transition-all duration-200 tracking-[0.03em]
        ${fullWidth ? 'w-full' : ''}
        ${variant === 'primary' ? 'bg-blue-500 text-white shadow-[0_4px_14px_rgba(59,130,246,0.35)] hover:bg-blue-600 hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(59,130,246,0.35)] disabled:bg-blue-300 disabled:cursor-not-allowed disabled:shadow-none' : ''}
      `}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {isLoading ? (
        <span 
          className="w-5 h-5 border-[2.5px] border-solid border-white/30 border-t-white rounded-full animate-spin" 
          aria-label="Loading" 
        />
      ) : (
        children
      )}
    </button>
  );
}
