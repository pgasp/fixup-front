import React, { useState } from 'react';
import { VehicleInspectionItem, VehicleInspectionReport } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, CameraIcon } from './icons';

interface VehicleInspectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: VehicleInspectionReport) => void;
  repairOrderNumber: string;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const VehicleInspectionForm: React.FC<VehicleInspectionFormProps> = ({ isOpen, onClose, onSave, repairOrderNumber }) => {
    const [items, setItems] = useState<Omit<VehicleInspectionItem, 'id'>[]>([]);
    const [notes, setNotes] = useState('');

    const handleAddItem = () => {
        setItems([...items, { description: '', photo: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: 'description', value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handlePhotoChange = async (index: number, file: File | null) => {
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("L'image est trop lourde (max 2MB).");
            return;
        }
        try {
            const base64Photo = await blobToBase64(file);
            const newItems = [...items];
            newItems[index].photo = base64Photo;
            setItems(newItems);
        } catch (error) {
            console.error("Erreur lors de la conversion de l'image:", error);
            alert("Erreur lors du chargement de l'image.");
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const report: VehicleInspectionReport = {
            id: crypto.randomUUID(),
            items: items.filter(i => i.description && i.photo).map(i => ({...i, id: crypto.randomUUID()})),
            notes,
        };
        onSave(report);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`État des lieux d'entrée - ${repairOrderNumber}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Anomalies constatées</h3>
                    {items.map((item, index) => (
                        <div key={index} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-gray-50 dark:bg-gray-800/50">
                            <input 
                                type="text"
                                placeholder={`Description de l'anomalie #${index + 1}`}
                                value={item.description}
                                onChange={e => handleItemChange(index, 'description', e.target.value)}
                                className="md:col-span-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"
                                required
                            />
                             <div className="flex items-center gap-2">
                                <label htmlFor={`photo-${index}`} className="flex-grow cursor-pointer text-center py-2 px-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md truncate">
                                    <CameraIcon className="w-4 h-4 inline-block mr-1"/>
                                    {item.photo ? 'Changer Photo' : 'Ajouter Photo'}
                                </label>
                                <input id={`photo-${index}`} type="file" accept="image/*" onChange={e => handlePhotoChange(index, e.target.files ? e.target.files[0] : null)} className="hidden"/>
                                <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:text-red-400"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                            {item.photo && <img src={item.photo} alt={`Anomalie ${index + 1}`} className="md:col-span-3 rounded-md max-h-40 object-contain mx-auto"/>}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold py-2"><PlusIcon/> Ajouter une anomalie</button>
                </div>
                 <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Notes générales</label>
                    <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"></textarea>
                </div>
                 <div className="mt-8 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-500 text-white rounded-md font-semibold">Annuler</button>
                    <button type="submit" className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold">Sauvegarder et commencer</button>
                </div>
            </form>
        </Modal>
    );
};

export default VehicleInspectionForm;
