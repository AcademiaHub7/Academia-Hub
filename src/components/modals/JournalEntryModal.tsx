import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  Clock,
  Book,
  Users,
  Target,
  List,
  FileText,
  Eye,
  Save
} from 'lucide-react';
import { JournalEntry, JournalObjective, JournalStep } from '../../types/journal';

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  entry?: JournalEntry;
  classes: string[];
  subjects: string[];
}

const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  entry,
  classes,
  subjects
}) => {
  const [formData, setFormData] = useState<JournalEntry>({
    id: '',
    title: '',
    date: '',
    subject: '',
    class: '',
    duration: 60,
    status: 'planned',
    objectives: [],
    steps: [],
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    } else {
      setFormData({
        id: `JRN-${new Date().getTime()}`,
        title: '',
        date: '',
        subject: '',
        class: '',
        duration: 60,
        status: 'planned',
        objectives: [],
        steps: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, [entry]);

  const handleAddObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [
        ...prev.objectives,
        {
          id: `OBJ-${new Date().getTime()}`,
          title: '',
          description: '',
          competencies: []
        }
      ]
    }));
  };

  const handleRemoveObjective = (id: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  const handleObjectiveChange = (id: string, field: keyof JournalObjective, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj =>
        obj.id === id ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: `STP-${new Date().getTime()}`,
          title: '',
          duration: 15,
          description: ''
        }
      ]
    }));
  };

  const handleRemoveStep = (id: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== id)
    }));
  };

  const handleStepChange = (id: string, field: keyof JournalStep, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === id ? { ...step, [field]: value } : step
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {entry ? 'Modifier la séance' : 'Nouvelle séance'}
            </h2>
            <button 
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Titre</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Matière</label>
                <select
                  className="select select-bordered w-full"
                  value={formData.subject}
                  onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Classe</label>
                <select
                  className="select select-bordered w-full"
                  value={formData.class}
                  onChange={e => setFormData(prev => ({ ...prev, class: e.target.value }))}
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Durée (minutes)</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={formData.duration}
                  onChange={e => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  min="5"
                  step="5"
                  required
                />
              </div>
              <div>
                <label className="label">Statut</label>
                <select
                  className="select select-bordered w-full"
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as JournalEntry['status'] }))}
                >
                  <option value="planned">Planifiée</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminée</option>
                  <option value="postponed">Reportée</option>
                </select>
              </div>
            </div>

            {/* Objectives */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Objectifs</h3>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleAddObjective}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un objectif
                </button>
              </div>
              <div className="space-y-4">
                {formData.objectives.map(objective => (
                  <div key={objective.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Objectif</h4>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-red-500"
                        onClick={() => handleRemoveObjective(objective.id)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid gap-4">
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Titre de l'objectif"
                        value={objective.title}
                        onChange={e => handleObjectiveChange(objective.id, 'title', e.target.value)}
                        required
                      />
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Description"
                        value={objective.description}
                        onChange={e => handleObjectiveChange(objective.id, 'description', e.target.value)}
                        required
                      />
                      <div>
                        <label className="label">Compétences (séparées par des virgules)</label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={objective.competencies.join(', ')}
                          onChange={e => handleObjectiveChange(
                            objective.id,
                            'competencies',
                            e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Déroulement</h3>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleAddStep}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une étape
                </button>
              </div>
              <div className="space-y-4">
                {formData.steps.map(step => (
                  <div key={step.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Étape</h4>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-red-500"
                        onClick={() => handleRemoveStep(step.id)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid gap-4">
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Titre de l'étape"
                        value={step.title}
                        onChange={e => handleStepChange(step.id, 'title', e.target.value)}
                        required
                      />
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          className="input input-bordered w-32"
                          placeholder="Durée"
                          value={step.duration}
                          onChange={e => handleStepChange(step.id, 'duration', parseInt(e.target.value))}
                          min="5"
                          step="5"
                          required
                        />
                        <span>minutes</span>
                      </div>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Description détaillée"
                        value={step.description}
                        onChange={e => handleStepChange(step.id, 'description', e.target.value)}
                        required
                      />
                      {/* Optional fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Ressources</label>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Séparées par des virgules"
                            value={step.resources?.join(', ') || ''}
                            onChange={e => handleStepChange(
                              step.id,
                              'resources',
                              e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            )}
                          />
                        </div>
                        <div>
                          <label className="label">Mode de travail</label>
                          <select
                            className="select select-bordered w-full"
                            value={step.grouping || ''}
                            onChange={e => handleStepChange(step.id, 'grouping', e.target.value)}
                          >
                            <option value="">Non spécifié</option>
                            <option value="individual">Individuel</option>
                            <option value="pairs">En binôme</option>
                            <option value="small_groups">Petits groupes</option>
                            <option value="whole_class">Classe entière</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prérequis (séparés par des virgules)</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.prerequisites?.join(', ') || ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    prerequisites: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }))}
                />
              </div>
              <div>
                <label className="label">Différenciation</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={formData.differentiation || ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    differentiation: e.target.value
                  }))}
                />
              </div>
            </div>

            {/* Evaluation */}
            <div>
              <h3 className="text-lg font-medium mb-4">Évaluation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Type d'évaluation</label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.evaluation?.type || ''}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      evaluation: {
                        ...prev.evaluation,
                        type: e.target.value as 'formative' | 'summative'
                      }
                    }))}
                  >
                    <option value="">Non spécifié</option>
                    <option value="formative">Formative</option>
                    <option value="summative">Sommative</option>
                  </select>
                </div>
                <div>
                  <label className="label">Méthode d'évaluation</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.evaluation?.method || ''}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      evaluation: {
                        ...prev.evaluation,
                        method: e.target.value
                      }
                    }))}
                  />
                </div>
                <div className="col-span-2">
                  <label className="label">Critères d'évaluation (séparés par des virgules)</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.evaluation?.criteria?.join(', ') || ''}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      evaluation: {
                        ...prev.evaluation,
                        criteria: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-end space-x-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalEntryModal;
