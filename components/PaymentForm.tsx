import React, { useState } from 'react';
import { Invoice, PaymentDetails } from '../types';
import Modal from './Modal';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: PaymentDetails) => void;
  invoice: Invoice | null;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ isOpen, onClose, onSave, invoice }) => {
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentDetails['method']>('card');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            date: new Date(paymentDate).toISOString(),
            method: paymentMethod,
        });
    };

    if (!invoice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Enregistrer le paiement de ${invoice.invoiceNumber}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <p>Montant à payer : <strong className="font-bold text-lg">{invoice.quote.laborItems.reduce((acc, l) => acc + (l.hours * l.rate) + l.partItems.reduce((pAcc, p) => pAcc + (p.quantity * p.unitPrice), 0), 0) * (1 + invoice.quote.taxRate/100)}€</strong></p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="payment-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de paiement</label>
                <input
                    id="payment-date"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 p-2"
                    required
                />
            </div>
             <div>
                <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Méthode de paiement</label>
                <select
                    id="payment-method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentDetails['method'])}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 p-2"
                    required
                >
                    <option value="card">Carte bancaire</option>
                    <option value="cash">Espèces</option>
                    <option value="transfer">Virement</option>
                    <option value="other">Autre</option>
                </select>
            </div>
        </div>
         <div className="mt-8 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-500 text-white rounded-md font-semibold">Annuler</button>
          <button type="submit" className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold">Confirmer le paiement</button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentForm;