import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFicheContext } from '../../context/FicheContext';
import { Fiche } from '../../types';
import FicheWizard from './wizard/FicheWizard';
import FicheEditor from './editor/FicheEditor';
import CompetenciesManager from './competencies/CompetenciesManager';
import DeroulementBuilder from './deroulement/DeroulementBuilder';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FicheAssistantProps {
  fiche?: Fiche;
  onSave: () => void;
  onCancel: () => void;
}

const FicheAssistant: React.FC<FicheAssistantProps> = ({ fiche, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { createFiche, updateFiche } = useFicheContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Fiche>({
    title: '',
    subject: '',
    level: '',
    duration: 55,
    date: new Date(),
    description: '',
    objectives: [],
    content: '',
    resources: [],
    status: 'draft',
  });
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Sauvegarde automatique toutes les 30 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      if (fiche) {
        updateFiche(fiche.id, formData).then(() => {
          toast.success('Sauvegarde automatique effectuée');
        }).catch(error => {
          toast.error('Erreur lors de la sauvegarde');
        });
      }
    }, 30000);
    
    setAutoSaveTimer(timer);
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [formData, fiche?.id, updateFiche]);

  // Gestion du changement d'étape
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  // Gestion de la validation de l'étape
  const handleStepValidation = async (stepData: Partial<Fiche>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape, sauvegarder la fiche
      try {
        if (fiche) {
          await updateFiche(fiche.id, formData);
        } else {
          await createFiche(formData);
        }
        onSave();
        toast.success('Fiche sauvegardée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la sauvegarde');
      }
    }
  };

  // Composants pour chaque étape
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FicheWizard step={1} data={formData} onNext={handleStepValidation} />;
      case 2:
        return <CompetenciesManager data={formData} onNext={handleStepValidation} />;
      case 3:
        return <DeroulementBuilder data={formData} onNext={handleStepValidation} />;
      case 4:
        return <FicheEditor data={formData} onNext={handleStepValidation} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Assistant de création de fiche</h2>
        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={() => handleStepValidation(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {currentStep < 4 ? 'Suivant' : 'Terminer'}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Étape {currentStep}/4</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default FicheAssistant;
