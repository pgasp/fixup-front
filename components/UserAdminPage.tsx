import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { USER_ROLES, roleLabelsFr, type UserRole } from '../auth/roles';
import type { AuthUser } from '../auth/session';
import { apiClient } from '../services/api';
import ConfirmationModal from './ConfirmationModal';
import Modal from './Modal';
import { MailIcon, PencilIcon, TrashIcon, UserCircleIcon } from './icons';

export type UserAdminPageHandle = {
  openCreate: () => void;
};

type UserAdminPageProps = {
  currentUserId: string;
};

const UserAdminPage = forwardRef<UserAdminPageHandle, UserAdminPageProps>(function UserAdminPage(
  { currentUserId },
  ref,
) {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AuthUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AuthUser | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('mechanic');
  const [password, setPassword] = useState('');

  const load = useCallback(async () => {
    setError(null);
    try {
      setLoading(true);
      const list = await apiClient.users.list();
      setUsers(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useImperativeHandle(ref, () => ({
    openCreate: () => {
      setEditing(null);
      setEmail('');
      setDisplayName('');
      setRole('mechanic');
      setPassword('');
      setFormError(null);
      setFormOpen(true);
    },
  }));

  const openEdit = (user: AuthUser) => {
    setEditing(user);
    setEmail(user.email);
    setDisplayName(user.displayName);
    setRole(user.role);
    setPassword('');
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      if (!editing) {
        await apiClient.users.create({
          email,
          displayName,
          role,
          password,
        });
      } else {
        await apiClient.users.update(editing.id, {
          email,
          displayName,
          role,
        });
        if (password.trim().length > 0) {
          await apiClient.users.setPassword(editing.id, password);
        }
      }
      closeForm();
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setError(null);
    try {
      await apiClient.users.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const sorted = [...users].sort((a, b) => a.displayName.localeCompare(b.displayName, 'fr'));

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">Chargement…</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sorted.length > 0 ? (
              sorted.map((user) => (
                <li
                  key={user.id}
                  className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-grow">
                    <UserCircleIcon className="h-12 w-12 text-gray-400 flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-lg text-gray-900 dark:text-white">{user.displayName}</p>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{roleLabelsFr[user.role]}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1.5">
                        <MailIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(user)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                      title="Modifier"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(user)}
                      disabled={user.id === currentUserId}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                      title={user.id === currentUserId ? 'Impossible de supprimer votre propre compte' : 'Supprimer'}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-16 px-6">
                <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="text-xl font-semibold mt-4">Aucun utilisateur</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Créez un compte pour commencer.</p>
              </div>
            )}
          </ul>
        )}
      </div>

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={editing ? 'Modifier l’utilisateur' : 'Nouvel utilisateur'}
        size="md"
      >
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          {formError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm text-red-800 dark:text-red-200">
              {formError}
            </div>
          )}
          <div>
            <label htmlFor="ua-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-mail
            </label>
            <input
              id="ua-email"
              type="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="ua-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom affiché
            </label>
            <input
              id="ua-name"
              type="text"
              required
              value={displayName}
              onChange={(ev) => setDisplayName(ev.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="ua-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rôle
            </label>
            <select
              id="ua-role"
              value={role}
              onChange={(ev) => setRole(ev.target.value as UserRole)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
            >
              {USER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {roleLabelsFr[r]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ua-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {editing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
            </label>
            <input
              id="ua-password"
              type="password"
              autoComplete="new-password"
              required={!editing}
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
              placeholder={editing ? 'Laisser vide pour ne pas changer' : 'Minimum 6 caractères'}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeForm}
              className="py-2 px-4 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {editing ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title="Supprimer l’utilisateur"
        confirmText="Supprimer"
      >
        <p>
          Supprimer définitivement <strong>{deleteTarget?.displayName}</strong> ({deleteTarget?.email}) ?
        </p>
      </ConfirmationModal>
    </>
  );
});

export default UserAdminPage;
