import React, { useState, DragEvent } from 'react';
import { Clock, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Template } from '../../templates/types';

interface DeroulementFormProps {
  data: any;
  onChange: (data: any) => void;
}

const DeroulementForm: React.FC<DeroulementFormProps> = ({
  data,
  onChange
}) => {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [showDurationModal, setShowDurationModal] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddPhase = () => {
    onChange({
      ...data,
      phases: [...data.phases, {
        titre: 'Nouvelle phase',
        duree: 0,
        description: '',
        materiaux: []
      }]
    });
  };

  const handleDragStart = (e: DragEvent, index: number) => {
    e.dataTransfer.setData('phaseIndex', index.toString());
  };

  const handleDrop = (e: DragEvent, targetIndex: number) => {
    const sourceIndex = parseInt(e.dataTransfer.getData('phaseIndex'));
    const phases = [...data.phases];
    const [phase] = phases.splice(sourceIndex, 1);
    phases.splice(targetIndex, 0, phase);
    onChange({ ...data, phases });
  };

  const handleAddActivity = (phaseIndex: number) => {
    if (selectedActivity) {
      const phases = [...data.phases];
      phases[phaseIndex].activites = [
        ...(phases[phaseIndex].activites || []),
        selectedActivity
      ];
      onChange({ ...data, phases });
      setSelectedActivity('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        <Clock className="w-4 h-4 inline-block mr-1" />
        Déroulement
      </h3>

      {/* Liste des phases */}
      <div className="space-y-4">
        {data.phases.map((phase: any, index: number) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phase {index + 1}
                </span>
                <input
                  type="text"
                  value={phase.titre}
                  onChange={(e) => {
                    const phases = [...data.phases];
                    phases[index].titre = e.target.value;
                    onChange({ ...data, phases });
                  }}
                  className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const phases = [...data.phases];
                    phases.splice(index, 1);
                    onChange({ ...data, phases });
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Durée */}
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <input
                type="number"
                value={phase.duree}
                onChange={(e) => {
                  const phases = [...data.phases];
                  phases[index].duree = parseInt(e.target.value);
                  onChange({ ...data, phases });
                }}
                className="w-20 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">minutes</span>
            </div>

            {/* Description */}
            <div className="mb-2">
              <textarea
                value={phase.description}
                onChange={(e) => {
                  const phases = [...data.phases];
                  phases[index].description = e.target.value;
                  onChange({ ...data, phases });
                }}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-24"
                placeholder="Description de la phase..."
              />
            </div>

            {/* Matériaux */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matériaux
              </label>
              <div className="flex flex-wrap gap-2">
                {phase.materiaux.map((mat: string, i: number) => (
                  <span
                    key={i}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Activités */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activités
              </h4>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Rechercher une activité..."
                />
                <button
                  onClick={() => handleAddActivity(index)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {phase.activites?.map((activity: string, i: number) => (
                  <div key={i} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Bouton d'ajout de phase */}
        <button
          onClick={handleAddPhase}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une phase
        </button>
      </div>

      {/* Validation */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Validation du déroulement
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {data.phases.length} phases définies
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Durée totale : {data.phases.reduce((sum, phase) => sum + phase.duree, 0)} minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeroulementForm;
