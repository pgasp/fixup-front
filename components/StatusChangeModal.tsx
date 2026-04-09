import React, { useMemo } from 'react';
import Modal from './Modal';
import { Quote, QuoteStatus } from '../types';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: QuoteStatus) => void;
  quoteForStatusChange: Quote | null;
}

const statusTextMap = {
    draft: 'Brouillon',
    ready_to_send: 'Prêt pour envoi',
    sent: 'Envoyé',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    awaiting_part_pricing: 'Attente cotation',
};


const StatusChangeModal: React.FC<StatusChangeModalProps> = ({ isOpen, onClose, onConfirm, quoteForStatusChange }) => {
  if (!isOpen || !quoteForStatusChange) return null;

  const { status: currentStatus, quoteNumber } = quoteForStatusChange;

  const hasPendingPreOrders = useMemo(() => {
    return quoteForStatusChange?.laborItems.some(l => 
        l.partItems.some(p => p.isPreOrder && p.preOrderStatus === 'pending_pricing')
    ) ?? false;
  }, [quoteForStatusChange]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Changer le statut de ${quoteNumber}`} size="md">
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Le statut actuel est : <strong className="font-semibold">{statusTextMap[currentStatus]}</strong>.
        <br/>
        Choisissez une action :
      </p>
      <div className="flex flex-col gap-3">
        {currentStatus === 'draft' && (
           <>
            {hasPendingPreOrders ? (
              <>
                <button
                  onClick={() => onConfirm('awaiting_part_pricing')}
                  className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors font-semibold"
                >
                  Demander une cotation de pièces
                </button>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                    Ce devis contient des pièces qui doivent être cotées avant de pouvoir être validé pour envoi.
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => onConfirm('ready_to_send')}
                  className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors font-semibold"
                >
                  Valider et préparer pour envoi
                </button>
                <button
                  onClick={() => onConfirm('sent')}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-semibold"
                >
                  Envoyer directement au client
                </button>
              </>
            )}
          </>
        )}

        {currentStatus === 'ready_to_send' && (
             <>
                <button
                onClick={() => onConfirm('sent')}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-semibold"
                >
                Marquer comme Envoyé
                </button>
                <button
                onClick={() => onConfirm('draft')}
                className="w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors font-semibold"
                >
                Réviser (retour au brouillon)
                </button>
            </>
        )}
        
        {currentStatus === 'awaiting_part_pricing' && (
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <p className="text-yellow-800 dark:text-yellow-200">
                    Ce devis ne peut pas changer de statut manuellement.
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Veuillez renseigner les prix des pièces sur la page "Cotations Pièces" pour le faire passer en "Brouillon".
                </p>
            </div>
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
