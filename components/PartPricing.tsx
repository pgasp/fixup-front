import React, { useState, useMemo, useEffect } from 'react';
import { Quote } from '../types';
import { DocumentSearchIcon } from './icons';

interface PartPricingProps {
  quotes: Quote[];
  onUpdatePrices: (pricedParts: Map<string, { price: number; supplier: string; supplierReference: string; }>) => void;
}

type PartToPrice = {
    key: string;
    description: string;
    reference?: string;
    totalQuantity: number;
    quoteNumbers: string[];
    supplier?: string;
}

type PartData = {
    price: string;
    supplier: string;
    supplierReference: string;
}

const PartPricing: React.FC<PartPricingProps> = ({ quotes, onUpdatePrices }) => {
    const [partData, setPartData] = useState<Map<string, PartData>>(new Map());
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    const partsToPrice = useMemo<PartToPrice[]>(() => {
        const partsMap = new Map<string, PartToPrice>();
        quotes.forEach(quote => {
            if (quote.status === 'awaiting_part_pricing') {
                quote.laborItems.forEach(labor => {
                    labor.partItems.forEach(part => {
                        if (part.isPreOrder && part.preOrderStatus === 'pending_pricing') {
                            const key = `${part.description}_${part.reference || ''}`;
                            if (partsMap.has(key)) {
                                const existing = partsMap.get(key)!;
                                existing.totalQuantity += part.quantity;
                                if (!existing.quoteNumbers.includes(quote.quoteNumber)) {
                                    existing.quoteNumbers.push(quote.quoteNumber);
                                }
                            } else {
                                partsMap.set(key, {
                                    key,
                                    description: part.description,
                                    reference: part.reference,
                                    totalQuantity: part.quantity,
                                    quoteNumbers: [quote.quoteNumber],
                                    supplier: part.supplier,
                                });
                            }
                        }
                    });
                });
            }
        });
        return Array.from(partsMap.values());
    }, [quotes]);

    useEffect(() => {
        const newPartData = new Map<string, PartData>();
        partsToPrice.forEach(part => {
            const existingData = partData.get(part.key);
            newPartData.set(part.key, {
                price: existingData?.price || '',
                supplier: existingData?.supplier ?? part.supplier ?? '',
                supplierReference: existingData?.supplierReference || ''
            });
        });
        setPartData(newPartData);
    }, [partsToPrice]);


    const handleDataChange = (key: string, field: keyof PartData, value: string) => {
        setPartData(prev => {
            const newMap = new Map(prev);
            const currentData = newMap.get(key) || { price: '', supplier: '', supplierReference: '' };
            // FIX: Replaced object spread with Object.assign to resolve "Spread types may only be created from object types" error.
            newMap.set(key, Object.assign({}, currentData, { [field]: value }));
            return newMap;
        });
    };

    const handleSubmit = () => {
        const pricedParts = new Map<string, { price: number; supplier: string; supplierReference: string; }>();
        partData.forEach((data, key) => {
            const price = parseFloat(data.price);
            // We only submit if a price is entered. Supplier info is optional but will be saved if present.
            if (!isNaN(price) && price > 0) {
                pricedParts.set(key, { 
                    price, 
                    supplier: data.supplier, 
                    supplierReference: data.supplierReference 
                });
            }
        });
        if (pricedParts.size > 0) {
            onUpdatePrices(pricedParts);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } else {
            alert("Veuillez entrer au moins un prix valide.");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Pièces en attente de cotation</h3>
            {partsToPrice.length > 0 ? (
                <div className="space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Référence</th>
                                    <th className="p-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Qté</th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-48">Fournisseur</th>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-48">Réf. Fournisseur</th>
                                    <th className="p-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-40">Prix d'Achat HT</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {partsToPrice.map(part => (
                                    <tr key={part.key}>
                                        <td className="p-3 font-medium text-gray-900 dark:text-white">
                                            {part.description}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Devis: {part.quoteNumbers.join(', ')}</p>
                                        </td>
                                        <td className="p-3 text-gray-500 dark:text-gray-400">{part.reference || 'N/A'}</td>
                                        <td className="p-3 text-center font-semibold">{part.totalQuantity}</td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={partData.get(part.key)?.supplier || ''}
                                                onChange={e => handleDataChange(part.key, 'supplier', e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2"
                                                placeholder="Nom du fournisseur"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={partData.get(part.key)?.supplierReference || ''}
                                                onChange={e => handleDataChange(part.key, 'supplierReference', e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2"
                                                placeholder="Référence pièce"
                                            />
                                        </td>
                                        <td className="p-3 text-right">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={partData.get(part.key)?.price || ''}
                                                onChange={e => handleDataChange(part.key, 'price', e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-right font-mono"
                                                placeholder="0.00€"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {saveSuccess && <p className="text-green-600 dark:text-green-400 font-semibold">Prix sauvegardés !</p>}
                        <button onClick={handleSubmit} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700">
                            Sauvegarder les Prix
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 px-6">
                    <DocumentSearchIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
                    <h3 className="text-xl font-semibold mt-4">Aucune pièce en attente</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Toutes les pièces sur commande ont été cotées.</p>
                </div>
            )}
        </div>
    );
};

export default PartPricing;