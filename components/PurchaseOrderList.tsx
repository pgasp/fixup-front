import React, { useMemo } from 'react';
import { PurchaseOrder, PurchaseOrderStatus, Part } from '../types';
import { FileTextIcon, PencilIcon, TrashIcon, ClockIcon, CheckCircleIcon, TruckIcon, CreditCardIcon } from './icons';

interface PurchaseOrderListProps {
  orders: PurchaseOrder[];
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onReceive: (orderId: string) => void;
  onMarkAsPaid: (order: PurchaseOrder) => void;
}

const statusConfig: { [key in PurchaseOrderStatus]: { text: string; color: string; icon: React.FC<{className?:string}> } } = {
    'draft': { text: 'Brouillon', color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700', icon: FileTextIcon },
    'ordered': { text: 'Commandé', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50', icon: ClockIcon },
    'partially_received': { text: 'Partiellement Reçu', color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50', icon: TruckIcon },
    'received': { text: 'Reçu', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50', icon: CheckCircleIcon },
    'cancelled': { text: 'Annulé', color: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/50', icon: TrashIcon },
};

const PurchaseOrderList: React.FC<PurchaseOrderListProps> = ({ orders, onEdit, onDelete, onReceive, onMarkAsPaid }) => {
    
    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders]);

    const calculateTotal = (order: PurchaseOrder) => {
        return order.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    };

  return (
    <div className="space-y-4">
        <ul className="space-y-3">
            {sortedOrders.length > 0 ? sortedOrders.map(order => {
                const Icon = statusConfig[order.status].icon;
                return (
                <li key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex-grow">
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                            {order.orderNumber}
                            {order.supplierOrderNumber && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({order.supplierOrderNumber})</span>}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{order.supplier}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Date: {new Date(order.date).toLocaleDateString()} | Prévu le: {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                        <div className="flex sm:flex-col items-start sm:items-end gap-2">
                             <p className="font-mono text-lg font-semibold text-blue-600 dark:text-blue-400">{calculateTotal(order).toFixed(2)}€</p>
                             <div className="flex gap-2">
                                {order.isPaid && (
                                     <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50" title={`Payé le ${new Date(order.paymentDate!).toLocaleDateString()}`}>
                                        <CreditCardIcon className="w-3.5 h-3.5"/> Payé
                                    </span>
                                )}
                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[order.status].color}`}>
                                    <Icon className="w-3.5 h-3.5"/>
                                    {statusConfig[order.status].text}
                                </span>
                             </div>
                        </div>
                       
                        <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 pt-3 sm:pt-0 sm:pl-3">
                           {order.status === 'ordered' && (
                                <button onClick={() => onReceive(order.id)} className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Marquer comme Reçue"><CheckCircleIcon className="h-5 w-5"/></button>
                           )}
                           {order.status === 'received' && !order.isPaid && (
                                <button onClick={() => onMarkAsPaid(order)} className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Marquer comme Payée"><CreditCardIcon className="h-5 w-5"/></button>
                           )}
                           <button onClick={() => onEdit(order)} className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Modifier"><PencilIcon className="h-5 w-5"/></button>
                           <button onClick={() => onDelete(order.id)} className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Supprimer"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </li>
            )}) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <TruckIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
                    <h3 className="text-xl font-semibold mt-4">Aucune commande fournisseur</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Cliquez sur "Nouvelle commande" pour commencer.</p>
                </div>
            )}
        </ul>
    </div>
  );
};

export default PurchaseOrderList;