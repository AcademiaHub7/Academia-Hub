import React, { useState } from 'react';
import { Fiche } from '../../../types';
import { FicheViewContext } from '../FicheViewTypes';

interface FicheEditViewProps {
  fiche: Fiche;
}

const FicheEditView: React.FC<FicheEditViewProps> = ({ fiche }) => {
  const context = React.useContext(FicheViewContext);
  if (!context) {
    throw new Error('FicheEditView must be used within a FicheViewProvider');
  }

  const [formData, setFormData] = useState({
    title: fiche.title || '',
    subject: fiche.subject || '',
    level: fiche.level || '',
    objectives: fiche.objectives || [],
    content: fiche.content || '',
    resources: fiche.resources || [],
    evaluation: fiche.evaluation || []
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    context.updateFiche(formData);
  };

  return (
    <div className="space-y-6">
      {/* Formulaire principal */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              aria-label="Titre de la fiche"
              placeholder="Entrez le titre de la fiche"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Matière
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              aria-label="Sélectionner la matière"
              aria-required="true"
            >
              {/* Options de matière */}
              <option value="">Sélectionner une matière</option>
              {/* À compléter avec les matières réelles */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Niveau
            </label>
            <select
              value={formData.level}
              onChange={(e) => handleInputChange('level', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              aria-label="Sélectionner le niveau de classe"
              aria-required="true"
            >
              {/* Options de niveau */}
              <option value="">Sélectionner un niveau</option>
              {/* À compléter avec les niveaux réels */}
            </select>
          </div>

          {/* Objectifs */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Objectifs pédagogiques
            </label>
            <div className="mt-2 space-y-2">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => {
                      const newObjectives = [...formData.objectives];
                      newObjectives[index] = e.target.value;
                      handleInputChange('objectives', newObjectives);
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                    aria-label={`Objectif ${index + 1}`}
                    placeholder="Entrez un objectif pédagogique"
                  />
                  <button
                    onClick={() => {
                      const newObjectives = [...formData.objectives];
                      newObjectives.splice(index, 1);
                      handleInputChange('objectives', newObjectives);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleInputChange('objectives', [...formData.objectives, ''])}
                className="text-blue-500 hover:text-blue-700"
              >
                + Ajouter un objectif
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contenu
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Ressources */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ressources
            </label>
            <div className="mt-2 space-y-2">
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Titre"
                    value={resource.title}
                    onChange={(e) => {
                      const newResources = [...formData.resources];
                      newResources[index].title = e.target.value;
                      handleInputChange('resources', newResources);
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={resource.description}
                    onChange={(e) => {
                      const newResources = [...formData.resources];
                      newResources[index].description = e.target.value;
                      handleInputChange('resources', newResources);
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  <button
                    onClick={() => {
                      const newResources = [...formData.resources];
                      newResources.splice(index, 1);
                      handleInputChange('resources', newResources);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleInputChange('resources', [...formData.resources, { title: '', description: '' }])}
                className="text-blue-500 hover:text-blue-700"
              >
                + Ajouter une ressource
              </button>
            </div>
          </div>

          {/* Évaluation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Évaluation
            </label>
            <div className="mt-2 space-y-2">
              {formData.evaluation.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newEvaluation = [...formData.evaluation];
                      newEvaluation[index] = e.target.value;
                      handleInputChange('evaluation', newEvaluation);
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  <button
                    onClick={() => {
                      const newEvaluation = [...formData.evaluation];
                      newEvaluation.splice(index, 1);
                      handleInputChange('evaluation', newEvaluation);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleInputChange('evaluation', [...formData.evaluation, ''])}
                className="text-blue-500 hover:text-blue-700"
              >
                + Ajouter un item d'évaluation
              </button>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FicheEditView;
