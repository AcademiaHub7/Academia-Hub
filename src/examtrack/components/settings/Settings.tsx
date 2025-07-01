import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { 
  Settings as SettingsIcon, 
  User, 
  School,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Phone,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const settingsTabs: SettingsTab[] = [
  {
    id: 'profile',
    label: 'Profil',
    icon: <User className="w-5 h-5" />,
    roles: ['super_admin', 'patronat_admin', 'school_admin', 'teacher']
  },
  {
    id: 'organization',
    label: 'Organisation',
    icon: <School className="w-5 h-5" />,
    roles: ['super_admin', 'patronat_admin', 'school_admin']
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="w-5 h-5" />,
    roles: ['super_admin', 'patronat_admin', 'school_admin', 'teacher']
  },
  {
    id: 'security',
    label: 'Sécurité',
    icon: <Shield className="w-5 h-5" />,
    roles: ['super_admin', 'patronat_admin', 'school_admin']
  },
  {
    id: 'appearance',
    label: 'Apparence',
    icon: <Palette className="w-5 h-5" />,
    roles: ['super_admin', 'patronat_admin', 'school_admin']
  },
  {
    id: 'system',
    label: 'Système',
    icon: <Database className="w-5 h-5" />,
    roles: ['super_admin']
  }
];

export const Settings: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const { settings, updateSettings, isLoading } = useSettingsStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    position: '',
    bio: ''
  });
  
  const [organizationData, setOrganizationData] = useState({
    name: tenant?.name || '',
    address: '',
    phone: '',
    email: '',
    website: '',
    academicYear: tenant?.settings.academicYear || '2024-2025',
    timeZone: tenant?.settings.timeZone || 'Africa/Porto-Novo',
    language: tenant?.settings.language || 'fr'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    examReminders: true,
    gradeNotifications: true,
    systemUpdates: false,
    weeklyReports: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: '',
    auditLogs: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: tenant?.settings.primaryColor || '#1a472a',
    fontSize: 'medium',
    compactMode: false,
    showAvatars: true,
    animationsEnabled: true
  });

  const availableTabs = settingsTabs.filter(tab => 
    tab.roles.includes(user?.role || '')
  );

  const handleSaveProfile = async () => {
    await updateSettings('profile', profileData);
  };

  const handleSaveOrganization = async () => {
    await updateSettings('organization', organizationData);
  };

  const handleSaveNotifications = async () => {
    await updateSettings('notifications', notificationSettings);
  };

  const handleSaveSecurity = async () => {
    await updateSettings('security', securitySettings);
  };

  const handleSaveAppearance = async () => {
    await updateSettings('appearance', appearanceSettings);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Personnelles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fonction
            </label>
            <input
              type="text"
              value={profileData.position}
              onChange={(e) => setProfileData({...profileData, position: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biographie
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="Parlez-nous de vous..."
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de l'Organisation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'Organisation *
            </label>
            <input
              type="text"
              value={organizationData.name}
              onChange={(e) => setOrganizationData({...organizationData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <textarea
              value={organizationData.address}
              onChange={(e) => setOrganizationData({...organizationData, address: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={organizationData.phone}
              onChange={(e) => setOrganizationData({...organizationData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={organizationData.email}
              onChange={(e) => setOrganizationData({...organizationData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Web
            </label>
            <input
              type="url"
              value={organizationData.website}
              onChange={(e) => setOrganizationData({...organizationData, website: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année Scolaire
            </label>
            <select
              value={organizationData.academicYear}
              onChange={(e) => setOrganizationData({...organizationData, academicYear: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuseau Horaire
            </label>
            <select
              value={organizationData.timeZone}
              onChange={(e) => setOrganizationData({...organizationData, timeZone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="Africa/Porto-Novo">Africa/Porto-Novo (GMT+1)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue
            </label>
            <select
              value={organizationData.language}
              onChange={(e) => setOrganizationData({...organizationData, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveOrganization}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences de Notification</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Notifications par Email</h4>
              <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Notifications SMS</h4>
              <p className="text-sm text-gray-600">Recevoir les alertes urgentes par SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Notifications Push</h4>
              <p className="text-sm text-gray-600">Notifications en temps réel dans l'application</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Rappels d'Examens</h4>
              <p className="text-sm text-gray-600">Rappels automatiques avant les examens</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.examReminders}
                onChange={(e) => setNotificationSettings({...notificationSettings, examReminders: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Notifications de Notes</h4>
              <p className="text-sm text-gray-600">Alertes lors de la publication de nouvelles notes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.gradeNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, gradeNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Rapports Hebdomadaires</h4>
              <p className="text-sm text-gray-600">Résumé hebdomadaire des activités</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.weeklyReports}
                onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveNotifications}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'organization':
        return renderOrganizationSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return <div className="text-center py-12 text-gray-500">Paramètres de sécurité (à implémenter)</div>;
      case 'appearance':
        return <div className="text-center py-12 text-gray-500">Paramètres d'apparence (à implémenter)</div>;
      case 'system':
        return <div className="text-center py-12 text-gray-500">Paramètres système (à implémenter)</div>;
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600 mt-1">
              Configuration et personnalisation de votre compte
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-primary-color" />
            <span className="text-sm font-medium text-primary-color">
              {tenant?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <nav className="space-y-1">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-color text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {renderCurrentTab()}
          </div>
        </div>
      </div>
    </div>
  );
};