import React, { useState, useEffect } from 'react';
import { useRegistrationStore } from '../../stores/registrationStore';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { OrganizationInfoStep } from './steps/OrganizationInfoStep';
import { PlanSelectionStep } from './steps/PlanSelectionStep';
import { PaymentStep } from './steps/PaymentStep';
import { ReviewStep } from './steps/ReviewStep';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

const steps = [
  { id: 'personal_info', title: 'Informations Personnelles', description: 'Vos coordonnées' },
  { id: 'organization_info', title: 'Informations Organisation', description: 'Détails du patronat' },
  { id: 'plan_selection', title: 'Choix du Plan', description: 'Sélection abonnement' },
  { id: 'payment_pending', title: 'Paiement', description: 'Règlement sécurisé' },
  { id: 'under_review', title: 'Validation', description: 'Examen du dossier' },
];

export const RegistrationWizard: React.FC = () => {
  const { currentRegistration, isLoading } = useRegistrationStore();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentRegistration) {
      const stepIndex = steps.findIndex(step => step.id === currentRegistration.status);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }
    }
  }, [currentRegistration]);

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return isLoading ? (
        <Clock className="w-6 h-6 text-blue-500 animate-spin" />
      ) : (
        <Circle className="w-6 h-6 text-blue-500 fill-current" />
      );
    } else {
      return <Circle className="w-6 h-6 text-gray-300" />;
    }
  };

  const renderCurrentStep = () => {
    if (!currentRegistration) {
      return <PersonalInfoStep />;
    }

    switch (currentRegistration.status) {
      case 'organization_info':
        return <OrganizationInfoStep />;
      case 'plan_selection':
        return <PlanSelectionStep />;
      case 'payment_pending':
        return <PaymentStep />;
      case 'under_review':
        return <ReviewStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-color rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">EM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-color">
                  EducMaster Academia Hub
                </h1>
                <p className="text-sm text-gray-600">Inscription Patronat Régional</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div className="flex flex-col items-center">
                    {getStepIcon(index)}
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${
                        index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {renderCurrentStep()}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Besoin d'aide ?
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Notre équipe support est disponible pour vous accompagner dans votre inscription.
              </p>
              <div className="mt-3 flex space-x-4">
                <a href="tel:+22921234567" className="text-sm text-blue-600 hover:text-blue-800">
                  📞 +229 21 23 45 67
                </a>
                <a href="mailto:support@educmaster-hub.com" className="text-sm text-blue-600 hover:text-blue-800">
                  ✉️ support@educmaster-hub.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};