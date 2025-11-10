// FIX: Provide full implementation for the InterventionTemplateForm component.
import React, { useState, useEffect } from 'react';
import { InterventionTemplate, LaborTask, PartItem, Part } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon } from './icons';

interface InterventionTemplateFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (template: InterventionTemplate) => void;
    parts: Part[];
    existingTemplate?: InterventionTemplate | null;
}

const emptyLaborTask: Omit<LaborTask, 'id'> = { description: '', hours: 1, rate: 50, partItems: [] };
const emptyPartItem: Omit<PartItem, 'id'> = { partId: '', description: '', quantity: 1, unitPrice: 0 };

const calculatePartSellingPrice = (part: Part): number => {
    if (part.pricingMethod === 'markup' && part.markupPercentage) {
        return part.purchasePrice * (1 + part.markupPercentage / 100);
    }
    return part.sellingPrice || 0;
};

const InterventionTemplateForm: React.FC<InterventionTemplateFormProps> = ({ isOpen, onClose, onSave, parts, existingTemplate }) => {
    const [name, setName] = useState('');
    const [laborItems, setLaborItems] = useState<LaborTask[]>([]);
    
    useEffect(() => {
        if (isOpen) {
            if (existingTemplate) {
                setName(existingTemplate.name);
                // FIX: Add a unique 'id' to each labor item when loading from a template.
                // The form state `laborItems` is of type `LaborTask[]`, which requires an `id`,
                // while `existingTemplate.laborItems` is `Omit<LaborTask, 'id'>[]`.
                setLaborItems(existingTemplate.laborItems.map(l => ({...l, id: crypto.randomUUID(), partItems: l.partItems.map(p => ({...p}))})));
            } else {
                setName('');
                setLaborItems([{...emptyLaborTask, id: crypto.randomUUID(), partItems: []}]);
            }
        }
    }, [existingTemplate, isOpen]);
    
    // Labor Handlers
    const handleLaborChange = (index: number, field: keyof Omit<LaborTask, 'id' | 'partItems'>, value: string | number) => {
        const newLaborItems = [...laborItems];
        (newLaborItems[index] as any)[field] = value;
        setLaborItems(newLaborItems);
    }
    
    const handleAddLabor = () => {
        setLaborItems([...laborItems, {...emptyLaborTask, id: crypto.randomUUID(), partItems: []}]);
    }
    
    const handleRemoveLabor = (index: number) => {
        setLaborItems(laborItems.filter((_, i) => i !== index));
    }

    // Part Handlers
    const handlePartSelect = (laborIndex: number, partIndex: number, partId: string) => {
        const part = parts.find(p => p.id === partId);
        const newLaborItems = [...laborItems];
        const partItems = [...newLaborItems[laborIndex].partItems];
        if (part) {
            partItems[partIndex] = { ...partItems[partIndex], partId, description: part.name, unitPrice: calculatePartSellingPrice(part) };
        } else {
            partItems[partIndex] = { ...partItems[partIndex], partId: '', description: '', unitPrice: 0 };
        }
        newLaborItems[laborIndex].partItems = partItems;
        setLaborItems(newLaborItems);
    }

    const handlePartQuantityChange = (laborIndex: number, partIndex: number, quantity: number) => {
        const newLaborItems = [...laborItems];
        newLaborItems[laborIndex].partItems[partIndex].quantity = quantity;
        setLaborItems(newLaborItems);
    }

    const handleAddPart = (laborIndex: number) => {
        const newLaborItems = [...laborItems];
        newLaborItems[laborIndex].partItems.push({...emptyPartItem, id: crypto.randomUUID()});
        setLaborItems(newLaborItems);
    }

    const handleRemovePart = (laborIndex: number, partIndex: number) => {
        const newLaborItems = [...laborItems];
        newLaborItems[laborIndex].partItems = newLaborItems[laborIndex].partItems.filter((_, i) => i !== partIndex);
        setLaborItems(newLaborItems);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            alert("Le nom du modèle est obligatoire.");
            return;
        }
        // FIX: Remove the temporary 'id' from laborItems before saving to match the InterventionTemplate type.
        const template: InterventionTemplate = {
            id: existingTemplate?.id || crypto.randomUUID(),
            name,
            laborItems: laborItems.filter(l => l.description).map(({ id, ...rest }) => ({
                ...rest,
                partItems: rest.partItems.filter(p => p.partId)
            })),
        };
        onSave(template);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={existingTemplate ? "Modifier l'intervention" : "Nouvelle intervention"}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="template-name" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Nom de l'intervention</label>
                    <input id="template-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"/>
                </div>
                
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400">Tâches et Pièces</h3>
                    {laborItems.map((labor, laborIndex) => (
                        <div key={labor.id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg space-y-4 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold">Tâche #{laborIndex + 1}</p>
                                <button type="button" onClick={() => handleRemoveLabor(laborIndex)} className="text-red-500"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Description main d'œuvre</label>
                                    <input type="text" value={labor.description} onChange={e => handleLaborChange(laborIndex, 'description', e.target.value)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-sm"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Heures</label>
                                    <input type="number" step="0.1" value={labor.hours} onChange={e => handleLaborChange(laborIndex, 'hours', parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-sm"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Taux Horaire (€)</label>
                                    <input type="number" step="0.01" value={labor.rate} onChange={e => handleLaborChange(laborIndex, 'rate', parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-sm"/>
                                </div>
                            </div>
                            
                            <div className="pl-4 border-l-2 border-blue-400 dark:border-blue-600 space-y-2">
                                <h4 className="text-sm font-semibold mt-2">Pièces associées</h4>
                                {labor.partItems.map((part, partIndex) => (
                                    <div key={part.id} className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-12 md:col-span-8">
                                            <select 
                                                value={part.partId} 
                                                onChange={e => handlePartSelect(laborIndex, partIndex, e.target.value)}
                                                className="w-full text-sm p-1 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                            >
                                                <option value="">Sélectionner une pièce</option>
                                                {parts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.reference})</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-4 md:col-span-3"><input type="number" placeholder="Qté" value={part.quantity} onChange={e => handlePartQuantityChange(laborIndex, partIndex, parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-sm py-1 px-2"/></div>
                                        <div className="col-span-4 md:col-span-1"><button type="button" onClick={() => handleRemovePart(laborIndex, partIndex)} className="text-red-500"><TrashIcon className="h-4 w-4"/></button></div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => handleAddPart(laborIndex)} className="text-sm flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold"><PlusIcon className="h-4 w-4"/> Pièce</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddLabor} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold py-2"><PlusIcon/> Ajouter une tâche</button>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-500 text-white rounded-md font-semibold">Annuler</button>
                    <button type="submit" className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold">Sauvegarder</button>
                </div>
            </form>
        </Modal>
    )
}

export default InterventionTemplateForm;