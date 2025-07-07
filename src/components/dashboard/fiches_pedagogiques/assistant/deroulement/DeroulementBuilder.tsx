import React, { useState, useEffect } from 'react';
import { Fiche } from '../../../types';
import { useTemplateService } from '../../../services/templateService';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

interface DeroulementBuilderProps {
  data: Fiche;
  onNext: (data: Partial<Fiche>) => void;
}

interface Phase {
  id: string;
  title: string;
  duration: number;
  activities: Array<{
    id: string;
    title: string;
    description: string;
    duration: number;
  }>;
}

const phases = [
  { id: 'intro', title: 'Introduction', duration: 0 },
  { id: 'presentation', title: 'Présentation', duration: 0 },
  { id: 'activites', title: 'Activités', duration: 0 },
  { id: 'synthese', title: 'Synthèse', duration: 0 },
];

const DeroulementBuilder: React.FC<DeroulementBuilderProps> = ({ data, onNext }) => {
  const { getTemplatePhases } = useTemplateService();
  const [phasesState, setPhasesState] = useState<Phase[]>(phases);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Charger les phases du template au montage
  useEffect(() => {
    const loadTemplatePhases = async () => {
      if (data.templateId) {
        const templatePhases = await getTemplatePhases(data.templateId);
        setPhasesState(templatePhases);
      }
    };
    loadTemplatePhases();
  }, [data.templateId]);

  // Calculer la durée totale
  useEffect(() => {
    const calculateTotalDuration = () => {
      const duration = phasesState.reduce((sum, phase) => 
        sum + phase.duration + phase.activities.reduce((sum, activity) => sum + activity.duration, 0),
        0
      );
      setTotalDuration(duration);
    };
    calculateTotalDuration();
  }, [phasesState]);

  // Gérer le drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(phasesState);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhasesState(items);
  };

  // Gérer l'ajout d'une activité
  const addActivity = (phaseId: string) => {
    const newActivity = {
      id: crypto.randomUUID(),
      title: 'Nouvelle activité',
      description: '',
      duration: 15,
    };

    setPhasesState(prev => prev.map(phase => 
      phase.id === phaseId
        ? { ...phase, activities: [...phase.activities, newActivity] }
        : phase
    ));
  };

  // Gérer la suppression d'une activité
  const removeActivity = (phaseId: string, activityId: string) => {
    setPhasesState(prev => prev.map(phase => 
      phase.id === phaseId
        ? { 
            ...phase, 
            activities: phase.activities.filter(activity => activity.id !== activityId) 
          }
        : phase
    ));
  };

  // Soumission de l'étape
  const handleSubmit = () => {
    if (totalDuration > data.duration) {
      toast.error('La durée totale dépasse la durée prévue');
      return;
    }

    const content = phasesState.map(phase => (
      `<h3>${phase.title}</h3>
      ${phase.activities.map(activity => (
        `<div>
          <h4>${activity.title}</h4>
          <p>${activity.description}</p>
          <p>Durée: ${activity.duration} minutes</p>
        </div>`
      )).join('')}
      <hr />
      `)
    ).join('');

    onNext({ content });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modèle de déroulement
        </label>
        <select
          value={selectedTemplate || ''}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          aria-label="Sélectionner un modèle de déroulement"
          aria-required="false"
        >
          <option value="">Sélectionner un modèle</option>
          {/* Options de templates à implémenter */}
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="phases">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {phasesState.map((phase, index) => (
                <Draggable key={phase.id} draggableId={phase.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white rounded-lg shadow p-4 mb-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {phase.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          Durée: {phase.duration} minutes
                        </span>
                      </div>

                      <div className="space-y-4">
                        {phase.activities.map((activity) => (
                          <div key={activity.id} className="border rounded-lg p-3">
                            <input
                              type="text"
                              value={activity.title}
                              onChange={(e) => {
                                setPhasesState(prev => prev.map(p => 
                                  p.id === phase.id
                                    ? {
                                        ...p,
                                        activities: p.activities.map(a => 
                                          a.id === activity.id
                                            ? { ...a, title: e.target.value }
                                            : a
                                        )
                                      }
                                    : p
                                ));
                              }}
                              placeholder="Titre de l'activité"
                              className="w-full mb-2"
                              aria-label="Titre de l'activité"
                              aria-required="true"
                            />
                            <textarea
                              value={activity.description}
                              onChange={(e) => {
                                setPhasesState(prev => prev.map(p => 
                                  p.id === phase.id
                                    ? {
                                        ...p,
                                        activities: p.activities.map(a => 
                                          a.id === activity.id
                                            ? { ...a, description: e.target.value }
                                            : a
                                        )
                                      }
                                    : p
                                ));
                              }}
                              placeholder="Description de l'activité"
                              className="w-full mb-2"
                              aria-label="Description de l'activité"
                              aria-required="false"
                            />
                            <div className="flex justify-between items-center">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Durée (minutes)
                                </label>
                                <input
                                  type="number"
                                  value={activity.duration}
                                  onChange={(e) => {
                                    setPhasesState(prev => prev.map(p => 
                                      p.id === phase.id
                                        ? {
                                            ...p,
                                            activities: p.activities.map(a => 
                                              a.id === activity.id
                                                ? { ...a, duration: parseInt(e.target.value) }
                                                : a
                                            )
                                          }
                                        : p
                                    ));
                                  }}
                                  className="w-full"
                                  aria-label="Durée de l'activité en minutes"
                                  aria-required="true"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeActivity(phase.id, activity.id)}
                                className="text-red-600 hover:text-red-800"
                                aria-label="Supprimer l'activité"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addActivity(phase.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Ajouter une activité
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          Durée totale: {totalDuration} minutes / {data.duration} minutes prévues
        </span>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default DeroulementBuilder;
