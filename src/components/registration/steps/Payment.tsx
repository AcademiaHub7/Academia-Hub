import React from 'react';
import { RegistrationSession } from '../../../types';

interface PaymentProps {
  sessionData: RegistrationSession | null;
  updateSessionData: (updates: Partial<RegistrationSession>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Payment: React.FC<PaymentProps> = ({ 
  // sessionData et updateSessionData seront utilisés pour la gestion des données de paiement
  // validationErrors et setValidationErrors seront utilisés pour la validation du formulaire
  goToNextStep, 
  goToPreviousStep
}) => {
  return (
    <div className="payment-step">
      <h2>Paiement Sécurisé</h2>
      <p>Effectuez votre paiement en toute sécurité pour activer votre abonnement.</p>
      
      {/* Formulaire de paiement à implémenter */}
      <div className="payment-form">
        <p>Interface de paiement à intégrer</p>
        
        <div className="form-actions">
          <button 
            onClick={goToPreviousStep} 
            className="btn btn-outline-secondary"
          >
            Retour
          </button>
          <button 
            onClick={goToNextStep} 
            className="btn btn-primary"
          >
            Confirmer le paiement
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
