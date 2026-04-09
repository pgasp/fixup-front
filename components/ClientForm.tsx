import React, { useState, useEffect } from 'react';
import { Client, Vehicle, VehicleServiceHistory } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, ChevronDownIcon, FileTextIcon } from './icons';
import { fetchVehicleInfo } from '../services/vehicleInfoService';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  existingClient?: Client | null;
  onViewInvoice: (repairOrderId: string) => void;
  /** Préremplit la plaque du premier véhicule (ex. recherche devis). */
  firstVehiclePlatePrefill?: string | null;
}

const emptyVehicle: Omit<Vehicle, 'id' | 'serviceHistory'> = { licensePlate: '', make: '', model: '' };

const ClientForm: React.FC<ClientFormProps> = ({ isOpen, onClose, onSave, existingClient, onViewInvoice, firstVehiclePlatePrefill }) => {
  const [client, setClient] = useState<Omit<Client, 'id'>>({
    name: '', email: '', phone: '', address: '', postalCode: '', city: '', vehicles: []
  });
  const [vehicleInfoLoading, setVehicleInfoLoading] = useState<number | null>(null);
  const [vehicleInfoError, setVehicleInfoError] = useState<string | null>(null);
  const [expandedHistories, setExpandedHistories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      if (existingClient) {
        setClient(JSON.parse(JSON.stringify(existingClient))); // Deep copy
      } else {
        const firstVehicle = { ...emptyVehicle, id: crypto.randomUUID(), serviceHistory: [] as VehicleServiceHistory[] };
        if (firstVehiclePlatePrefill?.trim()) {
          firstVehicle.licensePlate = firstVehiclePlatePrefill.trim().toUpperCase();
        }
        setClient({ name: '', email: '', phone: '', address: '', postalCode: '', city: '', vehicles: [firstVehicle] });
      }
      setVehicleInfoError(null);
      setExpandedHistories({});
    }
  }, [existingClient, isOpen, firstVehiclePlatePrefill]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (index: number, field: keyof Omit<Vehicle, 'id' | 'serviceHistory'>, value: string) => {
    setClient(prev => {
        const newClient = { ...prev };
        const newVehicles = [...newClient.vehicles];
        if (newVehicles[index]) {
            (newVehicles[index] as any)[field] = value;
            newClient.vehicles = newVehicles;
        }
        return newClient;
    });
  };
  
  const handleFetchVehicleInfo = async (index: number) => {
      const plate = client.vehicles[index]?.licensePlate;
      if (!plate) {
          setVehicleInfoError("Veuillez entrer une plaque d'immatriculation.");
          return;
      }
      setVehicleInfoLoading(index);
      setVehicleInfoError(null);
      try {
          const info = await fetchVehicleInfo(plate);
          setClient(prev => {
            const newVehicles = [...prev.vehicles];
            if (newVehicles[index]) {
              newVehicles[index] = { ...newVehicles[index], make: info.make || '', model: info.model || '' };
            }
            return {...prev, vehicles: newVehicles};
          });
      } catch(error) {
        if (error instanceof Error) {
          setVehicleInfoError(error.message);
        } else {
          setVehicleInfoError("Une erreur est survenue.");
        }
      } finally {
          setVehicleInfoLoading(null);
      }
  };

  const addVehicle = () => {
    setClient(prev => ({ ...prev, vehicles: [...prev.vehicles, {...emptyVehicle, id: crypto.randomUUID(), serviceHistory: []}] }));
  };

  const removeVehicle = (index: number) => {
    setClient(prev => {
        if (prev.vehicles.length > 1) {
            return { ...prev, vehicles: prev.vehicles.filter((_, i) => i !== index) };
        }
        return prev;
    });
  };

  const toggleHistory = (vehicleId: string) => {
    setExpandedHistories(prev => ({...prev, [vehicleId]: !prev[vehicleId]}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.name.trim()) {
        alert("Le nom du client est obligatoire.");
        return;
    }
    const clientToSave: Client = {
      id: existingClient?.id || crypto.randomUUID(),
      ...client,
      name: client.name.trim(),
      vehicles: client.vehicles.filter(v => v.licensePlate && v.make && v.model),
    };
    onSave(clientToSave);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingClient ? 'Modifier la fiche client' : 'Nouveau client'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border dark:border-gray-700 rounded-lg space-y-4">
            <h3 className="font-semibold">Informations Personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={client.name} onChange={handleChange} placeholder="Nom complet *" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                <input name="phone" type="tel" value={client.phone} onChange={handleChange} placeholder="Téléphone" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                <input name="email" type="email" value={client.email} onChange={handleChange} placeholder="Email" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 md:col-span-2" />
                <input name="address" value={client.address} onChange={handleChange} placeholder="Adresse" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 md:col-span-2" />
                <input name="postalCode" value={client.postalCode} onChange={handleChange} placeholder="Code Postal" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                <input name="city" value={client.city} onChange={handleChange} placeholder="Ville" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
            </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Véhicules</h3>
          {vehicleInfoError && <p className="text-red-500 text-sm">{vehicleInfoError}</p>}
          {client.vehicles.map((vehicle, index) => (
            <div key={vehicle.id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg space-y-3 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Véhicule #{index + 1}</p>
                {client.vehicles.length > 1 && <button type="button" onClick={() => removeVehicle(index)} className="text-red-500"><TrashIcon className="h-5 w-5"/></button>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-3 grid grid-cols-3 gap-2">
                    <input value={vehicle.licensePlate} onChange={e => handleVehicleChange(index, 'licensePlate', e.target.value.toUpperCase())} placeholder="Plaque d'immatriculation *" required className="col-span-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"/>
                    <button type="button" onClick={() => handleFetchVehicleInfo(index)} disabled={vehicleInfoLoading === index} className="text-sm p-2 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50">
                        {vehicleInfoLoading === index ? 'Recherche...' : 'Infos Auto'}
                    </button>
                </div>
                <input value={vehicle.make} onChange={e => handleVehicleChange(index, 'make', e.target.value)} placeholder="Marque *" required className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"/>
                <input value={vehicle.model} onChange={e => handleVehicleChange(index, 'model', e.target.value)} placeholder="Modèle *" required className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"/>
                <input value={vehicle.vin || ''} onChange={e => handleVehicleChange(index, 'vin', e.target.value)} placeholder="VIN (Optionnel)" className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"/>
              </div>

              <div className="md:col-span-3 pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                  <button type="button" onClick={() => toggleHistory(vehicle.id)} className="flex items-center justify-between w-full text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                      <span>Historique d'entretien ({vehicle.serviceHistory.length})</span>
                      <ChevronDownIcon className={`h-5 w-5 transition-transform ${expandedHistories[vehicle.id] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedHistories[vehicle.id] && (
                      <div className="mt-2 space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                          {vehicle.serviceHistory.length > 0 ? (
                              <table className="w-full text-left text-sm mt-2">
                                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                      <tr>
                                          <th className="py-1 px-2">Date</th>
                                          <th className="py-1 px-2">Kilométrage</th>
                                          <th className="py-1 px-2">Description</th>
                                          <th className="py-1 px-2">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {vehicle.serviceHistory
                                        .slice()
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map(entry => (
                                          <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-700">
                                              <td className="py-2 px-2">{new Date(entry.date).toLocaleDateString()}</td>
                                              <td className="py-2 px-2">{entry.mileage} km</td>
                                              <td className="py-2 px-2">{entry.description}</td>
                                              <td className="py-2 px-2">
                                                {entry.referenceId && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onViewInvoice(entry.referenceId!)}
                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-semibold"
                                                        title="Voir la facture associée"
                                                    >
                                                        <FileTextIcon className="h-4 w-4" />
                                                        Facture
                                                    </button>
                                                )}
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          ) : <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Aucun historique de service pour ce véhicule.</p>}
                      </div>
                  )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addVehicle} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold py-2"><PlusIcon/> Ajouter un véhicule</button>
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