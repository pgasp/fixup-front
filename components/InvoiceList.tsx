import React, { useMemo } from 'react';
import { Invoice, InvoiceStatus, Client } from '../types';
// FIX: Import 'ReceiptTaxIcon'.
import { FileTextIcon, TrashIcon, CreditCardIcon, ClockIcon, ReceiptTaxIcon } from './icons';

interface InvoiceListProps {
  invoices: Invoice[];
  clients: Client[];
  onView: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onMarkAsPaid: (invoice: Invoice) => void;
}

const statusConfig: { [key in InvoiceStatus]: { text: string; color: string; icon: React.FC<{className?:string}> } } = {
    'draft': { text: 'En attente de paiement', color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50', icon: ClockIcon },
    'paid': { text: 'Payée', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50', icon: CreditCardIcon },
    'cancelled': { text: 'Annulée', color: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/50', icon: TrashIcon },
};

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, clients, onView, onDelete, onMarkAsPaid }) => {
    
    const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

    const sortedInvoices = useMemo(() => {
        return [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [invoices]);

    const calculateTotal = (invoice: Invoice) => {
        const subtotal = invoice.quote.laborItems.reduce((acc, labor) => {
            const laborCost = labor.hours * labor.rate;
            const partsCost = labor.partItems.reduce((pAcc, part) => pAcc + (part.quantity * part.unitPrice), 0);
            return acc + laborCost + partsCost;
        }, 0);
        return subtotal * (1 + invoice.quote.taxRate / 100);
    };

  return (
    <div className="space-y-4">
        <ul className="space-y-3">
            {sortedInvoices.length > 0 ? sortedInvoices.map(invoice => {
                const Icon = statusConfig[invoice.status].icon;
                const client = clientMap.get(invoice.quote.clientId);
                return (
                <li key={invoice.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex-grow">
                        <p className="font-bold text-lg text-gray-900 dark:text-white">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{client?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Date: {new Date(invoice.date).toLocaleDateString()} | Échéance: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                        <div className="flex sm:flex-col items-start sm:items-end gap-2">
                             <p className="font-mono text-lg font-semibold text-blue-600 dark:text-blue-400">{calculateTotal(invoice).toFixed(2)}€</p>
                             <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[invoice.status].color}`}>
                                <Icon className="w-3.5 h-3.5"/>
                                {statusConfig[invoice.status].text}
                            </span>
                        </div>
                       
                        <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 pt-3 sm:pt-0 sm:pl-3">
                           {invoice.status === 'draft' && (
                                <button onClick={() => onMarkAsPaid(invoice)} className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Marquer comme Payée"><CreditCardIcon className="h-5 w-5"/></button>
                           )}
                            <button onClick={() => onView(invoice)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Voir la facture"><FileTextIcon className="h-5 w-5"/></button>
                            <button onClick={() => onDelete(invoice.id)} className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Supprimer la facture"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </li>
            )}) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <ReceiptTaxIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
                    <h3 className="text-xl font-semibold mt-4">Aucune facture trouvée</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Générez une facture à partir d'une fiche de réparation terminée.</p>
                </div>
            )}
        </ul>
    </div>
  );
};

export default InvoiceList;