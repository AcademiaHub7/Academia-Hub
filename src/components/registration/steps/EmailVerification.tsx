import React, { useState, useEffect, useRef, useCallback } from 'react';
import { registrationService } from '../../../services/registration/registrationService';

/**
 * Interface pour les données de session d'inscription
 */
interface RegistrationSession {
  id: string;
  promoter?: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    emailVerified?: boolean;
  };
  school?: {
    name: string;
    type: string;
    address: string;
    subdomain: string;
  };
  status: 'pending' | 'email_verified' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

interface EmailVerificationProps {
  sessionData: RegistrationSession | null;
  updateSessionData: (updates: Partial<RegistrationSession>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validationErrors?: Record<string, string>;
  setValidationErrors?: (errors: Record<string, string>) => void;
}

/**
 * Composant de vérification d'email
 */
const EmailVerification: React.FC<EmailVerificationProps> = ({
  sessionData,
  updateSessionData,
  goToNextStep,
  goToPreviousStep
  // Les props validationErrors et setValidationErrors sont optionnelles et non utilisées actuellement
}) => {
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Envoyer le code de vérification
  const sendVerificationCode = useCallback(async (): Promise<boolean> => {
    if (!sessionData?.id || !sessionData?.promoter?.email) {
      setVerificationError('Session invalide ou email manquant');
      return false;
    }

    setIsResending(true);
    setVerificationError(null);

    try {
      const result = await registrationService.sendVerificationCode(
        sessionData.id, 
        sessionData.promoter.email
      );

      if (result.success) {
        setEmailSent(true);
        setCountdown(60); // 60 secondes avant de pouvoir renvoyer
        return true;
      } else {
        setVerificationError(result.message || 'Échec de l\'envoi du code de vérification');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de l\'envoi du code de vérification:', error);
      setVerificationError(`Impossible d'envoyer le code de vérification: ${errorMessage}`);
      return false;
    } finally {
      setIsResending(false);
    }
  }, [sessionData]);

  // Envoyer le code de vérification au chargement du composant
  useEffect(() => {
    const sendInitialVerification = async () => {
      if (sessionData?.promoter?.email && !emailSent) {
        await sendVerificationCode();
      }
    };

    sendInitialVerification();
  }, [sessionData, emailSent, sendVerificationCode]);

  // Gérer le compte à rebours pour la réexpédition du code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Vérifier le code
  const verifyEmailCode = useCallback(async (code: string): Promise<boolean> => {
    if (!sessionData?.id) {
      setVerificationError('Session invalide');
      return false;
    }

    if (code.length !== 6) {
      setVerificationError('Veuillez entrer le code complet à 6 chiffres');
      return false;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const result = await registrationService.verifyEmailCode(sessionData.id, code);

      if (result.verified) {
            // Mettre à jour les données de session
      if (sessionData.promoter) {
        updateSessionData({
          promoter: {
            ...sessionData.promoter,
            emailVerified: true
          }
        });
      }

        // Passer à l'étape suivante
        goToNextStep();
        return true;
      } else {
        setVerificationError('Code de vérification incorrect. Veuillez réessayer.');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la vérification du code:', error);
      setVerificationError(`Erreur lors de la vérification: ${errorMessage}`);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [sessionData, goToNextStep, updateSessionData]);

  // Gérer la saisie du code
  const handleCodeChange = useCallback(async (index: number, value: string) => {
    // Accepter uniquement les chiffres
    if (value && !/^\d+$/.test(value)) return;

    // Mettre à jour le code
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Effacer les erreurs
    if (verificationError) {
      setVerificationError(null);
    }

    // Passer au champ suivant si un chiffre est entré
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Vérifier automatiquement si le code est complet
    if (value && index === 5) {
      const completeCode = newCode.join('');
      if (completeCode.length === 6) {
        try {
          await verifyEmailCode(completeCode);
        } catch (error) {
          console.error('Erreur lors de la vérification du code:', error);
        }
      }
    }
  }, [verificationCode, verificationError, verifyEmailCode]);

  // Gérer la navigation au clavier
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Aller au champ précédent si on efface un champ vide
      inputRefs.current[index - 1]?.focus();
    }
  }, [verificationCode]);

  // Coller le code depuis le presse-papiers
  const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');

    // Vérifier si le contenu collé est un code à 6 chiffres
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setVerificationCode(newCode);

      // Vérifier le code automatiquement
      try {
        await verifyEmailCode(pastedData);
      } catch (error) {
        console.error('Erreur lors de la vérification du code:', error);
      }
    }
  }, [verifyEmailCode]);

  // Rendu du composant
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vérification de l'email</h2>
          <p className="mt-2 text-sm text-gray-600">
            Nous avons envoyé un code de vérification à l'adresse {sessionData?.promoter?.email}.
            Veuillez le saisir ci-dessous.
          </p>
        </div>

        {verificationError && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {verificationError}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={verificationCode[index]}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isVerifying}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                aria-label={`Chiffre ${index + 1} du code de vérification`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
              disabled={isResending || isVerifying}
            >
              &larr; Retour
            </button>
            
            <div className="text-sm text-gray-500">
              {countdown > 0 ? (
                <span>Renvoyer le code dans {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
                  disabled={isResending}
                >
                  {isResending ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="inline-flex items-center">
                      <i className="fas fa-redo mr-1"></i> Renvoyer le code
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-4 mt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Vous n'avez pas reçu le code ? Vérifiez votre dossier de courrier indésirable ou{' '}
            <button
              type="button"
              onClick={sendVerificationCode}
              className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
              disabled={isResending || countdown > 0}
            >
              renvoyer le code
            </button>
            {countdown > 0 && ` (${countdown}s)`}.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            <i className="fas fa-info-circle mr-1"></i>
            Si vous ne recevez pas le code, vérifiez votre dossier de spam
            ou contactez notre support à{' '}
            <a href="mailto:support@academiahub.com" className="text-blue-600 hover:underline">
              support@academiahub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
