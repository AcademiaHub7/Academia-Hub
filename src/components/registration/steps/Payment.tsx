/**
 * Composant de paiement avec intégration FedaPay
 * @module components/registration/steps/Payment
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
// Importation du service d'inscription avec accolades
import { registrationService } from '../../../services/registration/registrationService';
import { PaymentStepProps } from './StepProps';
import { PaymentStatus } from '../../../types/common';

/**
 * Composant de paiement sécurisé avec intégration FedaPay (1-2 minutes)
 */
const Payment: React.FC<PaymentStepProps> = ({
  sessionData,
  updateSessionData,
  goToNextStep,
  goToPreviousStep,
  saveSession
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentInitiated, setPaymentInitiated] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed' | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  
  // Référence pour le conteneur FedaPay
  const fedaPayContainerRef = useRef<HTMLDivElement>(null);
  
  // Déclaration anticipée pour résoudre la dépendance circulaire
  // Fonction pour mettre à jour le statut du paiement et passer à l'étape suivante
  const updatePaymentStatus = useCallback((status: 'pending' | 'completed' | 'failed') => {
    // Mettre à jour les données de session
    updateSessionData({
      payment: {
        status,
        transactionId: transactionId || '',
        paymentDate: new Date().toISOString(),
        amount: sessionData?.plan?.price || 0,
        currency: sessionData?.plan?.currency || 'XOF',
      }
    });
    
    // Sauvegarder la session
    saveSession().then(() => {
      // Si le paiement est réussi, passer à l'étape suivante
      if (status === 'completed') {
        setTimeout(() => {
          goToNextStep();
        }, 2000); // Attendre 2 secondes pour afficher le message de succès
      }
    });
  }, [updateSessionData, transactionId, sessionData, saveSession, goToNextStep]);

  // Fonction de vérification du statut du paiement avec useCallback pour éviter les problèmes de dépendances
  const verifyPaymentStatus = useCallback(async (txId: string) => {
    if (checkingStatus) return;
    
    setCheckingStatus(true);
    
    try {
      // Appel au service pour vérifier le statut du paiement
      // Vérification du statut du paiement
      const response = await registrationService.checkPaymentStatus(sessionData?.id || '', txId);
      
      if (response && typeof response === 'object' && 'status' in response) {
        const paymentStatusValue = response.status;
        
        // Convertir la valeur en string pour les comparaisons
        const statusString = String(paymentStatusValue);
        
        if (statusString === PaymentStatus.COMPLETED || statusString === 'approved') {
          setPaymentStatus('completed');
          updatePaymentStatus('completed');
        } else if (statusString === PaymentStatus.FAILED || statusString === 'declined') {
          setPaymentStatus('failed');
          setPaymentError('Le paiement a échoué. Veuillez réessayer.');
          updatePaymentStatus('failed');
        } else {
          // Paiement toujours en attente
          setPaymentStatus('pending');
          setCountdown(10); // Vérifier à nouveau dans 10 secondes
        }
      } else {
        // Format de réponse inattendu
        console.error('Format de réponse inattendu:', response);
        setPaymentError('Erreur lors de la vérification du statut du paiement');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut du paiement:', error);
      setPaymentError('Erreur lors de la vérification du statut du paiement');
    } finally {
      setCheckingStatus(false);
    }
  }, [sessionData, setPaymentStatus, setPaymentError, setCountdown, setCheckingStatus, updatePaymentStatus, checkingStatus]);

  // Initialiser le widget FedaPay au chargement du composant
  useEffect(() => {
    // Vérifier si le script FedaPay est déjà chargé
    if (!document.getElementById('fedapay-script')) {
      const script = document.createElement('script');
      script.id = 'fedapay-script';
      script.src = 'https://cdn.fedapay.com/checkout.js';
      script.async = true;
      
      script.onload = () => {
        console.log('FedaPay script loaded');
      };
      
      document.body.appendChild(script);
    }
    
    // Vérifier si un paiement est déjà en cours dans la session
    if (sessionData?.payment?.transactionId) {
      setTransactionId(sessionData.payment.transactionId);
      setPaymentInitiated(true);
      verifyPaymentStatus(sessionData.payment.transactionId);
    }
    
    return () => {
      // Nettoyage si nécessaire
    };
  }, [sessionData, verifyPaymentStatus]);
  
  // Vérifier le statut du paiement périodiquement après l'initialisation
  useEffect(() => {
    if (transactionId && paymentStatus === 'pending') {
      // Vérifier immédiatement après l'initialisation
      verifyPaymentStatus(transactionId);
      
      // Puis vérifier toutes les 30 secondes
      const interval = setInterval(() => {
        verifyPaymentStatus(transactionId);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [transactionId, paymentStatus, verifyPaymentStatus]);
  
  // Vérifier le statut du paiement toutes les 10 secondes si le paiement est en attente
  useEffect(() => {
    if (countdown > 0 && paymentStatus === 'pending' && transactionId) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown === 1) {
          // Vérifier le statut du paiement lorsque le compte à rebours atteint 0
          verifyPaymentStatus(transactionId);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, paymentStatus, transactionId, verifyPaymentStatus]);
  
  // Initialiser le paiement
  const initializePayment = async () => {
    if (!sessionData?.id || !sessionData?.plan?.id) {
      setPaymentError('Informations de session ou de plan manquantes');
      return;
    }
    
    setIsLoading(true);
    setPaymentError(null);
    
    try {
      // Appeler le service pour initialiser le paiement
      const paymentData = await registrationService.initiatePayment(sessionData.id);
      
      if (paymentData && paymentData.transaction_id) {
        setTransactionId(paymentData.transaction_id);
        
        // Mettre à jour les données de session
        updateSessionData({
          payment: {
            transactionId: paymentData.transaction_id,
            status: 'pending',
            amount: sessionData?.plan?.price || 0,
            currency: sessionData?.plan?.currency || 'XOF',
            paymentDate: new Date().toISOString()
          }
        });
        
        // Sauvegarder la session
        await saveSession();
        
        // Initialiser le widget FedaPay
        if (window.FedaPay && fedaPayContainerRef.current) {
          const fedapay = new window.FedaPay({
            public_key: process.env.REACT_APP_FEDAPAY_PUBLIC_KEY || '',
            transaction: {
              id: paymentData.transaction_id
            },
            container: '#fedapay-container',
            onComplete: handlePaymentComplete
          });
          
          fedapay.init();
          setPaymentInitiated(true);
        } else {
          setPaymentError('Erreur lors de l\'initialisation du widget FedaPay');
        }
      } else {
        setPaymentError('Erreur lors de l\'initialisation du paiement');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du paiement:', error);
      setPaymentError('Une erreur est survenue lors de l\'initialisation du paiement');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer la fin du paiement
  const handlePaymentComplete = (response: { status: string; transaction?: { id: string }; }) => {
    if (response.status === 'approved') {
      setPaymentStatus('completed');
      updatePaymentStatus('completed');
    } else {
      setPaymentStatus('failed');
      setPaymentError('Le paiement a échoué. Veuillez réessayer.');
      updatePaymentStatus('failed');
    }
  };
  

  

  
  // Réinitialiser le paiement
  const resetPayment = () => {
    setPaymentInitiated(false);
    setPaymentStatus(null);
    setPaymentError(null);
    setTransactionId(null);
  };
  
  return (
    <motion.div 
      className="payment-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Paiement Sécurisé</h2>
      <p className="step-description">
        Effectuez votre paiement en toute sécurité pour activer votre abonnement.
        <br />
        <span className="time-estimate">Temps estimé: 1-2 minutes</span>
      </p>
      
      <div className="payment-summary">
        <h3>Récapitulatif de votre commande</h3>
        <div className="summary-details">
          <div className="summary-row">
            <span>Plan:</span>
            <span>{sessionData?.plan?.name || 'Plan non spécifié'}</span>
          </div>
          <div className="summary-row">
            <span>Montant:</span>
            <span>
              {sessionData?.plan?.price
                ? `${sessionData.plan.price} ${sessionData.plan.currency || 'XOF'}`
                : 'Montant non spécifié'
              }
            </span>
          </div>
          <div className="summary-row">
            <span>Cycle de facturation:</span>
            <span>
              {sessionData?.plan?.billingCycle || 'Non spécifié'}
            </span>
          </div>
        </div>
      </div>
      {paymentStatus === 'completed' ? (
        <div className="payment-success">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>Paiement réussi !</h3>
          <p>Votre paiement a été traité avec succès. Nous vous redirigeons vers l'étape suivante...</p>
        </div>
      ) : paymentStatus === 'failed' ? (
        <div className="payment-failed">
          <div className="failed-icon">
            <i className="fas fa-times-circle"></i>
          </div>
          <h3>Paiement échoué</h3>
          <p>{paymentError || 'Une erreur est survenue lors du traitement de votre paiement.'}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={resetPayment}
            disabled={isLoading}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="payment-form">
          {!paymentInitiated ? (
            <div className="payment-methods">
              <h3>Choisissez votre méthode de paiement</h3>
              <p>Nous acceptons les méthodes de paiement suivantes :</p>
              
              <div className="payment-methods-list">
                <div className="payment-method">
                  <img src="/assets/images/payment/mtn-momo.png" alt="MTN Mobile Money" />
                  <span>MTN Mobile Money</span>
                </div>
                <div className="payment-method">
                  <img src="/assets/images/payment/moov-money.png" alt="Moov Money" />
                  <span>Moov Money</span>
                </div>
                <div className="payment-method">
                  <img src="/assets/images/payment/orange-money.png" alt="Orange Money" />
                  <span>Orange Money</span>
                </div>
                <div className="payment-method">
                  <img src="/assets/images/payment/visa.png" alt="Visa" />
                  <span>Visa</span>
                </div>
                <div className="payment-method">
                  <img src="/assets/images/payment/mastercard.png" alt="Mastercard" />
                  <span>Mastercard</span>
                </div>
              </div>
              
              <button 
                className="btn btn-primary btn-lg mt-4"
                onClick={initializePayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Initialisation...
                  </>
                ) : (
                  <>Procéder au paiement <i className="fas fa-lock ml-2"></i></>
                )}
              </button>
            </div>
          ) : (
            <div className="fedapay-container">
              <h3>Complétez votre paiement</h3>
              
              {paymentError && (
                <div className="alert alert-danger">
                  {paymentError}
                </div>
              )}
              
              <div id="fedapay-container" ref={fedaPayContainerRef}></div>
              
              {paymentStatus === 'pending' && (
                <div className="payment-status-checking">
                  <p>
                    <i className="fas fa-info-circle mr-2"></i>
                    Si vous avez déjà effectué le paiement mais que vous n'êtes pas redirigé automatiquement,
                    nous vérifierons à nouveau dans {countdown} secondes.
                  </p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => transactionId && verifyPaymentStatus(transactionId)}
                    disabled={checkingStatus}
                  >
                    {checkingStatus ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Vérification...
                      </>
                    ) : (
                      <>Vérifier maintenant</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="payment-security-info">
        <div className="security-badge">
          <i className="fas fa-shield-alt"></i>
          <span>Paiement 100% sécurisé</span>
        </div>
        <p>
          Toutes les informations de paiement sont cryptées et sécurisées.
          Nous ne stockons pas vos informations de carte bancaire.
        </p>
      </div>
      
      <div className="navigation-buttons">
        <button 
          className="btn btn-outline-secondary"
          onClick={goToPreviousStep}
          disabled={isLoading || paymentStatus === 'completed'}
        >
          <i className="fas fa-arrow-left mr-2"></i> Étape précédente
        </button>
      </div>
    </motion.div>
  );
};

export default Payment;

// Déclaration pour TypeScript
// Définition du type FedaPay pour TypeScript
type FedaPayGlobal = {
  new(config: {
    public_key: string;
    transaction: {
      id: string;
    };
    container: string;
    onComplete: (response: { status: string; transaction?: { id: string } }) => void;
  }): {
    init: () => void;
  };
};

declare global {
  interface Window {
    FedaPay: FedaPayGlobal;
  }
}
