// Fix: Create InterventionTemplateList component.
import React from 'react';
import { InterventionTemplate } from '../types';
import { PencilIcon, TrashIcon, WrenchScrewdriverIcon } from './icons';

interface InterventionTemplateListProps {
  templates: InterventionTemplate[];
  onEdit: (template: InterventionTemplate) => void;
  onDelete: (templateId: string) => void;
}

const InterventionTemplateList: React.FC<InterventionTemplateListProps> = ({ templates, onEdit, onDelete }) => {
  const sortedTemplates = [...templates].sort((a, b) => a.name.localeCompare(b.name));

  const calculateTotal = (template: InterventionTemplate): number => {
    return template.laborItems.reduce((total, task) => {
        const laborTotal = task.hours * task.rate;
        const partsTotal = task.partItems.reduce((pAcc, part) => pAcc + (part.quantity * part.unitPrice), 0);
        return total + laborTotal + partsTotal;
    }, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedTemplates.length > 0 ? (
            sortedTemplates.map(template => (
            <li key={template.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{template.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {template.laborItems.length} tâche(s)
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-mono text-lg text-blue-600 dark:text-blue-400">{calculateTotal(template).toFixed(2)}€ HT</span>
                    <button onClick={() => onEdit(template)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400" title="Modifier le modèle">
                        <PencilIcon className="h-5 w-5"/>
                    </button>
                    <button onClick={() => onDelete(template.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" title="Supprimer le modèle">
                        <TrashIcon className="h-5 w-5"/>
                    </button>
                </div>
            </li>
            ))
        ) : (
            <div className="text-center py-16 px-6">
                <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
                <h3 className="text-xl font-semibold mt-4">Aucune intervention dans le catalogue</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Cliquez sur "Nouvelle intervention" pour en ajouter une.</p>
            </div>
        )}
        </ul>
    </div>
  );
};

export default InterventionTemplateList;