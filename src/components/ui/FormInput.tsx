import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

/**
 * Reusable FormInput component using Tailwind.
 */
export function FormInput({ label, error, id, ...inputProps }: FormInputProps) {
  return (
    <div className="flex flex-col gap-0.5 relative z-10 group focus-within:z-50">
      <label className="font-primary text-[13px] font-semibold text-gray-900 tracking-[0.01em]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-primary text-[15px] text-gray-900 outline-none transition-all duration-200 box-border placeholder-gray-400
          ${error
            ? 'border-red-600 focus:shadow-[0_0_0_2px_rgba(220,38,38,0.18)]'
            : 'focus:border-black focus:shadow-[0_0_0_4px_rgba(0,0,0,0.03)]'
          }
           disabled:bg-[#F3F4F6] disabled:border-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
        {...inputProps}
      />
      {error && (
        <span
          className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-red-600 text-red-600 px-2 py-1 rounded-md shadow-[0_4px_12px_rgba(220,38,38,0.2)] font-primary text-[11px] font-medium leading-[1.3] whitespace-nowrap animate-popup-fade-in opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200"
          role="alert"
          aria-live="polite"
        >
          <span className="absolute bottom-full left-4 w-0 h-0 border-[5px] border-solid border-transparent border-b-red-600" />
          <span className="absolute bottom-full left-4 w-0 h-0 border-[5px] border-solid border-transparent border-b-white -mb-[1px]" />
          {error}
        </span>
      )}
    </div>
  );
}
