import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Fiche, Competency } from '../../../types';
import { useTemplateService } from '../../../services/templateService';
import { useCompetencyService } from '../../../services/competencyService';

interface FicheWizardProps {
  step: number;
  data: Fiche;
  onNext: (data: Partial<Fiche>) => void;
}

const schema = yup.object().shape({
  title: yup.string().required('Le titre est requis'),
  subject: yup.string().required('La matière est requise'),
  level: yup.string().required('Le niveau est requis'),
  duration: yup
    .number()
    .required('La durée est requise')
    .min(5, 'Minimum 5 minutes')
    .max(240, 'Maximum 240 minutes'),
  objectives: yup.array().of(
    yup.object().shape({
      description: yup.string().required('L\'objectif est requis')
    })
  ).min(1, 'Au moins un objectif est requis'),
});

const FicheWizard: React.FC<FicheWizardProps> = ({ step, data, onNext }) => {
  const { getTemplates } = useTemplateService();
  const { getCompetencies } = useCompetencyService();
  const [templates, setTemplates] = useState([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  
  const { register, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: data,
  });

  // Charger les templates et compétences au montage
  useEffect(() => {
    const loadTemplates = async () => {
      const templates = await getTemplates();
      setTemplates(templates);
    };
    
    const loadCompetencies = async () => {
      const competencies = await getCompetencies(data.subject, data.level);
      setCompetencies(competencies);
    };

    loadTemplates();
    loadCompetencies();
  }, [data.subject, data.level]);

  // Suggestions automatiques basées sur matière/niveau
  const suggestObjectives = () => {
    if (data.subject && data.level) {
      // Logique de suggestion basée sur matière et niveau
      // À implémenter avec une IA ou règles métier
      const suggested = competencies
        .filter(c => c.subject === data.subject && c.level === data.level)
        .map(c => ({ description: c.description }));
      setValue('objectives', suggested);
    }
  };

  // Gestion de la sélection de template
  const handleTemplateSelect = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setValue('title', template.title);
      setValue('objectives', template.objectives);
      setValue('duration', template.duration);
    }
  };

  // Soumission de l'étape
  const onSubmit = handleSubmit((data) => {
    onNext({
      title: data.title,
      subject: data.subject,
      level: data.level,
      duration: data.duration,
      objectives: data.objectives,
      competencies: selectedCompetencies,
    });
  });

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modèle de fiche
        </label>
        <select
          {...register('templateId')}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Sélectionner un modèle</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.title}
            </option>
          ))}
        </select>
      </div>

      {/* Basic Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre de la fiche
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Matière
          </label>
          <select
            {...register('subject')}
            onChange={(e) => {
              setValue('subject', e.target.value);
              suggestObjectives();
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Sélectionner une matière</option>
            <option value="mathematiques">Mathématiques</option>
            <option value="francais">Français</option>
            <option value="histoire">Histoire</option>
            <option value="geographie">Géographie</option>
            <option value="sciences">Sciences</option>
            <option value="anglais">Anglais</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau
          </label>
          <select
            {...register('level')}
            onChange={(e) => {
              setValue('level', e.target.value);
              suggestObjectives();
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Sélectionner un niveau</option>
            <option value="CP">CP</option>
            <option value="CE1">CE1</option>
            <option value="CE2">CE2</option>
            <option value="CM1">CM1</option>
            <option value="CM2">CM2</option>
            <option value="6e">6ème</option>
            <option value="5e">5ème</option>
            <option value="4e">4ème</option>
            <option value="3e">3ème</option>
          </select>
        </div>
      </div>

      {/* Objectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Objectifs d'apprentissage
        </label>
        <div className="space-y-4">
          {data.objectives.map((objective, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                {...register(`objectives.${index}.description`)}
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder={`Objectif ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => {
                  setValue('objectives', data.objectives.filter((_, i) => i !== index));
                }}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setValue('objectives', [...data.objectives, { description: '' }]);
            }}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            Ajouter un objectif
          </button>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Durée (minutes)
        </label>
        <input
          type="number"
          {...register('duration')}
          min="5"
          max="240"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      {/* Competencies Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Compétences liées
        </label>
        <div className="space-y-2">
          {competencies.map((competency) => (
            <div key={competency.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCompetencies.includes(competency.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCompetencies([...selectedCompetencies, competency.id]);
                  } else {
                    setSelectedCompetencies(selectedCompetencies.filter(id => id !== competency.id));
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                id={`competency-${competency.id}`}
                aria-labelledby={`competency-${competency.id}-label`}
                aria-checked={selectedCompetencies.includes(competency.id)}
              />
              <label htmlFor={`competency-${competency.id}`} id={`competency-${competency.id}-label`} className="ml-2">{competency.description}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          aria-label="Passer à l'étape suivante de la création de la fiche pédagogique"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default FicheWizard;
