/**
 * Composant de widget de paiement FedaPay
 * @module components/payment/FedaPayCheckout
 */

import React, { useEffect, useState } from 'react';
import { FedaCheckoutContainer } from 'fedapay-reactjs';

interface FedaPayCheckoutProps {
  amount: number;
  description: string;
  currency?: string;
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
  metadata?: Record<string, any>;
  width?: number | string;
  height?: number | string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

/**
 * Composant widget de paiement FedaPay intégré
 */
const FedaPayCheckout: React.FC<FedaPayCheckoutProps> = ({
  amount,
  description,
  currency = 'XOF',
  customerEmail,
  customerFirstName,
  customerLastName,
  metadata = {},
  width = '100%',
  height = 600,
  onSuccess,
  onFailure,
  onDismiss
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [publicKey, setPublicKey] = useState<string>('');

  useEffect(() => {
    // Récupérer la clé publique depuis les variables d'environnement
    setPublicKey(process.env.REACT_APP_FEDAPAY_PUBLIC_KEY || '');
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !publicKey) {
    return <div className="fedapay-loading">Chargement du module de paiement...</div>;
  }

  // Configuration du widget FedaPay
  const checkoutOptions = {
    public_key: publicKey,
    transaction: {
      amount: amount,
      description: description,
      ...(customerEmail && {
        customer: {
          email: customerEmail,
          ...(customerFirstName && { firstname: customerFirstName }),
          ...(customerLastName && { lastname: customerLastName })
        }
      }),
      metadata: metadata
    },
    currency: {
      iso: currency
    },
    onComplete: (response: any) => {
      const FedaPay = window['FedaPay'];
      
      if (response.reason === FedaPay.DIALOG_DISMISSED) {
        if (onDismiss) {
          onDismiss();
        }
      } else if (response.reason === FedaPay.TRANSACTION_APPROVED) {
        if (onSuccess) {
          onSuccess(response.transaction);
        }
      } else {
        if (onFailure) {
          onFailure({
            reason: response.reason,
            transaction: response.transaction
          });
        }
      }
    }
  };

  return (
    <div className="fedapay-checkout-container">
      <FedaCheckoutContainer 
        options={checkoutOptions} 
        style={{ 
          width: width, 
          height: height, 
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden'
        }} 
      />
    </div>
  );
};

export default FedaPayCheckout;
