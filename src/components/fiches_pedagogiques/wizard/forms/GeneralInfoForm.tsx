import React, { useState } from 'react';
import { FileText, Clock, User, LayoutGrid, AlertCircle } from 'lucide-react';
import { Template } from '../../templates/types';

interface GeneralInfoFormProps {
  data: any;
  onChange: (data: any) => void;
}

const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({
  data,
  onChange
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleTemplateSelect = (template: Template) => {
    onChange({
      ...data,
      titre: template.nom,
      matiere: template.matiere,
      template: template
    });
    setShowTemplateModal(false);
  };

  // Suggestions automatiques basées sur matière/niveau
  useEffect(() => {
    if (data.matiere && data.classe) {
      // Logique pour récupérer les suggestions
      const suggestions = [
        { titre: 'Suggestion 1', description: 'Description de la suggestion 1' },
        { titre: 'Suggestion 2', description: 'Description de la suggestion 2' }
      ];
      setSuggestions(suggestions);
    }
  }, [data.matiere, data.classe]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        <FileText className="w-4 h-4 inline-block mr-1" />
        Informations générales
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Titre de la séance
          </label>
          <input
            type="text"
            value={data.titre}
            onChange={(e) => handleInputChange('titre', e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Matière
          </label>
          <select
            value={data.matiere}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Classe
          </label>
          <select
            value={data.classe}
            onChange={(e) => handleInputChange('classe', e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            required
          >
            <option value="">Sélectionnez une classe</option>
            <option value="6ème">6ème</option>
            <option value="5ème">5ème</option>
            <option value="4ème">4ème</option>
            <option value="3ème">3ème</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Durée (minutes)
          </label>
          <input
            type="number"
            value={data.duree}
            onChange={(e) => handleInputChange('duree', parseInt(e.target.value))}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            required
          />
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suggestions automatiques
          </h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {suggestion.titre}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton de template */}
      <button
        onClick={() => setShowTemplateModal(true)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        Utiliser un template
      </button>

      {/* Modal de template */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Sélectionner un template
              </h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {/* Liste des templates */}
              <div className="space-y-4">
                {/* Templates par matière */}
                {['Mathématiques', 'Français', 'Sciences'].map((matiere) => (
                  <div key={matiere}>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {matiere}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3].map((i) => (
                        <button
                          key={i}
                          onClick={() => handleTemplateSelect({
                            id: `${matiere}-${i}`,
                            nom: `${matiere} - Template ${i}`,
                            matiere,
                            description: `Template standard pour ${matiere}`
                          })}
                          className="p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <LayoutGrid className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">Template {i}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Description du template
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInfoForm;
