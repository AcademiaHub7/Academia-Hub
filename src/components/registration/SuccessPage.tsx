/**
 * Page de succès après inscription et paiement
 * @module components/registration/SuccessPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTransactionDetails } from '../../services/payment/paymentService';

// Types
interface LocationState {
  registrationId: string;
  transactionId: string;
}

interface TransactionDetails {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  invoiceUrl?: string;
  registrationId?: string;
  reference?: string;
  plan?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
  };
  metadata?: Record<string, unknown>;
}

/**
 * Composant de page de succès après inscription et paiement
 */
const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  
  // Récupérer les données de l'état de navigation
  const { registrationId, transactionId } = (location.state as LocationState) || {};

  // Charger les détails de la transaction
  useEffect(() => {
    const loadTransactionDetails = async () => {
      try {
        setLoading(true);
        
        // Vérifier si les données nécessaires sont présentes
        if (!registrationId || !transactionId) {
          throw new Error('Informations de transaction manquantes');
        }

        // Récupérer les détails de la transaction
        const details = await getTransactionDetails(transactionId);
        setTransactionDetails(details);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
        console.error('Erreur lors du chargement des détails de la transaction:', error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadTransactionDetails();
  }, [registrationId, transactionId]);

  // Rediriger vers la page KYC
  const handleContinue = () => {
    navigate('/school/kyc-verification');
  };

  // Rediriger vers le tableau de bord
  const handleGoToDashboard = () => {
    navigate('/school/dashboard');
  };

  // Si les données de transaction sont manquantes, afficher un message d'erreur
  if (!registrationId && !transactionId && !loading) {
    return (
      <div className="success-page-container error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Informations de transaction manquantes</h3>
          <p>Nous ne pouvons pas afficher les détails de votre inscription.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Aller à la page de connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page-container">
      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Chargement...</span>
          </div>
          <p>Chargement des détails de votre inscription...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Aller à la page de connexion
          </button>
        </div>
      ) : (
        <div className="success-content">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          
          <h2>Félicitations !</h2>
          <h3>Votre école a été enregistrée avec succès</h3>
          
          <div className="success-details">
            <p>
              Votre paiement a été traité avec succès et votre abonnement est maintenant actif.
              Vous pouvez maintenant accéder à votre tableau de bord et commencer à configurer votre école.
            </p>
            
            {transactionDetails && (
              <div className="transaction-summary">
                <h4>Récapitulatif de votre abonnement</h4>
                <div className="summary-item">
                  <span className="item-label">Plan :</span>
                  <span className="item-value">{transactionDetails.plan?.name || 'Plan standard'}</span>
                </div>
                <div className="summary-item">
                  <span className="item-label">Montant :</span>
                  <span className="item-value">{new Intl.NumberFormat('fr-FR').format(transactionDetails.amount)} FCFA</span>
                </div>
                <div className="summary-item">
                  <span className="item-label">Date :</span>
                  <span className="item-value">
                    {new Date(transactionDetails.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="item-label">Référence :</span>
                  <span className="item-value">{transactionDetails.reference}</span>
                </div>
              </div>
            )}
            
            <div className="next-steps">
              <h4>Prochaines étapes</h4>
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h5>Vérification KYC</h5>
                  <p>
                    Pour activer complètement votre compte, vous devez compléter le processus de vérification KYC
                    en fournissant les documents requis.
                  </p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h5>Configuration de votre école</h5>
                  <p>
                    Une fois la vérification KYC approuvée, vous pourrez configurer votre école,
                    ajouter des classes, des enseignants et des élèves.
                  </p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h5>Commencer à utiliser la plateforme</h5>
                  <p>
                    Explorez toutes les fonctionnalités disponibles et commencez à gérer votre école
                    de manière efficace avec Academia Hub.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="success-actions">
            <button 
              className="btn btn-primary"
              onClick={handleContinue}
            >
              Continuer vers la vérification KYC
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={handleGoToDashboard}
            >
              Accéder au tableau de bord
            </button>
          </div>
          
          <div className="success-footer">
            <p>
              Un email de confirmation a été envoyé à l'adresse email que vous avez fournie.
              Si vous avez des questions, n'hésitez pas à contacter notre support.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
