import React, { useState, useEffect } from 'react';
import { PurchaseOrder, PurchaseOrderItem, Part } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon } from './icons';

interface PurchaseOrderFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: PurchaseOrder) => void;
    parts: Part[];
    existingOrder?: PurchaseOrder | null;
    nextOrderNumber: string;
}

const emptyItem: Omit<PurchaseOrderItem, 'id'> = { partId: '', quantity: 1, unitPrice: 0 };

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ isOpen, onClose, onSave, parts, existingOrder, nextOrderNumber }) => {
    const [order, setOrder] = useState<Omit<PurchaseOrder, 'id' | 'orderNumber' | 'status'>>({
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        items: [],
    });

    useEffect(() => {
        if (isOpen) {
            if (existingOrder) {
                setOrder(existingOrder);
            } else {
                setOrder({ supplier: '', date: new Date().toISOString().split('T')[0], items: [{...emptyItem, id: crypto.randomUUID()}] });
            }
        }
    }, [existingOrder, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setOrder(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleItemChange = (index: number, field: keyof Omit<PurchaseOrderItem, 'id'>, value: string | number) => {
        const newItems = [...order.items];
        (newItems[index] as any)[field] = value;
        setOrder(prev => ({ ...prev, items: newItems }));
    };

    const handlePartSelect = (index: number, partId: string) => {
        const part = parts.find(p => p.id === partId);
        const newItems = [...order.items];
        if (part) {
            newItems[index] = { ...newItems[index], partId, unitPrice: part.purchasePrice };
            if(!order.supplier){
                setOrder(prev => ({...prev, supplier: part.supplier}));
            }
        } else {
            newItems[index] = { ...newItems[index], partId: '', unitPrice: 0 };
        }
        setOrder(prev => ({...prev, items: newItems}));
    };
    
    const handleAddItem = () => setOrder(prev => ({ ...prev, items: [...prev.items, {...emptyItem, id: crypto.randomUUID()}] }));
    const handleRemoveItem = (index: number) => setOrder(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const orderToSave: PurchaseOrder = {
            id: existingOrder?.id || crypto.randomUUID(),
            orderNumber: existingOrder?.orderNumber || nextOrderNumber,
            status: existingOrder?.status || 'draft',
            ...order,
            items: order.items.filter(item => item.partId && item.quantity > 0),
        };
        onSave(orderToSave);
    };

    const total = order.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={existingOrder ? `Modifier Commande ${existingOrder.orderNumber}` : `Nouvelle Commande ${nextOrderNumber}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="supplier" value={order.supplier} onChange={handleChange} placeholder="Fournisseur" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                    <input name="date" type="date" value={order.date.split('T')[0]} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                    <input name="expectedDeliveryDate" type="date" value={order.expectedDeliveryDate?.split('T')[0] || ''} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                </div>
                
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Articles</h3>
                    {order.items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-12 sm:col-span-6">
                                <select value={item.partId} onChange={e => handlePartSelect(index, e.target.value)} className="w-full text-sm p-2 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                    <option value="">Sélectionner une pièce</option>
                                    {parts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.reference})</option>)}
                                </select>
                            </div>
                            <div className="col-span-4 sm:col-span-2"><input type="number" placeholder="Qté" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value, 10) || 0)} className="w-full text-sm p-2 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                            <div className="col-span-4 sm:col-span-3"><input type="number" placeholder="Prix U. HT" value={item.unitPrice} step="0.01" onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full text-sm p-2 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                            <div className="col-span-4 sm:col-span-1 text-right"><button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500"><TrashIcon className="h-5 w-5"/></button></div>
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
