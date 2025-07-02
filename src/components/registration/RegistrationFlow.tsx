/**
 * Flux d'inscription multi-étapes moderne pour Academia Hub
 * @module components/registration/RegistrationFlow
 */

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Importation des composants d'animation pour les transitions fluides
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
 * Props du composant RegistrationFlow
 */
interface RegistrationFlowProps {
  initialStep?: string;
}

/**
 * Composant principal du flux d'inscription
 */
const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ initialStep }) => {
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

  useEffect(() => {
    // Si initialStep est fourni, trouver l'index correspondant
    if (initialStep) {
      const stepIndex = STEPS.findIndex(step => step.id === initialStep);
      if (stepIndex !== -1) {
        setCurrentStepIndex(stepIndex);
        return;
      }
    }
    
    // Sinon, déterminer l'étape en fonction des données de session
    if (sessionData) {
      // Logique pour déterminer l'étape actuelle en fonction des données de session
      let newStepIndex = 0;
      
      // Vérifier l'état de la session pour déterminer l'étape appropriée
      if (!sessionData.promoter?.email) {
        newStepIndex = 0; // Landing ou Pre-registration
      } else if (sessionData.promoter?.email && !sessionData.promoter?.emailVerified) {
        newStepIndex = 2; // Email verification
      } else if (sessionData.promoter?.emailVerified && !sessionData.school?.name) {
        newStepIndex = 3; // Profile form
      } else if (sessionData.school?.name && !sessionData.subscription?.planId) {
        newStepIndex = 4; // Plan selection
      } else if (sessionData.subscription?.planId && !sessionData.payment?.status) {
        newStepIndex = 5; // Payment
      } else if (sessionData.payment?.status === 'completed' && (!sessionData.kyc?.status || sessionData.kyc?.status === 'pending')) {
        newStepIndex = 6; // KYC verification
      } else if (sessionData.kyc?.status === 'verified' && !sessionData.activation?.status) {
        newStepIndex = 7; // Activation
      } else if (sessionData.activation?.status === 'activated') {
        newStepIndex = 8; // Onboarding
      }
      
      // Mettre à jour l'étape actuelle
      setCurrentStepIndex(newStepIndex);
    }
  }, [sessionData, initialStep]);

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
    let isMounted = true;
    
    const initSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchParams = new URLSearchParams(location.search);
        const sid = searchParams.get('session') || localStorage.getItem('registration_session_id');

        if (sid) {
          await loadSessionData(sid);
        } else {
          await startNewSession();
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de la session:', err);
        if (isMounted) {
          setError('Impossible de démarrer la session d\'inscription. Veuillez réessayer.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSession();
    
    return () => {
      isMounted = false;
    };
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
    try {
      setLoading(true);
      
      // Valider l'étape actuelle avant de continuer
      const isValid = await validateCurrentStep();
      
      if (!isValid) {
        toast.error('Veuillez corriger les erreurs avant de continuer.');
        return;
      }
      
      // Ajouter un effet visuel de progression
      toast.success(`Étape ${currentStepIndex + 1} complétée avec succès!`);
      
      setDirection(1); // Animation vers la droite
      setCurrentStepIndex(prev => Math.min(prev + 1, STEPS.length - 1));
    } catch (error) {
      console.error('Erreur lors du passage à l\'étape suivante:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [validateCurrentStep, currentStepIndex]);

// Navigation vers l'étape précédente
const goToPreviousStep = useCallback(() => {
  try {
    setDirection(-1); // Animation vers la gauche
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  } catch (error) {
    console.error('Erreur lors du passage à l\'étape précédente:', error);
    toast.error('Une erreur est survenue. Veuillez réessayer.');
  }
}, []);

// Sauvegarder l'étape actuelle
const saveCurrentStep = useCallback(() => {
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
}, [sessionData, currentStepIndex]);

// Appel de saveCurrentStep lors des changements d'étape
useEffect(() => {
  if (sessionData) {
    saveCurrentStep();
  }
}, [currentStepIndex, saveCurrentStep, sessionData]);

// Rendu de l'étape actuelle
const renderCurrentStep = () => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-64">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600 font-medium">Chargement de votre session...</p>
      </div>
    );
  }
  
  const CurrentStepComponent = STEPS[currentStepIndex].component;
  
  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {STEPS[currentStepIndex].name}
        <span className="ml-2 text-sm font-normal text-gray-500">
          (Temps estimé: {STEPS[currentStepIndex].timeEstimate})
        </span>
      </h2>
      
      <Suspense fallback={<LoadingFallback />}>
        <CurrentStepComponent 
          sessionData={sessionData} 
          updateSessionData={updateSessionData}
          goToNextStep={goToNextStep}
          goToPreviousStep={goToPreviousStep}
          validationErrors={validationErrors}
        />
      </Suspense>
    </div>
  );
};

  // Fonction pour naviguer directement à une étape spécifique
  const navigateToStep = (index: number) => {
    // Ne permettre que de revenir en arrière ou d'aller à l'étape suivante
    if (index <= currentStepIndex + 1 && index >= 0 && index < STEPS.length) {
      setDirection(index > currentStepIndex ? 1 : -1);
      setCurrentStepIndex(index);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-red-500 mb-4 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Oups, une erreur est survenue</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            Nouvelle tentative
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-flow-container">
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <header className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Academia Hub Logo" 
            className="h-10 w-auto mr-3" 
            onError={(e) => {
              // Fallback si l'image n'existe pas
              e.currentTarget.src = 'https://via.placeholder.com/40x40?text=AH';
            }}
          />
          <h1 className="text-xl font-bold text-gray-800">Academia Hub <span className="text-blue-600">Inscription</span></h1>
        </div>
        
        <div className="text-sm text-gray-500">
          Session ID: <span className="font-mono text-xs bg-gray-100 p-1 rounded">{sessionId?.substring(0, 8) || 'Non démarrée'}</span>
        </div>
      </header>
      
      <div className="progress-bar">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`step ${index <= currentStepIndex ? 'completed' : ''}`}
            onClick={() => navigateToStep(index)}
            title={`Étape ${index + 1}: ${step.name}`}
          >
            <span>{step.name}</span>
            <small>{step.timeEstimate}</small>
          </div>
        ))}
      </div>
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStepIndex}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="registration-step-container"
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>

      {/* Indicateur d'auto-sauvegarde */}
      {autoSaveStatus && (
        <div className={`auto-save-indicator ${autoSaveStatus}`}>
          {autoSaveStatus === 'saving' && (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sauvegarde en cours...
            </>
          )}
          {autoSaveStatus === 'saved' && (
            <>
              <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Modifications sauvegardées
            </>
          )}
          {autoSaveStatus === 'error' && (
            <>
              <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Erreur de sauvegarde
            </>
          )}
        </div>
      )}
      
      {/* Navigation */}
      <div className="registration-navigation">
        {currentStepIndex > 0 ? (
          <button 
            onClick={goToPreviousStep} 
            className="btn btn-outline-primary"
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Précédent
          </button>
        ) : <div></div>}
        
        {currentStepIndex < STEPS.length - 1 && (
          <button 
            onClick={goToNextStep} 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </>
            ) : (
              <>
                Suivant
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default RegistrationFlow;
