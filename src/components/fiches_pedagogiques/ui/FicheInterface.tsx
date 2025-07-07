import React, { useState, useEffect } from 'react';
import { FileText, Edit2, Eye, BookOpen, Search, Bookmark, Video, MessageSquare, Settings } from 'lucide-react';

interface FicheInterfaceProps {
  fiche: any;
  onEdit: (data: any) => void;
  onSearch: (query: string) => void;
  onNavigate: (path: string) => void;
  onSavePreferences: (prefs: any) => void;
}

const FicheInterface: React.FC<FicheInterfaceProps> = ({
  fiche,
  onEdit,
  onSearch,
  onNavigate,
  onSavePreferences
}) => {
  const [viewMode, setViewMode] = useState<'officiel' | 'edition' | 'revision' | 'presentation'>('edition');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [preferences, setPreferences] = useState({
    theme: 'light',
    shortcuts: {},
    panelLayout: 'default',
    font: 'default'
  });

  // Modes de vue
  const viewModes = {
    officiel: {
      icon: FileText,
      label: 'Fiche officielle',
      description: 'Format papier exact'
    },
    edition: {
      icon: Edit2,
      label: 'Édition',
      description: 'Interface de saisie'
    },
    revision: {
      icon: Eye,
      label: 'Révision',
      description: 'Vue synthétique'
    },
    presentation: {
      icon: BookOpen,
      label: 'Présentation',
      description: 'Affichage formation'
    }
  };

  // Navigation contextuelle
  const navigationTree = [
    {
      id: 'sequence',
      label: 'Séquence',
      children: [
        {
          id: 'sa1',
          label: 'SA1',
          children: [
            { id: 'fiche1', label: 'Fiche 1' },
            { id: 'fiche2', label: 'Fiche 2' }
          ]
        },
        {
          id: 'sa2',
          label: 'SA2',
          children: [
            { id: 'fiche3', label: 'Fiche 3' },
            { id: 'fiche4', label: 'Fiche 4' }
          ]
        }
      ]
    }
  ];

  // Outils d'aide
  const helpTools = {
    glossary: {
      icon: BookOpen,
      label: 'Glossaire',
      content: {
        'Savoir': 'Connaissance théorique',
        'Savoir-faire': 'Compétence pratique',
        'Savoir-être': 'Compétence sociale'
      }
    },
    examples: {
      icon: Search,
      label: 'Exemples',
      content: {
        'Mathématiques': ['Fractions', 'Équations', 'Géométrie'],
        'Français': ['Conjugaison', 'Orthographe', 'Lecture']
      }
    },
    tutorials: {
      icon: Video,
      label: 'Tutoriels',
      content: [
        { title: 'Création d'une fiche', url: '#' },
        { title: 'Validation par compétences', url: '#' },
        { title: 'Utilisation du glossaire', url: '#' }
      ]
    },
    support: {
      icon: MessageSquare,
      label: 'Support',
      content: 'Chat support pédagogique'
    }
  };

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '1') {
        setViewMode('officiel');
      } else if (e.ctrlKey && e.key === '2') {
        setViewMode('edition');
      } else if (e.ctrlKey && e.key === '3') {
        setViewMode('revision');
      } else if (e.ctrlKey && e.key === '4') {
        setViewMode('presentation');
      } else if (e.ctrlKey && e.key === 'G') {
        setShowGlossary(!showGlossary);
      } else if (e.ctrlKey && e.key === 'H') {
        setShowHelp(!showHelp);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGlossary, showHelp]);

  // Sauvegarde des préférences
  const savePreferences = (newPrefs: any) => {
    setPreferences(newPrefs);
    onSavePreferences(newPrefs);
  };

  // Composant de la fiche selon le mode
  const renderFiche = () => {
    switch (viewMode) {
      case 'officiel':
        return (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            {/* Contenu format officiel */}
            <h1 className="text-2xl font-bold mb-4">{fiche.titre}</h1>
            {/* ... */}
          </div>
        );
      case 'edition':
        return (
          <div className="space-y-6">
            {/* Interface d'édition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ... */}
            </div>
          </div>
        );
      case 'revision':
        return (
          <div className="space-y-4">
            {/* Vue synthétique */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              {/* ... */}
            </div>
          </div>
        );
      case 'presentation':
        return (
          <div className="p-8">
            {/* Mode présentation */}
            <h1 className="text-4xl font-bold mb-8">{fiche.titre}</h1>
            {/* ... */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Barre latérale */}
      {showSidebar && (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Modes de vue */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modes de vue
            </h3>
            <div className="space-y-2">
              {Object.entries(viewModes).map(([mode, { icon: Icon, label, description }]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`flex items-center space-x-2 p-2 rounded-lg ${
                    viewMode === mode
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Navigation
            </h3>
            <div className="space-y-2">
              {navigationTree.map((node) => (
                <div key={node.id}>
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Folder className="w-4 h-4" />
                    <span>{node.label}</span>
                  </button>
                  {node.children && (
                    <div className="ml-4 space-y-2">
                      {node.children.map((child) => (
                        <div key={child.id}>
                          <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <FileText className="w-4 h-4" />
                            <span>{child.label}</span>
                          </button>
                          {child.children && (
                            <div className="ml-4 space-y-2">
                              {child.children.map((subChild) => (
                                <button
                                  key={subChild.id}
                                  onClick={() => onNavigate(subChild.id)}
                                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <FileText className="w-4 h-4" />
                                  <span>{subChild.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Rechercher dans la fiche..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Contenu de la fiche */}
        {renderFiche()}
      </div>

      {/* Barre d'outils */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => setShowGlossary(!showGlossary)}
          className="p-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800"
          title="Glossaire"
        >
          <BookOpen className="w-6 h-6" />
        </button>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-lg bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800"
          title="Aide"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-800"
          title="Paramètres"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Modal de paramètres */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Préférences
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Thème */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thème
                  </label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => savePreferences({ ...preferences, theme: e.target.value })}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                  </select>
                </div>

                {/* Police */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Police
                  </label>
                  <select
                    value={preferences.font}
                    onChange={(e) => savePreferences({ ...preferences, font: e.target.value })}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="default">Par défaut</option>
                    <option value="serif">Serif</option>
                    <option value="sans-serif">Sans-serif</option>
                  </select>
                </div>

                {/* Raccourcis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Raccourcis clavier
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Ctrl+1</span>
                      <span className="text-sm">Mode officiel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Ctrl+2</span>
                      <span className="text-sm">Mode édition</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Ctrl+3</span>
                      <span className="text-sm">Mode révision</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Ctrl+4</span>
                      <span className="text-sm">Mode présentation</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      savePreferences(preferences);
                      setShowSettings(false);
                    }}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FicheInterface;
