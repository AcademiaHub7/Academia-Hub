import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Plus, Save, FileText } from 'lucide-react';
import { useFicheContext } from '../context/FicheContext';
import { Fiche, SUBJECTS, CLASS_LEVELS, Template } from '../types';
import { FicheTemplateSelector } from './FicheTemplateSelector';

// Validation schema
const schema = yup.object().shape({
  title: yup.string().required('Le titre est requis'),
  subject: yup.string().required('La matière est requise'),
  level: yup.string().required('Le niveau est requis'),
  duration: yup.number().required('La durée est requise').min(1, 'La durée doit être supérieure à 0'),
  templateId: yup.string().optional(),
  templateName: yup.string().optional(),
  description: yup.string().optional(),
  date: yup.date().nullable().required('La date est requise'),
  objectives: yup.array().of(
    yup.object().shape({
      id: yup.string().required(),
      description: yup.string().required('La description est requise'),
    })
  ).min(1, 'Au moins un objectif est requis'),
  resources: yup.array().of(
    yup.object().shape({
      id: yup.string().required(),
      type: yup.string().required('Le type est requis'),
      description: yup.string().required('La description est requise'),
    })
  ),
  methodology: yup.string().optional(),
  evaluation: yup.string().optional(),
  differentiation: yup.string().optional(),
  status: yup.string().optional(),
  class: yup.string().optional(),
  content: yup.string().optional(),
});

interface FicheFormProps {
  ficheId?: string;
  onCancel: () => void;
  onSave: () => void;
  isEditing?: boolean;
}

type FormData = yup.InferType<typeof schema>;

