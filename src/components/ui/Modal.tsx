import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Reusable Modal component using Tailwind.
 * Handles backdrop click, ESC key, body scroll lock.
 */
export function Modal({ isOpen, onClose, children }: ModalProps) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/55 backdrop-blur-[3px] flex items-center justify-center z-[1000] p-4 animate-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] max-w-[920px] w-full h-[580px] overflow-hidden animate-modal-slide sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 border-none bg-black/[0.06] hover:bg-black/10 rounded-full text-[14px] text-gray-500 hover:text-gray-900 cursor-pointer flex items-center justify-center z-10 transition-colors duration-150"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
