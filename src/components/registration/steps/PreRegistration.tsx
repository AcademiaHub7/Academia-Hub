/**
 * Étape de pré-inscription express
 * @module components/registration/steps/PreRegistration
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RegistrationSession } from '../../../types/registration';
import { registrationService } from '../../../services/registration/registrationService';

interface PreRegistrationProps {
  sessionData: RegistrationSession | null;
  updateSessionData: (updates: Partial<RegistrationSession>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
}

/**
 * Composant de pré-inscription express (15-30 secondes)
 */
const PreRegistration: React.FC<PreRegistrationProps> = ({
  sessionData,
  updateSessionData,
  goToNextStep,
  validationErrors,
  setValidationErrors
}) => {
  const [email, setEmail] = useState(sessionData?.promoter?.email || '');
  const [subdomain, setSubdomain] = useState(sessionData?.school?.subdomain || '');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [emailTimer, setEmailTimer] = useState<NodeJS.Timeout | null>(null);
  const [subdomainTimer, setSubdomainTimer] = useState<NodeJS.Timeout | null>(null);

  // Réinitialiser les erreurs lorsque les champs sont modifiés
  useEffect(() => {
    if (validationErrors.email) {
      setValidationErrors({
        ...validationErrors,
        email: ''
      });
    }
  }, [email]);

  useEffect(() => {
    if (validationErrors.subdomain) {
      setValidationErrors({
        ...validationErrors,
        subdomain: ''
      });
    }
  }, [subdomain]);

  // Vérification en temps réel de l'email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailAvailable(null);
    
    // Annuler le timer précédent
    if (emailTimer) {
      clearTimeout(emailTimer);
    }
    
    // Créer un nouveau timer pour vérifier l'email après 500ms d'inactivité
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setIsCheckingEmail(true);
      const timer = setTimeout(async () => {
        try {
          const isAvailable = await registrationService.checkEmailAvailability(newEmail);
          setEmailAvailable(isAvailable);
          
          // Mettre à jour les données de session
          updateSessionData({
            promoter: {
              ...(sessionData?.promoter || {}),
              email: newEmail
            }
          });
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'email:', error);
        } finally {
          setIsCheckingEmail(false);
        }
      }, 500);
      
      setEmailTimer(timer);
    }
  };

  // Vérification en temps réel du sous-domaine
  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convertir en minuscules et supprimer les caractères non autorisés
    const rawValue = e.target.value.toLowerCase();
    const sanitizedValue = rawValue.replace(/[^a-z0-9-]/g, '');
    
    setSubdomain(sanitizedValue);
    setSubdomainAvailable(null);
    
    // Annuler le timer précédent
    if (subdomainTimer) {
      clearTimeout(subdomainTimer);
    }
    
    // Créer un nouveau timer pour vérifier le sous-domaine après 500ms d'inactivité
    if (sanitizedValue && sanitizedValue.length >= 3) {
      setIsCheckingSubdomain(true);
      const timer = setTimeout(async () => {
        try {
          const isAvailable = await registrationService.checkSubdomainAvailability(sanitizedValue);
          setSubdomainAvailable(isAvailable);
          
          // Mettre à jour les données de session
          updateSessionData({
            school: {
              ...(sessionData?.school || {}),
              subdomain: sanitizedValue
            }
          });
        } catch (error) {
          console.error('Erreur lors de la vérification du sous-domaine:', error);
        } finally {
          setIsCheckingSubdomain(false);
        }
      }, 500);
      
      setSubdomainTimer(timer);
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation manuelle
    const errors: Record<string, string> = {};
    
    if (!email) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format d\'email invalide';
    } else if (emailAvailable === false) {
      errors.email = 'Cet email est déjà utilisé';
    }
    
    if (!subdomain) {
      errors.subdomain = 'Le sous-domaine est requis';
    } else if (subdomain.length < 3) {
      errors.subdomain = 'Le sous-domaine doit contenir au moins 3 caractères';
    } else if (subdomainAvailable === false) {
      errors.subdomain = 'Ce sous-domaine est déjà utilisé';
    }
    
    setValidationErrors(errors);
    
    // Si pas d'erreurs, passer à l'étape suivante
    if (Object.keys(errors).length === 0) {
      goToNextStep();
    }
  };

  return (
    <motion.div 
      className="pre-registration-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Commencez votre inscription</h2>
      <p className="step-description">
        Renseignez ces informations essentielles pour démarrer votre inscription.
        <br />
        <span className="time-estimate">Temps estimé: 15-30 secondes</span>
      </p>
      
      <form onSubmit={handleSubmit} className="pre-registration-form">
        <div className="form-group">
          <label htmlFor="email">Email professionnel</label>
          <div className="input-group">
            <input
              type="email"
              id="email"
              className={`form-control ${validationErrors.email ? 'is-invalid' : ''} ${emailAvailable === true ? 'is-valid' : ''}`}
              value={email}
              onChange={handleEmailChange}
              placeholder="votre@email.com"
              autoComplete="email"
            />
            <div className="input-group-append">
              {isCheckingEmail && (
                <span className="input-group-text">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="sr-only">Vérification...</span>
                  </div>
                </span>
              )}
              {emailAvailable === true && !isCheckingEmail && (
                <span className="input-group-text text-success">
                  <i className="fas fa-check"></i>
                </span>
              )}
              {emailAvailable === false && !isCheckingEmail && (
                <span className="input-group-text text-danger">
                  <i className="fas fa-times"></i>
                </span>
              )}
            </div>
          </div>
          {validationErrors.email && (
            <div className="invalid-feedback d-block">{validationErrors.email}</div>
          )}
          <small className="form-text text-muted">
            Nous utiliserons cet email pour vous contacter et vous envoyer les informations importantes.
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="subdomain">Sous-domaine de votre école</label>
          <div className="input-group">
            <input
              type="text"
              id="subdomain"
              className={`form-control ${validationErrors.subdomain ? 'is-invalid' : ''} ${subdomainAvailable === true ? 'is-valid' : ''}`}
              value={subdomain}
              onChange={handleSubdomainChange}
              placeholder="mon-ecole"
              autoComplete="off"
            />
            <div className="input-group-append">
              <span className="input-group-text">.academiahub.com</span>
              {isCheckingSubdomain && (
                <span className="input-group-text">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="sr-only">Vérification...</span>
                  </div>
                </span>
              )}
              {subdomainAvailable === true && !isCheckingSubdomain && (
                <span className="input-group-text text-success">
                  <i className="fas fa-check"></i>
                </span>
              )}
              {subdomainAvailable === false && !isCheckingSubdomain && (
                <span className="input-group-text text-danger">
                  <i className="fas fa-times"></i>
                </span>
              )}
            </div>
          </div>
          {validationErrors.subdomain && (
            <div className="invalid-feedback d-block">{validationErrors.subdomain}</div>
          )}
          <small className="form-text text-muted">
            Ce sera l'adresse web de votre école sur Academia Hub. Utilisez uniquement des lettres minuscules, 
            des chiffres et des tirets.
          </small>
        </div>
        
        <div className="form-preview">
          <div className="preview-label">Aperçu de votre URL :</div>
          <div className="preview-url">
            https://<strong>{subdomain || 'mon-ecole'}</strong>.academiahub.com
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={isCheckingEmail || isCheckingSubdomain}
          >
            Continuer
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PreRegistration;