const FicheForm: React.FC<FicheFormProps> = ({ ficheId, onCancel, onSave, isEditing = false }) => {
  const { selectedFiche, createFiche, updateFiche, getFicheById } = useFicheContext();
  
  // Form handling with react-hook-form
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    control,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      subject: '',
      class: '',
      level: '',
      duration: 55,
      date: new Date(),
      description: '',
      objectives: [{ id: crypto.randomUUID(), description: '' }],
      content: '',
      resources: [{ id: crypto.randomUUID(), type: '', description: '' }],
      status: 'draft',
      templateId: '',
      templateName: '',
    },
  });

  // Gestion des tableaux d'objectifs et de ressources
  const { 
    fields: objectiveFields, 
    append: appendObjective, 
    remove: removeObjective 
  } = useFieldArray({
    control,
    name: 'objectives',
  });

  const { 
    fields: resourceFields, 
    append: appendResource, 
    remove: removeResource 
  } = useFieldArray({
    control,
    name: 'resources',
  });
  
  // Watch template name for UI updates
  const templateName = watch('templateName');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Ajouter un nouvel objectif
  const handleAddObjective = () => {
    appendObjective({ id: crypto.randomUUID(), description: '' });
  };
  
  // Ajouter une nouvelle ressource
  const handleAddResource = () => {
    appendResource({ id: crypto.randomUUID(), type: '', description: '' });
  };
  
  // Gérer le changement de date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('date', e.target.value ? new Date(e.target.value) : null);
  };

  // Charger les données de la fiche si on est en mode édition
  useEffect(() => {
    if (isEditing && ficheId) {
      const loadFiche = async () => {
        try {
          await getFicheById(ficheId);
        } catch (err) {
          setError('Erreur lors du chargement de la fiche');
          console.error('Erreur lors du chargement de la fiche:', err);
        }
      };
      loadFiche();
    }
  }, [isEditing, ficheId, getFicheById]);

  // Mettre à jour le formulaire quand la fiche sélectionnée change
  useEffect(() => {
    if (selectedFiche && isEditing) {
      reset({
        ...selectedFiche,
        date: selectedFiche.date ? new Date(selectedFiche.date) : new Date(),
        objectives: selectedFiche.objectives?.length 
          ? selectedFiche.objectives 
          : [{ id: crypto.randomUUID(), description: '' }],
        resources: selectedFiche.resources?.length 
          ? selectedFiche.resources 
          : [{ id: crypto.randomUUID(), type: '', description: '' }],
      });
    }
  }, [selectedFiche, isEditing, reset]);

  // Soumission du formulaire
  const onSubmit = async (data: FormData) => {
    setError(null);
    setSuccess(null);

    try {
      // Filtrer les objectifs et ressources vides
      const objectives = data.objectives?.filter(obj => obj.description.trim() !== '') || [];
      const resources = data.resources?.filter(res => 
        res.description.trim() !== '' && res.type.trim() !== ''
      ) || [];

      const dataToSave = {
        ...data,
        objectives,
        resources,
        updatedAt: new Date().toISOString(),
        ...(!isEditing && { createdAt: new Date().toISOString() }),
      };

      if (isEditing && ficheId) {
        // Mode édition
        await updateFiche(ficheId, dataToSave);
        setSuccess('Fiche mise à jour avec succès');
      } else {
        // Mode création
        await createFiche(dataToSave as Omit<Fiche, 'id' | 'createdAt' | 'updatedAt'>);
        setSuccess('Fiche créée avec succès');
        
        // Réinitialiser le formulaire après création
        reset({
          title: '',
          subject: '',
          class: '',
          level: '',
          duration: 55,
          date: new Date(),
          description: '',
          objectives: [{ id: crypto.randomUUID(), description: '' }],
          content: '',
          resources: [{ id: crypto.randomUUID(), type: '', description: '' }],
          status: 'draft',
          templateId: '',
          templateName: '',
        });
      }

      // Notifier le parent que la sauvegarde est terminée
      onSave();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      console.error('Erreur lors de la sauvegarde de la fiche:', err);
    }
  };

  // Gestion de la sélection d'un template
  const handleTemplateSelect = (template: Template) => {
    setValue('templateId', template.id);
    setValue('templateName', template.name);
    setValue('subject', template.subject || '');
    setValue('title', `Nouvelle fiche - ${template.name}`);
    
    // Définir les valeurs par défaut à partir du template
    if (template.header) {
      if (template.header.objectives?.length) {
        setValue('objectives', 
          template.header.objectives.map(obj => ({
            id: crypto.randomUUID(),
            description: typeof obj === 'string' ? obj : obj.description || ''
          }))
        );
      }
      
      if (template.header.duration) {
        setValue('duration', template.header.duration);
      }
      
      if (template.header.level) {
        setValue('level', template.header.level);
      }
    }
    
    // Définir le contenu si disponible
    if (template.content) {
      setValue('content', template.content);
    }
    
    // Afficher un message de succès
    setSuccess(`Le modèle "${template.name}" a été appliqué avec succès`);
  };
  
  // Gérer la soumission du formulaire
  const onSubmitForm = handleSubmit(async (data) => {
    setError(null);
    setSuccess(null);

    try {
      // Filtrer les objectifs et ressources vides
      const objectives = data.objectives?.filter(obj => obj.description.trim() !== '') || [];
      const resources = data.resources?.filter(res => 
        res.description.trim() !== '' && res.type.trim() !== ''
      ) || [];

      const dataToSave = {
        ...data,
        objectives,
        resources,
        updatedAt: new Date().toISOString(),
        ...(!isEditing && { createdAt: new Date().toISOString() }),
      };

      if (isEditing && ficheId) {
        // Mode édition
        await updateFiche(ficheId, dataToSave as Fiche);
        setSuccess('Fiche mise à jour avec succès');
      } else {
        // Mode création
        await createFiche(dataToSave as Omit<Fiche, 'id' | 'createdAt' | 'updatedAt'>);
        setSuccess('Fiche créée avec succès');
        
        // Réinitialiser le formulaire après création
        reset({
          title: '',
          subject: '',
          class: '',
          level: '',
          duration: 55,
          date: new Date(),
          description: '',
          objectives: [{ id: crypto.randomUUID(), description: '' }],
          content: '',
          resources: [{ id: crypto.randomUUID(), type: '', description: '' }],
          status: 'draft',
          templateId: '',
          templateName: '',
        });
      }

      // Notifier le parent que la sauvegarde est terminée
      onSave();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      console.error('Erreur lors de la sauvegarde de la fiche:', err);
    }
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Modifier la fiche' : 'Nouvelle fiche pédagogique'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
            title="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Template Selection */}
      {!isEditing && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Modèle de fiche</h3>
            <FicheTemplateSelector 
              onSelectTemplate={handleTemplateSelect}
              className="max-w-2xl"
            />
          </div>
          
          {watch('templateName') && (
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2 text-primary-600" />
              <span>Modèle sélectionné : </span>
              <span className="font-medium ml-1">{watch('templateName')}</span>
              <button
                type="button"
                onClick={() => {
                  setValue('templateId', '');
                  setValue('templateName', '');
                }}
                className="ml-2 text-gray-400 hover:text-gray-600"
                title="Supprimer le modèle"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

      <form onSubmit={onSubmitForm} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titre de la fiche <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ex: Les fractions en 6ème"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Subject and Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Matière <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              {...register('subject')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Sélectionnez une matière</option>
              <option value="mathematiques">Mathématiques</option>
              <option value="francais">Français</option>
              <option value="histoire">Histoire</option>
              <option value="geographie">Géographie</option>
              <option value="sciences">Sciences</option>
              <option value="anglais">Anglais</option>
              <option value="eps">EPS</option>
              <option value="arts">Arts plastiques</option>
              <option value="musique">Éducation musicale</option>
            </select>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Niveau <span className="text-red-500">*</span>
            </label>
            <select
              id="level"
              {...register('level')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Sélectionnez un niveau</option>
              <option value="CP">CP</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="CM1">CM1</option>
              <option value="CM2">CM2</option>
              <option value="6e">6ème</option>
              <option value="5e">5ème</option>
              <option value="4e">4ème</option>
              <option value="3e">3ème</option>
              <option value="2nde">Seconde</option>
              <option value="1ere">Première</option>
              <option value="terminale">Terminale</option>
            </select>
            {errors.level && (
              <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
            )}
          </div>
        </div>

        {/* Duration and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Durée (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="duration"
              {...register('duration', { valueAsNumber: true })}
              min="5"
              max="240"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date de la séance <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              {...register('date')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Décrivez brièvement l'objectif de cette fiche"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Objectives */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Objectifs d'apprentissage <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddObjective}
              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ajouter un objectif
            </button>
          </div>
          
          <div className="space-y-2">
            {objectiveFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  {...register(`objectives.${index}.description` as const)}
                  className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={`Objectif ${index + 1}`}
                />
                {objectiveFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Supprimer l'objectif"
                    title="Supprimer l'objectif"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            {errors.objectives && (
              <p className="mt-1 text-sm text-red-600">
                {errors.objectives.message}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Contenu détaillé <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            {...register('content')}
            rows={8}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Détaillez ici le contenu de votre séance..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Resources */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Ressources nécessaires
            </label>
            <button
              type="button"
              onClick={handleAddResource}
              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ajouter une ressource
            </button>
          </div>
          
          <div className="space-y-2">
            {resourceFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <select
                    {...register(`resources.${index}.type` as const)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Type de ressource</option>
                    <option value="document">Document</option>
                    <option value="lien">Lien web</option>
                    <option value="materiel">Matériel</option>
                    <option value="logiciel">Logiciel</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="col-span-7">
                  <input
                    type="text"
                    {...register(`resources.${index}.description` as const)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Description de la ressource"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Supprimer la ressource"
                    title="Supprimer la ressource"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Statut <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            {...register('status')}
            className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Une erreur est survenue
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : isEditing ? 'Mettre à jour' : 'Créer la fiche'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export { FicheForm };
