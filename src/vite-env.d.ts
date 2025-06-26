/// <reference types="vite/client" />

// Déclarations pour les SDK de paiement
interface FedaPayConfig {
  public_key: string;
  transaction: {
    amount: number;
    description: string;
    callback_url: string;
    currency: {
      iso: string;
    };
    custom_metadata?: any;
  };
  container: string;
  onComplete: (response: any) => void;
  onClose: () => void;
  onError: (error: any) => void;
}

interface KkiapayConfig {
  key: string;
  sandbox: boolean;
  theme: string;
  amount: number;
  position: string;
  callback: string;
  data: any;
  name: string;
  description: string;
  webhook: string;
}

interface KkiapayWidgetOptions {
  amount: number;
  name: string;
  description: string;
  phone?: string;
  email?: string;
  reason?: string;
  data?: any;
  callback: (data: any) => void;
  failed: (error: any) => void;
  theme?: string;
}

interface FedaPay {
  init: (config: FedaPayConfig) => void;
}

interface Kkiapay {
  initialize: (config: KkiapayConfig) => void;
  openPaymentWidget: (options: KkiapayWidgetOptions) => void;
}

interface Window {
  FedaPay?: FedaPay;
  Kkiapay?: Kkiapay;
}