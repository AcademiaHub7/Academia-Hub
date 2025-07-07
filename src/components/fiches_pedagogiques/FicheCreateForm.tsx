import React, { useState } from 'react';
import { ElementsPlanificationForm, DeroulementBuilder, ConsigneResultatEditor, TemplateSelector, CompetencesPicker, StrategieBuilder } from './specialized';
import { FileText, User, Clock, LayoutGrid, BookOpen, Calendar, CheckCircle } from 'lucide-react';

interface FicheCreateFormProps {
  onSave: (fiche: FichePedagogique) => void;
  onCancel: () => void;
}

interface FichePedagogique {
  titre: string;
  matiere: string;
  classe: string;
  auteur: string;
  date: string;
  type: 'fiche' | 'planification';
  objectifs: string[];
  competences: string[];
  deroulement: any[];
  consignes: string[];
  resultats: string[];
  strategies: string[];
  template: string;
}

const FicheCreateForm: React.FC<FicheCreateFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<FichePedagogique>({
    titre: '',
    matiere: '',
    classe: '',
    auteur: '',
    date: new Date().toISOString(),
    type: 'fiche',
    objectifs: [],
    competences: [],
    deroulement: [],
    consignes: [],
    resultats: [],
    strategies: [],
    template: ''
  });

  const handleInputChange = (field: keyof FichePedagogique, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Nouvelle Fiche Pédagogique</h2>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Enregistrer
            </button>
          </div>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FileText className="w-4 h-4 inline-block mr-1" />
              Titre
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => handleInputChange('titre', e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
              placeholder="Titre de la fiche"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <BookOpen className="w-4 h-4 inline-block mr-1" />
              Matière
            </label>
            <select
              value={formData.matiere}
              onChange={(e) => handleInputChange('matiere', e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="">Sélectionnez une matière</option>
              <option value="Mathématiques">Mathématiques</option>
              <option value="Français">Français</option>
              <option value="Histoire">Histoire</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <User className="w-4 h-4 inline-block mr-1" />
              Classe
            </label>
            <select
              value={formData.classe}
              onChange={(e) => handleInputChange('classe', e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="">Sélectionnez une classe</option>
              <option value="6ème A">6ème A</option>
              <option value="5ème B">5ème B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Clock className="w-4 h-4 inline-block mr-1" />
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="fiche">Fiche de préparation</option>
              <option value="planification">Planification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sections principales */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Objectifs et Compétences</h3>
          <ElementsPlanificationForm
            objectifs={formData.objectifs}
            onObjectifsChange={(objectifs) => handleInputChange('objectifs', objectifs)}
          />
          <CompetencesPicker
            competences={formData.competences}
            onCompetencesChange={(competences) => handleInputChange('competences', competences)}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Déroulement</h3>
          <DeroulementBuilder
            deroulement={formData.deroulement}
            onChange={(deroulement) => handleInputChange('deroulement', deroulement)}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Consignes et Résultats</h3>
          <ConsigneResultatEditor
            consignes={formData.consignes}
            resultats={formData.resultats}
            onChange={(data) => {
              handleInputChange('consignes', data.consignes);
              handleInputChange('resultats', data.resultats);
            }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Stratégies d'enseignement</h3>
          <StrategieBuilder
            strategies={formData.strategies}
            onChange={(strategies) => handleInputChange('strategies', strategies)}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Template</h3>
          <TemplateSelector
            template={formData.template}
            onChange={(template) => handleInputChange('template', template)}
          />
        </div>
      </div>
    </form>
  );
};

export default FicheCreateForm;
