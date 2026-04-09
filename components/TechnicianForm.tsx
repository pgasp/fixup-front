import React, { useState, useEffect } from 'react';
import type { AuthUser } from '../auth/session';
import { Technician } from '../types';
import Modal from './Modal';

interface TechnicianFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (technician: Technician) => void;
  existingTechnician?: Technician | null;
  /** Comptes au rôle technicien — pour lier la fiche */
  technicianAppUsers: AuthUser[];
  /** Pour éviter de lier deux fiches au même compte */
  allTechnicians: Technician[];
}

const emptyTechnician = (): Omit<Technician, 'id'> => ({
  name: '',
  specialty: '',
  email: '',
  phone: '',
  hireDate: undefined,
  userId: undefined,
});

const TechnicianForm: React.FC<TechnicianFormProps> = ({
  isOpen,
  onClose,
  onSave,
  existingTechnician,
  technicianAppUsers,
  allTechnicians,
}) => {
  const [technician, setTechnician] = useState<Omit<Technician, 'id'>>(emptyTechnician());

  useEffect(() => {
    if (isOpen) {
      if (existingTechnician) {
        const { id: _id, ...rest } = existingTechnician;
        setTechnician(rest);
      } else {
        setTechnician(emptyTechnician());
      }
    }
  }, [existingTechnician, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTechnician((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserLinkChange = (userId: string) => {
    if (!userId) {
      setTechnician((prev) => ({ ...prev, userId: undefined }));
      return;
    }
    const u = technicianAppUsers.find((x) => x.id === userId);
    if (u) {
      setTechnician((prev) => ({
        ...prev,
        userId,
        name: u.displayName,
        email: u.email,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!technician.name.trim()) {
      alert('Le nom du technicien est obligatoire.');
      return;
    }
    if (technician.userId) {
      const conflict = allTechnicians.find(
        (t) => t.userId === technician.userId && t.id !== existingTechnician?.id,
      );
      if (conflict) {
        alert('Ce compte applicatif est déjà lié à une autre fiche technicien.');
        return;
      }
    }
    const technicianToSave: Technician = {
      id: existingTechnician?.id || crypto.randomUUID(),
      ...technician,
      name: technician.name.trim(),
    };
    onSave(technicianToSave);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingTechnician ? 'Modifier le technicien' : 'Nouveau technicien'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 px-3 py-2 text-sm text-blue-900 dark:text-blue-200">
          Liez la fiche au compte avec le rôle Technicien (créé dans Administration → Utilisateurs). Les champs nom et
          e-mail peuvent être remplis automatiquement à partir du compte.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border dark:border-gray-700 rounded-lg">
          <div className="md:col-span-2">
            <label htmlFor="technician-userId" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Compte applicatif (rôle Technicien)
            </label>
            <select
              id="technician-userId"
              value={technician.userId ?? ''}
              onChange={(e) => handleUserLinkChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white"
            >
              <option value="">— Sans liaison —</option>
              {technicianAppUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="technician-name" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Nom complet *
            </label>
            <input
              id="technician-name"
              name="name"
              type="text"
              value={technician.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="technician-specialty" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Spécialité
            </label>
            <input
              id="technician-specialty"
              name="specialty"
              type="text"
              value={technician.specialty || ''}
              onChange={handleChange}
              placeholder="Ex: Moteur, Électronique"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="technician-hireDate" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Date d'embauche
            </label>
            <input
              id="technician-hireDate"
              name="hireDate"
              type="date"
              value={technician.hireDate?.split('T')[0] || ''}
              onChange={(e) =>
                setTechnician((prev) => ({
                  ...prev,
                  hireDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                }))
              }
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="technician-email" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="technician-email"
              name="email"
              type="email"
              value={technician.email || ''}
              onChange={handleChange}
              placeholder="technicien@garage.com"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="technician-phone" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Téléphone
            </label>
            <input
              id="technician-phone"
              name="phone"
              type="tel"
              value={technician.phone || ''}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-500 text-white rounded-md font-semibold">
            Annuler
          </button>
          <button type="submit" className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold">
            Sauvegarder
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TechnicianForm;
