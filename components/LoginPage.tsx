import React, { useState } from 'react';
import type { AuthSession } from '../auth/session';
import { apiClient } from '../services/api';

interface LoginPageProps {
  onLoggedIn: (session: AuthSession) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoggedIn }) => {
  const [email, setEmail] = useState('admin@fixup.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await apiClient.auth.login(email, password);
      onLoggedIn({ token, user });
    } catch {
      setError('Identifiants invalides ou serveur indisponible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Connexion FixUp</h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Techniciens atelier, administratifs et autres rôles utilisent un compte attribué par l’administrateur. Comptes
          de démonstration : par ex. admin@fixup.local ou mecanicien@fixup.local (mots de passe côté configuration
          serveur).
        </p>
        {error && (
          <div className="p-3 rounded-md bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 text-sm text-center">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mot de passe
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
