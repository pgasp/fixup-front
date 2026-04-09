import React, { useMemo, useState } from 'react';
import { RepairOrder, Client, Technician } from '../types';
import { FileTextIcon, TrashIcon, WrenchIcon, UsersIcon } from './icons';
import { repairOrderStatusBadgeConfig } from '../domain/status';

interface RepairOrderListProps {
  repairOrders: RepairOrder[];
  clients: Client[];
  technicians: Technician[];
  technicianWorkload: Map<string, number>;
  onView: (order: RepairOrder) => void;
  onDelete: (orderId: string) => void;
  onAssignTechnician: (orderId: string, technicianId: string) => void;
}

const RepairOrderList: React.FC<RepairOrderListProps> = ({ repairOrders, clients, technicians, technicianWorkload, onView, onDelete, onAssignTechnician }) => {
    
    const [technicianFilter, setTechnicianFilter] = useState<string>('all');
    const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

    const sortedAndFilteredRepairOrders = useMemo(() => {
        return [...repairOrders]
            .filter(order => {
                if (technicianFilter === 'all') {
                    return true;
                }
                if (technicianFilter === '') { // "Non assignées"
                    return !order.technicianId;
                }
                return order.technicianId === technicianFilter;
            })
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
                const Icon = repairOrderStatusBadgeConfig[order.status].icon;
                const client = clientMap.get(order.quote.clientId);
                const vehicle = client?.vehicles.find(v => v.id === order.quote.vehicleId);
                return (
                <li key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex-grow">
                        <p className="font-bold text-lg text-gray-900 dark:text-white">{order.quote.quoteNumber.replace('DEV', 'FICHE')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{order.quote.laborItems.map(l => l.description).join(', ')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{client?.name} - {vehicle?.make} {vehicle?.model}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <UsersIcon className="h-5 w-5 text-gray-400 flex-shrink-0"/>
                            <select
                                value={order.technicianId || ''}
                                onChange={(e) => onAssignTechnician(order.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm text-gray-800 dark:text-gray-200"
                            >
                                <option value="">-- Non assigné --</option>
                                {technicians.map(tech => {
                                    const workload = technicianWorkload.get(tech.id) || 0;
                                    return (
                                        <option key={tech.id} value={tech.id}>
                                            {tech.name} ({workload} en cours)
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                         <span 
                            title="Statut de la réparation"
                            className={`inline-flex items-center gap-1.5 cursor-default transition-opacity text-xs font-medium px-3 py-1 rounded-full ${repairOrderStatusBadgeConfig[order.status].color}`}>
                            <Icon className="w-3.5 h-3.5"/>
                            {repairOrderStatusBadgeConfig[order.status].text}
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