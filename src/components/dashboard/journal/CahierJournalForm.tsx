import React, { useState, useEffect } from 'react';
import { X, Save, Trash } from 'lucide-react';
import { JournalEntry, JournalObjective, JournalStep } from '../../../types/journal';

interface CahierJournalFormProps {
  entry?: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  classes: string[];
  subjects: string[];
}

const CahierJournalForm: React.FC<CahierJournalFormProps> = ({
  entry,
  onSave,
  onCancel,
  onDelete,
  classes,
  subjects
}) => {
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    id: '',
    title: '',
    description: '',
    class: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    status: 'planned',
    objectives: [],
    steps: [],
    materials: '',
    notes: '',
    offline: false
  });

  const [newObjective, setNewObjective] = useState('');
  const [newStep, setNewStep] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    } else {
      // Generate a new ID for new entries
      setFormData(prev => ({
        ...prev,
        id: `JRN-${new Date().getTime()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }
  }, [entry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const addObjective = () => {
    if (!newObjective.trim()) return;
    
    const objective: JournalObjective = {
      id: `OBJ-${new Date().getTime()}`,
      description: newObjective,
      completed: false
    };
    
    setFormData(prev => ({
      ...prev,
      objectives: [...(prev.objectives || []), objective]
    }));
    
    setNewObjective('');
  };

  const removeObjective = (id: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives?.filter(obj => obj.id !== id) || []
    }));
  };

  const addStep = () => {
    if (!newStep.trim()) return;
    
    const step: JournalStep = {
      id: `STEP-${new Date().getTime()}`,
      description: newStep,
      duration: 10,
      completed: false
    };
    
    setFormData(prev => ({
      ...prev,
      steps: [...(prev.steps || []), step]
    }));
    
    setNewStep('');
  };

  const removeStep = (id: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps?.filter(step => step.id !== id) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as JournalEntry);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {entry ? 'Modifier la séance' : 'Nouvelle séance'}
        </h2>
        <button 
          className="btn btn-ghost"
          onClick={onCancel}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Classe</label>
                <select
                  name="class"
                  value={formData.class || ''}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Sélectionner</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Matière</label>
                <select
                  name="subject"
                  value={formData.subject || ''}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Sélectionner</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Début</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime || ''}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Durée (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration || 60}
                  onChange={handleNumberChange}
                  min="5"
                  step="5"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="textarea textarea-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Matériel nécessaire</label>
              <textarea
                name="materials"
                value={formData.materials || ''}
                onChange={handleChange}
                rows={2}
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Objectifs</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    className="input input-bordered input-sm mr-2"
                    placeholder="Nouvel objectif"
                  />
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary"
                    onClick={addObjective}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                {formData.objectives?.map(obj => (
                  <div key={obj.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>{obj.description}</span>
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-xs text-red-500"
                      onClick={() => removeObjective(obj.id)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!formData.objectives || formData.objectives.length === 0) && (
                  <p className="text-sm text-gray-500 italic text-center py-2">Aucun objectif défini</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Étapes de la séance</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    className="input input-bordered input-sm mr-2"
                    placeholder="Nouvelle étape"
                  />
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary"
                    onClick={addStep}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                {formData.steps?.map(step => (
                  <div key={step.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>{step.description}</span>
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-xs text-red-500"
                      onClick={() => removeStep(step.id)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!formData.steps || formData.steps.length === 0) && (
                  <p className="text-sm text-gray-500 italic text-center py-2">Aucune étape définie</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={4}
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          {entry && onDelete && (
            <button 
              type="button" 
              className="btn btn-outline btn-error"
              onClick={() => onDelete(entry.id)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Supprimer
            </button>
          )}
          <div className="ml-auto space-x-2">
            <button 
              type="button" 
              className="btn btn-ghost"
              onClick={onCancel}
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
        </div>
      </form>
    </div>
  );
};

export default CahierJournalForm;
