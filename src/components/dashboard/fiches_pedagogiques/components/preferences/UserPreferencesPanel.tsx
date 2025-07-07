import React, { useState } from 'react';
import { FicheViewContext } from '../FicheViewTypes';

interface Shortcut {
  action: string;
  key: string;
  description: string;
}

interface Preferences {
  theme: 'light' | 'dark' | 'system';
  layout: 'small' | 'medium' | 'large';
  panelPositions: {
    sidebar: 'left' | 'right' | 'top' | 'bottom';
  };
  inputPreferences: {
    mode: 'visual' | 'text' | 'mixed';
  };
  shortcuts: Record<string, string>;
  fontSize: 'small' | 'medium' | 'large';
}

const UserPreferencesPanel: React.FC = () => {
  const context = useContext<FicheViewContext>(FicheViewContext);
  if (!context) {
    throw new Error('UserPreferencesPanel must be used within a FicheViewProvider');
  }

  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(context.preferences);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    context.updatePreferences(preferences);
    setShowPreferences(false);
  };

  const handleShortcutChange = (action: string, key: string) => {
    setPreferences(prev => ({
      ...prev,
      shortcuts: {
        ...prev.shortcuts,
        [action]: key
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'Général' },
    { id: 'shortcuts', label: 'Raccourcis' },
    { id: 'layout', label: 'Disposition' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowPreferences(true)}
        aria-label="Ouvrir les préférences utilisateur"
        title="Ouvrir les préférences utilisateur"
        type="button"
        className="p-1 text-gray-400 hover:text-gray-500"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="sr-only">Ouvrir les préférences utilisateur</span>
      </button>

      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50" role="dialog" aria-modal="true">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto my-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Préférences utilisateur
                </h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  aria-label="Fermer les préférences"
                  title="Fermer les préférences"
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="sr-only">Fermer les préférences</span>
                </button>
              </div>

              <nav role="tablist" aria-label="Onglets de préférences" className="flex space-x-4 mb-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    aria-label={tab.label}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {tabs.map(tab => (
                <div
                  key={tab.id}
                  id={`panel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.id}`}
                  hidden={activeTab !== tab.id}
                  className="space-y-6"
                >
                  {tab.id === 'general' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Thème
                      </label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' | 'system' }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        aria-label="Sélectionner le thème"
                        id="theme-select"
                      >
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                        <option value="system">Système</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Taille de police
                      </label>
                      <select
                        value={preferences.fontSize}
                        onChange={(e) => setPreferences(prev => ({ ...prev, fontSize: e.target.value as 'small' | 'medium' | 'large' }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        aria-label="Sélectionner la taille de police"
                        id="font-size-select"
                      >
                        <option value="small">Petite</option>
                        <option value="medium">Moyenne</option>
                        <option value="large">Grande</option>
                      </select>
                    </div>
                  )}

                  {tab.id === 'shortcuts' && (
                    <div className="space-y-4">
                      {Object.entries(defaultShortcuts).map(([action, defaultKey]) => (
                        <div key={action} className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">
                              {action.replace(/-/g, ' ').replace(/\w+/g, (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                              )}
                            </label>
                            <p className="text-sm text-gray-500">
                              {preferences.shortcuts[action] || defaultKey}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              const newKey = prompt('Entrez le nouveau raccourci (ex: Ctrl+K)');
                              if (newKey) {
                                handleShortcutChange(action, newKey);
                              }
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700"
                            aria-label={`Modifier le raccourci ${action.replace(/-/g, ' ').replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}`}
                            title={`Modifier le raccourci ${action.replace(/-/g, ' ').replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}`}
                            type="button"
                          >
                            Modifier
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab.id === 'layout' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Position de la barre latérale
                        </label>
                        <select
                          value={preferences.panelPositions.sidebar}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            panelPositions: {
                              ...prev.panelPositions,
                              sidebar: e.target.value as 'left' | 'right' | 'top' | 'bottom'
                            }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          aria-label="Sélectionner la position de la barre latérale"
                          id="sidebar-position-select"
                        >
                          <option value="left">Gauche</option>
                          <option value="right">Droite</option>
                          <option value="top">Haut</option>
                          <option value="bottom">Bas</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Mode de saisie préféré
                        </label>
                        <select
                          value={preferences.inputPreferences.mode}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            inputPreferences: {
                              ...prev.inputPreferences,
                              mode: e.target.value as 'visual' | 'text' | 'mixed'
                            }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          aria-label="Sélectionner le mode de saisie préféré"
                          id="input-mode-select"
                        >
                          <option value="visual">Visuel</option>
                          <option value="text">Texte</option>
                          <option value="mixed">Mixte</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  aria-label="Annuler les modifications"
                  title="Annuler les modifications"
                  type="button"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  aria-label="Enregistrer les préférences"
                  title="Enregistrer les préférences"
                  type="button"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'general', label: 'Général' },
    { id: 'shortcuts', label: 'Raccourcis' },
    { id: 'layout', label: 'Disposition' }
  ];

  const handleSave = () => {
    context.updatePreferences(preferences);
    setShowPreferences(false);
  };

  const handleShortcutChange = (action: string, key: string) => {
    setPreferences(prev => ({
      ...prev,
      shortcuts: {
        ...prev.shortcuts,
        [action]: key
      }
    }));
  };

  return (
    <div className="relative">
      {/* Bouton des préférences */}
      <button
        onClick={() => setShowPreferences(true)}
        className="fixed top-4 right-4 p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600"
        aria-label="Ouvrir les préférences utilisateur"
        title="Ouvrir les préférences utilisateur"
        type="button"
      >
        <span className="sr-only">Ouvrir les préférences utilisateur</span>
        ⚙️
      </button>

      {/* Modal des préférences */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" role="document">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Préférences utilisateur</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Fermer les préférences"
                title="Fermer les préférences"
                type="button"
              >
                ×
              </button>
            </div>

            {/* Contenu */}
            <div className="p-4 space-y-4">
              {/* Onglets */}
              <div className="border-b">
                <nav className="flex space-x-4" role="tablist" aria-label="Onglets de préférences">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-2 font-medium ${
                        activeTab === tab.id
                          ? 'border-b-2 border-purple-500 text-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`panel-${tab.id}`}
                      id={`tab-${tab.id}`}
                      aria-label={tab.label}
                      tabIndex={activeTab === tab.id ? 0 : -1}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Contenu des onglets */}
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  id={`panel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.id}`}
                  hidden={activeTab !== tab.id}
                >
                  <div className="space-y-4">
                    {tab.id === 'general' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Thème
                        </label>
                        <select
                          value={preferences.theme}
                          onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' | 'system' }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          aria-label="Sélectionner le thème"
                          id="theme-select"
                        >
                          <option value="light">Clair</option>
                          <option value="dark">Sombre</option>
                          <option value="system">Système</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Taille de police
                        </label>
                        <select
                          value={preferences.fontSize}
                          onChange={(e) => setPreferences(prev => ({ ...prev, fontSize: e.target.value as 'small' | 'medium' | 'large' }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          aria-label="Sélectionner la taille de police"
                          id="font-size-select"
                        >
                          <option value="small">Petite</option>
                          <option value="medium">Moyenne</option>
                          <option value="large">Grande</option>
                        </select>
                      </div>
                    )}
                    {tab.id === 'shortcuts' && (
                      <div className="space-y-4">
                        {Object.entries(defaultShortcuts).map(([action, defaultKey]) => (
                          <div key={action} className="flex items-center space-x-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700">
                                {action.replace(/-/g, ' ').replace(/\w+/g, (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                )}
                              </label>
                              <p className="text-sm text-gray-500">
                                {preferences.shortcuts[action] || defaultKey}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                const newKey = prompt('Entrez le nouveau raccourci (ex: Ctrl+K)');
                                if (newKey) {
                                  handleShortcutChange(action, newKey);
                                }
                              }}
                              className="text-sm text-gray-500 hover:text-gray-700"
                              aria-label={`Modifier le raccourci ${action.replace(/-/g, ' ').replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}`}
                              title={`Modifier le raccourci ${action.replace(/-/g, ' ').replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}`}
                              type="button"
                            >
                              Modifier
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {tab.id === 'layout' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Position de la barre latérale
                          </label>
                          <select
                            value={preferences.panelPositions.sidebar}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              panelPositions: {
                                ...prev.panelPositions,
                                sidebar: e.target.value as 'left' | 'right' | 'top' | 'bottom'
                              }
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            aria-label="Sélectionner la position de la barre latérale"
                            id="sidebar-position-select"
                          >
                            <option value="left">Gauche</option>
                            <option value="right">Droite</option>
                            <option value="top">Haut</option>
                            <option value="bottom">Bas</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mode de saisie préféré
                          </label>
                          <select
                            value={preferences.inputPreferences.mode}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              inputPreferences: {
                                ...prev.inputPreferences,
                                mode: e.target.value as 'visual' | 'text' | 'mixed'
                              }
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            aria-label="Sélectionner le mode de saisie préféré"
                            id="input-mode-select"
                          >
                            <option value="visual">Visuel</option>
                            <option value="text">Texte</option>
                            <option value="mixed">Mixte</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
                      aria-label="Sélectionner le thème"
                      id="theme-select"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="system">Système</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Taille de police
                    </label>
                    <select
                      value={preferences.layout}
                      onChange={(e) => setPreferences(prev => ({ ...prev, layout: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      aria-label="Sélectionner la taille de police"
                      id="font-size-select"
                    >
                      <option value="small">Petite</option>
                      <option value="medium">Moyenne</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>
              )}

              <div id="panel-shortcuts" role="tabpanel" aria-labelledby="tab-shortcuts" hidden={activeTab !== 'shortcuts'}>
                <div className="space-y-4">
                  {Object.entries(defaultShortcuts).map(([action, defaultKey]) => (
                    <div key={action} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          {action.replace(/-/g, ' ').replace(/\w+/g, (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                          )}
                        </label>
                        <p className="text-sm text-gray-500">
                          {preferences.shortcuts[action] || defaultKey}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newKey = prompt('Entrez le nouveau raccourci (ex: Ctrl+K)');
                          if (newKey) {
                            handleShortcutChange(action, newKey);
                          }
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                        aria-label={`Modifier le raccourci ${action.replace(/-/g, ' ').replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}`}
                        title={`Modifier le raccourci ${action.replace(/-/g, ' ').replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}`}
                        type="button"
                      >
                        Modifier
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div id="panel-layout" role="tabpanel" aria-labelledby="tab-layout" hidden={activeTab !== 'layout'}>
                <div className="space-y-4">
                  <div>
                        }
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                      aria-label={`Modifier le raccourci ${action.replace(/-/g, ' ').replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}`}
                      title={`Modifier le raccourci ${action.replace(/-/g, ' ').replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}`}
                      type="button"
                    >
                      Modifier
                    </button>
                  </div>
                ))}
              )}

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  aria-label="Annuler les modifications"
                  title="Annuler les modifications"
                  type="button"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  aria-label="Enregistrer les préférences"
                  title="Enregistrer les préférences"
                  type="button"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
{{ ... }}
    </div>
  );
};

export default UserPreferencesPanel;
