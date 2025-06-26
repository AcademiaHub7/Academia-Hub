import React, { useState, useEffect, useRef } from 'react';
import FormModal from './FormModal';
import { CreditCard, CheckCircle, AlertTriangle, Phone, Globe, RefreshCw } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  planName: string;
  paymentMethod: 'fedapay' | 'kkiapay';
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  planName,
  paymentMethod
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const paymentContainerRef = useRef<HTMLDivElement>(null);

  // Référence de transaction
  const transactionRef = `SUB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  // Initialiser le paiement
  useEffect(() => {
    if (isOpen && paymentStatus === 'pending') {
      setPaymentStatus('processing');
      
      const initializePayment = async () => {
        try {
          if (paymentMethod === 'fedapay') {
            await initializeFedaPay();
          } else if (paymentMethod === 'kkiapay') {
            await initializeKKiaPay();
          }
        } catch (error) {
          console.error('Payment initialization error:', error);
          setPaymentStatus('failed');
          setErrorMessage('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
        }
      };
      
      initializePayment();
    }
    
    // Nettoyage lors de la fermeture du modal
    return () => {
      // Supprimer les scripts et widgets si nécessaire
      const fedaPayScript = document.getElementById('fedapay-script');
      if (fedaPayScript) {
        fedaPayScript.remove();
      }
      
      const kkiaPayScript = document.getElementById('kkiapay-script');
      if (kkiaPayScript) {
        kkiaPayScript.remove();
      }
      
      // Réinitialiser l'état
      if (!isOpen) {
        setPaymentStatus('pending');
        setErrorMessage(null);
        setProcessingTime(0);
        setTransactionId(null);
      }
    };
  }, [isOpen, paymentMethod, paymentStatus]);

  // Simuler un compteur pendant le traitement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (paymentStatus === 'processing') {
      interval = setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentStatus]);

  // Initialisation de FedaPay
  const initializeFedaPay = async () => {
    // Créer et ajouter le script FedaPay
    const script = document.createElement('script');
    script.id = 'fedapay-script';
    script.src = 'https://cdn.fedapay.com/checkout.js';
    script.async = true;
    
    script.onload = () => {
      // Simuler la création d'une transaction côté serveur
      const mockTransactionId = `fp_trans_${Math.random().toString(36).substring(2, 15)}`;
      setTransactionId(mockTransactionId);
      
      // Configuration de FedaPay
      // Dans une implémentation réelle, cela serait fait côté serveur
      if (window.FedaPay) {
        window.FedaPay.init({
          public_key: 'pk_sandbox_XXXXXXXXXXXXXXXXXXXXXXXX', // Clé publique de test
          transaction: {
            amount: amount,
            description: `Abonnement ${planName} - Academia Hub`,
            callback_url: window.location.origin + '/dashboard',
            currency: {
              iso: 'EUR'
            },
            custom_metadata: {
              plan_name: planName,
              transaction_ref: transactionRef
            }
          },
          container: '#fedapay-payment-container',
          onComplete: function(response: any) {
            console.log('FedaPay payment completed:', response);
            setPaymentStatus('success');
          },
          onClose: function() {
            console.log('FedaPay payment closed');
            setPaymentStatus('failed');
            setErrorMessage('Paiement annulé ou interrompu.');
          },
          onError: function(error: any) {
            console.error('FedaPay payment error:', error);
            setPaymentStatus('failed');
            setErrorMessage('Une erreur est survenue lors du traitement du paiement.');
          }
        });
      }
    };
    
    script.onerror = () => {
      setPaymentStatus('failed');
      setErrorMessage('Impossible de charger le service de paiement FedaPay.');
    };
    
    document.body.appendChild(script);
  };

  // Initialisation de KKiaPay
  const initializeKKiaPay = async () => {
    // Créer et ajouter le script KKiaPay
    const script = document.createElement('script');
    script.id = 'kkiapay-script';
    script.src = 'https://cdn.kkiapay.me/k.js';
    script.async = true;
    
    script.onload = () => {
      // Simuler la création d'une transaction côté serveur
      const mockTransactionId = `kk_trans_${Math.random().toString(36).substring(2, 15)}`;
      setTransactionId(mockTransactionId);
      
      // Configuration de KKiaPay
      if (window.Kkiapay) {
        window.Kkiapay.initialize({
          key: 'xxxxxxxxxxxxxxxxxxxxxxx', // Clé publique de test
          sandbox: true,
          theme: "blue",
          amount: amount,
          position: "center",
          callback: "https://academia-hub.com/callback",
          data: {
            plan_name: planName,
            transaction_ref: transactionRef
          },
          name: planName,
          description: `Abonnement ${planName} - Academia Hub`,
          webhook: "https://academia-hub.com/webhook"
        });
        
        // Ouvrir la fenêtre de paiement KKiaPay
        window.Kkiapay.openPaymentWidget({
          amount: amount,
          name: planName,
          description: `Abonnement ${planName} - Academia Hub`,
          phone: '',
          email: '',
          reason: `Abonnement ${planName}`,
          data: {
            plan_name: planName,
            transaction_ref: transactionRef
          },
          callback: function(data: any) {
            console.log('KKiaPay payment callback:', data);
            setPaymentStatus('success');
          },
          failed: function(error: any) {
            console.error('KKiaPay payment failed:', error);
            setPaymentStatus('failed');
            setErrorMessage('Le paiement a échoué. Veuillez réessayer.');
          },
          theme: "blue"
        });
      }
    };
    
    script.onerror = () => {
      setPaymentStatus('failed');
      setErrorMessage('Impossible de charger le service de paiement KKiaPay.');
    };
    
    document.body.appendChild(script);
  };

  const handleRetry = () => {
    setPaymentStatus('pending');
    setErrorMessage(null);
    setProcessingTime(0);
    setTransactionId(null);
  };

  const getPaymentMethodLogo = () => {
    if (paymentMethod === 'fedapay') {
      return (
        <div className="flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-xl font-bold text-green-600 dark:text-green-400">FedaPay</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">KKiaPay</span>
        </div>
      );
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Paiement de votre abonnement"
      size="md"
      footer={
        paymentStatus === 'failed' ? (
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </button>
          </div>
        ) : paymentStatus === 'success' ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onSuccess}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
            >
              Continuer
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
          </div>
        )
      }
    >
      <div className="space-y-6">
        {/* Logo du fournisseur de paiement */}
        {getPaymentMethodLogo()}
        
        {/* Détails de la transaction */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Plan:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{planName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Montant:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">{amount} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Référence:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{transactionRef}</span>
          </div>
        </div>
        
        {/* Conteneur pour les widgets de paiement */}
        <div ref={paymentContainerRef} id="fedapay-payment-container" className="min-h-[200px]">
          {/* Statut du paiement */}
          {paymentStatus === 'pending' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300">Initialisation du paiement...</p>
            </div>
          )}
          
          {paymentStatus === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300">Traitement de votre paiement...</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Temps écoulé: {processingTime} secondes</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Veuillez ne pas fermer cette fenêtre</p>
            </div>
          )}
          
          {paymentStatus === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Paiement réussi !</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Votre abonnement {planName} a été activé avec succès.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                Un email de confirmation a été envoyé à votre adresse.
              </p>
              {transactionId && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  ID de transaction: {transactionId}
                </p>
              )}
            </div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Échec du paiement</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {errorMessage || "Une erreur est survenue lors du traitement de votre paiement."}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                Veuillez vérifier vos informations de paiement et réessayer.
              </p>
            </div>
          )}
        </div>
        
        {/* Méthodes de paiement supportées */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-2 text-center">Méthodes de paiement supportées</p>
          <div className="flex justify-center space-x-4">
            {paymentMethod === 'fedapay' ? (
              <>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-sm font-medium">Visa/Mastercard</span>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-sm font-medium">MTN Mobile Money</span>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-sm font-medium">Moov Money</span>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-sm font-medium">Orange Money</span>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-sm font-medium">MTN Mobile Money</span>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-sm font-medium">Moov Money</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Sécurité */}
        <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-500">
          <CreditCard className="w-4 h-4 mr-2" />
          <span>Paiement sécurisé avec chiffrement SSL</span>
        </div>
      </div>
    </FormModal>
  );
};

// Déclaration pour TypeScript
declare global {
  interface Window {
    FedaPay?: any;
    Kkiapay?: any;
  }
}

export default PaymentModal;