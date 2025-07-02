/**
 * Types communs pour les props des composants d'étapes du flux d'inscription
 * @module components/registration/steps/StepProps
 */

import { RegistrationSession } from '../../../types/registration';

/**
 * Props de base pour tous les composants d'étape du flux d'inscription
 */
export interface BaseStepProps {
  sessionData?: RegistrationSession;
  updateSessionData: (data: Partial<RegistrationSession>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validationErrors?: Record<string, string>;
  setValidationErrors?: (errors: Record<string, string>) => void;
  saveSession: () => Promise<void>;
}

/**
 * Props spécifiques pour l'étape de paiement
 */
export interface PaymentStepProps extends BaseStepProps {
  // Props spécifiques au paiement si nécessaire
}

/**
 * Props spécifiques pour l'étape de vérification KYC
 */
export interface KycVerificationProps extends BaseStepProps {
  // Props spécifiques à la vérification KYC si nécessaire
}

/**
 * Props spécifiques pour l'étape de sélection de plan
 */
export interface PlanSelectionProps extends BaseStepProps {
  // Props spécifiques à la sélection de plan si nécessaire
}
