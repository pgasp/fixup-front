import React, { useMemo, useState } from 'react';
import { RepairOrder, RepairOrderStatus, Client, Technician } from '../types';
import { FileTextIcon, TrashIcon, WrenchIcon, CalendarIcon, CheckCircleIcon, ClipboardCheckIcon, ClockIcon, DocumentSearchIcon, ReceiptTaxIcon, UsersIcon } from './icons';

interface RepairOrderListProps {
  repairOrders: RepairOrder[];
  clients: Client[];
  technicians: Technician[];
  onView: (order: RepairOrder) => void;
  onDelete: (orderId: string) => void;
}

const statusConfig: { [key in RepairOrderStatus]: { text: string; color: string; icon: React.FC<{className?:string}> } } = {
    'scheduled': { text: 'Programmé', color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700', icon: CalendarIcon },
    'workshop_entry': { text: 'Entrée Atelier', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50', icon: ClipboardCheckIcon },
    'diagnosis_complete': { text: 'Diagnostic Terminé', color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/50', icon: DocumentSearchIcon },
    'in_progress': { text: 'En Cours', color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50', icon: WrenchIcon },
    'waiting_for_part': { text: 'Attente Pièce', color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50', icon: ClockIcon },
    'completed': { text: 'Terminée', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50', icon: CheckCircleIcon },
    'waiting_for_invoicing': { text: 'À Facturer', color: 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/50', icon: ReceiptTaxIcon },
    'invoiced': { text: 'Facturée', color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/50', icon: ReceiptTaxIcon },
    'cancelled': { text: 'Annulée', color: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/50', icon: TrashIcon },
};


const RepairOrderList: React.FC<RepairOrderListProps> = ({ repairOrders, clients, technicians, onView, onDelete }) => {
    
    const [technicianFilter, setTechnicianFilter] = useState<string>('all');
    const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);
    const technicianMap = useMemo(() => new Map(technicians.map(t => [t.id, t])), [technicians]);

    const sortedAndFilteredRepairOrders = useMemo(() => {
        return [...repairOrders]
            .filter(order => technicianFilter === 'all' || order.technicianId === technicianFilter)
            .sort((a, b) => new Date(b.quote.date).getTime() - new Date(a.quote.date).getTime());
    }, [repairOrders, technicianFilter]);

  return (
    <div className="space-y-4">
        <div className="p-1">
            <select
                value={technicianFilter}
                onChange={e => setTechnicianFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow py-2 px-4"
            >
                <option value="all">Tous les techniciens</option>
                <option value="">Non assignées</option>
                {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                ))}
            </select>
        </div>
        <ul className="space-y-3">
            {sortedAndFilteredRepairOrders.length > 0 ? sortedAndFilteredRepairOrders.map(order => {
                const Icon = statusConfig[order.status].icon;
                const client = clientMap.get(order.quote.clientId);
                const vehicle = client?.vehicles.find(v => v.id === order.quote.vehicleId);
                const technician = technicianMap.get(order.technicianId || '');
                return (
                <li key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex-grow">
                        <p className="font-bold text-lg text-gray-900 dark:text-white">{order.quote.quoteNumber.replace('DEV', 'FICHE')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{order.quote.laborItems.map(l => l.description).join(', ')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{client?.name} - {vehicle?.make} {vehicle?.model}</p>
                         <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                            <UsersIcon className="h-4 w-4"/>
                            <span>{technician ? technician.name : 'Non assigné'}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                         <span 
                            title="Statut de la réparation"
                            className={`inline-flex items-center gap-1.5 cursor-default transition-opacity text-xs font-medium px-3 py-1 rounded-full ${statusConfig[order.status].color}`}>
                            <Icon className="w-3.5 h-3.5"/>
                            {statusConfig[order.status].text}
                        </span>
                       
                        <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 pt-3 sm:pt-0 sm:pl-3">
                            <button onClick={() => onView(order)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Voir la fiche"><FileTextIcon className="h-5 w-5"/></button>
                            <button onClick={() => onDelete(order.id)} className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Supprimer la fiche"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </li>
            )}) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <WrenchIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
                    <h3 className="text-xl font-semibold mt-4">Aucune fiche de réparation</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Créez une fiche à partir d'un devis approuvé et planifié.</p>
                </div>
            )}
        </ul>
    </div>
  );
};

export default RepairOrderList;