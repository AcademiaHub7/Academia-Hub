import React, { useState } from 'react';
import { FileText, User, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface ValidationStep {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  date?: string;
  comments?: string[];
}

interface ValidationWorkflowProps {
  fiche: any;
  onUpdateStep: (step: ValidationStep) => void;
  onSendNotification: (recipient: string, message: string) => void;
}

const ValidationWorkflow: React.FC<ValidationWorkflowProps> = ({
  fiche,
  onUpdateStep,
  onSendNotification
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ValidationStep | null>(null);

  // Étapes du workflow
  const steps: ValidationStep[] = [
    {
      id: 'creation',
      title: 'Création par l'enseignant',
      status: 'completed',
      date: fiche.dateCreation
    },
    {
      id: 'soumission',
      title: 'Soumission pour visa',
      status: 'completed',
      date: fiche.dateSoumission
    },
    {
      id: 'validation_directeur',
      title: 'Validation directeur',
      status: 'in_progress',
      comments: []
    },
    {
      id: 'revision',
      title: 'Révision enseignant',
      status: 'pending',
      comments: []
    },
    {
      id: 'validation_finale',
      title: 'Validation finale',
      status: 'pending',
      comments: []
    }
  ];

  // Statuts de validation
  const validationStatus = {
    pending: {
      color: 'gray',
      label: 'En attente'
    },
    in_progress: {
      color: 'yellow',
      label: 'En cours'
    },
    completed: {
      color: 'green',
      label: 'Terminé'
    },
    rejected: {
      color: 'red',
      label: 'Rejeté'
    }
  };

  // Gestion des commentaires
  const handleAddComment = (stepId: string, comment: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      const updatedStep = {
        ...steps[stepIndex],
        comments: [...(steps[stepIndex].comments || []), comment]
      };
      onUpdateStep(updatedStep);
    }
  };

  // Gestion des notifications
  const handleSendNotification = (step: ValidationStep) => {
    const nextStep = steps[steps.indexOf(step) + 1];
    if (nextStep) {
      onSendNotification(
        nextStep.id === 'revision' ? fiche.auteur : 'Directeur',
        `La fiche "${fiche.titre}" est prête pour la ${nextStep.title.toLowerCase()}`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-1/2 w-px h-full bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      validationStatus[step.status].color === 'green'
                        ? 'bg-green-500'
                        : validationStatus[step.status].color === 'red'
                        ? 'bg-red-500'
                        : validationStatus[step.status].color === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {step.date ? new Date(step.date).toLocaleDateString('fr-FR') : 'En attente'}
                    </p>
                  </div>
                </div>
                {step.comments?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {step.comments.map((comment, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className="w-8">
                  <div className="h-full w-px bg-gray-200 dark:bg-gray-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => {
            const currentStep = steps[currentStep];
            onUpdateStep({
              ...currentStep,
              status: 'completed'
            });
            handleSendNotification(currentStep);
            setCurrentStep(currentStep + 1);
          }}
          className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Valider l'étape
        </button>
        <button
          onClick={() => {
            const currentStep = steps[currentStep];
            onUpdateStep({
              ...currentStep,
              status: 'rejected'
            });
            handleSendNotification(currentStep);
          }}
          className="inline-flex items-center px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Rejeter l'étape
        </button>
      </div>

      {/* Modal de commentaire */}
      {showCommentModal && selectedStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Ajouter un commentaire
              </h2>
              <button
                onClick={() => setShowCommentModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Commentaire
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 h-32"
                    placeholder="Votre commentaire..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowCommentModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // Logique d'ajout du commentaire
                      setShowCommentModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationWorkflow;
