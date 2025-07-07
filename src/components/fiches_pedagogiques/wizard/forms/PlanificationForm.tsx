import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { Template } from '../../templates/types';

interface PlanificationFormProps {
  data: any;
  onChange: (data: any) => void;
}

const PlanificationForm: React.FC<PlanificationFormProps> = ({
  data,
  onChange
}) => {
  const [showCompetenceModal, setShowCompetenceModal] = useState(false);
  const [selectedCompetence, setSelectedCompetence] = useState('');
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('');

  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddCompetence = () => {
    if (selectedCompetence) {
      onChange({
        ...data,
        competences: [...data.competences, selectedCompetence]
      });
      setSelectedCompetence('');
    }
  };

  const handleAddStrategy = () => {
    if (selectedStrategy) {
      onChange({
        ...data,
        strategies: [...data.strategies, selectedStrategy]
      });
      setSelectedStrategy('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        <FileText className="w-4 h-4 inline-block mr-1" />
        Planification
      </h3>

      {/* Objectifs */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Objectifs pédagogiques
        </h4>
        <div className="space-y-4">
          {data.objectifs.map((objectif: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={objectif}
                onChange={(e) => {
                  const newObjectifs = [...data.objectifs];
                  newObjectifs[index] = e.target.value;
                  onChange({ ...data, objectifs: newObjectifs });
                }}
                className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
              />
              <button
                onClick={() => {
                  const newObjectifs = [...data.objectifs];
                  newObjectifs.splice(index, 1);
                  onChange({ ...data, objectifs: newObjectifs });
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange({ ...data, objectifs: [...data.objectifs, ''] })}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un objectif
          </button>
        </div>
      </div>

      {/* Compétences */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Compétences
        </h4>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={selectedCompetence}
            onChange={(e) => setSelectedCompetence(e.target.value)}
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            placeholder="Rechercher une compétence..."
          />
          <button
            onClick={handleAddCompetence}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.competences.map((competence: string, index: number) => (
            <span
              key={index}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
            >
              {competence}
            </span>
          ))}
        </div>
      </div>

      {/* Stratégies */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Stratégies d'enseignement
        </h4>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
            placeholder="Rechercher une stratégie..."
          />
          <button
            onClick={handleAddStrategy}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {data.strategies.map((strategy: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">{strategy}</span>
              <button
                onClick={() => {
                  const newStrategies = [...data.strategies];
                  newStrategies.splice(index, 1);
                  onChange({ ...data, strategies: newStrategies });
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Validation */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Validation
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {data.objectifs.length} objectifs définis
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {data.competences.length} compétences sélectionnées
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {data.strategies.length} stratégies définies
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanificationForm;
