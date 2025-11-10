import React from 'react';
import { Client } from '../types';
import { PencilIcon, CarIcon, UsersIcon, TrashIcon } from './icons';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientCard: React.FC<{ client: Client, onEdit: (client: Client) => void, onDelete: (clientId: string) => void }> = ({ client, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col justify-between h-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ease-in-out hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{client.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</p>
                        {client.city && <p className="text-sm text-gray-500 dark:text-gray-400">{client.postalCode} {client.city}</p>}
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                        <button onClick={() => onEdit(client)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" title="Modifier la fiche client">
                            <PencilIcon className="h-5 w-5"/>
                        </button>
                        <button onClick={() => onDelete(client.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" title="Supprimer le client">
                            <TrashIcon className="h-5 w-5"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-start gap-2 text-blue-600 dark:text-blue-300">
               <CarIcon className="h-5 w-5"/>
               <span className="text-sm font-semibold">{client.vehicles.length} véhicule(s)</span>
            </div>
        </div>
    );
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete }) => {
  const sortedClients = [...clients].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sortedClients.length > 0 ? (
        sortedClients.map(client => (
            <ClientCard key={client.id} client={client} onEdit={onEdit} onDelete={onDelete} />
        ))
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg md:col-span-2 xl:col-span-3">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
          <h3 className="text-xl font-semibold mt-4">Aucun client trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Cliquez sur "Ajouter un client" pour commencer.</p>
        </div>
      )}
    </div>
  );
};

export default ClientList;