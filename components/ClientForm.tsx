// FIX: Provide full implementation for the ClientForm component.
import React, { useState, useEffect } from 'react';
import { Client, Vehicle } from '../types';
import Modal from './Modal';
import { fetchVehicleInfo } from '../services/vehicleInfoService';
import { PlusIcon, TrashIcon, AlertTriangleIcon, CheckCircleIcon } from './icons';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  existingClient?: Client | null;
}

const ClientForm: React.FC<ClientFormProps> = ({ isOpen, onClose, onSave, existingClient }) => {
  const [client, setClient] = useState<Omit<Client, 'id'>>({
    name: '', email: '', phone: '', address: '', postalCode: '', city: '', vehicles: []
  });
  const [newLicensePlate, setNewLicensePlate] = useState('');
  const [apiStatus, setApiStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  useEffect(() => {
    if (isOpen) {
      if (existingClient) {
        setClient({ ...existingClient });
      } else {
        setClient({ name: '', email: '', phone: '', address: '', postalCode: '', city: '', vehicles: [] });
      }
      setNewLicensePlate('');
      setApiStatus({ type: 'idle', message: '' });
    }
  }, [existingClient, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (index: number, field: keyof Omit<Vehicle, 'id'>, value: string) => {
    const updatedVehicles = [...client.vehicles];
    updatedVehicles[index] = { ...updatedVehicles[index], [field]: value };
    setClient(prev => ({ ...prev, vehicles: updatedVehicles }));
  };
  
  const handleAddVehicleFromApi = async () => {
      if (!newLicensePlate.trim()) return;
      setApiStatus({ type: 'loading', message: 'Recherche...' });
      try {
          const vehicleInfo = await fetchVehicleInfo(newLicensePlate.trim().toUpperCase());
          const newVehicle: Vehicle = {
              id: crypto.randomUUID(),
              licensePlate: newLicensePlate.trim().toUpperCase(),
              make: vehicleInfo.make || '',
              model: vehicleInfo.model || '',
          };
          setClient(prev => ({ ...prev, vehicles: [...prev.vehicles, newVehicle]}));
          setNewLicensePlate('');
          setApiStatus({ type: 'success', message: 'Véhicule ajouté !' });
      } catch (error) {
          console.error(error);
          const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue.';
          setApiStatus({ type: 'error', message: errorMessage });
      }
  };

  const handleRemoveVehicle = (id: string) => {
    setClient(prev => ({...prev, vehicles: prev.vehicles.filter(v => v.id !== id)}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.name) {
        alert("Le nom du client est obligatoire.");
        return;
    }
    const clientToSave: Client = {
      id: existingClient?.id || crypto.randomUUID(),
      ...client,
    };
    onSave(clientToSave);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingClient ? 'Modifier la fiche client' : 'Nouveau client'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={client.name} onChange={handleChange} placeholder="Nom complet" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="phone" value={client.phone} onChange={handleChange} placeholder="Téléphone" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="email" type="email" value={client.email} onChange={handleChange} placeholder="Email" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="address" value={client.address} onChange={handleChange} placeholder="Adresse" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="postalCode" value={client.postalCode} onChange={handleChange} placeholder="Code Postal" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="city" value={client.city} onChange={handleChange} placeholder="Ville" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
        </div>
        
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Véhicules</h3>
            {/* API Add Vehicle */}
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <input 
                    type="text" 
                    value={newLicensePlate} 
                    onChange={e => { setNewLicensePlate(e.target.value); setApiStatus({type: 'idle', message: ''}); }}
                    placeholder="AA-123-BB" 
                    className="flex-grow bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"
                />
                <button type="button" onClick={handleAddVehicleFromApi} disabled={apiStatus.type === 'loading'} className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300">
                    {apiStatus.type === 'loading' ? '...' : 'Ajouter par plaque'}
                </button>
            </div>
            {apiStatus.type === 'error' && <p className="text-red-500 text-sm flex items-center gap-1"><AlertTriangleIcon className="h-4 w-4" /> {apiStatus.message}</p>}
            {apiStatus.type === 'success' && <p className="text-green-500 text-sm flex items-center gap-1"><CheckCircleIcon className="h-4 w-4" /> {apiStatus.message}</p>}
            
            {/* Vehicle List */}
            {client.vehicles.map((v, i) => (
                <div key={v.id} className="grid grid-cols-12 gap-2 items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
                    <input value={v.licensePlate} onChange={e => handleVehicleChange(i, 'licensePlate', e.target.value)} placeholder="Plaque" className="col-span-12 sm:col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-sm p-1"/>
                    <input value={v.make} onChange={e => handleVehicleChange(i, 'make', e.target.value)} placeholder="Marque" className="col-span-12 sm:col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-sm p-1"/>
                    <input value={v.model} onChange={e => handleVehicleChange(i, 'model', e.target.value)} placeholder="Modèle" className="col-span-12 sm:col-span-4 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-sm p-1"/>
                    <div className="col-span-12 sm:col-span-2 flex justify-end">
                      <button type="button" onClick={() => handleRemoveVehicle(v.id)} className="text-red-500"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-500 text-white rounded-md font-semibold">Annuler</button>
          <button type="submit" className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold">Sauvegarder</button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientForm;
