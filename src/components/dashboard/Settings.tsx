import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  School, 
  Users, 
  Shield, 
  Bell,
  CreditCard,
  Database,
  Globe,
  Save,
  Upload,
  Download,
  FileText
} from 'lucide-react';
import DocumentTemplates from '../settings/DocumentTemplates';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('school');

  const settingsTabs = [
    { id: 'school', label: 'Établissement', icon: School },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'data', label: 'Données', icon: Database },
    { id: 'system', label: 'Système', icon: SettingsIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configuration et gestion de votre établissement</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-white' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'school' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Informations de l'établissement</h2>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'établissement
                    </label>
                    <input
                      type="text"
                      defaultValue="École Exemple"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'établissement
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>École primaire</option>
                      <option>Collège</option>
                      <option>Lycée</option>
                      <option>Université</option>
                      <option>Centre de formation</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="123 Rue de l'Éducation, 75001 Paris, France"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      defaultValue="01 23 45 67 89"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="contact@ecole-exemple.fr"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo de l'établissement
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <School className="w-8 h-8 text-white" />
                      </div>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        <Upload className="w-4 h-4 mr-2" />
                        Changer le logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Ajouter utilisateur
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Administrateurs</h3>
                      <span className="text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <p className="text-sm text-gray-600">Accès complet à tous les modules</p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Enseignants</h3>
                      <span className="text-2xl font-bold text-green-600">45</span>
                    </div>
                    <p className="text-sm text-gray-600">Accès aux modules pédagogiques</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Personnel</h3>
                      <span className="text-2xl font-bold text-purple-600">12</span>
                    </div>
                    <p className="text-sm text-gray-600">Accès limité selon le rôle</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Rôles et permissions</h3>
                  
                  <div className="space-y-3">
                    {['Directeur', 'Enseignant', 'Secrétaire', 'Comptable', 'Surveillant'].map((role, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{role}</h4>
                          <p className="text-sm text-gray-600">
                            {role === 'Directeur' ? 'Accès complet à tous les modules' :
                             role === 'Enseignant' ? 'Notes, emploi du temps, communication' :
                             role === 'Secrétaire' ? 'Élèves, communication, documents' :
                             role === 'Comptable' ? 'Finance, paiements, rapports' :
                             'Absences, discipline, surveillance'}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Modifier
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Sécurité et confidentialité</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Authentification</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Authentification à deux facteurs obligatoire</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Expiration automatique des sessions (30 min)</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Connexion par empreinte digitale</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Politique de mot de passe</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longueur minimale
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>8 caractères</option>
                          <option>10 caractères</option>
                          <option>12 caractères</option>
                        </select>
                      </div>
                      
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Caractères spéciaux obligatoires</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Renouvellement tous les 90 jours</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-red-900 mb-4">Zone de danger</h3>
                  <div className="space-y-3">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Réinitialiser tous les mots de passe
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 ml-3">
                      Exporter les logs de sécurité
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Paramètres de notification</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Notifications système</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Nouvelles inscriptions</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Paiements reçus</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Absences non justifiées</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Incidents disciplinaires</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Canaux de notification</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Email</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">SMS</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notifications push</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Slack/Teams</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Facturation et abonnement</h2>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Plan Professional</h3>
                      <p className="text-sm text-gray-600">Jusqu'à 500 élèves • Tous les modules inclus</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">79€/mois</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Changer de plan
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Informations de facturation</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de facturation
                        </label>
                        <input
                          type="text"
                          defaultValue="École Exemple"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse de facturation
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="123 Rue de l'Éducation, 75001 Paris, France"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Méthode de paiement</h3>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-600">Expire 12/25</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Modifier
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Historique des factures</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Montant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01/01/2024</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€79.00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Payé
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <DocumentTemplates />
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des données</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Sauvegarde</h3>
                    
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <Database className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-green-900">Dernière sauvegarde</p>
                          <p className="text-sm text-green-700">Aujourd'hui à 03:00</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Créer une sauvegarde maintenant
                      </button>
                      <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Télécharger la dernière sauvegarde
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Import/Export</h3>
                    
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Importer des données
                      </button>
                      <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4 inline mr-2" />
                        Exporter toutes les données
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Formats supportés: CSV, Excel, JSON</p>
                      <p>Conformité RGPD garantie</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-yellow-900 mb-4">Rétention des données</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-800">Données élèves archivées</span>
                      <select className="px-3 py-1 border border-yellow-300 rounded text-sm">
                        <option>7 ans</option>
                        <option>10 ans</option>
                        <option>Permanent</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-800">Logs système</span>
                      <select className="px-3 py-1 border border-yellow-300 rounded text-sm">
                        <option>1 an</option>
                        <option>2 ans</option>
                        <option>5 ans</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Paramètres système</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Localisation</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Langue
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Français</option>
                          <option>English</option>
                          <option>Español</option>
                          <option>Deutsch</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fuseau horaire
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Europe/Paris (UTC+1)</option>
                          <option>Europe/London (UTC+0)</option>
                          <option>America/New_York (UTC-5)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Format de date
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Intégrations IA</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Traduction automatique</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Génération de commentaires</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Détection d'anomalies</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Prédictions de performance</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Informations système</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-800"><strong>Version:</strong> Academia Hub v2.1.0</p>
                      <p className="text-blue-800"><strong>Base de données:</strong> PostgreSQL 14.2</p>
                      <p className="text-blue-800"><strong>Serveur:</strong> AWS eu-west-1</p>
                    </div>
                    <div>
                      <p className="text-blue-800"><strong>Uptime:</strong> 99.98%</p>
                      <p className="text-blue-800"><strong>Dernière mise à jour:</strong> 15/01/2024</p>
                      <p className="text-blue-800"><strong>Support:</strong> 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;