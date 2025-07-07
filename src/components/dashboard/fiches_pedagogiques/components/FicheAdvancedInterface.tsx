import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  FileText,
  Edit2,
  Eye,
  Presentation,
  Menu,
  Search,
  BookOpen,
  HelpCircle,
  Settings,
  User,
  Star
} from 'lucide-react';

import {
  FicheViewMode,
  FicheViewContext,
  FicheViewProps,
  NavigationState,
  UserPreferences
} from './types/FicheViewTypes';
import FicheOfficialView from './views/FicheOfficialView';
import FicheEditView from './views/FicheEditView';
import FicheReviewView from './views/FicheReviewView';
import FichePresentationView from './views/FichePresentationView';
import NavigationTree from './navigation/NavigationTree';
import ContextualHelp from './help/ContextualHelp';
import Glossary from './help/Glossary';
import UserPreferencesPanel from './preferences/UserPreferencesPanel';

const FicheViewContext = createContext<FicheViewContext | undefined>(undefined);

export const FicheViewProvider: React.FC<FicheViewProps> = ({
  fiche,
  mode,
  onModeChange,
  onFicheUpdate,
  navigation,
  onNavigationUpdate,
  preferences,
  onPreferencesUpdate
}) => {
  return (
    <FicheViewContext.Provider
      value={{
        mode,
        setMode: onModeChange,
        fiche,
        updateFiche: onFicheUpdate,
        navigation,
        updateNavigation: onNavigationUpdate,
        preferences,
        updatePreferences: onPreferencesUpdate
      }}
    >
      <FicheAdvancedInterface />
    </FicheViewContext.Provider>
  );
};

export const FicheAdvancedInterface: React.FC = () => {
  const context = useContext(FicheViewContext);
  if (!context) {
    throw new Error('FicheAdvancedInterface must be used within a FicheViewProvider');
  }

  const {
    mode,
    fiche,
    navigation,
    preferences
  } = context;

  const renderView = () => {
    switch (mode) {
      case FicheViewMode.OFFICIAL:
        return <FicheOfficialView fiche={fiche} />;
      case FicheViewMode.EDIT:
        return <FicheEditView fiche={fiche} />;
      case FicheViewMode.REVIEW:
        return <FicheReviewView fiche={fiche} />;
      case FicheViewMode.PRESENTATION:
        return <FichePresentationView fiche={fiche} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Navigation et outils */}
      <div className="w-64 border-r">
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              aria-label="Ouvrir les préférences"
              title="Ouvrir les préférences"
              type="button"
            >
              <Settings size={16} aria-hidden="true" />
            </button>
          </div>
          
          {/* Mode de vue */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Mode de vue</h3>
            <div className="flex space-x-2">
              <button
                className={`p-2 rounded ${mode === FicheViewMode.OFFICIAL ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => context.setMode(FicheViewMode.OFFICIAL)}
                aria-label="Mode officiel"
                title="Mode officiel"
                type="button"
              >
                <FileText size={16} aria-hidden="true" />
              </button>
              <button
                className={`p-2 rounded ${mode === FicheViewMode.EDIT ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => context.setMode(FicheViewMode.EDIT)}
                aria-label="Mode édition"
                title="Mode édition"
                type="button"
              >
                <Edit2 size={16} aria-hidden="true" />
              </button>
              <button
                className={`p-2 rounded ${mode === FicheViewMode.REVIEW ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => context.setMode(FicheViewMode.REVIEW)}
                aria-label="Mode revue"
                title="Mode revue"
                type="button"
              >
                <Eye size={16} aria-hidden="true" />
              </button>
              <button
                className={`p-2 rounded ${mode === FicheViewMode.PRESENTATION ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => context.setMode(FicheViewMode.PRESENTATION)}
                aria-label="Mode présentation"
                title="Mode présentation"
                type="button"
              >
                <Presentation size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation arborescente */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Navigation</h3>
            <NavigationTree path={navigation.currentPath} />
          </div>

          {/* Recherche */}
          <div className="mb-4">
            <div className="flex items-center bg-gray-50 rounded-md">
              <Search className="h-5 w-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Rechercher dans la fiche..."
                className="flex-1 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 bg-gray-50 rounded-md"
              />
            </div>
          </div>

          {/* Outils d'aide */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Aide</h3>
            <div className="flex space-x-2">
              <button
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
                aria-label="Ouvrir le glossaire"
                title="Ouvrir le glossaire"
                type="button"
              >
                <BookOpen size={16} aria-hidden="true" className="mr-2" />
                Glossaire
              </button>
              <button
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
                aria-label="Ouvrir l'aide contextuelle"
                title="Ouvrir l'aide contextuelle"
                type="button"
              >
                <HelpCircle size={16} aria-hidden="true" className="mr-2" />
                Aide contextuelle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Barre d'outils */}
        <div className="border-b">
          <div className="flex items-center justify-between px-4 h-12">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">{fiche?.title}</h1>
              <span className="text-sm text-gray-500">{fiche?.subject}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                aria-label="Ajouter aux favoris"
                title="Ajouter aux favoris"
                type="button"
              >
                <Star size={16} aria-hidden="true" />
              </button>
              <button
                className="text-gray-500 hover:text-gray-700"
                aria-label="Partager"
                title="Partager"
                type="button"
              >
                <User size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Vue principale */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderView()}
        </div>
      </div>

      {/* Panneau de préférences */}
      <UserPreferencesPanel preferences={preferences} />

      {/* Aide contextuelle */}
      <ContextualHelp />

      {/* Glossaire */}
      <Glossary />
    </div>
  );
};

// Export nommé utilisé à la place de l'export par défaut
