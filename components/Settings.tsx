import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { CameraIcon } from './icons';

interface SettingsProps {
  settings: Settings;
  onSave: (newSettings: Settings) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const SettingsComponent: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit for logo
        alert("Le logo est trop lourd (max 1MB).");
        return;
      }
      try {
        const base64Logo = await blobToBase64(file);
        setCurrentSettings(prev => ({ ...prev, logo: base64Logo }));
      } catch (error) {
        console.error("Error converting logo to base64:", error);
        alert("Erreur lors du chargement du logo.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Informations du Garage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="garageName" value={currentSettings.garageName} onChange={handleChange} placeholder="Nom du garage" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="phone" value={currentSettings.phone} onChange={handleChange} placeholder="Téléphone" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="email" type="email" value={currentSettings.email} onChange={handleChange} placeholder="Email" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="address" value={currentSettings.address} onChange={handleChange} placeholder="Adresse" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="postalCode" value={currentSettings.postalCode} onChange={handleChange} placeholder="Code Postal" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
          <input name="city" value={currentSettings.city} onChange={handleChange} placeholder="Ville" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Logo</h3>
        <div className="flex items-center gap-6">
          {currentSettings.logo ? (
            <img src={currentSettings.logo} alt="Logo du garage" className="h-24 w-auto object-contain bg-gray-200 dark:bg-gray-700 p-2 rounded-md" />
          ) : (
            <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
              <span className="text-sm text-gray-500">Logo</span>
            </div>
          )}
          <div>
            <label htmlFor="logo-upload" className="cursor-pointer bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-2 px-4 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800">
              Changer le logo
            </label>
            <input id="logo-upload" type="file" accept="image/png, image/jpeg, image/svg+xml" className="hidden" onChange={handleLogoChange} />
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, SVG. Max 1MB.</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
            {saveSuccess && <p className="text-green-600 dark:text-green-400 font-semibold">Sauvegardé !</p>}
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition-colors">
            Sauvegarder les paramètres
            </button>
        </div>
      </div>
    </form>
  );
};

export default SettingsComponent;