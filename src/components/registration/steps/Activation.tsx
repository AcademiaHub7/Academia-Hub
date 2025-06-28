import React from 'react';
import { RegistrationSession } from '../../../types';

interface ActivationProps {
  sessionData: RegistrationSession | null;
  updateSessionData: (updates: Partial<RegistrationSession>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Activation: React.FC<ActivationProps> = ({ 
  // sessionData et updateSessionData seront utilisés pour la gestion des données d'activation
  // validationErrors et setValidationErrors seront utilisés pour la validation
  // goToPreviousStep pourrait être utilisé pour revenir à l'étape précédente
  goToNextStep
}) => {
  return (
    <div className="activation-step">
      <h2>Activation de votre compte</h2>
      <p>Votre compte est en cours d'activation. Veuillez patienter pendant que nous finalisons la configuration.</p>
      
      <div className="activation-status">
        <div className="status-item completed">
          <div className="status-icon">✓</div>
          <div className="status-text">
            <h4>Vérification des informations</h4>
            <p>Vos informations ont été vérifiées avec succès.</p>
          </div>
        </div>
        
        <div className="status-item completed">
          <div className="status-icon">✓</div>
          <div className="status-text">
            <h4>Paiement confirmé</h4>
            <p>Votre paiement a été traité et confirmé.</p>
          </div>
        </div>
        
        <div className="status-item in-progress">
          <div className="status-icon">⟳</div>
          <div className="status-text">
            <h4>Configuration de l'espace</h4>
            <p>Nous configurons votre espace Academia Hub.</p>
          </div>
        </div>
        
        <div className="status-item pending">
          <div className="status-icon">⏱</div>
          <div className="status-text">
            <h4>Finalisation</h4>
            <p>Dernières étapes avant l'accès complet.</p>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          onClick={goToNextStep} 
          className="btn btn-primary"
        >
          Continuer vers l'onboarding
        </button>
      </div>
    </div>
  );
};

export default Activation;
