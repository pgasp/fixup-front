// FIX: Provide full implementation for the PartForm component.
import React, { useState, useEffect } from 'react';
import { Part } from '../types';
import Modal from './Modal';

interface PartFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (part: Part) => void;
    existingPart?: Part | null;
}

const PartForm: React.FC<PartFormProps> = ({ isOpen, onClose, onSave, existingPart }) => {
  const [part, setPart] = useState<Omit<Part, 'id'>>({
    name: '',
    reference: '',
    supplier: '',
    stock: 0,
    purchasePrice: 0,
    pricingMethod: 'fixed',
    sellingPrice: 0,
    markupPercentage: 0,
  });
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (existingPart) {
        setPart({ ...existingPart });
      } else {
        setPart({ name: '', reference: '', supplier: '', stock: 0, purchasePrice: 0, pricingMethod: 'fixed', sellingPrice: 0, markupPercentage: 25 });
      }
      setInfoMessage('');
    }
  }, [existingPart, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const numericValue = parseFloat(value) || 0;

    if (name === "sellingPrice") {
        setPart(prev => {
            if (prev.pricingMethod === 'markup') {
                setInfoMessage('Le prix a été ajusté manuellement. La tarification est passée en "Prix Fixe".');
                return { ...prev, sellingPrice: numericValue, pricingMethod: 'fixed' };
            }
            return { ...prev, sellingPrice: numericValue };
        });
    } else {
        setPart(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? numericValue : value 
        }));
    }
  };

  const handlePricingMethodChange = (method: 'fixed' | 'markup') => {
    setPart(prev => ({...prev, pricingMethod: method}));
    setInfoMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!part.name) {
        alert("Le nom de la pièce est obligatoire.");
        return;
    }
    const partToSave: Part = {
      id: existingPart?.id || crypto.randomUUID(),
      ...part,
    };
    onSave(partToSave);
  };

  const calculatedSellingPrice = part.pricingMethod === 'markup' 
    ? part.purchasePrice * (1 + (part.markupPercentage || 0) / 100)
    : part.sellingPrice || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingPart ? 'Modifier la pièce' : 'Nouvelle pièce'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Nom de la pièce *</label>
            <input name="name" value={part.name} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          </div>
          <input name="reference" value={part.reference} onChange={handleChange} placeholder="Référence" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="supplier" value={part.supplier} onChange={handleChange} placeholder="Fournisseur" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Stock</label>
            <input name="stock" type="number" value={part.stock} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Prix d'achat HT</label>
            <input name="purchasePrice" type="number" step="0.01" value={part.purchasePrice} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          </div>

          <div className="md:col-span-2 p-4 border dark:border-gray-700 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Méthode de tarification</label>
            <div className="flex gap-4 mb-3">
                <button type="button" onClick={() => handlePricingMethodChange('fixed')} className={`flex-1 py-2 rounded-md font-semibold ${part.pricingMethod === 'fixed' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Prix Fixe</button>
                <button type="button" onClick={() => handlePricingMethodChange('markup')} className={`flex-1 py-2 rounded-md font-semibold ${part.pricingMethod === 'markup' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Marge en %</button>
            </div>
            {part.pricingMethod === 'markup' && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Marge en % (sur prix d'achat)</label>
                    <input name="markupPercentage" type="number" step="0.1" value={part.markupPercentage || 0} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Prix de vente HT</label>
                <input 
                    name="sellingPrice" 
                    type="number" 
                    step="0.01" 
                    value={calculatedSellingPrice.toFixed(2)} 
                    onChange={handleChange} 
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" 
                />
                 {infoMessage && <p className="text-xs text-green-600 dark:text-green-400 mt-1">{infoMessage}</p>}
            </div>
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

export default PartForm;