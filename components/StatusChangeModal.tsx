import React from 'react';
import Modal from './Modal';
import { QuoteStatus } from '../types';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: QuoteStatus) => void;
  currentStatus: QuoteStatus;
  quoteNumber: string;
}

const statusTextMap = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    approved: 'Approuvé',
    rejected: 'Rejeté',
};


const StatusChangeModal: React.FC<StatusChangeModalProps> = ({ isOpen, onClose, onConfirm, currentStatus, quoteNumber }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Changer le statut de ${quoteNumber}`} size="md">
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Le statut actuel est : <strong className="font-semibold">{statusTextMap[currentStatus]}</strong>.
        <br/>
        Choisissez une action :
      </p>
      <div className="flex flex-col gap-3">
        {currentStatus === 'draft' && (
           <button
            onClick={() => onConfirm('sent')}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-semibold"
          >
            Marquer comme Envoyé
          </button>
        )}
        
        {currentStatus === 'sent' && (
          <>
            <button
              onClick={() => onConfirm('approved')}
              className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-semibold"
            >
              Marquer comme Approuvé
            </button>
            <button
              onClick={() => onConfirm('rejected')}
              className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-semibold"
            >
              Marquer comme Rejeté
            </button>
             <button
              onClick={() => onConfirm('draft')}
              className="w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors font-semibold"
            >
              Réviser (retour au brouillon)
            </button>
          </>
        )}

        {currentStatus === 'rejected' && (
             <button
              onClick={() => onConfirm('draft')}
              className="w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors font-semibold"
            >
              Réviser (retour au brouillon)
            </button>
        )}

        {currentStatus === 'approved' && (
            <p className="text-center text-gray-500 dark:text-gray-400">Ce devis est approuvé et ne peut plus être modifié.</p>
        )}
      </div>
       <div className="mt-8 flex justify-end">
         <button
          type="button"
          onClick={onClose}
          className="py-2 px-6 bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500 rounded-md transition-colors font-semibold"
        >
          Annuler
        </button>
      </div>
    </Modal>
  );
};

export default StatusChangeModal;
