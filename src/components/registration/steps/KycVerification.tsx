import React from 'react';
import { RegistrationSession } from '../../../types';

interface KycVerificationProps {
  sessionData: RegistrationSession | null;
  updateSessionData: (updates: Partial<RegistrationSession>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const KycVerification: React.FC<KycVerificationProps> = ({ 
  // sessionData et updateSessionData seront utilisés pour la soumission des fichiers
  // validationErrors et setValidationErrors seront utilisés pour la validation
  goToNextStep, 
  goToPreviousStep
}) => {
  return (
    <div className="kyc-verification-step">
      <h2>Vérification KYC</h2>
      <p>Veuillez compléter la procédure de vérification d'identité pour finaliser votre inscription.</p>
      
      {/* Formulaire KYC à implémenter */}
      <div className="kyc-form">
        <div className="form-section">
          <h3>Documents d'identité</h3>
          <div className="document-upload">
            <label htmlFor="id-document">Pièce d'identité (CNI, Passeport)</label>
            <input 
              id="id-document"
              type="file" 
              className="form-control" 
              title="Télécharger votre pièce d'identité" 
              placeholder="Télécharger votre pièce d'identité" 
              aria-label="Pièce d'identité" 
            />
          </div>
          
          <div className="document-upload">
            <label htmlFor="address-proof">Justificatif d'adresse</label>
            <input 
              id="address-proof"
              type="file" 
              className="form-control" 
              title="Télécharger votre justificatif d'adresse" 
              placeholder="Télécharger votre justificatif d'adresse" 
              aria-label="Justificatif d'adresse" 
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Documents établissement</h3>
          <div className="document-upload">
            <label htmlFor="opening-authorization">Autorisation d'ouverture</label>
            <input 
              id="opening-authorization"
              type="file" 
              className="form-control" 
              title="Télécharger l'autorisation d'ouverture" 
              placeholder="Télécharger l'autorisation d'ouverture" 
              aria-label="Autorisation d'ouverture" 
            />
          </div>
          
          <div className="document-upload">
            <label htmlFor="business-registry">Registre de commerce</label>
            <input 
              id="business-registry"
              type="file" 
              className="form-control" 
              title="Télécharger le registre de commerce" 
              placeholder="Télécharger le registre de commerce" 
              aria-label="Registre de commerce" 
            />
          </div>
        </div>
        
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
            Soumettre les documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default KycVerification;
