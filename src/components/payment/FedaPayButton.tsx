/**
 * Composant de bouton de paiement FedaPay
 * @module components/payment/FedaPayButton
 */

import React, { useEffect, useState } from 'react';
import { FedaCheckoutButton } from 'fedapay-reactjs';

interface FedaPayButtonProps {
  amount: number;
  description: string;
  currency?: string;
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
  metadata?: Record<string, any>;
  buttonText?: string;
  buttonClass?: string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

/**
 * Composant bouton de paiement FedaPay
 */
const FedaPayButton: React.FC<FedaPayButtonProps> = ({
  amount,
  description,
  currency = 'XOF',
  customerEmail,
  customerFirstName,
  customerLastName,
  metadata = {},
  buttonText,
  buttonClass = 'btn btn-primary',
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
    return <div>Chargement du bouton de paiement...</div>;
  }

  // Configuration du bouton FedaPay
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
    button: {
      class: buttonClass,
      text: buttonText || `Payer ${amount.toLocaleString()} ${currency}`
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

  return <FedaCheckoutButton options={checkoutOptions} />;
};

export default FedaPayButton;
