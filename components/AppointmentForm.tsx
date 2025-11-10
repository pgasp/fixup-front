import React, { useState, useEffect } from 'react';
import { Appointment, Quote, Client } from '../types';
import Modal from './Modal';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  quoteToSchedule: Quote | null;
  clients: Client[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ isOpen, onClose, onSave, quoteToSchedule, clients }) => {
  const [start, setStart] = useState('');
  const [duration, setDuration] = useState(2); // Default duration in hours

  const client = clients.find(c => c.id === quoteToSchedule?.clientId);
  const vehicle = client?.vehicles.find(v => v.id === quoteToSchedule?.vehicleId);

  useEffect(() => {
    if (quoteToSchedule) {
      const suggestedDate = quoteToSchedule.repairDate ? new Date(quoteToSchedule.repairDate) : new Date();
      suggestedDate.setHours(9, 0, 0, 0); // Default to 9 AM
      // Format to yyyy-MM-ddTHH:mm which is required by datetime-local input
      const pad = (num: number) => num.toString().padStart(2, '0');
      const formattedDate = `${suggestedDate.getFullYear()}-${pad(suggestedDate.getMonth() + 1)}-${pad(suggestedDate.getDate())}T${pad(suggestedDate.getHours())}:${pad(suggestedDate.getMinutes())}`;
      setStart(formattedDate);
    }
  }, [quoteToSchedule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteToSchedule || !client || !vehicle || !start) {
        alert("Informations manquantes pour planifier le rendez-vous.");
        return;
    }

    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

    const newAppointment: Omit<Appointment, 'id'> = {
      title: `Réparation: ${client.name} - ${vehicle.make} ${vehicle.model}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      quoteId: quoteToSchedule.id,
      clientId: client.id,
      vehicleId: vehicle.id,
    };
    onSave(newAppointment);
  };

  if (!quoteToSchedule) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Planifier pour Devis ${quoteToSchedule.quoteNumber}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <p><strong>Client:</strong> {client?.name}</p>
            <p><strong>Véhicule:</strong> {vehicle?.make} {vehicle?.model} ({vehicle?.licensePlate})</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Début du rendez-vous</label>
                <input
                    id="start-date"
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 sm:text-sm p-2"
                    required
                />
            </div>
            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Durée (heures)</label>
                <input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 sm:text-sm p-2"
                    step="0.5"
                    min="0.5"
                    required
                />
            </div>
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-500 text-white rounded-md font-semibold">Annuler</button>
          <button type="submit" className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold">Planifier</button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentForm;
