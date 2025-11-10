import React from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  confirmColorClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children, confirmText, confirmColorClass }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="text-gray-700 dark:text-gray-300">
        {children}
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-6 bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500 rounded-md transition-colors font-semibold"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`py-2 px-6 text-white rounded-md transition-colors font-semibold ${confirmColorClass || 'bg-red-600 hover:bg-red-500'}`}
        >
          {confirmText || 'Confirmer la suppression'}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;