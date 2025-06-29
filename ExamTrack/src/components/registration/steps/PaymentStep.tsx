import React, { useState } from 'react';
import { useRegistrationStore } from '../../../stores/registrationStore';
import { CreditCard, Smartphone, Building, Shield, CheckCircle } from 'lucide-react';

export const PaymentStep: React.FC = () => {
  const { processPayment, isLoading, currentRegistration, subscriptionPlans } = useRegistrationStore();
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card' | 'bank_transfer'>('mobile_money');
  const [paymentProvider, setPaymentProvider] = useState<string>('moov');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPlan = subscriptionPlans.find(p => p.id === currentRegistration?.planSelection.planId);
  
  const getDiscountedPrice = () => {
    if (!selectedPlan) return 0;
    const cycle = currentRegistration?.planSelection.billingCycle || 'monthly';
    let multiplier = 1;
    let discount = 0;

    switch (cycle) {
      case 'quarterly':
        multiplier = 3;
        discount = 0.05;
        break;
      case 'yearly':
        multiplier = 12;
        discount = 0.15;
        break;
    }

    const basePrice = selectedPlan.price * multiplier;
    return Math.round(basePrice * (1 - discount));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    const paymentData = {
      amount: getDiscountedPrice(),
      currency: 'XOF',
      method: paymentMethod,
      provider: paymentProvider,
      phoneNumber: paymentMethod === 'mobile_money' ? phoneNumber : undefined,
    };

    const result = await processPayment(paymentData);
    
    if (result.success) {
      // Après le paiement réussi, passer directement à la validation finale
      // sans étape KYC
      alert('Paiement effectué avec succès ! Votre compte sera activé sous 24h après validation administrative.');
    }
    
    setIsProcessing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Paiement Sécurisé
        </h2>
        <p className="text-gray-600">
          Finalisez votre inscription en procédant au paiement sécurisé via FedaPay.
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Récapitulatif de la commande</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Plan {selectedPlan?.name}</span>
            <span className="font-medium">{formatPrice(selectedPlan?.price || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">
              Cycle de facturation: {currentRegistration?.planSelection.billingCycle === 'monthly' ? 'Mensuel' : 
                                   currentRegistration?.planSelection.billingCycle === 'quarterly' ? 'Trimestriel' : 'Annuel'}
            </span>
            <span className="text-green-600">
              {currentRegistration?.planSelection.billingCycle === 'quarterly' ? '-5%' : 
               currentRegistration?.planSelection.billingCycle === 'yearly' ? '-15%' : ''}
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total à payer</span>
            <span className="text-primary-color">{formatPrice(getDiscountedPrice())}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Méthode de paiement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mobile Money */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              paymentMethod === 'mobile_money' ? 'border-primary-color bg-primary-color/5' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('mobile_money')}
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="w-6 h-6 text-primary-color" />
              <div>
                <h4 className="font-medium">Mobile Money</h4>
                <p className="text-sm text-gray-600">Moov, MTN, Celtiis</p>
              </div>
            </div>
          </div>

          {/* Card Payment */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              paymentMethod === 'card' ? 'border-primary-color bg-primary-color/5' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-primary-color" />
              <div>
                <h4 className="font-medium">Carte Bancaire</h4>
                <p className="text-sm text-gray-600">Visa, Mastercard</p>
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              paymentMethod === 'bank_transfer' ? 'border-primary-color bg-primary-color/5' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('bank_transfer')}
          >
            <div className="flex items-center space-x-3">
              <Building className="w-6 h-6 text-primary-color" />
              <div>
                <h4 className="font-medium">Virement Bancaire</h4>
                <p className="text-sm text-gray-600">Banques locales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Money Details */}
      {paymentMethod === 'mobile_money' && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Détails Mobile Money</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opérateur
              </label>
              <select
                value={paymentProvider}
                onChange={(e) => setPaymentProvider(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              >
                <option value="moov">Moov Money</option>
                <option value="mtn">MTN Mobile Money</option>
                <option value="celtiis">Celtiis Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+229 XX XX XX XX"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Paiement 100% Sécurisé</h4>
            <p className="text-sm text-blue-700 mt-1">
              Vos données de paiement sont protégées par le chiffrement SSL et traitées par FedaPay, 
              notre partenaire de paiement certifié PCI DSS.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Process Steps */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Processus de paiement</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Redirection vers FedaPay</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Saisie sécurisée des informations de paiement</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Confirmation automatique du paiement</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Validation administrative (24-48h)</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Activation de votre compte patronat</span>
          </div>
        </div>
      </div>

      {/* Simplified Process Notice */}
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Processus Simplifié</h4>
            <p className="text-sm text-green-700 mt-1">
              Plus besoin de documents KYC ! Après votre paiement, votre compte sera activé 
              automatiquement sous 24-48h après une simple validation administrative.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color transition-colors"
        >
          Retour
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing || (paymentMethod === 'mobile_money' && !phoneNumber)}
          className="px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Redirection...' : `Payer ${formatPrice(getDiscountedPrice())}`}
        </button>
      </div>
    </div>
  );
};