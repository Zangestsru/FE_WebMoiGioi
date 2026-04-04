import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

let modalActiveCount = 0;
let originalBodyPadding = '';
let originalBodyOverflow = '';
let originalNavPadding = '';

/**
 * Reusable Modal component using Tailwind.
 * Handles backdrop click, ESC key, body scroll lock, and scrollbar compensation.
 */
export function Modal({ isOpen, onClose, children, maxWidth = "920px" }: ModalProps) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll and compensate for scrollbar width to prevent layout shift
  useEffect(() => {
    if (!isOpen) return;

    modalActiveCount++;

    if (modalActiveCount === 1) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      originalBodyPadding = document.body.style.paddingRight;
      originalBodyOverflow = document.body.style.overflow;
      
      // Lock body scroll and apply compensatory padding
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Compensate for fixed navbars to prevent them from jumping
      const navbar = document.querySelector('nav.fixed') as HTMLElement;
      if (navbar) {
        const computedPadding = window.getComputedStyle(navbar).paddingRight;
        const currentPad = parseFloat(computedPadding) || 0;
        originalNavPadding = navbar.style.paddingRight;
        navbar.style.paddingRight = `${currentPad + scrollbarWidth}px`;
      }
    }

    return () => {
      modalActiveCount--;
      
      if (modalActiveCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.paddingRight = originalBodyPadding;
        
        const navbar = document.querySelector('nav.fixed') as HTMLElement;
        if (navbar) {
          navbar.style.paddingRight = originalNavPadding;
        }
      }
    };
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
        className="relative bg-white rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] w-full max-h-[90vh] overflow-y-auto animate-modal-slide sm:rounded-2xl"
        style={{ maxWidth }}
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
