import React, { useState, useEffect } from 'react';
import { FileText, Clock, LayoutGrid, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { Template } from '../templates/types';

interface FicheWizardProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const FicheWizard: React.FC<FicheWizardProps> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    general: {
      titre: '',
      matiere: '',
      classe: '',
      date: new Date().toISOString(),
      duree: 0,
      template: null
    },
    planification: {
      objectifs: [],
      competences: [],
      strategies: []
    },
    deroulement: {
      phases: []
    },
    revision: {
      resultats: [],
      evaluation: '',
      remarques: ''
    }
  });

  // Sauvegarde automatique toutes les 30 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      onSave(formData);
    }, 30000);

    return () => clearInterval(timer);
  }, [formData]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSave = () => {
    if (validateStep(currentStep)) {
      onSave(formData);
      onCancel();
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.general.titre && formData.general.matiere && formData.general.classe;
      case 2:
        return formData.planification.objectifs.length > 0 && formData.planification.competences.length > 0;
      case 3:
        return formData.deroulement.phases.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-4">
      {/* Progression */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <div className="w-full h-1 bg-blue-100 dark:bg-blue-900" />
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <div className="w-full h-1 bg-blue-100 dark:bg-blue-900" />
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <div className="w-full h-1 bg-blue-100 dark:bg-blue-900" />
          <div className="w-4 h-4 rounded-full bg-blue-500" />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Étape {currentStep}/4
        </span>
      </div>

      {/* Contenu de l'étape */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <GeneralInfoForm
            data={formData.general}
            onChange={(data) => setFormData(prev => ({ ...prev, general: data }))}
          />
        )}
        {currentStep === 2 && (
          <PlanificationForm
            data={formData.planification}
            onChange={(data) => setFormData(prev => ({ ...prev, planification: data }))}
          />
        )}
        {currentStep === 3 && (
          <DeroulementForm
            data={formData.deroulement}
            onChange={(data) => setFormData(prev => ({ ...prev, deroulement: data }))}
          />
        )}
        {currentStep === 4 && (
          <RevisionForm
            data={formData.revision}
            onChange={(data) => setFormData(prev => ({ ...prev, revision: data }))}
          />
        )}
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Clock className="w-4 h-4 mr-2" />
              Précédent
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
        <div className="flex space-x-4">
          {currentStep < 4 && (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Suivant
            </button>
          )}
          {currentStep === 4 && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
            >
              <Save className="w-4 h-4 mr-2" />
              Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FicheWizard;
