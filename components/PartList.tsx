import React, { useState } from 'react';
import { Part } from '../types';
import { PencilIcon, TrashIcon, WrenchScrewdriverIcon, PlusIcon, TruckIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';

interface PartListProps {
  parts: Part[];
  onEdit: (part: Part) => void;
  onDelete: (partId: string) => void;
  onAdd: () => void;
  onOrder: (part: Part) => void;
}

const PartList: React.FC<PartListProps> = ({ parts, onEdit, onDelete, onAdd, onOrder }) => {
  const [filter, setFilter] = useState('');
  const [partToDelete, setPartToDelete] = useState<Part | null>(null);
  
  const filteredParts = parts.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.reference.toLowerCase().includes(filter.toLowerCase()) ||
    p.supplier.toLowerCase().includes(filter.toLowerCase())
  ).sort((a,b) => a.name.localeCompare(b.name));

  const calculateSellingPrice = (part: Part): number => {
    if (part.pricingMethod === 'markup' && part.markupPercentage) {
        return part.purchasePrice * (1 + part.markupPercentage / 100);
    }
    return part.sellingPrice || part.purchasePrice;
  };

  const handleConfirmDelete = () => {
    if (partToDelete) {
      onDelete(partToDelete.id);
      setPartToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <input 
            type="text" 
            placeholder="Rechercher par nom, référence, fournisseur..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow py-2 px-4"
          />
          <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700">
              <PlusIcon className="h-5 w-5"/> Nouvelle Pièce
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Référence</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Fournisseur</th>
                <th className="p-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                <th className="p-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Prix Achat HT</th>
                <th className="p-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Prix Vente HT</th>
                <th className="p-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredParts.length > 0 ? filteredParts.map(part => (
                <tr key={part.id} className={`${part.stock <= 5 ? 'bg-red-50 dark:bg-red-900/20' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                  <td className="p-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">{part.name}</td>
                  <td className="p-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{part.reference}</td>
                  <td className="p-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{part.supplier}</td>
                  <td className={`p-3 whitespace-nowrap text-center font-bold ${part.stock <= 5 ? 'text-red-500' : 'text-green-600'}`}>{part.stock}</td>
                  <td className="p-3 whitespace-nowrap text-right font-mono text-gray-600 dark:text-gray-300">{part.purchasePrice.toFixed(2)}€</td>
                  <td className="p-3 whitespace-nowrap text-right font-mono font-semibold text-blue-600 dark:text-blue-400">{calculateSellingPrice(part).toFixed(2)}€
                  {part.pricingMethod === 'markup' && <span className="text-xs text-gray-400"> (Marge)</span>}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center">
                    <button onClick={() => onOrder(part)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" title="Commander"><TruckIcon className="h-5 w-5"/></button>
                    <button onClick={() => onEdit(part)} className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400" title="Modifier"><PencilIcon className="h-5 w-5"/></button>
                    <button onClick={() => setPartToDelete(part)} className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400" title="Supprimer"><TrashIcon className="h-5 w-5"/></button>
                  </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={7}>
                          <div className="text-center py-16 px-6">
                              <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
                              <h3 className="text-xl font-semibold mt-4">Aucune pièce trouvée</h3>
                              <p className="text-gray-500 dark:text-gray-400 mt-2">Ajustez votre recherche ou ajoutez une nouvelle pièce.</p>
                          </div>
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={!!partToDelete}
        onClose={() => setPartToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression de la pièce"
      >
        Êtes-vous sûr de vouloir supprimer la pièce "{partToDelete?.name}" ? Cette action est irréversible.
      </ConfirmationModal>
    </>
  );
};

export default PartList;