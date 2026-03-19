import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { Modal } from './Modal';
import { FormButton } from './FormButton';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * StatusModal - Global status notification component.
 * Automatically listens to useUIStore state.
 * High-end feel, responsive and clean.
 */
export const StatusModal: React.FC = () => {
  const { statusPopup, hideStatus } = useUIStore();

  return (
    <Modal 
      isOpen={statusPopup.isOpen} 
      onClose={hideStatus}
      maxWidth="400px"
    >
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] animate-in zoom-in duration-300">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${statusPopup.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
          {statusPopup.type === 'success' ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-primary">{statusPopup.title}</h3>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed font-primary">{statusPopup.message}</p>
        <FormButton 
          className="mt-8 w-full py-3.5 rounded-2xl shadow-lg shadow-gray-200"
          onClick={hideStatus}
        >
          Xác nhận
        </FormButton>
      </div>
    </Modal>
  );
};
