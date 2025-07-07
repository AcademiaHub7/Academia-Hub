import React, { useState } from 'react';
import { Plus, X, CheckCircle, Search } from 'lucide-react';

interface Competence {
  id: string;
  code: string;
  libelle: string;
  domaine: string;
  niveau: number;
}

interface CompetencesPickerProps {
  competences: string[];
  onCompetencesChange: (competences: string[]) => void;
}

const competences: Competence[] = [
  {
    id: '1',
    code: 'MATH-1',
    libelle: 'Résolution de problèmes',
    domaine: 'Mathématiques',
    niveau: 1
  },
  {
    id: '2',
    code: 'FR-1',
    libelle: 'Expression écrite',
    domaine: 'Français',
    niveau: 2
  },
  {
    id: '3',
    code: 'HIST-1',
    libelle: 'Analyse historique',
    domaine: 'Histoire',
    niveau: 1
  },
  // ... autres compétences
];

const CompetencesPicker: React.FC<CompetencesPickerProps> = ({
  competences,
  onCompetencesChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const filteredCompetences = competences.filter(id =>
    competences.some(c => c.id === id)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCompetence = (competenceId: string) => {
    onCompetencesChange([...competences, competenceId]);
    setShowPicker(false);
  };

  const handleRemoveCompetence = (index: number) => {
    onCompetencesChange(
      competences.filter((_, i) => i !== index)
    );
  };

  const validateCompetences = () => {
    onCompetencesChange(competences.filter(id => id.trim() !== ''));
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Compétences associées</h4>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Rechercher une compétence..."
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </button>
        </div>

        {showPicker && (
          <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <div className="p-2">
              {competences
                .filter(c =>
                  c.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.code.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => handleAddCompetence(comp.id)}
                    className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{comp.code}</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">{comp.libelle}</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Niv. {comp.niveau}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {competences.map((compId, index) => {
          const comp = competences.find(c => c.id === compId);
          if (!comp) return null;
          return (
            <div
              key={compId}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center"
            >
              <span className="mr-2">{comp.code}</span>
              <span className="text-sm">{comp.libelle}</span>
              <button
                onClick={() => handleRemoveCompetence(index)}
                className="ml-2 p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={validateCompetences}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Valider les compétences
        </button>
      </div>
    </div>
  );
};

export default CompetencesPicker;
