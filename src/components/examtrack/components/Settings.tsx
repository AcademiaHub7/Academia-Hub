import React, { useState } from 'react';
import { Save, Mail, Lock, Globe, Check } from 'lucide-react';

const Settings: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState({
    institutionName: 'École Privée Saint-Joseph',
    academicYear: '2024-2025',
    timezone: 'Africa/Porto-Novo',
    language: 'fr',
    enableGradeContestations: true,
    automaticReportsGeneration: true
  });

  const [emailSettings, setEmailSettings] = useState({
    enableNotifications: true,
    sendExamReminders: true,
    sendGradeNotifications: true,
    sendBulletins: true,
    notificationEmailAddress: 'notifications@ecole-stjoseph.bj',
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordExpiryDays: 90,
    enforceStrongPasswords: true,
    enableTwoFactor: false,
    maximumLoginAttempts: 5
  });

  const [success, setSuccess] = useState(false);

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setEmailSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : (type === 'number' ? parseInt(value, 10) : value)
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Dans une application réelle, ici on enverrait les données au serveur
    console.log('Saving settings...', { generalSettings, emailSettings, securitySettings });
    
    // Simuler un succès
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Paramètres du Système</h1>
        
        <button 
          onClick={handleSaveSettings}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-colors"
        >
          <Save className="h-5 w-5 mr-2" />
          Enregistrer
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
          <Check className="h-5 w-5 mr-2" />
          <span>Paramètres enregistrés avec succès</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Paramètres Généraux</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom de l'établissement
              </label>
              <input
                type="text"
                id="institutionName"
                name="institutionName"
                value={generalSettings.institutionName}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Année scolaire
              </label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={generalSettings.academicYear}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fuseau horaire
              </label>
              <select
                id="timezone"
                name="timezone"
                value={generalSettings.timezone}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="Africa/Porto-Novo">Bénin (UTC+1)</option>
                <option value="Europe/Paris">France (UTC+1/+2)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Langue
              </label>
              <select
                id="language"
                name="language"
                value={generalSettings.language}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableGradeContestations"
                name="enableGradeContestations"
                checked={generalSettings.enableGradeContestations}
                onChange={handleGeneralSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700"
              />
              <label htmlFor="enableGradeContestations" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Autoriser les contestations de notes par les étudiants
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="automaticReportsGeneration"
                name="automaticReportsGeneration"
                checked={generalSettings.automaticReportsGeneration}
                onChange={handleGeneralSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700"
              />
              <label htmlFor="automaticReportsGeneration" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Génération automatique des bulletins en fin de période
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Notifications par Email</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="notificationEmailAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Adresse email pour les notifications
            </label>
            <input
              type="email"
              id="notificationEmailAddress"
              name="notificationEmailAddress"
              value={emailSettings.notificationEmailAddress}
              onChange={handleEmailSettingsChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableNotifications"
                name="enableNotifications"
                checked={emailSettings.enableNotifications}
                onChange={handleEmailSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700"
              />
              <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Activer les notifications par email
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendExamReminders"
                name="sendExamReminders"
                checked={emailSettings.sendExamReminders}
                onChange={handleEmailSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700"
              />
              <label htmlFor="sendExamReminders" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Envoyer des rappels avant les examens
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendGradeNotifications"
                name="sendGradeNotifications"
                checked={emailSettings.sendGradeNotifications}
                onChange={handleEmailSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700"
              />
              <label htmlFor="sendGradeNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Notifier quand les notes sont publiées
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendBulletins"
                name="sendBulletins"
                checked={emailSettings.sendBulletins}
                onChange={handleEmailSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700"
              />
              <label htmlFor="sendBulletins" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Envoyer les bulletins par email
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Sécurité</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Délai d'expiration de session (minutes)
              </label>
              <input
                type="number"
                id="sessionTimeout"
                name="sessionTimeout"
                min="5"
                max="120"
                value={securitySettings.sessionTimeout}
                onChange={handleSecuritySettingsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="passwordExpiryDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiration des mots de passe (jours)
              </label>
              <input
                type="number"
                id="passwordExpiryDays"
                name="passwordExpiryDays"
                min="0"
                max="365"
                value={securitySettings.passwordExpiryDays}
                onChange={handleSecuritySettingsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">0 pour désactiver l'expiration</p>
            </div>
            
            <div>
              <label htmlFor="maximumLoginAttempts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre maximal de tentatives de connexion
              </label>
              <input
                type="number"
                id="maximumLoginAttempts"
                name="maximumLoginAttempts"
                min="1"
                max="10"
                value={securitySettings.maximumLoginAttempts}
                onChange={handleSecuritySettingsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enforceStrongPasswords"
                name="enforceStrongPasswords"
                checked={securitySettings.enforceStrongPasswords}
                onChange={handleSecuritySettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700"
              />
              <label htmlFor="enforceStrongPasswords" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Imposer des mots de passe forts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableTwoFactor"
                name="enableTwoFactor"
                checked={securitySettings.enableTwoFactor}
                onChange={handleSecuritySettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700"
              />
              <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Activer l'authentification à deux facteurs
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
