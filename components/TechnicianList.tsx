import React from 'react';
import { Technician, RepairOrder } from '../types';
import { PencilIcon, TrashIcon, WrenchIcon, UserCircleIcon, MailIcon, PhoneIcon } from './icons';

interface TechnicianListProps {
  technicians: Technician[];
  repairOrders: RepairOrder[];
  onEdit: (technician: Technician) => void;
  onDelete: (technicianId: string) => void;
}

const TechnicianList: React.FC<TechnicianListProps> = ({ technicians, repairOrders, onEdit, onDelete }) => {
  const sortedTechnicians = [...technicians].sort((a, b) => a.name.localeCompare(b.name));

  const assignedRepairsCount = (technicianId: string) => {
    return repairOrders.filter(ro => ro.technicianId === technicianId && !['completed', 'invoiced', 'cancelled'].includes(ro.status)).length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedTechnicians.length > 0 ? (
          sortedTechnicians.map(technician => (
            <li key={technician.id} className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-4 flex-grow">
                <UserCircleIcon className="h-12 w-12 text-gray-400 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">{technician.name}</p>
                  {technician.specialty && <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{technician.specialty}</p>}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                    {technician.email && <p className="flex items-center gap-1.5"><MailIcon className="h-3.5 w-3.5" /><span>{technician.email}</span></p>}
                    {technician.phone && <p className="flex items-center gap-1.5"><PhoneIcon className="h-3.5 w-3.5" /><span>{technician.phone}</span></p>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0 w-full sm:w-auto">
                 <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(technician)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400" title="Modifier le technicien">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(technician.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" title="Supprimer le technicien">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-2">
                  <WrenchIcon className="h-4 w-4" />
                  <span>{assignedRepairsCount(technician.id)} réparation(s) en cours</span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <div className="text-center py-16 px-6">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="text-xl font-semibold mt-4">Aucun technicien trouvé</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Cliquez sur "Ajouter un technicien" pour commencer.</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default TechnicianList;