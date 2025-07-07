import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Trash, FileDown, CheckCircle, Clock, Plus, ArrowRight, BarChart2, Trash2 } from 'lucide-react';
import { JournalEntry, JournalObjective, JournalStep } from '../../../types/journal';
import RichTextEditor from '../../common/RichTextEditor';
import { generateEntryPDF } from '../../../utils/pdfExport';
import { setupAutoSave, getAutoSavedEntry, clearAutoSave } from '../../../utils/autoSave';

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
  const [formData, setFormData] = useState<Partial<JournalEntry> & {
    description?: string;
    materials?: string;
    notes?: string;
    startTime?: string;
    endTime?: string;
  }>({
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
  const [autoSaveStatus, setAutoSaveStatus] = useState<{
    lastSaved: string | null;
    saving: boolean;
  }>({ lastSaved: null, saving: false });
  
  // Référence pour l'intervalle de sauvegarde automatique
  const autoSaveRef = useRef<(() => void) | null>(null);

  // Effet pour initialiser le formulaire et gérer la sauvegarde automatique
  useEffect(() => {
    // Vérifier s'il y a une sauvegarde automatique quand on crée une nouvelle entrée
    if (!entry) {
      const autoSaved = getAutoSavedEntry();
      if (autoSaved) {
        // Proposer de restaurer la sauvegarde automatique
        const confirmRestore = window.confirm('Une sauvegarde automatique a été trouvée. Voulez-vous la restaurer ?');
        if (confirmRestore) {
          setFormData({
            ...autoSaved,
            id: `JRN-${new Date().getTime()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          if (autoSaved.lastAutoSave) {
            setAutoSaveStatus({
              lastSaved: autoSaved.lastAutoSave,
              saving: false
            });
          }
        } else {
          // Si l'utilisateur ne veut pas restaurer, on efface la sauvegarde
          clearAutoSave();
          initializeNewEntry();
        }
      } else {
        initializeNewEntry();
      }
    } else {
      setFormData(entry);
    }
  }, [entry]);
  
  // Effet séparé pour la sauvegarde automatique qui dépend de formData
  useEffect(() => {
    // Configurer la sauvegarde automatique
    autoSaveRef.current = setupAutoSave(() => {
      setAutoSaveStatus(currentStatus => ({ ...currentStatus, saving: true }));
      setTimeout(() => {
        setAutoSaveStatus({
          saving: false,
          lastSaved: new Date().toISOString()
        });
      }, 500);
      return formData;
    });
    
    // Nettoyage à la fermeture du composant
    return () => {
      if (autoSaveRef.current) {
        autoSaveRef.current();
      }
    };
  }, [formData]);
  
  // Fonction pour initialiser une nouvelle entrée
  const initializeNewEntry = () => {
    setFormData({
      id: `JRN-${new Date().getTime()}`,
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
      offline: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preparationStatus: 'not_started'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRichTextChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const addObjective = () => {
    if (!newObjective.trim()) return;
    
    const objective: JournalObjective = {
      id: `OBJ-${new Date().getTime()}`,
      title: newObjective,
      description: '',
      competencies: []
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
      title: newStep,
      description: '',
      duration: 10
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
    
    // Calculer le taux de complétion et le statut de préparation
    const updatedFormData = { ...formData };
    
    // Vérifier si la séance est suffisamment préparée
    const hasTitle = !!updatedFormData.title?.trim();
    const hasClass = !!updatedFormData.class?.trim();
    const hasSubject = !!updatedFormData.subject?.trim();
    const hasDate = !!updatedFormData.date?.trim();
    const hasObjectives = updatedFormData.objectives && updatedFormData.objectives.length > 0;
    const hasSteps = updatedFormData.steps && updatedFormData.steps.length > 0;
    
    // Calculer le statut de préparation
    let preparationStatus: 'not_started' | 'in_progress' | 'ready' = 'not_started';
    if (hasTitle && hasClass && hasSubject && hasDate) {
      preparationStatus = hasObjectives && hasSteps ? 'ready' : 'in_progress';
    }
    
    // Calculer le taux de complétion (basé sur les champs obligatoires remplis)
    const requiredFields = [hasTitle, hasClass, hasSubject, hasDate, hasObjectives, hasSteps];
    const completedFields = requiredFields.filter(Boolean).length;
    const completionRate = Math.round((completedFields / requiredFields.length) * 100);
    
    // Définir si une alerte doit être affichée
    const preparationAlert = preparationStatus !== 'ready' && updatedFormData.date && 
      new Date(updatedFormData.date) <= new Date(new Date().setDate(new Date().getDate() + 2)); // Alerte si dans moins de 2 jours
    
    updatedFormData.preparationStatus = preparationStatus;
    updatedFormData.completionRate = completionRate;
    updatedFormData.preparationAlert = preparationAlert;
    updatedFormData.updatedAt = new Date().toISOString();
    
    // Effacer la sauvegarde automatique après l'enregistrement
    clearAutoSave();
    
    onSave(updatedFormData as JournalEntry);
  };

  const handleExportPDF = () => {
    if (formData.id) {
      generateEntryPDF(formData as JournalEntry);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {entry ? 'Modifier la séance' : 'Nouvelle séance'}
        </h2>
        <div className="flex items-center gap-4">
          {/* Indicateur de sauvegarde automatique */}
          <div className="text-sm flex items-center">
            {autoSaveStatus.saving ? (
              <span className="text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1 animate-pulse" />
                Sauvegarde en cours...
              </span>
            ) : autoSaveStatus.lastSaved ? (
              <span className="text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Sauvegardé à {new Date(autoSaveStatus.lastSaved).toLocaleTimeString()}
              </span>
            ) : null}
          </div>
          <button 
            className="btn btn-ghost"
            onClick={onCancel}
            title="Annuler et fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" title="Titre de la séance">Titre</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Titre de la séance"
                title="Titre de la séance"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" title="Classe concernée">Classe</label>
                <select
                  name="class"
                  value={formData.class || ''}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  title="Sélectionner une classe"
                  required
                >
                  <option value="">Sélectionner</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" title="Matière de la séance">Matière</label>
                <select
                  name="subject"
                  value={formData.subject || ''}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  title="Sélectionner une matière"
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
                <label className="block text-sm font-medium mb-1" title="Date de la séance">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  title="Date de la séance"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" title="Heure de début de la séance">Début</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime || ''}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  title="Heure de début de la séance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" title="Durée de la séance (en minutes)">Durée (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration || 60}
                  onChange={handleNumberChange}
                  min="5"
                  step="5"
                  className="input input-bordered w-full"
                  title="Durée de la séance (en minutes)"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" title="Description de la séance">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-24"
                title="Description de la séance"
                placeholder="Description de la séance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" title="Matériel nécessaire pour la séance">Matériel</label>
              <RichTextEditor
                value={formData.materials || ''}
                onChange={handleRichTextChange('materials')}
                placeholder="Liste du matériel nécessaire"
                height="150px"
                title="Matériel nécessaire pour la séance"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium" title="Objectifs de la séance">Objectifs</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    className="input input-bordered input-sm mr-2"
                    placeholder="Nouvel objectif"
                    title="Nouvel objectif"
                  />
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm"
                    onClick={addObjective}
                    title="Ajouter un nouvel objectif"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Ajouter
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                {formData.objectives?.map((obj) => (
                  <div key={obj.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>{obj.title}</span>
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-xs"
                      onClick={() => removeObjective(obj.id)}
                      title="Supprimer cet objectif"
                    >
                      <Trash2 className="w-3 h-3" />
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
                <label className="block text-sm font-medium" title="Étapes de la séance">Étapes</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    className="input input-bordered input-sm mr-2"
                    placeholder="Nouvelle étape"
                    title="Nouvelle étape"
                  />
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm"
                    onClick={addStep}
                    title="Ajouter une nouvelle étape"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Ajouter
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                {formData.steps?.map((step) => (
                  <div key={step.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>{step.title}</span>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">{step.duration} min</span>
                      <button 
                        type="button" 
                        className="btn btn-ghost btn-xs"
                        onClick={() => removeStep(step.id)}
                        title="Supprimer cette étape"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!formData.steps || formData.steps.length === 0) && (
                  <p className="text-sm text-gray-500 italic text-center py-2">Aucune étape définie</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" title="Notes et observations">Notes</label>
              <RichTextEditor
                value={formData.notes || ''}
                onChange={handleRichTextChange('notes')}
                placeholder="Notes et observations"
                height="150px"
                title="Notes et observations"
              />
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                name="offline"
                checked={!!formData.offline}
                onChange={handleCheckboxChange}
                className="checkbox mr-2"
                id="offline-checkbox"
                title="Séance hors ligne"
              />
              <label htmlFor="offline-checkbox" className="text-sm" title="Séance hors ligne">
                Séance hors ligne (non comptabilisée dans le suivi)
              </label>
            </div>

            {/* Section de comparaison prévu/réalisé (visible uniquement en mode édition) */}
            {entry && entry.status === 'completed' && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <h3 className="text-md font-medium mb-2 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Comparaison prévu/réalisé
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Taux de complétion:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${formData.completionRate || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{formData.completionRate || 0}% des objectifs atteints</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div>
            {onDelete && entry && (
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                className="btn btn-error btn-sm"
                title="Supprimer cette séance"
              >
                <Trash className="w-4 h-4 mr-1" /> Supprimer
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {entry && (
              <button
                type="button"
                onClick={handleExportPDF}
                className="btn btn-outline btn-sm"
                title="Exporter en PDF"
              >
                <FileDown className="w-4 h-4 mr-1" /> Exporter
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost btn-sm"
              title="Annuler les modifications"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              title="Enregistrer la séance"
            >
              <Save className="w-4 h-4 mr-1" /> Enregistrer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CahierJournalForm;
