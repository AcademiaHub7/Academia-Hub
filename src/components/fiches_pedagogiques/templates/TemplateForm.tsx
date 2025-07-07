import React, { useState } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { Template } from './types';

interface TemplateFormProps {
  template?: Template;
  onSubmit: (template: Template) => void;
  onCancel: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Template>({
    id: template?.id || '',
    nom: template?.nom || '',
    description: template?.description || '',
    matiere: template?.matiere || '',
    type: template?.type || 'fiche',
    version: template?.version || '1.0',
    sections: template?.sections || [
      {
        titre: 'SA N°, SÉQUENCE N°, Date, Cours, Durée, TITRE',
        type: 'info',
        champs: [
          { label: 'SA N°', type: 'number' },
          { label: 'SÉQUENCE N°', type: 'number' },
          { label: 'Date', type: 'date' },
          { label: 'Cours', type: 'text' },
          { label: 'Durée', type: 'time' },
          { label: 'TITRE', type: 'text' }
        ]
      },
      {
        titre: 'Éléments de planification',
        type: 'competences',
        sous_sections: [
          { titre: 'Compétences disciplinaires', type: 'competence' },
          { titre: 'Compétences Transversales', type: 'competence' },
          { titre: 'Compétences Transdisciplinaires', type: 'competence' },
          { titre: 'Compétences et Techniques', type: 'competence' },
          { titre: 'Stratégie Objet d\'Apprentissage', type: 'text' },
          { titre: 'Stratégie d\'enseignement/Apprentissage/Evaluation', type: 'text' },
          { titre: 'Matériel', type: 'text' }
        ]
      },
      {
        titre: 'Déroulement',
        type: 'table',
        colonnes: [
          { titre: 'Colonne N°', type: 'number' },
          { titre: 'Consignes', type: 'text' },
          { titre: 'Résultats attendus', type: 'text' }
        ],
        lignes: [
          {
            titre: 'Activités préliminaires',
            sous_sections: [
              {
                titre: 'Introduction',
                sous_sections: [
                  { titre: 'Mise en situation', type: 'text' },
                  {
                    titre: 'Proposition de nouvelles acquisitions',
                    sous_sections: [
                      { titre: 'Pré-conception', type: 'text' },
                      { titre: 'Pré-requis', type: 'text' }
                    ]
                  }
                ]
              },
              { titre: 'Réalisation', type: 'text' },
              {
                titre: 'Retour et projection',
                sous_sections: [
                  { titre: 'Objectivation', type: 'text' },
                  { titre: 'Evaluation', type: 'text' },
                  { titre: 'Projection', type: 'text' }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  const handleInputChange = (field: keyof Template, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom du template
          </label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => handleInputChange('nom', e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Matière
          </label>
          <select
            value={formData.matiere}
            onChange={(e) => handleInputChange('matiere', e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            required
          >
            <option value="">Sélectionnez une matière</option>
            <option value="Mathématiques">Mathématiques</option>
            <option value="Français">Français</option>
            <option value="Sciences">Sciences</option>
            <option value="Histoire">Histoire-Géographie</option>
            <option value="EPS">EPS</option>
            <option value="Arts">Arts</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
          placeholder="Description détaillée du template..."
        />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {formData.sections.map((section, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Section {index + 1}
              </h4>
              {section.type === 'table' && (
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Logique pour ajouter une ligne
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Logique pour supprimer une ligne
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Configuration des sections */}
            {section.type === 'info' && (
              <div className="space-y-2">
                {section.champs.map((champ, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={champ.label}
                      onChange={(e) => {
                        const newChamps = [...section.champs];
                        newChamps[i].label = e.target.value;
                        const newSections = [...formData.sections];
                        newSections[index].champs = newChamps;
                        handleInputChange('sections', newSections);
                      }}
                      className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    />
                    <select
                      value={champ.type}
                      onChange={(e) => {
                        const newChamps = [...section.champs];
                        newChamps[i].type = e.target.value;
                        const newSections = [...formData.sections];
                        newSections[index].champs = newChamps;
                        handleInputChange('sections', newSections);
                      }}
                      className="w-32 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="text">Texte</option>
                      <option value="number">Nombre</option>
                      <option value="date">Date</option>
                      <option value="time">Heure</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'competences' && (
              <div className="space-y-2">
                {section.sous_sections.map((ss, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={ss.titre}
                      onChange={(e) => {
                        const newSections = [...formData.sections];
                        newSections[index].sous_sections[i].titre = e.target.value;
                        handleInputChange('sections', newSections);
                      }}
                      className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    />
                    <select
                      value={ss.type}
                      onChange={(e) => {
                        const newSections = [...formData.sections];
                        newSections[index].sous_sections[i].type = e.target.value;
                        handleInputChange('sections', newSections);
                      }}
                      className="w-32 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="competence">Compétence</option>
                      <option value="text">Texte</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'table' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {section.colonnes.map((col, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Colonne {i + 1}
                      </label>
                      <input
                        type="text"
                        value={col.titre}
                        onChange={(e) => {
                          const newSections = [...formData.sections];
                          newSections[index].colonnes[i].titre = e.target.value;
                          handleInputChange('sections', newSections);
                        }}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      />
                      <select
                        value={col.type}
                        onChange={(e) => {
                          const newSections = [...formData.sections];
                          newSections[index].colonnes[i].type = e.target.value;
                          handleInputChange('sections', newSections);
                        }}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 mt-2"
                      >
                        <option value="text">Texte</option>
                        <option value="number">Nombre</option>
                      </select>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {section.lignes.map((ligne, i) => (
                    <div key={i}>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {ligne.titre}
                      </h5>
                      {ligne.sous_sections && ligne.sous_sections.map((ss, j) => (
                        <div key={j} className="ml-4">
                          <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {ss.titre}
                          </h6>
                          {ss.sous_sections && ss.sous_sections.map((sss, k) => (
                            <div key={k} className="ml-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={sss.titre}
                                  onChange={(e) => {
                                    const newSections = [...formData.sections];
                                    newSections[index].lignes[i].sous_sections[j].sous_sections[k].titre = e.target.value;
                                    handleInputChange('sections', newSections);
                                  }}
                                  className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                />
                                <select
                                  value={sss.type}
                                  onChange={(e) => {
                                    const newSections = [...formData.sections];
                                    newSections[index].lignes[i].sous_sections[j].sous_sections[k].type = e.target.value;
                                    handleInputChange('sections', newSections);
                                  }}
                                  className="w-32 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                >
                                  <option value="text">Texte</option>
                                  <option value="number">Nombre</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Boutons */}
      <div className="flex justify-end space-x-4">
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
          {template ? 'Modifier' : 'Créer'} Template
        </button>
      </div>
    </form>
  );
};

export default TemplateForm;
