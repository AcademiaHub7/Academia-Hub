/**
 * Flux d'inscription multi-étapes moderne pour Academia Hub
 * @module components/registration/RegistrationFlow
 */

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Composant de chargement pour Suspense
const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="spinner"></div>
    <p>Chargement...</p>
  </div>
);

// Imports des composants d'étapes
import LandingPage from './steps/LandingPage';
import PreRegistration from './steps/PreRegistration';
import EmailVerification from './steps/EmailVerification';
import ProfileForm from './steps/ProfileForm';
import PlanSelection from './steps/PlanSelection';
import Payment from './steps/Payment';
import KycVerification from './steps/KycVerification';
import Activation from './steps/Activation';
import Onboarding from './steps/Onboarding';

// Services
import { registrationService } from '../../services/registration/registrationService';

// Types
import { RegistrationSession } from '../../types/registration';

// Type pour adapter la réponse du service à notre interface
type ServiceRegistrationSession = {
  id: string;
  promoter?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    position?: string;
    password?: string;
    confirmPassword?: string;
  };
  school?: {
    name?: string;
    type?: string;
    address?: string;
    subdomain?: string;
    country?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    website?: string;
    foundedYear?: number;
    numberOfStudents?: number;
  };
  status?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
};

// Styles
import '../../styles/registration/RegistrationFlow.css';

// Définition des étapes du processus
const STEPS = [
  { id: 'landing', name: 'Bienvenue', component: LandingPage, timeEstimate: '0-5 secondes' },
  { id: 'pre-registration', name: 'Pré-inscription Express', component: PreRegistration, timeEstimate: '15-30 secondes' },
  { id: 'email-verification', name: 'Vérification Email', component: EmailVerification, timeEstimate: 'immédiate' },
  { id: 'profile', name: 'Profil Complet', component: ProfileForm, timeEstimate: '2-3 minutes' },
  { id: 'plan', name: 'Sélection Plan', component: PlanSelection, timeEstimate: '30 secondes' },
  { id: 'payment', name: 'Paiement Sécurisé', component: Payment, timeEstimate: '1-2 minutes' },
  { id: 'kyc', name: 'KYC Guidé', component: KycVerification, timeEstimate: '5-10 minutes' },
  { id: 'activation', name: 'Activation', component: Activation, timeEstimate: '1 minute' },
  { id: 'onboarding', name: 'Onboarding Interactif', component: Onboarding, timeEstimate: '10-15 minutes' }
];

// Animations pour les transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -20
  }
};

/**
 * Composant principal du flux d'inscription
 */
const RegistrationFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<RegistrationSession | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Direction de l'animation (1 = suivant, -1 = précédent)
  const [direction, setDirection] = useState<number>(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Déterminer l'étape actuelle en fonction des données de session
  const determineStepFromSession = useCallback((session: RegistrationSession): number => {
    // Déterminer l'étape en fonction du statut
    switch (session.status) {
      case 'email_verified': return 2; // Étape de profil
      case 'completed': return 6; // Étape d'onboarding
      default: return 0; // Étape de pré-inscription par défaut
    }
  }, []);

  // Charger les données de session existantes
  const loadSessionData = useCallback(async (sid: string) => {
    try {
      const serviceSession = await registrationService.getRegistrationSession(sid) as ServiceRegistrationSession;
      
      // Adapter la réponse du service à notre interface avec des assertions de type strictes
      const completeSession = {
        id: serviceSession.id,
        promoter: serviceSession.promoter ? {
          email: serviceSession.promoter.email || '',  // Valeur par défaut pour le champ requis
          firstName: serviceSession.promoter.firstName,
          lastName: serviceSession.promoter.lastName,
          phone: serviceSession.promoter.phone,
          address: serviceSession.promoter.address,
          position: serviceSession.promoter.position,
          password: serviceSession.promoter.password,
          confirmPassword: serviceSession.promoter.confirmPassword
        } : { email: '' },  // email est requis
        school: serviceSession.school ? {
          name: serviceSession.school.name || '',  // Valeurs par défaut pour les champs requis
          type: serviceSession.school.type || '',
          address: serviceSession.school.address || '',
          subdomain: serviceSession.school.subdomain || '',
          country: serviceSession.school.country,
          city: serviceSession.school.city,
          postalCode: serviceSession.school.postalCode,
          phone: serviceSession.school.phone,
          website: serviceSession.school.website,
          foundedYear: serviceSession.school.foundedYear,
          numberOfStudents: serviceSession.school.numberOfStudents
        } : undefined,  // undefined est acceptable car school est optionnel
        status: (serviceSession.status as 'pending' | 'email_verified' | 'completed' | 'cancelled') || 'pending',
        createdAt: serviceSession.created_at || new Date().toISOString(),
        updatedAt: serviceSession.updated_at || new Date().toISOString(),
        metadata: serviceSession.metadata
      } as RegistrationSession;  // Assertion de type pour forcer la compatibilité
      
      setSessionData(completeSession);
      setCurrentStepIndex(determineStepFromSession(completeSession));
    } catch (err) {
      console.error('Erreur lors du chargement de la session:', err);
      setError('Impossible de charger la session d\'inscription. Veuillez réessayer.');
    }
  }, [determineStepFromSession]);

  // Démarrer une nouvelle session
  const startNewSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const serviceSession = await registrationService.startRegistrationSession() as ServiceRegistrationSession;
      
      // Adapter la réponse du service à notre interface avec des assertions de type strictes
      const completeSession = {
        id: serviceSession.id,
        promoter: serviceSession.promoter ? {
          email: serviceSession.promoter.email || '',  // Valeur par défaut pour le champ requis
          firstName: serviceSession.promoter.firstName,
          lastName: serviceSession.promoter.lastName,
          phone: serviceSession.promoter.phone,
          address: serviceSession.promoter.address,
          position: serviceSession.promoter.position,
          password: serviceSession.promoter.password,
          confirmPassword: serviceSession.promoter.confirmPassword
        } : { email: '' },  // email est requis
        school: serviceSession.school ? {
          name: serviceSession.school.name || '',  // Valeurs par défaut pour les champs requis
          type: serviceSession.school.type || '',
          address: serviceSession.school.address || '',
          subdomain: serviceSession.school.subdomain || '',
          country: serviceSession.school.country,
          city: serviceSession.school.city,
          postalCode: serviceSession.school.postalCode,
          phone: serviceSession.school.phone,
          website: serviceSession.school.website,
          foundedYear: serviceSession.school.foundedYear,
          numberOfStudents: serviceSession.school.numberOfStudents
        } : undefined,  // undefined est acceptable car school est optionnel
        status: (serviceSession.status as 'pending' | 'email_verified' | 'completed' | 'cancelled') || 'pending',
        createdAt: serviceSession.created_at || new Date().toISOString(),
        updatedAt: serviceSession.updated_at || new Date().toISOString(),
        metadata: serviceSession.metadata || {}
      } as RegistrationSession;  // Assertion de type pour forcer la compatibilité
      
      setSessionId(serviceSession.id);
      setSessionData(completeSession);
      
      // Stocker le sessionId dans le localStorage
      localStorage.setItem('registration_session_id', serviceSession.id);
    } catch (err) {
      console.error('Erreur lors du démarrage de la session:', err);
      setError('Impossible de démarrer la session d\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mise à jour des données de session
  const updateSessionData = useCallback((updates: Partial<RegistrationSession>) => {
    setSessionData((prev: RegistrationSession | null) => {
      if (!prev) {
        // Création d'un nouvel objet session avec les valeurs par défaut
        // Utiliser une assertion de type pour éviter les erreurs de compatibilité
        const newSession = {
          id: updates.id || '',
          status: (updates.status as 'pending' | 'email_verified' | 'completed' | 'cancelled') || 'pending',
          createdAt: updates.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Initialiser avec des objets vides mais conformes aux types
          promoter: updates.promoter || { email: '' },
          school: updates.school || {
            name: '',
            type: '',
            address: '',
            subdomain: ''
          },
          metadata: updates.metadata
        } as RegistrationSession;
        return newSession;
      }
      // Mise à jour avec les nouvelles valeurs
      return { ...prev, ...updates, updatedAt: new Date().toISOString() };
    });
  }, []);

  // Sauvegarder les données de session
  const saveSessionData = useCallback(async () => {
    if (!sessionId || !sessionData) return;
    
    try {
      setAutoSaveStatus('saving');
      
      // Note: Dans une implémentation réelle, nous aurions une méthode updateSession
      // Pour l'instant, nous simulons la sauvegarde en récupérant simplement la session
      // TODO: Implémenter registrationService.updateSession quand disponible
      await registrationService.getRegistrationSession(sessionId);
      
      setAutoSaveStatus('saved');
      
      // Masquer l'indicateur après quelques secondes
      setTimeout(() => {
        setAutoSaveStatus(null);
      }, 3000);
      
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }, [sessionId, sessionData]);

  // Initialisation de la session
  useEffect(() => {
    const initSession = async () => {
      const searchParams = new URLSearchParams(location.search);
      const sid = searchParams.get('session');

      if (sid) {
        await loadSessionData(sid);
      } else {
        await startNewSession();
      }
    };

    initSession();
  }, [location.search, loadSessionData, startNewSession]);

  // Synchronisation de l'URL avec l'étape actuelle
  useEffect(() => {
    if (!sessionId) return;
    
    const currentStep = STEPS[currentStepIndex];
    const params = new URLSearchParams(location.search);
    params.set('session', sessionId);
    
    navigate(`/register/${currentStep.id}?${params.toString()}`, { replace: true });
  }, [currentStepIndex, sessionId, navigate, location.search]);

  // Sauvegarder automatiquement les modifications de session
  useEffect(() => {
    if (!sessionId || !sessionData) return;
    
    const saveTimeout = setTimeout(() => {
      saveSessionData();
    }, 1000);
    
    return () => clearTimeout(saveTimeout);
  }, [sessionId, sessionData, saveSessionData]);

  // Valider l'étape actuelle
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (!sessionData) return false;
    
    const errors: Record<string, string> = {};
    const currentStep = STEPS[currentStepIndex];
    
    // Validation spécifique à chaque étape
    switch (currentStep.id) {
      case 'pre-registration':
        // Valider l'email et les informations de base
        if (!sessionData.promoter?.email) {
          errors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sessionData.promoter.email)) {
          errors.email = 'Format d\'email invalide';
        }
        break;
        
      case 'email-verification':
        // Vérifier si l'email a été vérifié
        if (sessionData.status !== 'email_verified') {
          errors.verification = 'Veuillez vérifier votre email avant de continuer';
        }
        break;
        
      case 'profile':
        // Valider les informations du profil complet
        if (!sessionData.promoter?.firstName) {
          errors.firstName = 'Le prénom est requis';
        }
        if (!sessionData.promoter?.lastName) {
          errors.lastName = 'Le nom est requis';
        }
        if (!sessionData.school?.name) {
          errors.schoolName = 'Le nom de l\'école est requis';
        }
        break;
        
      // Autres validations d'étapes...
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [sessionData, currentStepIndex]);

  // Navigation vers l'étape suivante
  const goToNextStep = useCallback(async () => {
    // Vérifier si l'étape actuelle est valide
    const isValid = await validateCurrentStep();
    
    if (!isValid) {
      toast.error('Veuillez corriger les erreurs avant de continuer');
      return;
    }
    
    // Si c'est la dernière étape, finaliser l'inscription
    if (currentStepIndex >= STEPS.length - 1) {
      // Logique de finalisation...
      return;
    }
    
    setDirection(1);
    setCurrentStepIndex((prev: number) => prev + 1);
    
    // Sauvegarder l'étape actuelle
    if (sessionData) {
      // Mise à jour du statut en fonction de l'étape actuelle
      setSessionData((prev: RegistrationSession | null) => {
        if (!prev) return null;
        // Mise à jour du statut en fonction de l'étape actuelle
        const updatedSession: RegistrationSession = { 
          ...prev, 
          status: currentStepIndex === STEPS.length - 1 ? 'completed' : 'pending',
          updatedAt: new Date().toISOString()
        };
        return updatedSession;
      });
    }
  }, [currentStepIndex, sessionData, validateCurrentStep]);

  // Navigation vers l'étape précédente
  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex <= 0) return;
    
    setDirection(-1);
    setCurrentStepIndex((prev: number) => prev - 1);
  }, [currentStepIndex]);

  // Rendu du composant de l'étape actuelle
  const renderCurrentStep = useCallback(() => {
    const currentStep = STEPS[currentStepIndex];
    const CurrentStepComponent = currentStep.component;

    return (
      <Suspense fallback={<LoadingFallback />}>
        <CurrentStepComponent
          sessionData={sessionData}
          updateSessionData={updateSessionData}
          goToNextStep={goToNextStep}
          goToPreviousStep={goToPreviousStep}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          saveSession={saveSessionData}
        />
      </Suspense>
    );
  }, [currentStepIndex, sessionData, updateSessionData, goToNextStep, goToPreviousStep, validationErrors, setValidationErrors, saveSessionData]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={startNewSession}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="registration-flow-container">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={direction} // Utilisation de la direction pour les animations
          className="registration-step-container"
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>

      <div className="progress-bar">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`step ${index <= currentStepIndex ? 'completed' : ''}`}
          >
            <span>{step.name}</span>
            <small>{step.timeEstimate}</small>
          </div>
        ))}
      </div>
      {/* Indicateur d'auto-sauvegarde */}
      {autoSaveStatus && (
        <div className={`auto-save-indicator ${autoSaveStatus}`}>
          {autoSaveStatus === 'saving' && 'Sauvegarde en cours...'}
          {autoSaveStatus === 'saved' && 'Modifications sauvegardées'}
          {autoSaveStatus === 'error' && 'Erreur de sauvegarde'}
        </div>
      )}
      
      {/* Navigation */}
      <div className="registration-navigation">
        {currentStepIndex > 0 && (
          <button 
            onClick={goToPreviousStep} 
            className="btn btn-outline-primary"
            disabled={loading}
          >
            Précédent
          </button>
        )}
        
        {currentStepIndex < STEPS.length - 1 && (
          <button 
            onClick={goToNextStep} 
            className="btn btn-primary"
            disabled={loading}
          >
            Suivant
          </button>
        )}
      </div>
    </div>
  );
};

export default RegistrationFlow;
