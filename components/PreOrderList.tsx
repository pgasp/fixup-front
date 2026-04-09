import React, { useMemo, useState } from 'react';
import { Quote, QuoteStatus } from '../types';
import { ShoppingCartIcon, TruckIcon } from './icons';
import { quoteStatusBadgeConfig } from '../domain/status';

interface PreOrderListProps {
  quotes: Quote[];
  onCreatePurchaseOrder: (supplier: string, items: { id: string; partId: string; description: string; quantity: number; purchasePrice: number; }[]) => void;
}

type FlatPartItem = {
    uniqueKey: string; // Combo of quoteId and lineItemId
    id: string; // Line item ID
    partId: string;
    description: string;
    reference?: string;
    supplierReference?: string;
    quantity: number;
    purchasePrice: number;
    supplier: string;
    quoteNumber: string;
    quoteStatus: QuoteStatus;
    quoteId: string;
};

const PreOrderList: React.FC<PreOrderListProps> = ({ quotes, onCreatePurchaseOrder }) => {
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const flatParts = useMemo(() => {
        const parts: FlatPartItem[] = [];
        quotes.forEach(quote => {
            // Only allow parts from approved quotes to be ordered
            if (quote.status !== 'approved') return;

            quote.laborItems.forEach(labor => {
                labor.partItems.forEach(part => {
                    if (part.isPreOrder && part.preOrderStatus === 'priced' && part.supplier && part.purchasePrice) {
                        parts.push({
                            uniqueKey: part.id, // part.id is the unique line item ID
                            id: part.id,
                            partId: part.partId,
                            description: part.description,
                            reference: part.reference,
                            supplierReference: part.supplierReference,
                            quantity: part.quantity,
                            purchasePrice: part.purchasePrice,
                            supplier: part.supplier,
                            quoteNumber: quote.quoteNumber,
                            quoteStatus: quote.status,
                            quoteId: quote.id
                        });
                    }
                });
            });
        });
        return parts.sort((a, b) => a.supplier.localeCompare(b.supplier) || a.quoteNumber.localeCompare(b.quoteNumber));
    }, [quotes]);

    const toggleSelectAll = () => {
        if (selectedItems.size === flatParts.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(flatParts.map(p => p.uniqueKey)));
        }
    };

    const toggleItem = (key: string) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(key)) {
            newSet.delete(key);
        } else {
            newSet.add(key);
        }
        setSelectedItems(newSet);
    };

    const handleCreateOrders = () => {
        if (selectedItems.size === 0) return;

        const selectedParts = flatParts.filter(p => selectedItems.has(p.uniqueKey));
        
        // Group by supplier
        const bySupplier = new Map<string, FlatPartItem[]>();
        selectedParts.forEach(part => {
            if (!bySupplier.has(part.supplier)) {
                bySupplier.set(part.supplier, []);
            }
            bySupplier.get(part.supplier)!.push(part);
        });

        // Create orders
        bySupplier.forEach((items, supplier) => {
            onCreatePurchaseOrder(supplier, items);
        });
        
        setSelectedItems(new Set());
    };

    const totalSelectedAmount = flatParts
        .filter(p => selectedItems.has(p.uniqueKey))
        .reduce((acc, p) => acc + (p.quantity * p.purchasePrice), 0);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <ShoppingCartIcon className="h-6 w-6 text-blue-500" />
                            Pièces à commander
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Sélectionnez les pièces pour générer les bons de commande par fournisseur.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {selectedItems.size > 0 && (
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedItems.size} article(s) sélectionné(s)</p>
                                <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{totalSelectedAmount.toFixed(2)}€ HT</p>
                            </div>
                        )}
                        <button
                            onClick={handleCreateOrders}
                            disabled={selectedItems.size === 0}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg shadow-md flex items-center gap-2 transition-colors"
                        >
                            <TruckIcon className="h-5 w-5"/>
                            Créer Commande(s)
                        </button>
                    </div>
                </div>

                {flatParts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-3 text-center w-12">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedItems.size === flatParts.length && flatParts.length > 0} 
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Devis</th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Fournisseur</th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Références</th>
                                    <th className="p-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Qté</th>
                                    <th className="p-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Prix Achat U. HT</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {flatParts.map(part => {
                                    const status = quoteStatusBadgeConfig[part.quoteStatus];
                                    const StatusIcon = status.icon;
                                    return (
                                        <tr key={part.uniqueKey} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedItems.has(part.uniqueKey) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                            <td className="p-3 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedItems.has(part.uniqueKey)} 
                                                    onChange={() => toggleItem(part.uniqueKey)}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                <div className="font-bold text-gray-900 dark:text-white">{part.quoteNumber}</div>
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${status.color}`}>
                                                    {StatusIcon && <StatusIcon className="w-3 h-3"/>}
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                                                {part.description}
                                            </td>
                                            <td className="p-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                {part.supplier}
                                            </td>
                                            <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col gap-1">
                                                    <span>Int: {part.reference || '-'}</span>
                                                    <span>Fourn: {part.supplierReference || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center font-semibold text-gray-800 dark:text-gray-200">
                                                {part.quantity}
                                            </td>
                                            <td className="p-3 text-right font-mono text-gray-800 dark:text-gray-200">
                                                {part.purchasePrice.toFixed(2)}€
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 px-6">
                        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <ShoppingCartIcon className="h-8 w-8 text-gray-400 dark:text-gray-500"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Aucune pièce à commander</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                            Seules les pièces provenant de devis <strong>Approuvés</strong> et dont le prix d'achat a été renseigné apparaissent ici.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreOrderList;