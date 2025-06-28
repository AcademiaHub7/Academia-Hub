/**
 * Page de paiement FedaPay pour l'inscription d'une école
 * @module components/registration/PaymentPage
 */

import React, { useState, useEffect } from 'react';
import './PaymentPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FedaCheckoutContainer } from 'fedapay-reactjs';
import { createTransaction, checkTransactionStatus } from '../../services/payment/paymentService';

// Types
interface LocationState {
  registrationId: string;
  planId: string;
  email: string;
}

interface TransactionData {
  id: string;
  amount: number;
  description: string;
  status: string;
  paymentUrl?: string;
}

interface FedaPayCheckoutOptions {
  public_key: string;
  currency: {
    iso: string;
    code?: number;
  };
  transaction: {
    id: number;
    amount: number;
    description: string;
  };
  onComplete: (response: FedaPayResponse) => void;
}

interface FedaPayTransaction {
  id: string;
  status: string;
  [key: string]: unknown;
}

interface FedaPayResponse {
  id: string;
  reason: string;
  transaction: FedaPayTransaction;
}

interface FedaPayGlobal {
  DIALOG_DISMISSED: string;
  TRANSACTION_APPROVED: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    FedaPay: FedaPayGlobal;
  }
}

/**
 * Composant de page de paiement FedaPay
 */
const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [publicKey, setPublicKey] = useState<string>('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Récupérer les données de l'état de navigation
  const { registrationId, planId, email } = (location.state as LocationState) || {};

  // Charger la clé publique FedaPay et créer la transaction
  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        
        // Vérifier si les données nécessaires sont présentes
        if (!registrationId || !planId) {
          throw new Error('Informations d\'inscription manquantes');
        }

        // Récupérer la clé publique FedaPay
        setPublicKey(process.env.REACT_APP_FEDAPAY_PUBLIC_KEY || '');

        // Créer une transaction pour le paiement
        const transactionData = await createTransaction({
          registrationId,
          planId,
          email
        });

        setTransaction(transactionData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
        console.error('Erreur lors de l\'initialisation du paiement:', error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [registrationId, planId, email]);

  // Gérer le succès du paiement
  const handlePaymentSuccess = async (transaction: FedaPayTransaction) => {
    try {
      setPaymentProcessing(true);
      
      // Vérifier le statut de la transaction
      const status = await checkTransactionStatus(transaction.id.toString());
      
      if (status === 'approved') {
        setPaymentSuccess(true);
        
        // Rediriger vers la page de succès après un court délai
        setTimeout(() => {
          navigate('/register/school/success', { 
            state: { 
              registrationId,
              transactionId: transaction.id.toString()
            } 
          });
        }, 2000);
      } else {
        throw new Error('Le paiement n\'a pas été approuvé');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      console.error('Erreur lors de la vérification du paiement:', error);
      setError(errorMessage);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Gérer l'échec du paiement
  const handlePaymentFailure = (error: Error | { message?: string; reason?: string; transaction?: unknown }) => {
    console.error('Échec du paiement:', error);
    const errorMessage = 
      (error instanceof Error ? error.message : null) ||
      (typeof error === 'object' && error !== null && 'reason' in error && typeof error.reason === 'string' ? error.reason : null) ||
      'Le paiement a échoué. Veuillez réessayer ou contacter le support.';
    setError(errorMessage);
  };

  // Gérer la fermeture du widget de paiement
  const handlePaymentDismiss = () => {
    console.log('Paiement annulé par l\'utilisateur');
  };

  // Rendu du widget de paiement FedaPay
  const renderPaymentWidget = () => {
    if (!transaction || !publicKey) return null;

    const checkoutOptions: FedaPayCheckoutOptions = {
      public_key: publicKey,
      currency: {
        iso: 'XOF',
        code: 952 // Code ISO 4217 pour le XOF
      },
      transaction: {
        id: parseInt(transaction.id, 10), // Convertir en nombre pour FedaPay
        amount: transaction.amount,
        description: transaction.description
      },
      onComplete: (response: FedaPayResponse) => {
        const FedaPay = window['FedaPay'];
        
        if (response.reason === FedaPay.DIALOG_DISMISSED) {
          handlePaymentDismiss();
        } else if (response.reason === FedaPay.TRANSACTION_APPROVED && response.transaction) {
          handlePaymentSuccess(response.transaction);
        } else {
          handlePaymentFailure(new Error(`Erreur de paiement: ${response.reason}`));
        }
      }
    };

    return (
      <div className="fedapay-checkout-wrapper">
        <FedaCheckoutContainer options={checkoutOptions} />
      </div>
    );
  };

  // Si les données d'inscription sont manquantes, afficher un message d'erreur
  if (!registrationId && !loading) {
    return (
      <div className="payment-page-container error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Informations d'inscription manquantes</h3>
          <p>Veuillez recommencer le processus d'inscription.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/register/school')}
          >
            Retour à l'inscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <div className="payment-header">
        <h2>Paiement de votre abonnement</h2>
        <p>
          Veuillez procéder au paiement pour finaliser votre inscription.
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Chargement...</span>
          </div>
          <p>Initialisation du paiement...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              className="btn btn-outline-primary"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Retour
            </button>
          </div>
        </div>
      ) : paymentProcessing ? (
        <div className="processing-container">
          <div className="spinner-border text-success" role="status">
            <span className="sr-only">Traitement...</span>
          </div>
          <h3>Traitement de votre paiement</h3>
          <p>Veuillez patienter pendant que nous confirmons votre paiement...</p>
        </div>
      ) : paymentSuccess ? (
        <div className="success-container">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>Paiement réussi !</h3>
          <p>Votre paiement a été traité avec succès. Vous allez être redirigé...</p>
        </div>
      ) : (
        <div className="payment-content">
          {transaction && (
            <div className="transaction-details">
              <div className="detail-item">
                <span className="detail-label">Montant :</span>
                <span className="detail-value">{new Intl.NumberFormat('fr-FR').format(transaction.amount)} FCFA</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Description :</span>
                <span className="detail-value">{transaction.description}</span>
              </div>
            </div>
          )}
          
          {renderPaymentWidget()}
          
          <div className="payment-footer">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={paymentProcessing}
            >
              Retour
            </button>
          </div>
          
          <div className="payment-security-info">
            <div className="security-icon">
              <i className="fas fa-lock"></i>
            </div>
            <div className="security-content">
              <p>
                Vos informations de paiement sont sécurisées par FedaPay.
                Academia Hub ne stocke pas vos données bancaires.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
