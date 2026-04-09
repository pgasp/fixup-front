import React, { useState, useEffect } from 'react';
import { PurchaseOrder, PurchaseOrderItem, Part } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon } from './icons';

interface PurchaseOrderFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: PurchaseOrder, newParts: Part[]) => void;
    parts: Part[];
    existingOrder?: PurchaseOrder | null;
    nextOrderNumber: string;
}

type FormOrderItem = {
    id: string;
    isNew: boolean;
    partId?: string;
    description: string;
    newReference: string;
    quantity: number;
    unitPrice: number;
};

const emptyFormItem: FormOrderItem = {
    id: crypto.randomUUID(),
    isNew: false,
    partId: '',
    description: '',
    newReference: '',
    quantity: 1,
    unitPrice: 0,
};

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ isOpen, onClose, onSave, parts, existingOrder, nextOrderNumber }) => {
    const [orderInfo, setOrderInfo] = useState({
        supplier: '',
        supplierOrderNumber: '',
        date: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: '',
    });
    const [formItems, setFormItems] = useState<FormOrderItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (existingOrder) {
                const { items, supplier, supplierOrderNumber, date, expectedDeliveryDate } = existingOrder;
                setOrderInfo({ supplier, supplierOrderNumber: supplierOrderNumber || '', date, expectedDeliveryDate: expectedDeliveryDate || '' });
                setFormItems(items.map(item => ({
                    ...item,
                    isNew: false,
                    newReference: parts.find(p => p.id === item.partId)?.reference || '',
                })));
            } else {
                setOrderInfo({
                    supplier: '',
                    supplierOrderNumber: '',
                    date: new Date().toISOString().split('T')[0],
                    expectedDeliveryDate: addDays(new Date(), 7),
                });
                setFormItems([emptyFormItem]);
            }
        }
    }, [existingOrder, isOpen, parts]);

    const addDays = (date: Date, days: number): string => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setOrderInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleItemChange = (index: number, field: keyof FormOrderItem, value: string | number | boolean) => {
        const newItems = [...formItems];
        (newItems[index] as any)[field] = value;
        setFormItems(newItems);
    };

    const handlePartSelect = (index: number, partId: string) => {
        const part = parts.find(p => p.id === partId);
        const newItems = [...formItems];
        if (part) {
            newItems[index] = { ...newItems[index], partId, unitPrice: part.purchasePrice, description: part.name, newReference: part.reference };
            if (!orderInfo.supplier) {
                setOrderInfo(prev => ({ ...prev, supplier: part.supplier }));
            }
        } else {
            newItems[index] = { ...newItems[index], partId: '', unitPrice: 0, description: '', newReference: '' };
        }
        setFormItems(newItems);
    };
    
    const handleAddItem = () => setFormItems(prev => [...prev, { ...emptyFormItem, id: crypto.randomUUID() }]);
    const handleRemoveItem = (index: number) => setFormItems(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPartsToCreate: Part[] = [];

        const finalItems: PurchaseOrderItem[] = formItems.map(item => {
            if (item.isNew) {
                const newPartId = crypto.randomUUID();
                newPartsToCreate.push({
                    id: newPartId,
                    name: item.description,
                    reference: item.newReference,
                    supplier: orderInfo.supplier,
                    stock: 0,
                    purchasePrice: item.unitPrice,
                    pricingMethod: 'markup',
                    markupPercentage: 50,
                });
                return {
                    id: item.id,
                    partId: newPartId,
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                };
            } else {
                return {
                    id: item.id,
                    partId: item.partId!,
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                };
            }
        }).filter(item => item.partId && item.quantity > 0);

        const orderToSave: PurchaseOrder = {
            id: existingOrder?.id || crypto.randomUUID(),
            orderNumber: existingOrder?.orderNumber || nextOrderNumber,
            status: existingOrder?.status || 'draft',
            supplier: orderInfo.supplier,
            supplierOrderNumber: orderInfo.supplierOrderNumber,
            date: orderInfo.date,
            expectedDeliveryDate: orderInfo.expectedDeliveryDate,
            items: finalItems,
        };

        onSave(orderToSave, newPartsToCreate);
    };

    const total = formItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={existingOrder ? `Modifier Commande ${existingOrder.orderNumber}` : `Nouvelle Commande ${nextOrderNumber}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border dark:border-gray-700 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Fournisseur *</label>
                        <input name="supplier" value={orderInfo.supplier} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">N° Commande Fournisseur</label>
                        <input name="supplierOrderNumber" value={orderInfo.supplierOrderNumber} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date de commande *</label>
                        <input name="date" type="date" value={orderInfo.date.split('T')[0]} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date de livraison prévue</label>
                        <input name="expectedDeliveryDate" type="date" value={orderInfo.expectedDeliveryDate?.split('T')[0] || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Articles</h3>
                    {formItems.map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <input type="checkbox" checked={item.isNew} onChange={e => handleItemChange(index, 'isNew', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                    Nouvelle pièce non référencée
                                </label>
                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-400"><TrashIcon className="h-5 w-5"/></button>
                            </div>

                            <div className="grid grid-cols-12 gap-2 items-center">
                                {item.isNew ? (
                                    <>
                                        <div className="col-span-12 sm:col-span-6"><input type="text" placeholder="Nom de la pièce *" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} required className="w-full text-sm p-2 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                                        <div className="col-span-12 sm:col-span-6"><input type="text" placeholder="Référence" value={item.newReference} onChange={e => handleItemChange(index, 'newReference', e.target.value)} className="w-full text-sm p-2 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                                    </>
                                ) : (
                                    <div className="col-span-12">
                                        <select value={item.partId} onChange={e => handlePartSelect(index, e.target.value)} className="w-full text-sm p-2 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                            <option value="">Sélectionner une pièce existante</option>
                                            {parts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.reference})</option>)}
                                        </select>
                                    </div>
                                )}
                                <div className="col-span-6 sm:col-span-6"><input type="number" placeholder="Quantité" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value, 10) || 0)} className="w-full text-sm p-2 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                                <div className="col-span-6 sm:col-span-6"><input type="number" placeholder="Prix U. HT" value={item.unitPrice} step="0.01" onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full text-sm p-2 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem} className="text-sm flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold"><PlusIcon className="h-4 w-4"/> Ajouter un article</button>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between font-bold text-base w-full max-w-xs">
                        <span>TOTAL HT</span><span className="font-mono">{total.toFixed(2)}€</span>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-500 text-white rounded-md font-semibold">Annuler</button>
                    <button type="submit" className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold">Sauvegarder</button>
                </div>
            </form>
        </Modal>
    );
};

export default PurchaseOrderForm;