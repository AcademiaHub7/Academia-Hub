import React from 'react';
import { Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ElementsPlanificationFormProps {
  objectifs: string[];
  onObjectifsChange: (objectifs: string[]) => void;
}

const ElementsPlanificationForm: React.FC<ElementsPlanificationFormProps> = ({
  objectifs,
  onObjectifsChange
}) => {
  const handleAddObjectif = () => {
    onObjectifsChange([...objectifs, '']);
  };

  const handleRemoveObjectif = (index: number) => {
    onObjectifsChange(objectifs.filter((_, i) => i !== index));
  };

  const handleObjectifChange = (index: number, value: string) => {
    onObjectifsChange(
      objectifs.map((obj, i) => (i === index ? value : obj))
    );
  };

  return (
    <div className="space-y-4">
      {/* Objectifs */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Objectifs pédagogiques</h4>
        {objectifs.map((objectif, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <input
                type="text"
                value={objectif}
                onChange={(e) => handleObjectifChange(index, e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                placeholder="Objectif pédagogique"
              />
            </div>
            <button
              onClick={() => handleRemoveObjectif(index)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              title="Supprimer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={handleAddObjectif}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un objectif
        </button>
      </div>

      {/* Validation */}
      <div className="mt-4">
        <button
          onClick={() => onObjectifsChange(objectifs.filter(obj => obj.trim() !== ''))}
          className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Valider
        </button>
        {objectifs.some(obj => obj.trim() === '') && (
          <p className="mt-2 text-sm text-red-500">
            <AlertCircle className="w-4 h-4 inline-block mr-1" />
            Certains objectifs sont vides
          </p>
        )}
      </div>
    </div>
  );
};

export default ElementsPlanificationForm;
